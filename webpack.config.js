const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

module.exports = {
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", { loader: "postcss-loader" }]
      }
    ]
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      styles: path.resolve(__dirname, "src/styles/")
    }
  },
  output: {
    filename: "main.js",
    publicPath: "/",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      React: "react",
      _: "lodash",
      Transis: "transis"
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    before: app => {
      app.get("/api/campaigns/1", (_req, res) => {
        const rawJson = fs.readFileSync("./src/data/campaign.json", {
          encoding: "utf8"
        });
        res.json(JSON.parse(rawJson));
      });

      app.get("/api/media_plans/*", (_req, res) => {
        const rawJson = fs.readFileSync("./src/data/media_plan.json", {
          encoding: "utf8"
        });
        res.json(JSON.parse(rawJson));
      });
    }
  }
};
