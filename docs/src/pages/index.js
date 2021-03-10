import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Logo from './logo'
import styles from './styles.module.css'

const features = [
  {
    title: '开箱即用',
    // imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        您无需学习和配置许多构建工具。可有助您专注于开发,默认支持Typescript, ESlint, Babel,
        PostCSS等,开箱即用
      </>
    )
  },
  {
    title: '简单',
    // imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        您的应用程序仅需要一个构建依赖项。Zmi 有丰富测试
        ，以确保其所有基础部分都可以无缝协同工作-无需关心复杂的版本兼容。
      </>
    )
  },
  {
    title: '功能丰富',
    // imageUrl: 'img/undraw_docusaurus_react.svg',
    description: <>一个依赖即可同时支持 React / Vue / miniApp-ts 并且完全可配置.</>
  }
]

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl)
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

export default function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout title="Zmi-CLI" description="Description will go into a meta tag in <head />">
      <header className={clsx('hero', styles.heroBanner, 'container')}>
        <div>
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('docs/')}
            >
              快速开始
            </Link>
          </div>
        </div>
        <Logo />
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
            <h2>起步</h2>
            <p>安装:</p>
            <pre>
              <code>yarn create @zmi-cli/zmi-app</code>
              <br />
              <span># OR</span>
              <br />
              <code>npx @zmi-cli/create-zmi-app</code>
            </pre>
          </div>
        </section>
      </main>
    </Layout>
  )
}
