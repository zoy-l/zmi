/** @type {import('@docusaurus/types').DocusaurusConfig} */

module.exports = {
  title: 'Zmi-CLI',
  tagline: '🎃 通用的 React Vue miniapp-ts 开发工具.',
  url: 'https://l-zoy.github.io',
  baseUrl: '/zmi/',
  titleDelimiter: '·',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'l-zoy',
  projectName: 'zmi',

  themeConfig: {
    algolia: {
      apiKey: '25626fae796133dc1e734c6bcaaeac3c',
      indexName: 'docsearch',

      // Optional: see doc section bellow
      contextualSearch: true,

      // Optional: Algolia search parameters
      searchParameters: {}
    },
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula')
    },
    navbar: {
      title: 'Zmi-CLI',
      logo: {
        alt: 'Zmi Logo',
        src: 'img/logo.svg'
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: '指南',
          position: 'left'
        },
        {
          href: 'https://github.com/l-zoy/zmi',
          label: 'GitHub',
          position: 'right'
        }
      ]
    }
  },
  presets: [
    [
      require.resolve('@docusaurus/preset-classic'),
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./src/sidebars.js')
          // editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
