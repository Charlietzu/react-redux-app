const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

//node enviroment declaration (development mode)
process.env.NODE_ENV = "development";

module.exports = {
  //run in development mode
  mode: "development",
  target: "web",
  //source maps let us see our original code when debugging in the browser
  devtool: "cheap-module-source-map",
  //entry point of the application
  entry: "./src/index",
  /*where we want to webpack to output 
  note: webpack doesn't output code in development mode. it serves our app from memory*/
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
    filename: "bundle.js",
  },
  /*setting our server to development */
  devServer: {
    //minimal information in the terminal
    stats: "minimal",
    //overlay any errors that occur in the browser
    overlay: true,
    //all request will be sent to index.html
    historyApiFallback: true,
    //we need these 3 lines bellow because of a issue ocurring when using the latest version of Google Chrome
    disableHostCheck: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    https: false,
  },
  plugins: [
    /*Here we define our enviroment variable that is relatable to our base url for our API.
      Now webpack will replace process.env.API_URL anywhere in our code with the URL we've
      specified here.*/
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify("http://localhost:3001"),
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      favicon: "src/favicon.ico",
    }),
  ],
  module: {
    rules: [
      {
        //how to find our JavaScript files (js or jsx files)
        test: /\.(js|jsx)$/,
        //ignore node modules
        exclude: /node_modules/,
        //tell webpack what to do with these JavaScript files
        use: ["babel-loader", "eslint-loader"],
      },
      {
        test: /(\.css)$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
