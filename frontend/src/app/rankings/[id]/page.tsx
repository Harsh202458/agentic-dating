import RankingsClient from './RankingsClient';

export function generateStaticParams() {
  return Array.from({ length: 25 }, (_, i) => ({
    id: String(i + 1)
  }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolved = await params;
  return <RankingsClient id={resolved?.id || '1'} />;
}
