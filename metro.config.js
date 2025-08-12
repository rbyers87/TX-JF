const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional asset extensions if needed
config.resolver.assetExts.push('bin');

module.exports = config;
