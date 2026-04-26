import { Event, Creator, Project, Category } from "./types";

export const mockCategories: Category[] = [
  { id: "1", name: "Gaming", slug: "gaming", color: "#F97316", icon: "🎮" },
  { id: "2", name: "DeFi", slug: "defi", color: "#8B5CF6", icon: "💎" },
  { id: "3", name: "NFT", slug: "nft", color: "#EC4899", icon: "🖼️" },
  { id: "4", name: "Education", slug: "education", color: "#06B6D4", icon: "📚" },
  { id: "5", name: "Community", slug: "community", color: "#10B981", icon: "🌐" },
  { id: "6", name: "Development", slug: "development", color: "#3B82F6", icon: "⚡" },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Abstract Chain",
    slug: "abstract-chain",
    logo: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=64&h=64&fit=crop",
    description: "The consumer chain for crypto",
    category: "Infrastructure",
    websiteUrl: "https://abs.xyz",
    twitterUrl: "https://twitter.com/AbstractChain",
  },
  {
    id: "2",
    name: "Renegade",
    slug: "renegade",
    logo: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=64&h=64&fit=crop",
    description: "Dark pool DEX",
    category: "DeFi",
    websiteUrl: "https://renegade.fi",
  },
  {
    id: "3",
    name: "Humanity Protocol",
    slug: "humanity-protocol",
    logo: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=64&h=64&fit=crop",
    description: "Proof of humanity",
    category: "Identity",
  },
  {
    id: "4",
    name: "Pengu Royale",
    slug: "pengu-royale",
    logo: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=64&h=64&fit=crop",
    description: "Pudgy Penguins battle royale",
    category: "Gaming",
  },
];

export const mockCreators: Creator[] = [
  {
    id: "1",
    username: "abstractlabs",
    displayName: "Abstract Labs",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop",
    bio: "Official Abstract Chain team. Building the consumer chain for crypto.",
    twitterUrl: "https://twitter.com/AbstractChain",
    discordUrl: "https://discord.gg/abstract",
    followersCount: 12400,
    eventsCount: 47,
    verified: true,
    joinedAt: "2024-01-01",
  },
  {
    id: "2",
    username: "cryptosage",
    displayName: "CryptoSage",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=128&h=128&fit=crop",
    bio: "DeFi educator and on-chain analyst. Breaking down complex concepts.",
    twitterUrl: "https://twitter.com/cryptosage",
    followersCount: 8900,
    eventsCount: 23,
    verified: true,
    joinedAt: "2024-03-15",
  },
  {
    id: "3",
    username: "0xgamer",
    displayName: "0xGamer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    bio: "Pro blockchain gamer and tournament organizer. Let's play on Abstract!",
    twitterUrl: "https://twitter.com/0xgamer",
    followersCount: 5600,
    eventsCount: 31,
    verified: false,
    joinedAt: "2024-05-20",
  },
  {
    id: "4",
    username: "nftwhisperer",
    displayName: "NFT Whisperer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    bio: "NFT collector, artist, and community builder on Abstract.",
    twitterUrl: "https://twitter.com/nftwhisperer",
    followersCount: 3200,
    eventsCount: 18,
    verified: false,
    joinedAt: "2024-07-10",
  },
];

const now = new Date();

function hoursFromNow(hours: number): string {
  const d = new Date(now);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

function daysFromNow(days: number, hour = 18): string {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

// Returns a date on the given ISO weekday (1=Mon…7=Sun) at the given hour (local time).
// If that time has already passed this week, it rolls over to next week so it always
// represents the next upcoming occurrence (weekly recurring events).
function thisWeekDay(isoDow: number, hour: number, minute = 0): string {
  const d = new Date();
  const js = d.getDay(); // 0=Sun…6=Sat
  const curr = js === 0 ? 7 : js; // convert to 1=Mon…7=Sun
  d.setDate(d.getDate() + (isoDow - curr));
  d.setHours(hour, minute, 0, 0);
  // If this occurrence has already passed, push forward one week
  if (d.getTime() < Date.now()) {
    d.setDate(d.getDate() + 7);
  }
  return d.toISOString();
}

// ── Schedule hosts (used only for weekly events, not shown in Top Creators) ──
function mkCreator(
  id: string, username: string, displayName: string, photo: string,
  followers = 1200, events = 12, verified = false
): Creator {
  return {
    id, username, displayName,
    avatar: `https://images.unsplash.com/${photo}?w=128&h=128&fit=crop&crop=face`,
    bio: `${displayName} — Abstract ecosystem content creator`,
    twitterUrl: `https://twitter.com/${username}`,
    followersCount: followers, eventsCount: events, verified,
    joinedAt: "2024-09-01",
  };
}

const sc = {
  abstractChainCN: mkCreator("c01","AbstractChainCN","AbstractChainCN","photo-1506794778202-cad84cf45f1d",4200,14,true),
  chesus:          mkCreator("c02","chesus","Chesus","photo-1472099645785-5658abf4ff4e",3100,52,false),
  GMB:             mkCreator("c03","GMB_AOB","GMB","photo-1500648767791-00dcc994a43e",5800,28,true),
  DenisStoo:       mkCreator("c04","DenisStoo","DenisStoo","photo-1570295999919-56ceb5ecca61",1900,11,false),
  absnaija:        mkCreator("c05","absnaija","absnaija","photo-1463453091185-61582044d556",2300,9,false),
  abstractcnGame:  mkCreator("c06","abstractcn_game","AbstractCN Game","photo-1580489944761-cc6b8c1f2c1b",2800,16,false),
  IGotAssets:      mkCreator("c07","IGotAssets","IGotAssets","photo-1566492031773-de0d4bd2e7eb",3600,22,false),
  marcellovtv:     mkCreator("c08","marcellovtv","marcellovtv","photo-1531427186611-2a85bb920a4f",6100,34,true),
  REDCrypto:       mkCreator("c09","RED__Crypto","RED__Crypto","photo-1560250097-0b93528c311a",2100,8,false),
  mariannehere:    mkCreator("c10","mariannehere","Marianne","photo-1548142813-c348350df52b",4400,19,false),
  CryptoGrit:      mkCreator("c11","CryptoGrit","CryptoGrit","photo-1539571696357-5a69c17a67c6",1700,7,false),
  SultanXchain:    mkCreator("c12","SultanXchain","SultanXchain","photo-1519085360753-af0119f7cbe7",3300,13,false),
  AbsAfrica:       mkCreator("c13","AbsAfrica","AbsAfrica","photo-1557862921-37829c790f19",5200,24,true),
  MetaTomix:       mkCreator("c14","Meta_Tomix","Meta_Tomix","photo-1544005313-94ddf0286df2",2600,10,false),
  itsN1rvy:        mkCreator("c15","itsN1rvy","itsN1rvy","photo-1524504388940-b6c8ea94b0ea",1800,6,false),
  woostarrr:       mkCreator("c16","woostarrr_","woostarrr_","photo-1573140247632-f8341c589093",2900,11,false),
  Soulonchain:     mkCreator("c17","Soulonchain_","Soulonchain_","photo-1562788869-4ed32648eb72",3800,17,false),
  SHOTDON:         mkCreator("c18","SHOTDON_AOB","SHOTDON_AOB","photo-1546961342-ef5fa8a2d90d",2200,8,false),
  enftsar:         mkCreator("c19","enftsar","enftsar","photo-1587614382346-4ec70e388b28",3000,15,false),
};

// Banner pools by type
const B = {
  tournament: [
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=1200&h=630&fit=crop",
  ],
  stream: [
    "https://images.unsplash.com/photo-1598550476360-51d408a42e90?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1478737270197-bc0fd0de7fa1?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630&fit=crop",
  ],
  education: [
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200&h=630&fit=crop",
  ],
  community: [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=1200&h=630&fit=crop",
  ],
  gaming: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=1200&h=630&fit=crop",
    "https://images.unsplash.com/photo-1462317728884-19c8e03ed7ec?w=1200&h=630&fit=crop",
  ],
};

export const mockEvents: Event[] = [
  // ── MONDAY ──────────────────────────────────────────────────────────────────
  { id:"10", slug:"mog-tournament-mon", title:"MoG Tournament", description:"Weekly MoG tournament hosted by AbstractChainCN. Compete with the community for on-chain prizes.", bannerImage:B.tournament[0], eventType:"Tournament", creator:sc.abstractChainCN, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(1,8), endTime:thisWeekDay(1,10), recurrence:{type:"weekly",daysOfWeek:[1]}, twitterLink:"https://twitter.com/AbstractChainCN", tags:["MoG","tournament","gaming"], status:"approved", featured:false, viewCount:320, reminderCount:87, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"11", slug:"reality-check-mon", title:"Reality Check", description:"Weekly reality check stream — honest takes on what's happening in the Abstract ecosystem, market vibes, and community updates.", bannerImage:B.stream[0], eventType:"AMA", creator:sc.chesus, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(1,11), endTime:thisWeekDay(1,12), recurrence:{type:"weekly",daysOfWeek:[1]}, twitterLink:"https://twitter.com/chesus", tags:["reality check","weekly","AMA"], status:"approved", featured:false, viewCount:510, reminderCount:132, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"12", slug:"moody-mondays", title:"Moody Mondays", description:"Moody Mondays — a chill weekly stream with GMB covering Abstract ecosystem news, NFT drops, and community spotlights.", bannerImage:B.stream[1], eventType:"Stream", creator:sc.GMB, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(1,12), endTime:thisWeekDay(1,13), recurrence:{type:"weekly",daysOfWeek:[1]}, twitterLink:"https://twitter.com/GMB_AOB", tags:["Moody Mondays","stream","community"], status:"approved", featured:false, viewCount:440, reminderCount:98, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"13", slug:"tollan-universe-academy-mon", title:"Tollan Universe Academy", description:"Educational sessions covering the Tollan Universe — lore, gameplay, strategy, and how to get started in the Abstract gaming ecosystem.", bannerImage:B.education[0], eventType:"Education", creator:sc.DenisStoo, projects:[], category:mockCategories[3], language:"English", timezone:"EST", startTime:thisWeekDay(1,13), endTime:thisWeekDay(1,14), recurrence:{type:"weekly",daysOfWeek:[1]}, twitterLink:"https://twitter.com/DenisStoo", tags:["Tollan","education","gaming","academy"], status:"approved", featured:false, viewCount:290, reminderCount:61, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"14", slug:"tollan-gamenight-mon", title:"Tollan Gamenight", description:"Monday night Tollan gaming session open to the community. Jump in, play together, and earn rewards in the Abstract ecosystem.", bannerImage:B.gaming[0], eventType:"Gaming", creator:sc.absnaija, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(1,15), endTime:thisWeekDay(1,17), recurrence:{type:"weekly",daysOfWeek:[1]}, twitterLink:"https://twitter.com/absnaija", tags:["Tollan","gamenight","gaming"], status:"approved", featured:false, viewCount:380, reminderCount:74, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── TUESDAY ─────────────────────────────────────────────────────────────────
  { id:"15", slug:"tollan-tournament-tue", title:"Tollan Tournament", description:"Tuesday Tollan tournament organized by the AbstractCN gaming community. Open brackets, prizes for top finishers.", bannerImage:B.tournament[1], eventType:"Tournament", creator:sc.abstractcnGame, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(2,8), endTime:thisWeekDay(2,10), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/abstractcn_game", tags:["Tollan","tournament","gaming"], status:"approved", featured:false, viewCount:410, reminderCount:91, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"16", slug:"reality-check-tue", title:"Reality Check", description:"Weekly reality check stream — honest takes on what's happening in the Abstract ecosystem, market vibes, and community updates.", bannerImage:B.stream[2], eventType:"AMA", creator:sc.chesus, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(2,11), endTime:thisWeekDay(2,12), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/chesus", tags:["reality check","weekly","AMA"], status:"approved", featured:false, viewCount:490, reminderCount:118, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"17", slug:"pudgy-world-tour-tue", title:"Pudgy World Tour", description:"IGotAssets takes the community on a Pudgy Penguins world tour — showcasing ecosystem dApps, NFT collections, and on-chain adventures.", bannerImage:B.stream[3], eventType:"Stream", creator:sc.IGotAssets, projects:[], category:mockCategories[2], language:"English", timezone:"EST", startTime:thisWeekDay(2,11,30), endTime:thisWeekDay(2,12,30), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/IGotAssets", tags:["Pudgy","NFT","stream","world tour"], status:"approved", featured:false, viewCount:560, reminderCount:143, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"18", slug:"gigachad-bat-event-tue", title:"Gigachad Bat Event", description:"The infamous Gigachad bat event returns. marcellovtv brings the chaos — games, challenges, and community fun on Abstract.", bannerImage:B.gaming[1], eventType:"Gaming", creator:sc.marcellovtv, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(2,12), endTime:thisWeekDay(2,13), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/marcellovtv", tags:["Gigachad","gaming","fun","community"], status:"approved", featured:false, viewCount:720, reminderCount:189, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"19", slug:"tollan-tuesdays", title:"Tollan Tuesdays", description:"Every Tuesday, RED__Crypto hosts the community Tollan session — updates, tips, open play, and rewards for participants.", bannerImage:B.community[0], eventType:"Community Call", creator:sc.REDCrypto, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(2,13), endTime:thisWeekDay(2,14), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/RED__Crypto", tags:["Tollan","Tuesdays","community"], status:"approved", featured:false, viewCount:330, reminderCount:67, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"20", slug:"proliferation-tue", title:"Proliferation", description:"Proliferation — Marianne's weekly exploration of what's growing and thriving inside the Abstract ecosystem. Alpha, trends, and hidden gems.", bannerImage:B.stream[4], eventType:"Stream", creator:sc.mariannehere, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(2,14), endTime:thisWeekDay(2,15), recurrence:{type:"weekly",daysOfWeek:[2]}, twitterLink:"https://twitter.com/mariannehere", tags:["Proliferation","stream","ecosystem"], status:"approved", featured:false, viewCount:470, reminderCount:112, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── WEDNESDAY ───────────────────────────────────────────────────────────────
  { id:"21", slug:"reality-check-wed", title:"Reality Check", description:"Weekly reality check stream — honest takes on what's happening in the Abstract ecosystem, market vibes, and community updates.", bannerImage:B.stream[0], eventType:"AMA", creator:sc.chesus, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(3,11), endTime:thisWeekDay(3,12), recurrence:{type:"weekly",daysOfWeek:[3]}, twitterLink:"https://twitter.com/chesus", tags:["reality check","weekly","AMA"], status:"approved", featured:false, viewCount:505, reminderCount:125, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"22", slug:"ruyui-wednesday", title:"Ruyui Wednesday", description:"Wednesday vibes with IGotAssets — Ruyui lore, gameplay sessions, ecosystem exploration, and community Q&A.", bannerImage:B.gaming[2], eventType:"Stream", creator:sc.IGotAssets, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(3,11,30), endTime:thisWeekDay(3,12,30), recurrence:{type:"weekly",daysOfWeek:[3]}, twitterLink:"https://twitter.com/IGotAssets", tags:["Ruyui","Wednesday","stream","gaming"], status:"approved", featured:false, viewCount:390, reminderCount:88, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"23", slug:"pudgy-party-wed", title:"Pudgy Party", description:"Wednesday Pudgy Party — marcellovtv brings together the Pudgy Penguins community on Abstract for games, giveaways, and good vibes.", bannerImage:B.community[1], eventType:"Community Call", creator:sc.marcellovtv, projects:[], category:mockCategories[2], language:"English", timezone:"EST", startTime:thisWeekDay(3,12), endTime:thisWeekDay(3,13), recurrence:{type:"weekly",daysOfWeek:[3]}, twitterLink:"https://twitter.com/marcellovtv", tags:["Pudgy","party","community","NFT"], status:"approved", featured:false, viewCount:580, reminderCount:151, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"24", slug:"hamieverse-stream-wed", title:"Hamieverse Stream", description:"CryptoGrit dives into the Hamieverse — weekly exploration of the Hamster ecosystem, Abstract integrations, and live gameplay.", bannerImage:B.stream[1], eventType:"Stream", creator:sc.CryptoGrit, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(3,14), endTime:thisWeekDay(3,15), recurrence:{type:"weekly",daysOfWeek:[3]}, twitterLink:"https://twitter.com/CryptoGrit", tags:["Hamieverse","stream","gaming"], status:"approved", featured:false, viewCount:260, reminderCount:54, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── THURSDAY ────────────────────────────────────────────────────────────────
  { id:"25", slug:"penguclash-tournament-thu", title:"PenguClash Tournament", description:"SultanXchain hosts the weekly PenguClash tournament — bracket play, live commentary, and prizes for the Abstract gaming community.", bannerImage:B.tournament[2], eventType:"Tournament", creator:sc.SultanXchain, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(4,10), endTime:thisWeekDay(4,12), recurrence:{type:"weekly",daysOfWeek:[4]}, twitterLink:"https://twitter.com/SultanXchain", tags:["PenguClash","tournament","gaming"], status:"approved", featured:false, viewCount:640, reminderCount:167, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"26", slug:"reality-check-thu", title:"Reality Check", description:"Weekly reality check stream — honest takes on what's happening in the Abstract ecosystem, market vibes, and community updates.", bannerImage:B.stream[2], eventType:"AMA", creator:sc.chesus, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(4,11), endTime:thisWeekDay(4,12), recurrence:{type:"weekly",daysOfWeek:[4]}, twitterLink:"https://twitter.com/chesus", tags:["reality check","weekly","AMA"], status:"approved", featured:false, viewCount:530, reminderCount:138, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"27", slug:"onboarding-series-thu", title:"Onboarding Series W", description:"AbsAfrica's weekly onboarding series for new Abstract users across the African continent — wallets, DApps, gaming, and NFTs explained simply.", bannerImage:B.education[1], eventType:"Education", creator:sc.AbsAfrica, projects:[], category:mockCategories[3], language:"English", timezone:"EST", startTime:thisWeekDay(4,13), endTime:thisWeekDay(4,14), recurrence:{type:"weekly",daysOfWeek:[4]}, twitterLink:"https://twitter.com/AbsAfrica", tags:["onboarding","Africa","education","community"], status:"approved", featured:false, viewCount:480, reminderCount:126, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"28", slug:"madness-royale-thu", title:"Madness Royale", description:"Meta_Tomix brings the madness — weekly Royale tournament with surprise mechanics, wild brackets, and massive community energy.", bannerImage:B.tournament[3], eventType:"Tournament", creator:sc.MetaTomix, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(4,14), endTime:thisWeekDay(4,16), recurrence:{type:"weekly",daysOfWeek:[4]}, twitterLink:"https://twitter.com/Meta_Tomix", tags:["Madness Royale","tournament","gaming"], status:"approved", featured:false, viewCount:590, reminderCount:154, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"29", slug:"tollan-creator-league-thu", title:"Tollan Creator League", description:"itsN1rvy runs the Tollan Creator League — weekly showdown between content creators competing in Tollan Universe for community glory.", bannerImage:B.stream[3], eventType:"Stream", creator:sc.itsN1rvy, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(4,15), endTime:thisWeekDay(4,17), recurrence:{type:"weekly",daysOfWeek:[4]}, twitterLink:"https://twitter.com/itsN1rvy", tags:["Tollan","creator league","stream","gaming"], status:"approved", featured:false, viewCount:350, reminderCount:79, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── FRIDAY ──────────────────────────────────────────────────────────────────
  { id:"30", slug:"reality-check-fri", title:"Reality Check", description:"Weekly reality check stream — honest takes on what's happening in the Abstract ecosystem, market vibes, and community updates.", bannerImage:B.stream[4], eventType:"AMA", creator:sc.chesus, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(5,11), endTime:thisWeekDay(5,12), recurrence:{type:"weekly",daysOfWeek:[5]}, twitterLink:"https://twitter.com/chesus", tags:["reality check","weekly","AMA"], status:"approved", featured:false, viewCount:495, reminderCount:122, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"31", slug:"clash-royale-fri", title:"Clash Royale", description:"woostarrr_ hosts the Friday Clash Royale — open to all Abstract community members. Bring your best deck and compete for prizes.", bannerImage:B.tournament[4], eventType:"Tournament", creator:sc.woostarrr, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(5,11,30), endTime:thisWeekDay(5,13), recurrence:{type:"weekly",daysOfWeek:[5]}, twitterLink:"https://twitter.com/woostarrr_", tags:["Clash Royale","tournament","gaming","Friday"], status:"approved", featured:false, viewCount:460, reminderCount:115, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"32", slug:"everything-abstract-fri", title:"Everything Abstract", description:"The weekly everything-Abstract show — Soulonchain_ covers all major events, releases, and alpha from across the Abstract ecosystem.", bannerImage:B.stream[0], eventType:"AMA", creator:sc.Soulonchain, projects:[], category:mockCategories[4], language:"English", timezone:"EST", startTime:thisWeekDay(5,13), endTime:thisWeekDay(5,14), recurrence:{type:"weekly",daysOfWeek:[5]}, twitterLink:"https://twitter.com/Soulonchain_", tags:["Everything Abstract","AMA","ecosystem","weekly"], status:"approved", featured:false, viewCount:820, reminderCount:204, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── SATURDAY ────────────────────────────────────────────────────────────────
  { id:"33", slug:"khuga-bash-sat", title:"Khuga Bash", description:"SHOTDON_AOB runs the Saturday Khuga Bash — gaming, community battles, giveaways, and a showcase of Khuga NFT holders on Abstract.", bannerImage:B.gaming[0], eventType:"Gaming", creator:sc.SHOTDON, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(6,10), endTime:thisWeekDay(6,12), recurrence:{type:"weekly",daysOfWeek:[6]}, twitterLink:"https://twitter.com/SHOTDON_AOB", tags:["Khuga","bash","gaming","NFT"], status:"approved", featured:false, viewCount:530, reminderCount:136, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"34", slug:"tollan-tournament-sat", title:"Tollan Tournament", description:"Saturday Tollan Tournament hosted by enftsar — weekly bracket competition open to all Tollan Universe players in the Abstract ecosystem.", bannerImage:B.tournament[5], eventType:"Tournament", creator:sc.enftsar, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(6,14), endTime:thisWeekDay(6,16), recurrence:{type:"weekly",daysOfWeek:[6]}, twitterLink:"https://twitter.com/enftsar", tags:["Tollan","tournament","Saturday","gaming"], status:"approved", featured:false, viewCount:490, reminderCount:127, createdAt:now.toISOString(), updatedAt:now.toISOString() },
  { id:"35", slug:"mog-gold-rush-tournament-sat", title:"MoG Gold Rush Tournament", description:"The Saturday Gold Rush — enftsar's high-stakes MoG tournament with an on-chain prize pool. Top 3 players take home the gold.", bannerImage:B.tournament[0], eventType:"Tournament", creator:sc.enftsar, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(6,15), endTime:thisWeekDay(6,17), recurrence:{type:"weekly",daysOfWeek:[6]}, twitterLink:"https://twitter.com/enftsar", tags:["MoG","Gold Rush","tournament","gaming"], status:"approved", featured:false, viewCount:670, reminderCount:175, createdAt:now.toISOString(), updatedAt:now.toISOString() },

  // ── SUNDAY ──────────────────────────────────────────────────────────────────
  { id:"36", slug:"tollan-universe-tournament-sun", title:"Tollan Universe Tournament", description:"AbsAfrica closes the week with the Sunday Tollan Universe Tournament — the biggest weekly Tollan event for the African Abstract community and beyond.", bannerImage:B.tournament[2], eventType:"Tournament", creator:sc.AbsAfrica, projects:[], category:mockCategories[0], language:"English", timezone:"EST", startTime:thisWeekDay(7,14), endTime:thisWeekDay(7,16), recurrence:{type:"weekly",daysOfWeek:[0]}, twitterLink:"https://twitter.com/AbsAfrica", tags:["Tollan","tournament","Sunday","Africa"], status:"approved", featured:false, viewCount:610, reminderCount:159, createdAt:now.toISOString(), updatedAt:now.toISOString() },
];

export const mockPendingEvents: Event[] = [
  {
    id: "8",
    slug: "abstract-testnet-launch-party",
    title: "Abstract Testnet 2.0 Launch Party",
    description: "Celebrate the launch of Abstract Testnet 2.0 with the community.",
    bannerImage:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=630&fit=crop",
    eventType: "Community Call",
    creator: mockCreators[0],
    projects: [mockProjects[0]],
    category: mockCategories[4],
    language: "English",
    timezone: "UTC",
    startTime: daysFromNow(10, 20),
    endTime: daysFromNow(10, 22),
    recurrence: { type: "none" },
    streamLink: "https://youtube.com/live/abstractchain",
    tags: ["testnet", "launch", "community"],
    status: "pending",
    featured: false,
    viewCount: 0,
    reminderCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
