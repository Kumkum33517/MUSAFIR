import { useMemo, useState } from "react";
import { FlatList, Image, ImageBackground, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DestinationCard, EmptyState, Icon, Pill, ReelCard, SearchBar, SectionTitle, Sheet, Tap, uiStyles } from "@/components/musafir-ui";
import { colors, destinations, events, reels, useTravel, type Destination, type SheetKey } from "@/lib/travel-store";

export default function ExploreScreen() {
  const router = useRouter();
  const { savedIds, toggleSaved, setSelectedDestination } = useTravel();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sheet, setSheet] = useState<SheetKey>(null);
  const [details, setDetails] = useState<Destination | null>(null);
  const [activeReel, setActiveReel] = useState<(typeof reels)[number] | null>(null);
  const [isReelScrolling, setIsReelScrolling] = useState(false);
  const categories = ["All", "Heritage", "Beach", "Nature", "Food", "Adventure"];
  const visible = useMemo(() => destinations.filter((item) => `${item.name} ${item.location}`.toLowerCase().includes(search.toLowerCase()) && (category === "All" || item.tag.toLowerCase() === category.toLowerCase())), [search, category]);
  const openDestination = (destination: Destination) => { setSelectedDestination(destination); setDetails(destination); };

  return <ScreenContainer className="bg-[#FAFBF7]" edges={["top", "left", "right"]}>
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={uiStyles.scrollContent}>
      <ExploreHeader onEvents={() => setSheet("events")} onWishlist={() => setSheet("wishlist")} onSafety={() => setSheet("safety")} />
      <View style={styles.welcomeRow}><View><Text style={styles.greeting}>GOOD MORNING, RIYA</Text><Text style={styles.pageTitle}>Where will you feel <Text style={styles.pageTitleAccent}>at home?</Text></Text></View><View style={styles.avatar}><Text style={styles.avatarText}>RS</Text></View></View>
      <SearchBar value={search} onChangeText={setSearch} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>{categories.map((item) => <Pill key={item} label={item} active={item === category} onPress={() => setCategory(item)} />)}</ScrollView>
      <SectionTitle eyebrow="TRENDING NOW · SHORT-FORM TRAVEL" title="Reels from the road" action="See all" onAction={() => setSheet("wishlist")} />
      <FlatList horizontal data={reels} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.reelRail} onScrollBeginDrag={() => setIsReelScrolling(true)} onScrollEndDrag={() => setIsReelScrolling(false)} onMomentumScrollEnd={() => setIsReelScrolling(false)} renderItem={({ item }) => <ReelCard image={item.image} title={item.title} location={item.location} views={item.views} hashtags={item.hashtags} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onPress={() => setActiveReel(item)} />} />
      <SectionTitle eyebrow="FEATURED · WEEKEND PICK" title="Find your next feeling" action="See all" onAction={() => setCategory("All")} />
      <Pressable onPress={() => openDestination(destinations[0])} style={styles.heroCard}><ImageBackground source={{ uri: destinations[0].image }} style={styles.heroImage} imageStyle={styles.heroImageRadius}><View style={styles.heroOverlay} /><View style={styles.heroTop}><View style={styles.trendingPill}><Icon name="auto-awesome" size={13} color={colors.deep} /><Text style={styles.trendingText}>WEEKEND PICK</Text></View><View style={styles.ratingPill}><Icon name="star" size={14} color="#FFD76B" /><Text style={styles.ratingText}>4.8</Text></View></View><View><Text style={styles.heroEyebrow}>CURATED FOR YOU · 3 DAYS</Text><Text style={styles.heroTitle}>A little more Jaipur,</Text><Text style={styles.heroSubtitle}>a lot more you.</Text><View style={styles.heroCta}><Text style={styles.heroCtaText}>Plan the feeling</Text><Icon name="arrow-forward" size={16} color={colors.primary} /></View></View></ImageBackground></Pressable>
      {visible.map((item) => <DestinationCard key={item.id} image={item.image} title={item.name} location={item.location} tag={item.tag} rating={item.rating} price={item.price} saved={savedIds.includes(item.id)} onSave={() => toggleSaved(item.id)} onPress={() => openDestination(item)} />)}
      <SectionTitle eyebrow="YOUR SHORTCUTS" title="Travel, your way" />
    </ScrollView>
    {!isReelScrolling ? <View style={styles.floatingTools}><Tap style={styles.floatingTool} onPress={() => setSheet("translator")} accessibilityLabel="Open translator"><Icon name="translate" size={20} color={colors.deep} /></Tap></View> : null}
    <DestinationDetails visible={!!details} destination={details} onClose={() => setDetails(null)} onBook={() => { setDetails(null); router.push("/(tabs)/bookings"); }} onMap={() => { setDetails(null); router.push("/(tabs)/map"); }} onItinerary={() => { setDetails(null); router.push("/(tabs)/bookings"); }} />
    <ReelViewer reel={activeReel} savedIds={savedIds} onClose={() => setActiveReel(null)} onSave={(reel) => toggleSaved(reel.id)} onDestination={(reel) => { setActiveReel(null); openDestination(destinations.find((item) => item.id === reel.destinationId) ?? destinations[0]); }} onBook={() => { setActiveReel(null); router.push("/(tabs)/bookings"); }} onMap={() => { setActiveReel(null); router.push("/(tabs)/map"); }} onItinerary={(reel) => { const destination = destinations.find((item) => item.id === reel.destinationId) ?? destinations[0]; setSelectedDestination(destination); setActiveReel(null); router.push("/(tabs)/bookings"); }} />
    <WishlistSheet visible={sheet === "wishlist"} onClose={() => setSheet(null)} onSelect={(destination) => { setSheet(null); openDestination(destination); }} />
    <SafetySheet visible={sheet === "safety"} onClose={() => setSheet(null)} />
    <EventsSheet visible={sheet === "events"} onClose={() => setSheet(null)} onAdd={() => { setSheet(null); router.push("/(tabs)/bookings"); }} />
    <TranslatorSheet visible={sheet === "translator"} onClose={() => setSheet(null)} />
  </ScreenContainer>;
}

function ExploreHeader({ onEvents, onWishlist, onSafety }: { onEvents: () => void; onWishlist: () => void; onSafety: () => void }) {
  return <View style={styles.exploreHeader}><View style={styles.headerLeft}><Tap style={styles.headerIconButton} onPress={onEvents} accessibilityLabel="Open events"><Icon name="calendar-today" size={18} color={colors.deep} /></Tap></View><View style={styles.centerBrand} pointerEvents="none"><Text style={styles.centerBrandName}>MUSAFIR</Text></View><View style={styles.headerRight}><Tap style={styles.headerIconButton} onPress={onSafety} accessibilityLabel="Open safety and security"><Icon name="verified-user" size={19} color={colors.deep} /></Tap><Tap style={styles.headerIconButton} onPress={onWishlist} accessibilityLabel="Open wishlist"><Icon name="bookmark" size={19} color={colors.deep} /></Tap></View></View>;
}

function ReelViewer({ reel, savedIds, onClose, onSave, onDestination, onBook, onMap, onItinerary }: { reel: (typeof reels)[number] | null; savedIds: string[]; onClose: () => void; onSave: (item: (typeof reels)[number]) => void; onDestination: (item: (typeof reels)[number]) => void; onBook: () => void; onMap: () => void; onItinerary: (item: (typeof reels)[number]) => void }) {
  const insets = useSafeAreaInsets();
  const { height, width } = useWindowDimensions();
  const isCompactMobile = width > 0 && width <= 600;
  const topInset = Platform.OS === "web" && isCompactMobile ? Math.max(insets.top, 76) : insets.top;
  const bottomInset = Math.max(insets.bottom, Platform.OS === "web" && isCompactMobile ? 8 : 0);
  const reelHeight = Math.max(1, height - topInset - bottomInset);
  if (!reel) return null;

  const renderReel = ({ item }: { item: (typeof reels)[number] }) => {
    const isSaved = savedIds.includes(item.id) || savedIds.includes(item.destinationId);
    return (
      <View style={[styles.reelPage, { height: reelHeight }]}>
        <ImageBackground source={{ uri: item.image }} style={styles.reelViewerImage} imageStyle={styles.reelViewerRadius}>
          {/* Dark gradient overlay — heavier at bottom */}
          <View style={styles.reelViewerShade} />
          <View style={styles.igReelGradient} />

          {/* ── TOP BAR: close left, title centre, mute right ── */}
          <View style={styles.igTopBar}>
            <Tap onPress={onClose} style={styles.igCloseBtn}>
              <Icon name="close" size={22} color="#fff" />
            </Tap>
            <View style={styles.igTopTitle}>
              <Icon name="play-arrow" size={13} color={colors.primary} />
              <Text style={styles.igTopTitleText}>TRAVEL REELS</Text>
            </View>
            <View style={[styles.igCloseBtn, { backgroundColor: "rgba(0,0,0,0.35)" }]}>
              <Icon name="language" size={22} color="#fff" />
            </View>
          </View>

          {/* ── CENTRE PLAY BUTTON ── */}
          <View style={styles.igPlayWrap}>
            <View style={styles.igPlayBtn}>
              <Icon name="play-arrow" size={30} color="#fff" />
            </View>
          </View>

          {/* ── BOTTOM ROW: caption left + action buttons right ── */}
          <View style={styles.igBottomRow}>

            {/* LEFT: caption */}
            <View style={styles.igCaption}>
              {/* Avatar + username row */}
              <View style={styles.igUsernameRow}>
                <View style={styles.igAvatar}>
                  <Text style={styles.igAvatarText}>M</Text>
                </View>
                <Text style={styles.igUsername}>musafir.travel</Text>
                <View style={styles.igFollowBadge}>
                  <Text style={styles.igFollowText}>Follow</Text>
                </View>
              </View>
              <Text style={styles.igLocation}>{item.location.toUpperCase()}</Text>
              <Text style={styles.igTitle}>{item.title}</Text>
              <Text style={styles.igCaptionText}>{item.caption}</Text>
              <Text style={styles.igHashtags}>{item.hashtags} · {item.views} views</Text>

              {/* Action pills row at bottom */}
              <View style={styles.igActionRow}>
                <Tap style={styles.igActionPill} onPress={() => onDestination(item)}>
                  <Icon name="place" size={14} color={colors.deep} />
                  <Text style={styles.igActionPillText}>Destination</Text>
                </Tap>
                <Tap style={styles.igActionPill} onPress={onMap}>
                  <Icon name="map" size={14} color={colors.deep} />
                  <Text style={styles.igActionPillText}>Map</Text>
                </Tap>
                <Tap style={styles.igActionPill} onPress={() => onItinerary(item)}>
                  <Icon name="event-note" size={14} color={colors.deep} />
                  <Text style={styles.igActionPillText}>Add plan</Text>
                </Tap>
              </View>

              {/* Book CTA */}
              <Tap style={styles.igBookBtn} onPress={onBook}>
                <Text style={styles.igBookText}>Start booking flow</Text>
                <Icon name="arrow-forward" size={16} color={colors.deep} />
              </Tap>
            </View>

            {/* RIGHT: Instagram-style vertical action buttons */}
            <View style={styles.igSideBar}>
              {/* Like */}
              <View style={styles.igSideAction}>
                <Tap style={styles.igSideIconBtn} onPress={() => onSave(item)}>
                  <Icon name={isSaved ? "favorite" : "favorite-border"} size={26} color={isSaved ? "#FF4B6A" : "#fff"} />
                </Tap>
                <Text style={styles.igSideLabel}>2.4K</Text>
              </View>
              {/* Comment */}
              <View style={styles.igSideAction}>
                <Tap style={styles.igSideIconBtn} onPress={() => {}}>
                  <Icon name="chat-bubble-outline" size={24} color="#fff" />
                </Tap>
                <Text style={styles.igSideLabel}>183</Text>
              </View>
              {/* Share */}
              <View style={styles.igSideAction}>
                <Tap style={styles.igSideIconBtn} onPress={() => {}}>
                  <Icon name="send" size={24} color="#fff" />
                </Tap>
                <Text style={styles.igSideLabel}>Share</Text>
              </View>
              {/* Save / Bookmark */}
              <View style={styles.igSideAction}>
                <Tap style={styles.igSideIconBtn} onPress={() => onSave(item)}>
                  <Icon name={isSaved ? "bookmark" : "bookmark-border"} size={24} color={isSaved ? colors.primary : "#fff"} />
                </Tap>
                <Text style={styles.igSideLabel}>Save</Text>
              </View>
              {/* More */}
              <View style={styles.igSideAction}>
                <Tap style={styles.igSideIconBtn} onPress={() => {}}>
                  <Icon name="more-horiz" size={24} color="#fff" />
                </Tap>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <ScreenContainer edges={[]} containerClassName="bg-[#000]">
        {/* On desktop web: center a phone-width column, black gutters on sides */}
        <View style={{ flex: 1, backgroundColor: "#000", alignItems: Platform.OS === "web" && width > 600 ? "center" : "stretch", justifyContent: "center" }}>
          <View style={{ width: Platform.OS === "web" && width > 600 ? 393 : "100%" as any, flex: 1, paddingTop: topInset, paddingBottom: bottomInset, overflow: "hidden" as any }}>
            <FlatList
              data={reels}
              keyExtractor={(item) => item.id}
              renderItem={renderReel}
              pagingEnabled
              snapToInterval={reelHeight}
              snapToAlignment="start"
              decelerationRate="fast"
              disableIntervalMomentum
              showsVerticalScrollIndicator={false}
              bounces={false}
              getItemLayout={(_, index) => ({ length: reelHeight, offset: reelHeight * index, index })}
              initialScrollIndex={Math.max(0, reels.findIndex((item) => item.id === reel.id))}
            />
          </View>
        </View>
      </ScreenContainer>
    </Modal>
  );
}

function DestinationDetails({ visible, destination, onClose, onBook, onMap, onItinerary }: { visible: boolean; destination: Destination | null; onClose: () => void; onBook: () => void; onMap: () => void; onItinerary: () => void }) {
  const { savedIds, toggleSaved, addItinerary } = useTravel();
  if (!destination || !visible) return null;

  const content = (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Image source={{ uri: destination.image }} style={styles.detailImage} />
      <View style={styles.detailBody}>
        <View style={styles.detailHeader}>
          <View>
            <Text style={styles.detailTag}>{destination.tag.toUpperCase()} · {destination.crowd.toUpperCase()} CROWDS</Text>
            <Text style={styles.detailTitle}>{destination.name}</Text>
            <View style={styles.detailLocation}><Icon name="place" size={15} color={colors.teal} /><Text style={styles.detailLocationText}>{destination.location}</Text></View>
          </View>
          <Tap onPress={onClose} style={styles.closeCircle}><Icon name="close" size={20} color={colors.text} /></Tap>
        </View>
        <View style={styles.statsRow}>
          <View><Text style={styles.statValue}>{destination.rating}</Text><Text style={styles.statLabel}>Rating · {destination.reviews} reviews</Text></View>
          <View><Text style={styles.statValue}>Best in</Text><Text style={styles.statLabel}>Oct – Mar</Text></View>
          <View><Text style={styles.statValue}>Moderate</Text><Text style={styles.statLabel}>Crowd today</Text></View>
        </View>
        <Text style={styles.description}>{destination.description}</Text>
        <Text style={styles.detailSectionTitle}>Little moments to look forward to</Text>
        {destination.highlights.map((highlight) => <View key={highlight} style={styles.highlightRow}><View style={styles.checkCircle}><Icon name="check" size={14} color={colors.deep} /></View><Text style={styles.highlightText}>{highlight}</Text></View>)}
        <View style={styles.detailActionGrid}>
          <Tap style={styles.detailSecondary} onPress={() => toggleSaved(destination.id)}><Icon name={savedIds.includes(destination.id) ? "bookmark" : "bookmark-border"} size={18} color={colors.teal} /><Text style={styles.secondaryActionText}>{savedIds.includes(destination.id) ? "Saved" : "Save"}</Text></Tap>
          <Tap style={styles.detailSecondary} onPress={onMap}><Icon name="map" size={18} color={colors.teal} /><Text style={styles.secondaryActionText}>View on map</Text></Tap>
        </View>
        <Tap style={styles.primaryButton} onPress={onBook}><Text style={styles.primaryButtonText}>Book a better-fit trip</Text><Icon name="arrow-forward" size={19} color={colors.deep} /></Tap>
        <Tap style={styles.textButton} onPress={() => { addItinerary({ id: `dest-${destination.id}`, time: "10:00 AM", title: `${destination.name} day plan`, location: destination.location, type: "Trip plan" }); onItinerary(); }}><Text style={styles.textButtonText}>＋ Add to itinerary</Text></Tap>
      </View>
    </ScrollView>
  );

  // Web: render in-tree so it stays inside the phone frame
  if (Platform.OS === "web") {
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "#FAFBF7", zIndex: 998 }]}>
        {content}
      </View>
    );
  }

  // Native: real modal
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScreenContainer edges={["top", "bottom", "left", "right"]} containerClassName="bg-[#FAFBF7]">
        {content}
      </ScreenContainer>
    </Modal>
  );
}

function WishlistSheet({ visible, onClose, onSelect }: { visible: boolean; onClose: () => void; onSelect: (destination: Destination) => void }) { const { savedIds, toggleSaved } = useTravel(); const saved = destinations.filter((destination) => savedIds.includes(destination.id)); return <Sheet visible={visible} title="Your wishlist" onClose={onClose}><ScrollView showsVerticalScrollIndicator={false}>{saved.length ? saved.map((item) => <DestinationCard key={item.id} horizontal image={item.image} title={item.name} location={item.location} tag={item.tag} rating={item.rating} price={item.price} saved onSave={() => toggleSaved(item.id)} onPress={() => onSelect(item)} />) : <EmptyState icon="bookmark-border" title="Nothing saved yet" body="Tap the bookmark on a destination to keep it close." />}</ScrollView></Sheet>; }

function SafetySheet({ visible, onClose }: { visible: boolean; onClose: () => void }) { return <Sheet visible={visible} title="Safety & support" onClose={onClose}><ScrollView showsVerticalScrollIndicator={false}><View style={styles.alertCard}><View style={styles.alertIcon}><Icon name="warning-amber" size={22} color={colors.warning} /></View><View style={{ flex: 1 }}><Text style={styles.alertTitle}>Heavy rainfall expected</Text><Text style={styles.alertBody}>Rain is likely around Amber Fort after 4 PM. Plan your outdoor moments early.</Text></View></View><Text style={styles.sheetEyebrow}>NEED HELP NOW?</Text><Tap style={styles.emergencyButton} onPress={() => Linking.openURL("tel:112")}><Icon name="emergency" size={22} color="#fff" /><Text style={styles.emergencyText}>Emergency support · 112</Text></Tap><View style={styles.serviceRow}><Tap style={styles.serviceCard} onPress={() => Linking.openURL("tel:100")}><Icon name="local-police" size={21} color={colors.teal} /><Text style={styles.serviceTitle}>Police</Text><Text style={styles.serviceCaption}>100</Text></Tap><Tap style={styles.serviceCard} onPress={() => Linking.openURL("tel:108")}><Icon name="local-hospital" size={21} color={colors.teal} /><Text style={styles.serviceTitle}>Ambulance</Text><Text style={styles.serviceCaption}>108</Text></Tap><Tap style={styles.serviceCard} onPress={() => Linking.openURL("tel:108")}><Icon name="health-and-safety" size={21} color={colors.teal} /><Text style={styles.serviceTitle}>Hospital</Text><Text style={styles.serviceCaption}>Nearby</Text></Tap><Tap style={[styles.serviceCard, { backgroundColor: colors.primarySoft, borderColor: "#D3EDC3", borderWidth: 1 }]} onPress={() => Linking.openURL("tel:")}><Icon name="speed" size={21} color={colors.deep} /><Text style={styles.serviceTitle}>Speed Dial</Text><Text style={styles.serviceCaption}>Your contact</Text></Tap></View></ScrollView></Sheet>; }

function EventsSheet({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: () => void }) { return <Sheet visible={visible} title="Events around you" onClose={onClose}><ScrollView showsVerticalScrollIndicator={false}><View style={styles.dateFilter}><Icon name="calendar-today" size={17} color={colors.teal} /><Text style={styles.dateFilterText}>September 2026</Text><Icon name="keyboard-arrow-down" size={18} color={colors.muted} /></View>{events.map((event) => <Tap key={event.id} style={styles.eventRow} onPress={onAdd}><Image source={{ uri: event.image }} style={styles.eventImage} /><View style={{ flex: 1 }}><Text style={styles.eventDate}>{event.date} · {event.category}</Text><Text style={styles.eventTitle}>{event.title}</Text><Text style={styles.eventLocation}>{event.location}</Text><Text style={styles.eventDescription}>{event.description}</Text></View><Icon name="chevron-right" size={19} color={colors.muted} /></Tap>)}</ScrollView></Sheet>; }

function TranslatorSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) { const [input, setInput] = useState("Where is the closest safe taxi stand?"); const [translated, setTranslated] = useState("सबसे नज़दीकी सुरक्षित टैक्सी स्टैंड कहाँ है?"); return <Sheet visible={visible} title="Real-time translator" onClose={onClose}><ScrollView><View style={styles.languageRow}><Pill label="English" active /><Icon name="swap-horiz" size={18} color={colors.muted} /><Pill label="Hindi" /></View><View style={styles.translateBox}><Text style={styles.translateLabel}>YOU SAY</Text><TextInput multiline value={input} onChangeText={setInput} style={styles.translateInput} /><Tap onPress={() => setTranslated("सुरक्षित टैक्सी स्टैंड कहाँ है?")} style={styles.micButton}><Icon name="mic" size={20} color={colors.deep} /></Tap></View><View style={[styles.translateBox, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}><Text style={styles.translateLabel}>TRANSLATION</Text><Text style={styles.translationText}>{translated}</Text><Tap style={styles.speakerButton} onPress={() => {}}><Icon name="volume-up" size={20} color={colors.teal} /><Text style={styles.speakerText}>Play audio</Text></Tap></View><Tap style={styles.primaryButton} onPress={() => setTranslated("सुरक्षित टैक्सी स्टैंड कहाँ है?")}><Text style={styles.primaryButtonText}>Translate phrase</Text><Icon name="translate" size={19} color={colors.deep} /></Tap></ScrollView></Sheet>; }

const styles = StyleSheet.create({ headerRight: { flexDirection: "row", alignItems: "center", gap: 6 }, headerIconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }, headerLeft: { flexDirection: "row", alignItems: "center", gap: 6 }, headerWishlist: { minWidth: 78, height: 38, borderRadius: 19, backgroundColor: colors.primary, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: 10 }, floatingTools: { position: "absolute", right: 18, bottom: 88, gap: 10 }, floatingTool: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 7, shadowOffset: { width: 0, height: 3 }, elevation: 4 }, exploreHeader: { height: 58, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }, headerEvents: { minWidth: 66, height: 38, borderRadius: 19, backgroundColor: colors.primarySoft, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4, paddingHorizontal: 10 }, headerEventsText: { color: colors.deep, fontSize: 10, fontWeight: "900" }, centerBrand: { position: "absolute", left: 0, right: 0, alignItems: "center", justifyContent: "center" }, centerLogo: { width: 28, height: 28, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 2 }, centerLogoText: { color: colors.deep, fontSize: 16, fontWeight: "900" }, centerBrandName: { color: colors.deep, fontSize: 12, fontWeight: "900", letterSpacing: 2.2 }, headerActions: { flexDirection: "row", gap: 7 }, roundAction: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, reelRail: { paddingBottom: 23 }, reelPage: { width: "100%", overflow: "hidden" }, reelViewer: { flex: 1, backgroundColor: colors.deep }, reelViewerImage: { flex: 1, justifyContent: "space-between", padding: 16 }, reelViewerRadius: { borderRadius: 0 }, reelViewerShade: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(4,25,18,0.20)" },
  /* ── Instagram-style reel layout ── */
  igReelGradient: { ...StyleSheet.absoluteFill, backgroundColor: "transparent",
    // simulate gradient: transparent top → dark bottom
    // RN doesn't support CSS gradient natively so we use two overlapping views
  },
  igTopBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14, paddingTop: 10 },
  igCloseBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: "rgba(0,0,0,0.35)", alignItems: "center", justifyContent: "center" },
  igTopTitle: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,0,0,0.35)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 20 },
  igTopTitleText: { color: "#fff", fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  igPlayWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  igPlayBtn: { width: 64, height: 64, borderRadius: 32, backgroundColor: "rgba(0,0,0,0.4)", alignItems: "center", justifyContent: "center", paddingLeft: 4 },
  igBottomRow: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 12, paddingBottom: 16, gap: 10 },
  igCaption: { flex: 1, gap: 0 },
  igUsernameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  igAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#fff" },
  igAvatarText: { color: colors.deep, fontWeight: "900", fontSize: 14 },
  igUsername: { color: "#fff", fontWeight: "800", fontSize: 13 },
  igFollowBadge: { borderWidth: 1, borderColor: "#fff", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  igFollowText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  igLocation: { color: colors.primary, fontSize: 9, fontWeight: "900", letterSpacing: 1.3, marginBottom: 5 },
  igTitle: { color: "#fff", fontSize: 20, fontWeight: "800", lineHeight: 24, marginBottom: 6 },
  igCaptionText: { color: "rgba(255,255,255,0.85)", fontSize: 12, lineHeight: 17, marginBottom: 6 },
  igHashtags: { color: colors.primary, fontSize: 11, fontWeight: "700", marginBottom: 14 },
  igActionRow: { flexDirection: "row", gap: 6, marginBottom: 10 },
  igActionPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  igActionPillText: { color: colors.deep, fontSize: 10, fontWeight: "900" },
  igBookBtn: { height: 44, borderRadius: 14, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 7 },
  igBookText: { color: colors.deep, fontSize: 13, fontWeight: "900" },
  igSideBar: { width: 52, alignItems: "center", gap: 20, paddingBottom: 4 },
  igSideAction: { alignItems: "center", gap: 4 },
  igSideIconBtn: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  igSideLabel: { color: "#fff", fontSize: 11, fontWeight: "700" }, welcomeRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }, greeting: { fontSize: 10, fontWeight: "900", color: colors.forest, letterSpacing: 1.3, marginBottom: 4 }, pageTitle: { color: colors.text, fontSize: 25, lineHeight: 30, fontWeight: "800", letterSpacing: -0.7, maxWidth: 290 }, pageTitleAccent: { color: colors.forest }, avatar: { width: 40, height: 40, borderRadius: 15, backgroundColor: colors.deep, alignItems: "center", justifyContent: "center" }, avatarText: { color: colors.primary, fontWeight: "800", fontSize: 12 }, categoryRow: { gap: 8, paddingBottom: 19 }, heroCard: { height: 310, borderRadius: 24, overflow: "hidden", backgroundColor: colors.deep, marginBottom: 26 }, heroImage: { flex: 1, justifyContent: "space-between", padding: 18 }, heroImageRadius: { borderRadius: 24 }, heroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(5,30,22,0.3)" }, heroTop: { flexDirection: "row", justifyContent: "space-between" }, trendingPill: { backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 10, flexDirection: "row", gap: 6, alignItems: "center", paddingHorizontal: 10, paddingVertical: 7 }, liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.warning }, trendingText: { fontSize: 9, fontWeight: "900", color: colors.deep, letterSpacing: 0.7 }, ratingPill: { backgroundColor: "rgba(13,45,35,0.72)", borderRadius: 10, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7 }, ratingText: { color: "#fff", fontWeight: "800", fontSize: 12 }, heroEyebrow: { color: colors.primary, fontSize: 10, fontWeight: "900", letterSpacing: 1.6, marginBottom: 7 }, heroTitle: { color: "#fff", fontSize: 30, lineHeight: 33, fontWeight: "800", letterSpacing: -0.9 }, heroSubtitle: { color: "rgba(255,255,255,0.88)", fontSize: 22, fontWeight: "400", marginTop: 3 }, heroCta: { marginTop: 16, flexDirection: "row", alignItems: "center", gap: 7 }, heroCtaText: { color: colors.primary, fontWeight: "800", fontSize: 13 }, utilityGrid: { flexDirection: "row", gap: 10, marginBottom: 16 }, utilityCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: colors.border }, utilityIcon: { width: 37, height: 37, borderRadius: 13, alignItems: "center", justifyContent: "center", marginBottom: 12 }, utilityTitle: { color: colors.text, fontWeight: "800", fontSize: 13 }, utilityBody: { color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 15 }, safetyBanner: { flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: colors.primarySoft, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: "#D3EDC3", marginTop: 5 }, safetyIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, safetyTitle: { color: colors.deep, fontWeight: "800", fontSize: 13 }, safetyBody: { color: colors.forest, fontSize: 11, marginTop: 3, lineHeight: 15 }, detailImage: { width: "100%", height: 310 }, detailBody: { padding: 20, paddingBottom: 35 }, detailHeader: { flexDirection: "row", justifyContent: "space-between", gap: 14 }, detailTag: { color: colors.forest, fontWeight: "900", letterSpacing: 1.1, fontSize: 10, marginBottom: 6 }, detailTitle: { color: colors.text, fontSize: 27, fontWeight: "800", letterSpacing: -0.8 }, detailLocation: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 7 }, detailLocationText: { color: colors.muted, fontSize: 13 }, closeCircle: { width: 36, height: 36, borderRadius: 13, backgroundColor: colors.cream, alignItems: "center", justifyContent: "center" }, statsRow: { flexDirection: "row", gap: 28, marginTop: 22, paddingVertical: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border }, statValue: { color: colors.text, fontWeight: "800", fontSize: 15 }, statLabel: { color: colors.muted, fontSize: 10, marginTop: 4 }, description: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 18 }, detailSectionTitle: { color: colors.text, fontSize: 16, fontWeight: "800", marginTop: 22, marginBottom: 10 }, highlightRow: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 9 }, checkCircle: { width: 22, height: 22, borderRadius: 8, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, highlightText: { color: colors.text, fontSize: 13 }, detailActionGrid: { flexDirection: "row", gap: 10, marginTop: 19 }, detailSecondary: { flex: 1, height: 44, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7 }, secondaryActionText: { color: colors.teal, fontWeight: "800", fontSize: 12 }, primaryButton: { height: 50, borderRadius: 16, backgroundColor: colors.primary, marginTop: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8 }, primaryButtonText: { color: colors.deep, fontSize: 14, fontWeight: "900" }, textButton: { alignItems: "center", padding: 15 }, textButtonText: { color: colors.teal, fontSize: 13, fontWeight: "800" }, alertCard: { padding: 13, borderRadius: 17, backgroundColor: colors.warningSoft, flexDirection: "row", gap: 10, borderWidth: 1, borderColor: "#F5D9B7", marginBottom: 22 }, alertIcon: { width: 37, height: 37, borderRadius: 12, backgroundColor: "#FFE2BD", alignItems: "center", justifyContent: "center" }, alertTitle: { color: colors.warning, fontWeight: "800" },
 alertBody: { color: "#87542E", fontSize: 11, lineHeight: 16, marginTop: 3 }, sheetEyebrow: { color: colors.forest, fontWeight: "900", fontSize: 10, letterSpacing: 1.2, marginBottom: 9, marginTop: 4 }, emergencyButton: { height: 50, borderRadius: 15, backgroundColor: colors.red, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, marginBottom: 12 }, emergencyText: { color: "#fff", fontWeight: "900", fontSize: 13 }, serviceRow: { flexDirection: "row", gap: 8, marginBottom: 20 }, serviceCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 15, borderWidth: 1, borderColor: colors.border, padding: 12 }, serviceTitle: { color: colors.text, fontWeight: "800", fontSize: 11, marginTop: 8 }, serviceCaption: { color: colors.muted, fontSize: 10, marginTop: 3 }, awarenessRow: { flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }, awarenessText: { color: colors.text, fontSize: 12 }, dateFilter: { height: 42, borderRadius: 13, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", gap: 8, alignItems: "center", paddingHorizontal: 12, marginBottom: 13 }, dateFilterText: { flex: 1, color: colors.text, fontWeight: "800", fontSize: 12 }, eventRow: { flexDirection: "row", gap: 10, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.border }, eventImage: { width: 78, height: 85, borderRadius: 13 }, eventDate: { color: colors.forest, fontSize: 9, fontWeight: "900", letterSpacing: 0.7 }, eventTitle: { color: colors.text, fontSize: 15, fontWeight: "800", marginTop: 5 }, eventLocation: { color: colors.muted, fontSize: 10, marginTop: 3 }, eventDescription: { color: colors.muted, fontSize: 10, lineHeight: 14, marginTop: 6 }, languageRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 }, translateBox: { minHeight: 130, borderRadius: 17, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginBottom: 12 }, translateLabel: { color: colors.forest, fontSize: 9, fontWeight: "900", letterSpacing: 1.1, marginBottom: 8 }, translateInput: { color: colors.text, fontSize: 16, lineHeight: 22, padding: 0, paddingRight: 35 }, micButton: { position: "absolute", right: 12, bottom: 12, width: 36, height: 36, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, translationText: { color: colors.deep, fontSize: 17, lineHeight: 24 }, speakerButton: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 15 }, speakerText: { color: colors.teal, fontSize: 12, fontWeight: "800" } });
