import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type TabKey = "explore" | "map" | "profile" | "bookings" | "trends";
export type SheetKey = "wishlist" | "safety" | "events" | "translator" | null;
export type BookingType = "Hotels" | "Restaurants" | "Activities" | "Guides";
export type Destination = {
  id: string; name: string; location: string; image: string; rating: string; reviews: string; tag: string; price: string;
  description: string; highlights: string[]; crowd: "Low" | "Moderate" | "High";
};
export type Listing = { id: string; name: string; location: string; rating: string; reviews: string; price: string; image: string; tags: string[] };
export type ItineraryItem = { id: string; time: string; title: string; location: string; type: string };
export type TrendPlace = {
  id: string; name: string; event: string; eventType: string; crowd: "Low" | "Moderate" | "High";
  reason: string; popularity: string; date: string; times: { label: string; value: number; tone: "low" | "mid" | "high" }[];
};

export const colors = {
  primary: "#91DA73", primarySoft: "#EAF7DF", deep: "#0D2D23", teal: "#165A54", forest: "#23643D",
  text: "#10231C", muted: "#718078", bg: "#FAFBF7", surface: "#FFFFFF", cream: "#F2F6ED", border: "#E6EDE3",
  warning: "#C66B2A", warningSoft: "#FFF1E2", red: "#C9534C", redSoft: "#FCE9E6", map: "#E6F1E4",
};

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=82`;

export const destinations: Destination[] = [
  { id: "jaipur", name: "Pink City, Jaipur", location: "Rajasthan, India", image: img("photo-1599661046289-e31897846e41"), rating: "4.8", reviews: "2.4k", tag: "Heritage", price: "₹2,950", description: "A sun-washed weekend of courtyards, craft markets and slow evenings under the Aravalli sky.", highlights: ["Amber Fort sunrise", "Blue pottery trail", "Old city food walk"], crowd: "Moderate" },
  { id: "goa", name: "South Goa Escape", location: "Goa, India", image: img("photo-1512343879784-a960bf40e7f2"), rating: "4.7", reviews: "1.8k", tag: "Beach", price: "₹4,200", description: "Quiet coves, golden hour cafés and a gentler side of Goa built for unhurried travel.", highlights: ["Palolem kayak", "Spice plantation", "Sunset café trail"], crowd: "Low" },
  { id: "kerala", name: "Backwaters of Kerala", location: "Alappuzha, India", image: img("photo-1602216056096-3b40cc0c9944"), rating: "4.9", reviews: "3.1k", tag: "Nature", price: "₹5,750", description: "Trade traffic for palm-lined waterways, fresh seafood and mornings that move at their own pace.", highlights: ["Houseboat morning", "Village canoe ride", "Ayurveda ritual"], crowd: "Low" },
  { id: "majuli", name: "Majuli Island", location: "Assam, India", image: img("photo-1516026672322-bc52d61a55d5"), rating: "4.7", reviews: "364", tag: "Culture", price: "₹3,100", description: "A river island of mask-making, satras and quiet bicycle roads shaped by the Brahmaputra.", highlights: ["Mishing village lunch", "Satriya performance", "Sunset ferry"], crowd: "Low" },
  { id: "gokarna", name: "Gokarna Coast", location: "Karnataka, India", image: img("photo-1507525428034-b723cf961d3e"), rating: "4.6", reviews: "912", tag: "Beach", price: "₹3,650", description: "A slower Konkan shoreline where temple lanes meet forested coves and simple seafood cafés.", highlights: ["Kudle coastal walk", "Local temple trail", "Half-moon cove"], crowd: "Moderate" },
  { id: "orchha", name: "Orchha Riverside", location: "Madhya Pradesh, India", image: img("photo-1548013146-72479768bada"), rating: "4.8", reviews: "527", tag: "Heritage", price: "₹2,450", description: "Stone chhatris, river sunsets and a small-town rhythm far from the usual tourist circuit.", highlights: ["Betwa riverbank", "Bundela frescoes", "Evening temple aarti"], crowd: "Low" },
  { id: "tawang", name: "Tawang Valley", location: "Arunachal Pradesh, India", image: img("photo-1464822759023-fed622ff2c3b"), rating: "4.9", reviews: "241", tag: "Adventure", price: "₹6,800", description: "High mountain passes, monastery bells and wide Himalayan skies for travellers who want the long way there.", highlights: ["Monastery dawn", "Sela Pass", "Local noodle kitchen"], crowd: "Low" },
  { id: "chettinad", name: "Chettinad Courtyards", location: "Tamil Nadu, India", image: img("photo-1564507592333-c60657eea523"), rating: "4.7", reviews: "188", tag: "Food", price: "₹3,200", description: "A delicious trail through tiled mansions, spice-rich kitchens and villages with deep craft traditions.", highlights: ["Athangudi tiles", "Home-style feast", "Heritage mansion walk"], crowd: "Low" },
  { id: "bali", name: "Ubud, Bali", location: "Bali, Indonesia", image: img("photo-1537996194471-e657df975ab4"), rating: "4.6", reviews: "986", tag: "Nature", price: "₹8,400", description: "Rice terraces, forest temples and a creative rhythm for a reset far from the everyday.", highlights: ["Tegallalang dawn", "Temple etiquette walk", "Local cooking class"], crowd: "Moderate" },
];

export const reels = [
  { id: "reel-majuli", destinationId: "majuli", title: "A river island that slows time", location: "Majuli · Assam", image: destinations[3].image, views: "8.9K", caption: "Ferries, folk songs and a horizon that keeps moving.", hashtags: "#SlowTravel #Assam" },
  { id: "reel-orchha", destinationId: "orchha", title: "Orchha after the last bus", location: "Orchha · Madhya Pradesh", image: destinations[5].image, views: "7.4K", caption: "The quietest kind of heritage is often the most memorable.", hashtags: "#HiddenIndia #Heritage" },
  { id: "reel-gokarna", destinationId: "gokarna", title: "A quieter Konkan coast", location: "Gokarna · Karnataka", image: destinations[4].image, views: "14.1K", caption: "Salt air, later breakfasts and a path to the next cove.", hashtags: "#CoastalRoad #WeekendEscape" },
  { id: "reel-jaipur", destinationId: "jaipur", title: "Amber Fort before the crowds", location: "Jaipur · Rajasthan", image: destinations[0].image, views: "18.4K", caption: "Golden hour has a way of making every road feel personal.", hashtags: "#Heritage #SlowTravel" },
  { id: "reel-goa", destinationId: "goa", title: "A quieter side of Goa", location: "Palolem · Goa", image: destinations[1].image, views: "12.8K", caption: "Salt air, soft mornings and nowhere else to be.", hashtags: "#BeachGetaway #WeekendEscape" },
  { id: "reel-kerala", destinationId: "kerala", title: "Let the backwaters set the pace", location: "Alappuzha · Kerala", image: destinations[2].image, views: "21.2K", caption: "A little stillness from the middle of the water.", hashtags: "#Nature #HiddenGems" },
];

export const listings: Record<BookingType, Listing[]> = {
  Hotels: [
    { id: "hotel-1", name: "The Gulabi Haveli", location: "Jaipur · 1.2 km from old city", rating: "4.8", reviews: "428", price: "₹3,950 / night", image: destinations[0].image, tags: ["Family friendly", "Well-lit area", "24/7 reception"] },
    { id: "hotel-2", name: "Maré Verde Retreat", location: "Palolem · 600 m from beach", rating: "4.7", reviews: "311", price: "₹4,600 / night", image: destinations[1].image, tags: ["Solo friendly", "Secure entrance", "Quiet zone"] },
    { id: "hotel-3", name: "Betwa Courtyard Stay", location: "Orchha · riverside", rating: "4.8", reviews: "159", price: "₹2,450 / night", image: destinations[5].image, tags: ["Rated by Women", "Heritage stay", "Local hosts"] },
    { id: "hotel-4", name: "Majuli River Homestay", location: "Majuli · Kamalabari", rating: "4.6", reviews: "92", price: "₹1,850 / night", image: destinations[3].image, tags: ["Family friendly", "Ferry pickup", "Home cooked meals"] },
  ],
  Restaurants: [
    { id: "rest-1", name: "Mitti Courtyard", location: "Jaipur · C-Scheme", rating: "4.6", reviews: "1.2k", price: "₹1,200 for two", image: img("photo-1517248135467-4c7edcad34c4"), tags: ["Rated by Women", "Vegetarian", "Well-lit area"] },
    { id: "rest-2", name: "Coco Loco", location: "South Goa · Patnem", rating: "4.8", reviews: "864", price: "₹1,600 for two", image: img("photo-1540189549336-e6e99c3679fe"), tags: ["Pet friendly", "Outdoor seating", "Solo friendly"] },
    { id: "rest-3", name: "Aai’s Assamese Kitchen", location: "Majuli · Garamur", rating: "4.9", reviews: "76", price: "₹650 for two", image: img("photo-1601050690597-df0568f70950"), tags: ["Local family", "Small seating", "Vegetarian options"] },
    { id: "rest-4", name: "Chettinad House Table", location: "Karaikudi · market lane", rating: "4.7", reviews: "211", price: "₹900 for two", image: img("photo-1559339352-11d035aa65de"), tags: ["Women-led", "Regional menu", "Advance booking"] },
  ],
  Activities: [
    { id: "act-1", name: "Amber at First Light", location: "Jaipur · 2.4 hrs", rating: "4.9", reviews: "192", price: "₹1,850 / person", image: img("photo-1477587458883-47145ed94245"), tags: ["Small group", "Women traveller friendly", "Guide included"] },
    { id: "act-2", name: "Mangrove Kayak Trail", location: "Goa · 3 hrs", rating: "4.7", reviews: "146", price: "₹1,450 / person", image: img("photo-1502680390469-be75c86b636f"), tags: ["Solo friendly", "Safety briefing", "Beginner friendly"] },
    { id: "act-3", name: "Betwa Dawn Cycle Route", location: "Orchha · 2 hrs", rating: "4.8", reviews: "64", price: "₹780 / person", image: destinations[5].image, tags: ["Small group", "Easy pace", "Helmet included"] },
    { id: "act-4", name: "Athangudi Tile Workshop", location: "Chettinad · 90 min", rating: "4.9", reviews: "48", price: "₹1,100 / person", image: destinations[7].image, tags: ["Local artisan", "Indoor option", "Family friendly"] },
  ],
  Guides: [
    { id: "guide-1", name: "Meera’s Pink City Walks", location: "Jaipur · Local host", rating: "5.0", reviews: "88", price: "₹900 / person", image: img("photo-1544005313-94ddf0286df2"), tags: ["Women-led", "Heritage expert", "Flexible pace"] },
    { id: "guide-2", name: "Ravi’s Backwater Stories", location: "Kerala · Local host", rating: "4.9", reviews: "124", price: "₹1,100 / person", image: img("photo-1560250097-0b93528c311a"), tags: ["Family friendly", "First aid trained", "Local food"] },
    { id: "guide-3", name: "Bikash’s Majuli Trails", location: "Assam · Local host", rating: "4.8", reviews: "51", price: "₹700 / person", image: destinations[3].image, tags: ["Local storyteller", "Ferry planning", "Slow pace"] },
    { id: "guide-4", name: "Ananya’s Konkan Walks", location: "Gokarna · Local host", rating: "4.9", reviews: "67", price: "₹850 / person", image: destinations[4].image, tags: ["Rated by Women", "Coastal safety", "Sunset route"] },
  ],
};

export const events = [
  { id: "e1", date: "SEP 14", category: "Culture", title: "Heritage at Night", location: "Jaipur · City Palace", image: destinations[0].image, description: "A lantern-lit courtyard walk with local storytellers and folk musicians." },
  { id: "e2", date: "SEP 18", category: "Food", title: "Monsoon Thali Trail", location: "Goa · Panjim", image: destinations[1].image, description: "Three family-run kitchens, one unhurried afternoon of coastal flavours." },
  { id: "e3", date: "SEP 22", category: "Nature", title: "Quiet Water Morning", location: "Kerala · Alappuzha", image: destinations[2].image, description: "A small-group sunrise canoe ride through the village backwaters." },
];

export const mapPlaces = [
  { id: "p1", name: "Amber Fort", category: "Tourist spot", city: "Jaipur", distance: "2.4 km", rating: "4.8", status: "Open · closes 6:00 PM", x: "26%", y: "28%", icon: "museum" },
  { id: "p2", name: "Sawai Man Singh Hospital", category: "Hospital", city: "Jaipur", distance: "3.1 km", rating: "4.5", status: "Open 24 hours", x: "62%", y: "53%", icon: "local-hospital" },
  { id: "p3", name: "Mitti Courtyard", category: "Restaurant", city: "Jaipur", distance: "1.8 km", rating: "4.6", status: "Open · closes 11:00 PM", x: "43%", y: "70%", icon: "restaurant" },
  { id: "p4", name: "Pink City Stay", category: "Hotel", city: "Jaipur", distance: "900 m", rating: "4.8", status: "Rooms available", x: "76%", y: "27%", icon: "hotel" },
  { id: "p5", name: "HP Petrol Pump", category: "Petrol", city: "Jaipur", distance: "2.7 km", rating: "4.2", status: "Open 24 hours", x: "18%", y: "69%", icon: "local-gas-station" },
  { id: "p6", name: "Lalbagh Botanical Garden", category: "Tourist spot", city: "Bengaluru", distance: "1.1 km", rating: "4.7", status: "Open · closes 7:00 PM", x: "22%", y: "22%", icon: "park" },
  { id: "p7", name: "Bengaluru Bean & Bowl", category: "Restaurant", city: "Bengaluru", distance: "700 m", rating: "4.6", status: "Open · closes 10:30 PM", x: "68%", y: "34%", icon: "restaurant" },
  { id: "p8", name: "NIMHANS Emergency", category: "Hospital", city: "Bengaluru", distance: "2.2 km", rating: "4.5", status: "Open 24 hours", x: "54%", y: "73%", icon: "local-hospital" },
  { id: "p9", name: "Majuli Raas Festival", category: "Event", city: "Majuli", distance: "4.5 km", rating: "4.9", status: "Today · starts 5:00 PM", x: "80%", y: "58%", icon: "event" },
  { id: "p10", name: "Konkan CNG Point", category: "Petrol", city: "Gokarna", distance: "3.6 km", rating: "4.3", status: "Open 24 hours", x: "35%", y: "82%", icon: "local-gas-station" },
  { id: "p11", name: "Orchha Riverside Stay", category: "Hotel", city: "Orchha", distance: "500 m", rating: "4.8", status: "Rooms available", x: "72%", y: "18%", icon: "hotel" },
  { id: "p12", name: "Tawang Medical Centre", category: "Hospital", city: "Tawang", distance: "1.4 km", rating: "4.4", status: "Open until 8:00 PM", x: "48%", y: "46%", icon: "local-hospital" },
];

export const trendPlaces: TrendPlace[] = [
  { id: "india-gate", name: "Delhi — India Gate", event: "Evening food and light festival", eventType: "Seasonal event", crowd: "High", reason: "A weekend light installation and food trucks are drawing families after sunset.", popularity: "Trending up 18% this week", date: "Saturday, Sep 19", times: [{ label: "10 AM", value: 34, tone: "low" }, { label: "1 PM", value: 52, tone: "mid" }, { label: "4 PM", value: 76, tone: "high" }, { label: "7 PM", value: 94, tone: "high" }] },
  { id: "lalbagh", name: "Bengaluru — Lalbagh", event: "Horticulture flower show", eventType: "Cultural celebration", crowd: "High", reason: "The annual flower show is open today, with timed entry and local craft stalls.", popularity: "Trending up 31% this week", date: "Sunday, Sep 20", times: [{ label: "10 AM", value: 58, tone: "mid" }, { label: "1 PM", value: 84, tone: "high" }, { label: "4 PM", value: 96, tone: "high" }, { label: "7 PM", value: 66, tone: "mid" }] },
  { id: "amber", name: "Jaipur — Amber Fort", event: "Heritage at Night", eventType: "Cultural evening", crowd: "Moderate", reason: "A lantern-lit storytelling walk begins after sunset and lifts evening footfall.", popularity: "Steady · best before 11 AM", date: "Monday, Sep 21", times: [{ label: "10 AM", value: 28, tone: "low" }, { label: "1 PM", value: 54, tone: "mid" }, { label: "4 PM", value: 72, tone: "high" }, { label: "7 PM", value: 82, tone: "high" }] },
  { id: "baga", name: "Goa — Baga Beach", event: "Monsoon music gathering", eventType: "Local gathering", crowd: "Moderate", reason: "Small beach venues are hosting live acoustic sets through the evening.", popularity: "Trending up 12% this week", date: "Friday, Sep 18", times: [{ label: "10 AM", value: 22, tone: "low" }, { label: "1 PM", value: 36, tone: "low" }, { label: "4 PM", value: 61, tone: "mid" }, { label: "7 PM", value: 78, tone: "high" }] },
  { id: "majuli", name: "Majuli — Kamalabari", event: "Raas rehearsal and river fair", eventType: "Religious event", crowd: "Moderate", reason: "Satras are rehearsing for the Raas festival while a riverside fair runs nearby.", popularity: "New interest · quieter before 3 PM", date: "Tuesday, Sep 22", times: [{ label: "10 AM", value: 24, tone: "low" }, { label: "1 PM", value: 38, tone: "low" }, { label: "4 PM", value: 68, tone: "mid" }, { label: "7 PM", value: 86, tone: "high" }] },
];

const defaultItinerary: ItineraryItem[] = [
  { id: "i1", time: "08:30 AM", title: "Amber Fort sunrise", location: "Amer, Jaipur", type: "Experience" },
  { id: "i2", time: "01:00 PM", title: "Lunch at Mitti Courtyard", location: "C-Scheme, Jaipur", type: "Restaurant" },
  { id: "i3", time: "05:30 PM", title: "Hotel check-in", location: "The Gulabi Haveli", type: "Stay" },
];
const defaultPreferences = ["Solo Traveller", "Woman Traveller"];

type TravelContextValue = {
  savedIds: string[]; toggleSaved: (id: string) => void;
  preferences: string[]; togglePreference: (value: string) => void;
  itinerary: ItineraryItem[]; addItinerary: (item: ItineraryItem) => void; removeItinerary: (id: string) => void;
  downloaded: boolean; setDownloaded: (value: boolean) => void;
  selectedDestination: Destination; setSelectedDestination: (destination: Destination) => void;
};
const TravelContext = createContext<TravelContextValue | null>(null);

export function TravelProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(["jaipur", "orchha"]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [itinerary, setItinerary] = useState(defaultItinerary);
  const [downloaded, setDownloaded] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const value = useMemo(() => ({
    savedIds,
    toggleSaved: (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]),
    preferences,
    togglePreference: (value: string) => setPreferences((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]),
    itinerary,
    addItinerary: (item: ItineraryItem) => setItinerary((current) => current.some((existing) => existing.id === item.id) ? current : [...current, item]),
    removeItinerary: (id: string) => setItinerary((current) => current.filter((item) => item.id !== id)),
    downloaded, setDownloaded, selectedDestination, setSelectedDestination,
  }), [savedIds, preferences, itinerary, downloaded, selectedDestination]);
  return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;
}

export function useTravel() {
  const context = useContext(TravelContext);
  if (!context) throw new Error("useTravel must be used inside TravelProvider");
  return context;
}
