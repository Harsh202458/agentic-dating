import React from 'react';
import DateArenaClient from '../../date/[id1]/[id2]/DateArenaClient';

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { pair: '1-14' },
    { pair: '2-15' },
    { pair: '3-16' },
    { pair: '8-21' },
    { pair: '9-18' },
  ];
}

interface DatesPairPageProps {
  params: Promise<{
    pair: string;
  }>;
}

export default async function DatesPairPage({ params }: DatesPairPageProps) {
  const resolvedParams = await params;
  const rawPair = resolvedParams?.pair || '1-14';

  const parts = rawPair.split(/[-_]/);
  const id1 = parts[0] || '1';
  const id2 = parts[1] || '14';

  return <DateArenaClient id1={id1} id2={id2} />;
}
