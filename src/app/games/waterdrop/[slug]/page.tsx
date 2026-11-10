import { editions, getEntry } from "@/data/catalog";
import { GameView } from "@/components/game-view";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return editions().map((entry) => ({ slug: entry.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  return { title: entry?.title ?? "Edition" };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry?.series) notFound();
  return <GameView id={entry.id} />;
}
