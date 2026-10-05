const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function checkUrl(urlStr, hops = 0) {
  return new Promise((resolve) => {
    if (!urlStr || typeof urlStr !== 'string' || !urlStr.startsWith('http')) {
      return resolve({ url: urlStr, status: 'Invalid URL', verdict: 'INVALID' });
    }
    if (hops > 3) {
      return resolve({ url: urlStr, status: 'Too Many Redirects', verdict: 'REDIRECT_LOOP' });
    }

    try {
      const url = new URL(urlStr);
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        timeout: 9000
      }, (res) => {
        const statusCode = res.statusCode;
        const location = res.headers.location;

        if ([301, 302, 307, 308].includes(statusCode) && location) {
          const nextUrl = location.startsWith('http') ? location : new URL(location, urlStr).toString();
          // If redirected to login wall
          if (nextUrl.includes('instagram.com/accounts/login') || nextUrl.includes('linkedin.com/authwall') || nextUrl.includes('linkedin.com/login')) {
            return resolve({
              url: urlStr,
              status: `${statusCode} -> Login Wall`,
              finalUrl: nextUrl,
              verdict: 'OK (Login Wall)'
            });
          }
          // Follow redirect
          return checkUrl(nextUrl, hops + 1).then(r => resolve({
            url: urlStr,
            status: `${statusCode} -> ${r.status}`,
            finalUrl: r.finalUrl || nextUrl,
            verdict: r.verdict
          }));
        }

        if (statusCode === 200) {
          resolve({ url: urlStr, status: '200 OK', verdict: 'OK (Live)' });
        } else if (statusCode === 999) {
          resolve({ url: urlStr, status: '999 Request Denied', verdict: 'OK (LinkedIn Bot Wall)' });
        } else if (statusCode === 429) {
          resolve({ url: urlStr, status: '429 Rate Limited', verdict: 'OK (LinkedIn Bot Wall)' });
        } else if (statusCode === 404) {
          resolve({ url: urlStr, status: '404 Not Found', verdict: 'FAIL (404 Not Found)' });
        } else {
          resolve({ url: urlStr, status: `${statusCode}`, verdict: statusCode < 400 ? 'OK' : 'FAIL' });
        }
      });

      req.on('error', (err) => resolve({ url: urlStr, status: `Error: ${err.message}`, verdict: 'FAIL (Network Error)' }));
      req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 'Timeout', verdict: 'FAIL (Timeout)' }); });
    } catch (e) {
      resolve({ url: urlStr, status: `Error: ${e.message}`, verdict: 'FAIL (Malformed URL)' });
    }
  });
}

async function verifyAll() {
  const jsonPath = path.join(__dirname, '../data/profiles_analyzed.json');
  const people = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  console.log('='.repeat(95));
  console.log(`VERIFYING SOCIAL PROFILES FOR ALL ${people.length} CANDIDATES`);
  console.log('='.repeat(95));
  console.log('');

  const report = [];

  for (let i = 0; i < people.length; i++) {
    const p = people[i];
    process.stdout.write(`[${i + 1}/${people.length}] Checking ${p.name.padEnd(25)}... `);

    const [liResult, igResult] = await Promise.all([
      checkUrl(p.linkedin_url),
      checkUrl(p.instagram_url)
    ]);

    console.log(`LI: ${liResult.verdict.padEnd(20)} | IG: ${igResult.verdict}`);

    report.push({
      id: p.id,
      name: p.name,
      gender: p.gender,
      linkedin_url: p.linkedin_url,
      linkedin_status: liResult.status,
      linkedin_verdict: liResult.verdict,
      instagram_url: p.instagram_url,
      instagram_status: igResult.status,
      instagram_verdict: igResult.verdict,
    });
  }

  console.log('\n' + '='.repeat(95));
  console.log('FULL VERIFICATION SUMMARY TABLE');
  console.log('='.repeat(95));
  console.log(
    'ID'.padEnd(4) +
    'Name'.padEnd(24) +
    'LinkedIn Verdict'.padEnd(26) +
    'Instagram Verdict'.padEnd(26) +
    'Overall'
  );
  console.log('-'.repeat(95));

  report.forEach(r => {
    const overall = (r.linkedin_verdict.startsWith('OK') && r.instagram_verdict.startsWith('OK')) ? 'PASS' : 'FLAG';
    console.log(
      String(r.id).padEnd(4) +
      r.name.slice(0, 22).padEnd(24) +
      r.linkedin_verdict.slice(0, 24).padEnd(26) +
      r.instagram_verdict.slice(0, 24).padEnd(26) +
      overall
    );
  });
  console.log('='.repeat(95));

  fs.writeFileSync(path.join(__dirname, '../data/links_verification_report.json'), JSON.stringify(report, null, 2));
  console.log('\nSaved full report to data/links_verification_report.json\n');
}

verifyAll().catch(console.error);
