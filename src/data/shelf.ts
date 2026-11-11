export type ShelfTitle = {
  id: string
  title: string
  href: string | null
  blurb: string
  passes: string[]
}

export const shelf: ShelfTitle[] = [
  {
    id: "unremembered",
    title: "Unremembered",
    href: "/games/unremembered",
    blurb: "One game. The folder on this machine is Conspiracy Of everything. The GitHub name is unremembered.",
    passes: ["C:\\Users\\timmi\\Conspiracy Of everything", "github.com/Rebelyouthz/unremembered"],
  },
  {
    id: "hnt",
    title: "HnT",
    href: "/games/hnt",
    blurb: "Father and Son, one title. The copies opened on this machine were not the current build, so this card has no still from those takes.",
    passes: ["github.com/Rebelyouthz/HnT", "Local folders were the wrong copy and are not listed as other games."],
  },
  {
    id: "waterdrop",
    title: "Waterdrop Survivor",
    href: "/games/waterdrop",
    blurb: "Pixi and the Space folder are one edition, Core. Older canvas repos are earlier passes of that same game, not new editions.",
    passes: [
      "WaterdropPixi / wd2d2Pixi",
      "waterdroppixi-2026-10-02",
      "waterdroppixi-september",
      "wd2d2, wd2d2New, wd2d",
      "Emergent waterdrop, Small-watersrop, RasmusVersion",
      "Dreamcore folders, same survivor idea",
      "V4 is the Godot native pass already named on the series page",
    ],
  },
  {
    id: "remnant",
    title: "Remnant",
    href: "/games/waterdrop/remnant",
    blurb: "Its own edition. The page is from a screen capture. No source was readable.",
    passes: ["Browser capture, Base44"],
  },
  {
    id: "covenant",
    title: "Covenant Abyss",
    href: null,
    blurb: "A separate PixiJS v8 survivor in C:\\Users\\timmi\\CovenantAbyss. The README calls it twin-stick, with a camp and a defend mode. No still is on this shelf yet.",
    passes: ["C:\\Users\\timmi\\CovenantAbyss"],
  },
]

export type AppEntry = {
  slug: string
  title: string
  status: string
  where: string
  body: string[]
}

export const apps: AppEntry[] = [
  {
    slug: "ai-detector",
    title: "AI Slop Detector",
    status: "Local folder",
    where: "C:\\Users\\timmi\\ai detector\\ai-slop-detector-main",
    body: [
      "The README calls it an evidence-based short-video scanner for YouTube, Instagram, TikTok, X, and uploaded clips.",
      "It says the report does not show an AI probability. The outcomes it names are AI indicators detected, no clear AI indicators, inconclusive, AI use disclosed, or verified AI provenance.",
      "It says a negative inspection cannot certify that a clip came from a camera. No GitHub repo for this folder was in the Rebelyouthz list I read.",
    ],
  },
  {
    slug: "mivibe",
    title: "MiVibe",
    status: "Local folder and GitHub",
    where: "C:\\Users\\timmi\\MiVibe and github.com/Rebelyouthz/MiVibe",
    body: [
      "The GitHub description calls it a social platform for AI vibe coding, built with Expo and Supabase.",
      "The folder README calls it a personal project, says it is not for sale, and names Vite and React for the web build in that folder.",
      "I did not verify the longer feature list in that README, so it is not repeated here as fact.",
    ],
  },
  {
    slug: "favorite-game-seeker",
    title: "Favorite Game Seeker",
    status: "GitHub",
    where: "github.com/Rebelyouthz/favorite-game-seeker",
    body: [
      "The repository description says it discovers games similar to ones you already like.",
      "A folder with the same name is under C:\\Users\\timmi\\favorite-game-seeker. I did not open its screens.",
    ],
  },
  {
    slug: "the-maker",
    title: "The Maker",
    status: "GitHub, thin description",
    where: "github.com/Rebelyouthz/The-maker- and C:\\Users\\timmi\\TheMaker",
    body: [
      "The GitHub description is one word: App. The local folder is TheMaker.",
      "I did not find a feature list I could stand behind, so this page stops there.",
    ],
  },
]
