import DateArenaClient from './DateArenaClient';

export function generateStaticParams() {
  const pairs: { id1: string; id2: string }[] = [];
  for (let i = 1; i <= 25; i++) {
    for (let j = 1; j <= 25; j++) {
      if (i !== j) {
        pairs.push({ id1: String(i), id2: String(j) });
      }
    }
  }
  return pairs;
}

export default async function Page({ params }: { params: Promise<{ id1: string; id2: string }> }) {
  const resolved = await params;
  return <DateArenaClient id1={resolved?.id1 || '1'} id2={resolved?.id2 || '3'} />;
}
