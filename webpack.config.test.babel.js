import nodeExternals from 'webpack-node-externals';

export default {
  target: "node",
  externals: [nodeExternals()],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: ["env", "react"],
          plugins: ["transform-runtime"]
        }
      }
    ]
  }
};
