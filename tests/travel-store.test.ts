import { describe, expect, it } from "vitest";
import { colors, destinations, events, listings, mapPlaces, reels, trendPlaces } from "../lib/travel-store";

describe("Musafir demo travel data", () => {
  it("keeps a bright, green-led palette", () => {
    expect(colors.primary).toBe("#91DA73");
    expect(colors.bg).toBe("#FAFBF7");
    expect(colors.deep).toBe("#0D2D23");
  });

  it("contains enough destination variety for Explore and wishlist flows", () => {
    expect(destinations.length).toBeGreaterThanOrEqual(8);
    expect(new Set(destinations.map((destination) => destination.location.split(", ").pop()))).toContain("India");
    expect(new Set(destinations.map((destination) => destination.tag)).size).toBeGreaterThanOrEqual(5);
    expect(destinations.every((destination) => destination.highlights.length >= 2)).toBe(true);
  });

  it("provides safety-aware booking categories and recommendation signals", () => {
    expect(Object.keys(listings)).toEqual(["Hotels", "Restaurants", "Activities", "Guides"]);
    expect(Object.values(listings).flat().every((listing) => listing.tags.length >= 2)).toBe(true);
    expect(Object.values(listings).flat().some((listing) => listing.tags.some((tag) => tag.toLowerCase().includes("women")))).toBe(true);
  });

  it("provides event and map data for the utility overlays", () => {
    expect(events.length).toBeGreaterThanOrEqual(3);
    expect(mapPlaces.some((place) => place.category === "Hospital")).toBe(true);
    expect(mapPlaces.some((place) => place.category === "Petrol")).toBe(true);
    expect(mapPlaces.some((place) => place.city === "Bengaluru")).toBe(true);
    expect(mapPlaces.some((place) => place.category === "Event")).toBe(true);
    expect(mapPlaces.every((place) => place.distance && place.status)).toBe(true);
  });

  it("keeps Trending Now as short-form reels with connected destinations", () => {
    expect(reels.length).toBeGreaterThanOrEqual(4);
    expect(reels.every((reel) => reel.views && reel.hashtags && reel.destinationId)).toBe(true);
    expect(reels.every((reel) => destinations.some((destination) => destination.id === reel.destinationId))).toBe(true);
  });

  it("provides selectable map categories for the location dropdown", () => {
    expect(new Set(mapPlaces.map((place) => place.category))).toEqual(new Set(["Tourist spot", "Hospital", "Restaurant", "Hotel", "Petrol", "Event"]));
  });

  it("provides place-specific event reasons and crowd timelines", () => {
    expect(trendPlaces.length).toBeGreaterThanOrEqual(5);
    expect(new Set(trendPlaces.map((place) => place.eventType)).size).toBeGreaterThanOrEqual(3);
    expect(trendPlaces.every((place) => place.reason && place.times.length >= 4)).toBe(true);
  });
});
