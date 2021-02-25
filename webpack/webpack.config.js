const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
      index : "./src/index.js",
      styles: './src/styles.js'
    },
    output: {
      filename: "[name].js",
      path: path.join(__dirname, "dist")
    },
    module: {
      rules: [{
          test: [/.css$/],
          use: ['style-loader', {
                loader: 'css-loader',
                    options: {
                      importLoaders: 1,
                      modules: true
                    }
                }
            ]
        },
        {
          test:/\.(png|svg|jpg|jpeg|gif)$/i,
          use: {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images',
              name: '[name].[ext]'
            }
          }
        },
        {
          test: /\.(xml|bpmn)$/i,
          use: ['raw-loader']
        }
      ]
    },    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html', 
        favicon: './src/assets/images/favicon.ico'       
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "bpmn-js/dist/assets/**",
            to: "vendor/npm",
            context: 'node_modules' 
          },
          {
            from: "diagram-js/assets/**",
            to: "vendor/npm",
            context: 'node_modules' 
          }
        ]})
      ],
    devServer: {
      port:8080,
      contentBase: path.resolve(__dirname, "dist"),
      publicPath: "/assets",
      writeToDisk: true,
    },
    mode: "development"
}