var CopyWebpackPlugin = require("copy-webpack-plugin");
var path = require("path");

var entries = {
  background: "./webextension/background.js",
  manage: ["babel-polyfill", "./webextension/manage.js"]
};

/**
 * Return a list of files that are part of our source tree (i.e. they start with
 * `./` or `../`.
 *
 * @param files An Array of files or a single file.
 * @return A generator of the filtered files.
 */
function* filterFiles(files) {
  if (!Array.isArray(files)) {
    files = [files];
  }

  for (let f of files) {
    if (f.match(/^\.+\//))
      yield f.replace(/^\.+\//, "");
  }
}

/**
 * Chain a sequence of generators together.
 *
 * @param ...generators A sequence of generator objects.
 * @return A generator chaining together all the input generators.
 */
function* chain(...generators) {
  for (let g of generators) {
    yield* g;
  }
}

var ignoreOnCopy = [...chain(...Object.values(entries).map(
  v => filterFiles(v))
)];

var config = {
  context: path.join(__dirname, "/src"),
  entry: entries,

  output: {
    filename: "./webextension/[name].js",
    path: path.join(__dirname, "/dist"),
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["react", "es2015"]
        }
      }
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {from: "**/*"},
    ], {ignore: ignoreOnCopy}),
  ],
};
module.exports = config;
