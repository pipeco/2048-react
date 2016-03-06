var pkg = require('./package.json')

var modules = []
if (process.env.NODE_ENV !== 'production') {
  modules.push('webpack/hot/dev-server')
}

modules.push('./src/app.jsx')

module.exports = {
  cache: true,

  resolve: { extensions: [ '', '.jsx', '.js' ] },

  context: __dirname,

  entry: { app: modules },

  output: {
    path: './build',
    filename: pkg.name + '.[name].js',
    publicPath: '/build/'
  },

  devServer: {
    host: '0.0.0.0',
    port: 8080,
    inline: true
  },

  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel',
        query: { presets: [ 'es2015', 'stage-0', 'react' ] }
      },
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      }
    ]
  }
}
