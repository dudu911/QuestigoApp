// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot];

// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules/.pnpm"),
];

// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

// 4. Enable symlink resolution for pnpm workspace packages
config.resolver.resolverMainFields = ["react-native", "browser", "main"];
config.resolver.platforms = ["ios", "android", "native", "web"];

// 5. Prevent duplicate react/react-native by ensuring single resolution
config.resolver.alias = {
  react: path.resolve(workspaceRoot, "node_modules/react"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
  "react-native-reanimated": path.resolve(
    workspaceRoot,
    "node_modules/react-native-reanimated",
  ),
  "expo-constants": path.resolve(workspaceRoot, "node_modules/expo-constants"),
  "expo-asset": path.resolve(workspaceRoot, "node_modules/expo-asset"),
  "expo-font": path.resolve(workspaceRoot, "node_modules/expo-font"),
  "expo-file-system": path.resolve(
    workspaceRoot,
    "node_modules/expo-file-system",
  ),
  // expo-modules-core is now available at workspace root, no alias needed
};

// 6. Add asset resolution for pnpm workspace structure
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
];

// 7. Add watch folders to include react-native assets from pnpm structure
config.watchFolders = [
  workspaceRoot,
  path.resolve(workspaceRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules/.pnpm"),
];

// 8. Add platform-specific resolution to redirect react-native-maps only on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Only redirect react-native-maps to @teovilla/react-native-web-maps on web platform
  // Keep native platforms (ios, android) using the original react-native-maps
  if (moduleName === "react-native-maps" && platform === "web") {
    return context.resolveRequest(
      context,
      "@teovilla/react-native-web-maps",
      platform,
    );
  }

  // Use original resolver for other cases
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
