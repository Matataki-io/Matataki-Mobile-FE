module.exports = {
  plugins: {
    // 应该该用 browserlistrc 了
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 7']
    // },
    'postcss-pxtorem': {
      rootValue: 16,
      propList: ['*']
    }
  }
}
