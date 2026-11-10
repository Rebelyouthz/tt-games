import { GameView } from "@/components/game-view";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Unremembered" };

export default function Page() {
  return <GameView id="unremembered" />;
}
