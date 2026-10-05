const fs = require('fs');
const path = require('path');

const matchesPath = path.join(__dirname, '..', 'public', 'data', 'matches.json');
const matches = JSON.parse(fs.readFileSync(matchesPath, 'utf8'));

let issues = [];
let totalPairs = 0;
let totalMessages = 0;

for (const [id1, targets] of Object.entries(matches)) {
  for (const [id2, m] of Object.entries(targets)) {
    totalPairs++;
    if (m.conversation) {
      m.conversation.forEach((c, idx) => {
        totalMessages++;
        const msg = (c.message || '').trim();
        const lastChar = msg.slice(-1);
        const hasTerminal = ['.', '!', '?', '"', "'", '”', '’'].includes(lastChar);
        if (!hasTerminal) {
          issues.push({ id1, id2, idx, type: 'NO_TERMINAL_PUNCTUATION', lastChar, snippet: msg.slice(-30) });
        }
        if (msg.includes('analyzed your verified profiles')) {
          issues.push({ id1, id2, idx, type: 'JARGON_ANALYZED_VERIFIED_PROFILES', snippet: msg.slice(0, 60) });
        }
        if (msg.includes('sovereign boundaries')) {
          issues.push({ id1, id2, idx, type: 'JARGON_SOVEREIGN_BOUNDARIES', snippet: msg.slice(0, 60) });
        }
        if (msg.includes('craft devotion')) {
          issues.push({ id1, id2, idx, type: 'JARGON_CRAFT_DEVOTION', snippet: msg.slice(0, 60) });
        }
      });
    }
  }
}

console.log(`Audited ${totalPairs} pairs and ${totalMessages} messages.`);
console.log(`Found ${issues.length} issues in matches.json.`);
issues.slice(0, 15).forEach(i => console.log(JSON.stringify(i)));
