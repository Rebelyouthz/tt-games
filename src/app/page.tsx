import { HomeClient } from "@/components/home";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "TT Games" } };

export default function Page() {
  return <HomeClient />;
}
