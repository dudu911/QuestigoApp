// apps/native/metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

// Get Expo's default Metro config
const config = getDefaultConfig(projectRoot);

// Ensure monorepo watch + resolution
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Critical: make sure React & React Native are singletons
config.resolver.alias = {
  react: path.resolve(workspaceRoot, "node_modules/react"),
  "react-native": path.resolve(workspaceRoot, "node_modules/react-native"),
  "react-i18next": path.resolve(workspaceRoot, "node_modules/react-i18next"),
};

// ⬇️ Custom resolver to block native-only modules on web
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    platform === "web" &&
    (moduleName === "react-native-maps" ||
      moduleName.startsWith("react-native-maps/") ||
      moduleName.includes("codegenNativeCommands") ||
      moduleName.includes("codegenNativeComponent"))
  ) {
    return { type: "empty" }; // prevent bundling crash
  }

  return originalResolveRequest
    ? originalResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
