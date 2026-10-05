import { NextRequest, NextResponse } from 'next/server';
import { scrapeLinkedIn, scrapeInstagram } from '@/lib/scrape';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { linkedinUrl, instagramUrl } = body;

    if (!linkedinUrl && !instagramUrl) {
      return NextResponse.json(
        { error: 'At least one social profile URL (LinkedIn or Instagram) is required.' },
        { status: 400 }
      );
    }

    const results: any = {};

    if (linkedinUrl) {
      try {
        results.linkedin = await scrapeLinkedIn(linkedinUrl);
      } catch (err: any) {
        results.linkedin = { success: false, error: err?.message };
      }
    }

    if (instagramUrl) {
      try {
        results.instagram = await scrapeInstagram(instagramUrl);
      } catch (err: any) {
        results.instagram = { success: false, error: err?.message };
      }
    }

    return NextResponse.json({
      success: true,
      data: results
    });
  } catch (err: any) {
    console.error('Scrape API error:', err);
    return NextResponse.json(
      { error: err?.message || 'Scrape service encountered an error' },
      { status: 500 }
    );
  }
}
