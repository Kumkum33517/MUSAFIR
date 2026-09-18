import { createContext, useContext } from "react";
import { Platform, View, type ViewProps } from "react-native";
import { SafeAreaView, useSafeAreaInsets, type Edge } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import { cn } from "@/lib/utils";

const AppShellSafeAreaContext = createContext(false);
export const AppShellSafeAreaProvider = AppShellSafeAreaContext.Provider;

export interface ScreenContainerProps extends ViewProps {
  edges?: Edge[];
  className?: string;
  containerClassName?: string;
  safeAreaClassName?: string;
}

/** Shared Musafir screen shell. The root app shell owns the top safe-area inset;
 * this component avoids applying it a second time while retaining safe edges
 * for screens rendered outside that shell, including standalone modal content. */
export function ScreenContainer({ children, edges = ["top", "left", "right"], className, containerClassName, safeAreaClassName, style, ...props }: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const rootOwnsTop = useContext(AppShellSafeAreaContext);
  const appliesTop = edges.includes("top") && !rootOwnsTop;
  const safeAreaEdges = edges.filter((edge) => edge !== "top") as Edge[];
  return <View className={cn("flex-1", "bg-background", containerClassName)} style={Platform.OS === "web" ? { position: "relative" as any, overflow: "hidden" as any } : undefined} {...props}>
    <StatusBar style="dark" />
    <SafeAreaView edges={safeAreaEdges} className={cn("flex-1", safeAreaClassName)} style={style}>
      <View className={cn("flex-1", className)} style={appliesTop ? (Platform.OS === "web" ? ({ paddingTop: `env(safe-area-inset-top, ${insets.top}px)` } as any) : { paddingTop: insets.top }) : undefined}>{children}</View>
    </SafeAreaView>
  </View>;
}
