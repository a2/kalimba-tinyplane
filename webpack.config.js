const path = require('path');
const bmpJson = require('./tools/bmp-json');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // modules: [path.resolve(__dirname, 'kaluma_modules')],
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset/inline',
        generator: { dataUrl: bmpJson }
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ]
  },
  /* kaluma builtin modules */
  externals: {
    'adc': 'commonjs adc',
    'at': 'commonjs at',
    'button': 'commonjs button',
    'dgram': 'commonjs dgram',
    'events': 'commonjs events',
    'gpio': 'commonjs gpio',
    'graphics': 'commonjs graphics',
    'http': 'commonjs http',
    'i2c': 'commonjs i2c',
    'led': 'commonjs led',
    'net': 'commonjs net',
    'pwm': 'commonjs pwm',
    'rp2': 'commonjs rp2',
    'spi': 'commonjs spi',
    'stream': 'commonjs stream',
    'uart': 'commonjs uart',
    'url': 'commonjs url',
    'wifi': 'commonjs wifi',
  },
  devtool: 'source-map'
};
