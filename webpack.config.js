var config = {
  context: __dirname + "/src",
  entry: "./webextension/manage.js",

  output: {
    filename: "./webextension/manage.js",
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
