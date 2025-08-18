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
  "expo-modules-core": path.resolve(
    workspaceRoot,
    "node_modules/.pnpm/expo-modules-core@2.2.3/node_modules/expo-modules-core",
  ),
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
  path.resolve(
    workspaceRoot,
    "node_modules/.pnpm/expo-modules-core@2.2.3/node_modules/expo-modules-core",
  ),
];

// 8. Add platform-specific resolution to block native modules on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block react-native-maps and related native modules on web platform
  if (
    platform === "web" &&
    (moduleName === "react-native-maps" ||
      moduleName.startsWith("react-native-maps/") ||
      moduleName.includes("codegenNativeCommands") ||
      moduleName.includes("codegenNativeComponent"))
  ) {
    // Return a mock module path that doesn't exist to prevent bundling
    return {
      type: "empty",
    };
  }

  // Use original resolver for other cases
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
