/* eslint-disable */
var path = require('path');
var webpack = require('webpack');

var PATHS = {
  entry: path.resolve('./src/index'),
  output: path.resolve('./dist'),
  root: path.resolve('./src')
};

var config = {
  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    PATHS.entry
  ],
  output: {
    filename: 'bundle.js',
    path: PATHS.output,
    publicPath: 'http://0.0.0.0:8080/'
  },
  resolve: {
    alias: { app: PATHS.root }
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        include: /src\/assets/,
        loaders: ['url?limit=10000&name=assets/images/[name].[ext]', 'img-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style-loader', 'css-loader', 'autoprefixer-loader', 'sass-loader']
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        loaders: ['file-loader?name=assets/fonts/[name].[ext]']
      },
      {
        test: /\.(frag|vert|glsl)$/,
        loaders: ['webpack-glsl-loader']
      }
    ]
  }
};


// Dist only configuration
if (process.env.npm_lifecycle_event == 'build') {
  config.entry = PATHS.entry;
  config.output.publicPath = '/';

  config.module.loaders[2].loaders = [];
  config.module.loaders[2].loader = ExtractTextPlugin.extract('style', 'css?modules!autoprefixer!sass');

  config.plugins = config.plugins.concat([
    new ExtractTextPlugin('main.css', {
      allChunks: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]);
}
// Dev only configuration
else {
  config.devtool = 'eval';
  config.devServer = {
    inline: true,
    contentBase: 'src',
    noInfo: true,
    historyApiFallback: true,
    publicPath: '/'
  };
}

module.exports = config;
