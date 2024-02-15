/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig

const webpack = require('webpack');

module.exports = {
  // ...
  webpack: (config) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.MANIFEST_JSON': JSON.stringify('/manifest.json')
      })
    )
    return config
  }
}