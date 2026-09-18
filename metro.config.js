const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Block the NativeWind CSS interop cache from being watched/hashed by Metro.
// This prevents the "Failed to get SHA-1" error on CI builds (Netlify, etc.)
config.resolver = config.resolver || {};
config.resolver.blockList = [
  ...(Array.isArray(config.resolver.blockList) ? config.resolver.blockList : []),
  /node_modules\/react-native-css-interop\/\.cache\/.*/,
];

module.exports = withNativeWind(config, {
  input: "./global.css",
  forceWriteFileSystem: true,
});
