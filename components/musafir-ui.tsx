import { MaterialIcons } from "@expo/vector-icons";
import { ImageBackground, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { ComponentProps, ReactNode } from "react";
import { colors } from "@/lib/travel-store";

export type IconName = ComponentProps<typeof MaterialIcons>["name"];
export function Icon({ name, size = 20, color = colors.text }: { name: IconName; size?: number; color?: string }) { return <MaterialIcons name={name} size={size} color={color} />; }
export function Tap({ onPress, children, style, disabled = false, accessibilityLabel }: { onPress?: () => void; children: ReactNode; style?: any; disabled?: boolean; accessibilityLabel?: string }) { return <Pressable disabled={disabled} onPress={onPress} accessibilityRole={Platform.OS === "web" ? undefined : "button"} accessibilityLabel={accessibilityLabel} style={({ pressed }) => [style, pressed && { opacity: 0.78, transform: [{ scale: 0.985 }] }, disabled && { opacity: 0.5 }]}>{children}</Pressable>; }
export function Pill({ label, active = false, onPress, icon }: { label: string; active?: boolean; onPress?: () => void; icon?: IconName }) { return <Tap onPress={onPress} style={[styles.pill, active && styles.pillActive]}>{icon ? <Icon name={icon} size={15} color={active ? colors.deep : colors.muted} /> : null}<Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text></Tap>; }
export function SectionTitle({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) { return <View style={styles.sectionTitleRow}><View>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text> : null}<Text style={styles.sectionTitle}>{title}</Text></View>{action ? <Tap onPress={onAction}><Text style={styles.linkText}>{action}</Text></Tap> : null}</View>; }
export function SearchBar({ value, onChangeText, placeholder = "Search destinations", onFilter }: { value: string; onChangeText: (value: string) => void; placeholder?: string; onFilter?: () => void }) { return <View style={styles.searchRow}><View style={styles.searchBox}><Icon name="search" size={21} color={colors.muted} /><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.muted} style={styles.searchInput} /></View>{onFilter ? <Tap onPress={onFilter} style={styles.filterButton}><Icon name="tune" size={20} color={colors.deep} /></Tap> : null}</View>; }
export function AppHeader({ onSafety, onWishlist, compact = false }: { onSafety: () => void; onWishlist: () => void; compact?: boolean }) { return <View style={styles.header}><View style={styles.headerTopRow}><View style={styles.brandLockup}><View><Text style={styles.logoWord}>MUSAFIR</Text>{!compact ? <Text style={styles.tagline}>Kyunki har raasta apna lagna chahiye.</Text> : <Text style={styles.headerSub}>TRAVEL, MADE PERSONAL</Text>}</View></View><View style={styles.headerActions}><Tap onPress={onSafety} style={styles.iconButton}><Icon name="verified-user" size={19} color={colors.deep} /></Tap><Tap onPress={onWishlist} style={styles.iconButton}><Icon name="bookmark-border" size={20} color={colors.deep} /></Tap></View></View></View>; }

/**
 * Sheet — on web renders as an absolutely-positioned overlay inside the
 * ScreenContainer so it stays within the phone frame.
 * On native uses a real Modal so it covers the status bar correctly.
 */
export function Sheet({ visible, title, onClose, children }: { visible: boolean; title: string; onClose: () => void; children: ReactNode }) {
  if (Platform.OS !== "web") {
    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.modalBackdrop}>
          <Tap style={StyleSheet.absoluteFill} onPress={onClose}><View /></Tap>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Tap onPress={onClose} style={styles.closeButton}><Icon name="close" size={20} color={colors.text} /></Tap>
            </View>
            {children}
          </View>
        </View>
      </Modal>
    );
  }

  // Web: render in-tree so it stays inside the phone frame
  if (!visible) return null;
  return (
    <View style={styles.webBackdrop} pointerEvents="box-none">
      <Tap style={StyleSheet.absoluteFill} onPress={onClose}><View /></Tap>
      <View style={styles.sheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <Tap onPress={onClose} style={styles.closeButton}><Icon name="close" size={20} color={colors.text} /></Tap>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: ("70vh" as any) }}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

export function ReelCard({ image, title, location, views, hashtags, saved, onPress, onSave }: { image: string; title: string; location: string; views: string; hashtags: string; saved?: boolean; onPress?: () => void; onSave?: () => void }) { return <Tap onPress={onPress} style={styles.reelCard}><ImageBackground source={{ uri: image }} style={styles.reelImage} imageStyle={styles.reelImageRadius}><View style={styles.reelOverlay} /><View style={styles.reelTop}><View style={styles.reelLabel}><Icon name="play-arrow" size={13} color={colors.deep} /><Text style={styles.reelLabelText}>REEL</Text></View><Tap onPress={onSave} style={styles.reelSave}><Icon name={saved ? "bookmark" : "bookmark-border"} size={18} color={saved ? colors.primary : "#fff"} /></Tap></View><View style={styles.reelBottom}><View style={styles.reelViewRow}><Icon name="play-circle-outline" size={14} color="#fff" /><Text style={styles.reelViews}>{views} views</Text></View><Text style={styles.reelTitle}>{title}</Text><View style={styles.reelLocation}><Icon name="place" size={12} color={colors.primary} /><Text style={styles.reelLocationText}>{location}</Text></View><Text style={styles.reelHashtags}>{hashtags}</Text></View></ImageBackground></Tap>; }
export function DestinationCard({ image, title, location, tag, rating, price, saved, onPress, onSave, horizontal = false }: { image: string; title: string; location: string; tag: string; rating: string; price: string; saved?: boolean; onPress?: () => void; onSave?: () => void; horizontal?: boolean }) { return <Tap onPress={onPress} style={[styles.destinationCard, horizontal && styles.destinationCardHorizontal]}><ImageBackground source={{ uri: image }} style={horizontal ? styles.destinationThumb : styles.destinationImage} imageStyle={styles.cardImageRadius}><View style={styles.cardGradient} /><View style={styles.cardTopRow}><Text style={styles.cardTag}>{tag}</Text><Tap onPress={onSave} style={styles.saveButton}><Icon name={saved ? "bookmark" : "bookmark-border"} size={19} color={saved ? colors.primary : "#fff"} /></Tap></View><View style={styles.cardBottom}><Text style={styles.cardTitle}>{title}</Text><View style={styles.cardMeta}><Icon name="place" size={13} color="#EAF7DF" /><Text style={styles.cardLocation}>{location}</Text><View style={styles.metaSpacer} /><Icon name="star" size={13} color="#FFD76B" /><Text style={styles.cardRating}>{rating}</Text></View>{!horizontal ? <View style={styles.cardPriceRow}><Text style={styles.cardPrice}>from {price}</Text><Text style={styles.exploreArrow}>Explore  ›</Text></View> : null}</View></ImageBackground>{horizontal ? <View style={styles.horizontalCardCopy}><Text style={styles.smallTag}>{tag}</Text><Text style={styles.horizontalTitle}>{title}</Text><Text style={styles.horizontalLocation}>{location}</Text><View style={styles.horizontalBottom}><Text style={styles.cardPrice}>{price}</Text><View style={styles.ratingLight}><Icon name="star" size={13} color={colors.warning} /><Text style={styles.lightRating}>{rating}</Text></View></View></View> : null}</Tap>; }
export function EmptyState({ icon, title, body }: { icon: IconName; title: string; body: string }) { return <View style={styles.emptyState}><View style={styles.emptyIcon}><Icon name={icon} size={26} color={colors.teal} /></View><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyBody}>{body}</Text></View>; }

const styles = StyleSheet.create({
  scrollContent: { padding: 18, paddingBottom: 32 },
  reelCard: { width: 172, height: 265, borderRadius: 20, overflow: "hidden", backgroundColor: colors.deep, marginRight: 10 }, reelImage: { flex: 1, justifyContent: "space-between", padding: 11 }, reelImageRadius: { borderRadius: 20 }, reelOverlay: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(5,30,22,0.28)" }, reelTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, reelLabel: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 5, flexDirection: "row", alignItems: "center", gap: 2 }, reelLabelText: { color: colors.deep, fontSize: 9, fontWeight: "900", letterSpacing: 0.7 }, reelSave: { width: 32, height: 32, borderRadius: 11, backgroundColor: "rgba(13,45,35,0.62)", alignItems: "center", justifyContent: "center" }, reelBottom: { marginTop: "auto" }, reelViewRow: { flexDirection: "row", gap: 4, alignItems: "center", marginBottom: 7 }, reelViews: { color: "#fff", fontSize: 10, fontWeight: "800" }, reelTitle: { color: "#fff", fontSize: 16, lineHeight: 19, fontWeight: "800" }, reelLocation: { flexDirection: "row", gap: 3, alignItems: "center", marginTop: 5 }, reelLocationText: { color: "#EAF7DF", fontSize: 10, fontWeight: "700" }, reelHashtags: { color: colors.primary, fontSize: 10, fontWeight: "800", marginTop: 8 },
  header: { marginBottom: 20 }, headerTopRow: { flexDirection: "row", alignItems: "center", gap: 10 }, brandLockup: { flex: 1, flexDirection: "row", alignItems: "center" }, logoMark: { width: 38, height: 38, borderRadius: 14, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", transform: [{ rotate: "-6deg" }] }, logoMarkText: { fontSize: 22, fontWeight: "900", color: colors.deep, transform: [{ rotate: "6deg" }] }, logoWord: { letterSpacing: 2.5, fontSize: 15, fontWeight: "900", color: colors.deep }, tagline: { color: colors.muted, fontSize: 10, marginTop: 3 }, headerSub: { color: colors.muted, fontSize: 9, letterSpacing: 1.1, marginTop: 3 }, headerActions: { flexDirection: "row", gap: 8 }, iconButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  searchRow: { flexDirection: "row", gap: 10, marginBottom: 15 }, searchBox: { flex: 1, height: 48, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 9 }, searchInput: { flex: 1, color: colors.text, fontSize: 14 }, filterButton: { height: 48, width: 48, borderRadius: 16, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  pill: { minHeight: 34, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, flexDirection: "row", gap: 6, alignItems: "center", justifyContent: "center" }, pillActive: { backgroundColor: colors.deep, borderColor: colors.deep }, pillText: { color: colors.muted, fontSize: 12, fontWeight: "700" }, pillTextActive: { color: colors.primary },
  sectionTitleRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 7, marginBottom: 12 }, eyebrow: { color: colors.forest, fontSize: 10, fontWeight: "800", letterSpacing: 1.4, marginBottom: 4 }, sectionTitle: { color: colors.text, fontSize: 22, fontWeight: "800", letterSpacing: -0.5 }, linkText: { color: colors.teal, fontSize: 12, fontWeight: "800", marginBottom: 2 },
  destinationCard: { height: 270, borderRadius: 22, overflow: "hidden", backgroundColor: colors.deep, marginBottom: 14 }, destinationImage: { flex: 1, justifyContent: "space-between", padding: 15 }, cardImageRadius: { borderRadius: 22 }, cardGradient: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(5,30,22,0.22)" }, cardTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }, cardTag: { color: colors.deep, fontWeight: "800", fontSize: 10, backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 6, textTransform: "uppercase", letterSpacing: 0.6 }, saveButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: "rgba(13,45,35,0.62)", alignItems: "center", justifyContent: "center" }, cardBottom: { marginTop: "auto" }, cardTitle: { color: "#fff", fontSize: 21, fontWeight: "800", marginBottom: 7 }, cardMeta: { flexDirection: "row", alignItems: "center", gap: 4 }, cardLocation: { color: "#EAF7DF", fontSize: 12 }, metaSpacer: { flex: 1 }, cardRating: { color: "#fff", fontSize: 12, fontWeight: "800" }, cardPriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14 }, cardPrice: { color: colors.primary, fontWeight: "800", fontSize: 13 }, exploreArrow: { color: "#fff", fontSize: 12, fontWeight: "800" },
  destinationCardHorizontal: { height: 110, flexDirection: "row", backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }, destinationThumb: { width: 112, height: 110, padding: 9 }, horizontalCardCopy: { flex: 1, padding: 12 }, smallTag: { color: colors.forest, fontSize: 9, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.8 }, horizontalTitle: { color: colors.text, fontWeight: "800", fontSize: 16, marginTop: 5 }, horizontalLocation: { color: colors.muted, fontSize: 11, marginTop: 3 }, horizontalBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }, ratingLight: { flexDirection: "row", alignItems: "center", gap: 3 }, lightRating: { color: colors.text, fontSize: 11, fontWeight: "800" },
  // Native modal
  modalBackdrop: { flex: 1, backgroundColor: "rgba(8,29,22,0.45)", justifyContent: "flex-end" },
  // Web in-tree overlay — stays inside the phone frame
  webBackdrop: { ...StyleSheet.absoluteFill, backgroundColor: "rgba(8,29,22,0.45)", justifyContent: "flex-end", zIndex: 999 },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, paddingTop: 10 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center", marginBottom: 15 },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sheetTitle: { fontSize: 23, fontWeight: "800", color: colors.text },
  closeButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  emptyState: { alignItems: "center", paddingVertical: 30 }, emptyIcon: { width: 56, height: 56, borderRadius: 20, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 12 }, emptyTitle: { color: colors.text, fontSize: 17, fontWeight: "800" }, emptyBody: { color: colors.muted, fontSize: 13, textAlign: "center", maxWidth: 280, lineHeight: 19, marginTop: 5 },
});
export const uiStyles = styles;
