import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { type ReactNode } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { Platform, Text, View, useWindowDimensions } from "react-native";
import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import {
  SafeAreaProvider,
  SafeAreaView,
  initialWindowMetrics,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TravelProvider } from "@/lib/travel-store";
import { AppShellSafeAreaProvider } from "@/components/screen-container";

export const unstable_settings = { anchor: "(tabs)" };

function AppShell({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isCompactMobile = width > 0 && width <= 600;
  const mobileTopClearance = isCompactMobile ? Math.max(insets.top, 76) : insets.top;
  const topInsetStyle =
    Platform.OS === "web"
      ? isCompactMobile
        ? ({ paddingTop: "max(env(safe-area-inset-top), 76px)" } as any)
        : ({ paddingTop: "env(safe-area-inset-top, 0px)" } as any)
      : { paddingTop: mobileTopClearance };

  return (
    <AppShellSafeAreaProvider value={true}>
      <SafeAreaView edges={["left", "right"]} style={{ flex: 1 }}>
        <View style={[{ flex: 1 }, topInsetStyle]}>{children}</View>
      </SafeAreaView>
    </AppShellSafeAreaProvider>
  );
}

/**
 * On desktop web: wrap the app in a centered iPhone-style frame so it
 * looks like a proper mobile app demo, not a stretched website.
 * On mobile browsers (≤ 600 px) or native: render full-screen as usual.
 */
function WebPhoneFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== "web" || width <= 600) {
    return <>{children}</>;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#D4DDD4",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Phone shell */}
      <View
        style={{
          width: 393,
          height: "88vh" as any,
          maxHeight: 852,
          borderRadius: 50,
          overflow: "hidden",
          backgroundColor: "#FAFBF7",
          shadowColor: "#000",
          shadowOpacity: 0.4,
          shadowRadius: 48,
          shadowOffset: { width: 0, height: 24 },
          borderWidth: 1,
          borderColor: "rgba(0,0,0,0.10)",
        }}
      >
        {/* Status bar spacing — no notch pill */}
        <View style={{ height: 14, backgroundColor: "#FAFBF7" }} />

        {/* App content */}
        <View style={{ flex: 1, overflow: "hidden" as any }}>
          {children}
        </View>
      </View>

      {/* Label beneath phone */}
      <View
        style={{
          marginTop: 24,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "rgba(255,255,255,0.55)",
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 24,
        }}
      >
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 8,
            backgroundColor: "#91DA73",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#0D2D23", fontWeight: "900", fontSize: 13 }}>M</Text>
        </View>
        <Text style={{ color: "#0D2D23", fontWeight: "800", fontSize: 13, letterSpacing: 2 }}>
          MUSAFIR
        </Text>
        <Text style={{ color: "#718078", fontSize: 11 }}>· Smart Travel Companion</Text>
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <WebPhoneFrame>
          <AppShell>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TravelProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                </Stack>
                <StatusBar style="dark" />
              </TravelProvider>
            </GestureHandlerRootView>
          </AppShell>
        </WebPhoneFrame>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
