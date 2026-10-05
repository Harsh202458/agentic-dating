import React from 'react';
import DateArenaClient from './DateArenaClient';

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { id1: '1', id2: '14' },
    { id1: '2', id2: '15' },
    { id1: '3', id2: '16' },
    { id1: '8', id2: '21' },
    { id1: '9', id2: '18' },
  ];
}

export default async function Page({ params }: { params: Promise<{ id1: string; id2: string }> }) {
  const resolved = await params;
  return <DateArenaClient id1={resolved?.id1 || '1'} id2={resolved?.id2 || '14'} />;
}
