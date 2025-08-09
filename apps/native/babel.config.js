// apps/{mobile|native}/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // RN 0.76 ⇒ THIS path, last
    ],
  };
};
