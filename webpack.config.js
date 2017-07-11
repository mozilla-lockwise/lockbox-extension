var config = {
  context: __dirname + "/src",
  entry: "./chrome/content/aboutPage.js",

  output: {
    filename: "chrome/content/aboutPage.js",
    path: __dirname + "/dist",
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015']
        }
      }
    ],
  },
};
module.exports = config;
