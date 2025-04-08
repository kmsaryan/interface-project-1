const path = require("path");
const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    http: require.resolve("stream-http"),
    crypto: require.resolve("crypto-browserify"),
    zlib: require.resolve("browserify-zlib"),
    path: require.resolve("path-browserify"),
    querystring: require.resolve("querystring-es3"),
    util: require.resolve("util/"),
    url: require.resolve("url/"),
    buffer: require.resolve("buffer/"),
    stream: require.resolve("stream-browserify"),
    timers: require.resolve("timers-browserify"),
    vm: require.resolve("vm-browserify"),
    fs: false, // Node.js `fs` module is not available in the browser
    net: false, // Node.js `net` module is not available in the browser
    async_hooks: false, // Disable async_hooks as it is not supported in the browser
  };

  config.resolve.alias = {
    "@server": path.resolve(__dirname, "src/server"),
    "@utils": path.resolve(__dirname, "src/utils"),
    "stream-http": path.resolve(__dirname, "src/utils/stream-http"), // Alias for stream-http
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  config.ignoreWarnings = [
    {
      module: /node_modules\/express\/lib\/view\.js/,
      message: /the request of a dependency is an expression/,
    },
  ];

  return config;
};