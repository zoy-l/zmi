module.exports = {
  presets: [
    process.env.NODE_ENV !== 'test' &&
      require.resolve('@docusaurus/core/lib/babel/preset')
  ].filter(Boolean)
}
