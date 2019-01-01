var path = require('path');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  output: {
    path: path.join(__dirname, 'dist'),
  },
  devServer: {
    compress: true,
    port: 8080
  }
};