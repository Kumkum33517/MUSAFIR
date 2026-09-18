import { useState } from "react";
import { Modal, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { AppHeader, DestinationCard, EmptyState, Icon, SectionTitle, Tap, uiStyles } from "@/components/musafir-ui";
import { colors, destinations, useTravel } from "@/lib/travel-store";

export default function ProfileScreen() {
  const router = useRouter();
  const { savedIds, toggleSaved, itinerary } = useTravel();
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const saved = destinations.filter((item) => savedIds.includes(item.id));
  return <ScreenContainer className="bg-[#FAFBF7]" edges={["top", "left", "right"]}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={uiStyles.scrollContent}>
    <AppHeader compact onSafety={() => router.push("/" as any)} onWishlist={() => setWishlistOpen(true)} />
    <View style={styles.profileCard}><View style={styles.profileTop}><View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>RS</Text></View><View style={{ flex: 1 }}><Text style={styles.profileName}>Riya Sharma</Text><Text style={styles.profileMeta}>Traveller since 2024 · Mumbai, India</Text></View><Tap style={styles.editButton} onPress={() => setWishlistOpen(true)}><Icon name="bookmark-border" size={17} color={colors.teal} /></Tap></View><View style={styles.profileStats}><View><Text style={styles.statNumber}>07</Text><Text style={styles.statLabel}>Trips taken</Text></View><View><Text style={styles.statNumber}>{saved.length.toString().padStart(2, "0")}</Text><Text style={styles.statLabel}>Places saved</Text></View><View><Text style={styles.statNumber}>12</Text><Text style={styles.statLabel}>Local moments</Text></View></View></View>
    <SectionTitle eyebrow="CURRENT TRIPS" title="Your Jaipur chapter" action="Open trip" onAction={() => router.push("/bookings" as any)} />
    <Tap style={styles.compactTripCard} onPress={() => router.push("/bookings" as any)}><View style={styles.historyIcon}><Icon name="luggage" size={21} color={colors.teal} /></View><View style={{ flex: 1 }}><Text style={styles.historyTitle}>Pink City, Jaipur</Text><Text style={styles.historyMeta}>Sep 14 – 17 · Upcoming · {itinerary.length} moments</Text></View><View style={styles.upcomingBadge}><Text style={styles.upcomingBadgeText}>IN 12 DAYS</Text></View></Tap>
    <SectionTitle eyebrow="TRIP HISTORY" title="Places you've felt at home" action="See all" />
    <View style={styles.historyCard}><View style={styles.historyIcon}><Icon name="history" size={21} color={colors.teal} /></View><View style={{ flex: 1 }}><Text style={styles.historyTitle}>South Goa Escape</Text><Text style={styles.historyMeta}>Jun 02 – 06 · Completed · 4 nights</Text></View><Text style={styles.historyRating}>4.8 ★</Text></View>
    <View style={styles.historyCard}><View style={[styles.historyIcon, { backgroundColor: colors.warningSoft }]}><Icon name="flight-takeoff" size={21} color={colors.warning} /></View><View style={{ flex: 1 }}><Text style={styles.historyTitle}>Ubud in one slow breath</Text><Text style={styles.historyMeta}>Feb 18 – 22 · Completed · 4 nights</Text></View><Text style={styles.historyRating}>4.7 ★</Text></View>
    <Tap style={styles.wishlistButton} onPress={() => setWishlistOpen(true)}><View style={styles.wishlistIcon}><Icon name="bookmark" size={19} color={colors.deep} /></View><View style={{ flex: 1 }}><Text style={styles.wishlistTitle}>Open wishlist</Text><Text style={styles.wishlistBody}>{saved.length} saved destinations, kept separate from your profile.</Text></View><Icon name="chevron-right" size={20} color={colors.teal} /></Tap>
    <View style={styles.menuCard}>{["Account settings", "Notifications", "Language · English", "Privacy & safety", "Help desk"].map((item, index) => <Tap key={item} style={[styles.menuRow, index === 4 && { borderBottomWidth: 0 }]} onPress={() => {}}><View style={styles.menuIcon}><Icon name={index === 0 ? "manage-accounts" : index === 1 ? "notifications-none" : index === 2 ? "language" : index === 3 ? "shield" : "help-outline"} size={18} color={colors.teal} /></View><Text style={styles.menuText}>{item}</Text><Icon name="chevron-right" size={18} color={colors.muted} /></Tap>)}</View>
  </ScrollView><WishlistModal visible={wishlistOpen} onClose={() => setWishlistOpen(false)} saved={saved} onSave={toggleSaved} /></ScreenContainer>;
}

function WishlistModal({ visible, onClose, saved, onSave }: { visible: boolean; onClose: () => void; saved: typeof destinations; onSave: (id: string) => void }) {
  if (!visible) return null;
  if (Platform.OS === "web") {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: "#FAFBF7", zIndex: 998 }}>
        <ScrollView contentContainerStyle={uiStyles.scrollContent}>
          <View style={styles.modalHeader}>
            <View><Text style={styles.modalEyebrow}>SAVED FOR LATER</Text><Text style={styles.modalTitle}>Your wishlist</Text></View>
            <Tap style={styles.closeButton} onPress={onClose}><Icon name="close" size={20} color={colors.text} /></Tap>
          </View>
          {saved.length
            ? saved.map((item) => <DestinationCard key={item.id} horizontal image={item.image} title={item.name} location={item.location} tag={item.tag} rating={item.rating} price={item.price} saved onSave={() => onSave(item.id)} />)
            : <EmptyState icon="bookmark-border" title="Your wishlist is waiting" body="Save a destination from Explore to keep it here." />}
        </ScrollView>
      </View>
    );
  }
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScreenContainer edges={["top", "bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={uiStyles.scrollContent}>
          <View style={styles.modalHeader}>
            <View><Text style={styles.modalEyebrow}>SAVED FOR LATER</Text><Text style={styles.modalTitle}>Your wishlist</Text></View>
            <Tap style={styles.closeButton} onPress={onClose}><Icon name="close" size={20} color={colors.text} /></Tap>
          </View>
          {saved.length
            ? saved.map((item) => <DestinationCard key={item.id} horizontal image={item.image} title={item.name} location={item.location} tag={item.tag} rating={item.rating} price={item.price} saved onSave={() => onSave(item.id)} />)
            : <EmptyState icon="bookmark-border" title="Your wishlist is waiting" body="Save a destination from Explore to keep it here." />}
        </ScrollView>
      </ScreenContainer>
    </Modal>
  );
}

const styles = StyleSheet.create({ profileCard: { backgroundColor: colors.deep, borderRadius: 22, padding: 17, marginBottom: 23 }, profileTop: { flexDirection: "row", alignItems: "center", gap: 11 }, profileAvatar: { width: 52, height: 52, borderRadius: 18, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, profileAvatarText: { color: colors.deep, fontWeight: "900", fontSize: 14 }, profileName: { color: "#fff", fontWeight: "800", fontSize: 18 }, profileMeta: { color: "#A6BEB0", fontSize: 10, marginTop: 4 }, editButton: { width: 34, height: 34, borderRadius: 11, backgroundColor: "rgba(145,218,115,0.15)", alignItems: "center", justifyContent: "center" }, profileStats: { flexDirection: "row", gap: 30, marginTop: 19, paddingTop: 15, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.13)" }, statNumber: { color: colors.primary, fontWeight: "800", fontSize: 19 }, statLabel: { color: "#A6BEB0", fontSize: 10, marginTop: 3 }, compactTripCard: { backgroundColor: colors.primarySoft, borderRadius: 16, borderWidth: 1, borderColor: "#D3EDC3", padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 23 }, upcomingBadge: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 6 }, upcomingBadgeText: { color: colors.deep, fontSize: 8, fontWeight: "900" }, historyCard: { backgroundColor: colors.surface, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 9 }, historyIcon: { width: 40, height: 40, borderRadius: 13, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, historyTitle: { color: colors.text, fontSize: 13, fontWeight: "800" }, historyMeta: { color: colors.muted, fontSize: 10, marginTop: 4 }, historyRating: { color: colors.forest, fontSize: 10, fontWeight: "900" }, wishlistButton: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: colors.primarySoft, borderRadius: 17, padding: 13, marginTop: 14, marginBottom: 18 }, wishlistIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }, wishlistTitle: { color: colors.deep, fontSize: 13, fontWeight: "900" }, wishlistBody: { color: colors.forest, fontSize: 10, marginTop: 3 }, menuCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 13, marginTop: 5 }, menuRow: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border }, menuIcon: { width: 31, height: 31, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }, menuText: { flex: 1, color: colors.text, fontSize: 12, fontWeight: "700" }, modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }, modalEyebrow: { color: colors.forest, fontSize: 10, fontWeight: "900", letterSpacing: 1.2 }, modalTitle: { color: colors.text, fontSize: 26, fontWeight: "800", marginTop: 4 }, closeButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" } });
