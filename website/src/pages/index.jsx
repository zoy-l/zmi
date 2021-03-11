import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import React from 'react'
import clsx from 'clsx'

import styles from '../css/styles.module.css'

const features = [
  {
    title: '开箱即用',
    imageUrl: 'img/undraw_typewriter.svg',

    description: (
      <>
        您无需学习和配置许多构建工具。可有助您专注于开发,默认支持Typescript, ESlint, Babel,
        PostCSS等,开箱即用
      </>
    )
  },
  {
    title: '简单',
    imageUrl: 'img/undraw_version_control.svg',
    description: (
      <>
        您的应用程序仅需要一个构建依赖项。Zmi 有丰富测试
        ，以确保其所有基础部分都可以无缝协同工作-无需关心复杂的版本兼容。
      </>
    )
  },
  {
    title: '功能丰富',
    imageUrl: 'img/undraw_switches.svg',
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
    <Layout
      title="通用的 React Vue miniapp-ts 开发工具"
      description="Cli/Vue-Cli/React-Cli/微信小程序/React/Vue"
    >
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
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              {features.map((props, idx) => (
                <Feature key={idx} {...props} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <div style={{ position: 'relative', height: '20vh', overflow: 'hidden' }}>
        <svg
          className={styles.waves}
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>

          <g className={styles.parallax}>
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(213, 172, 236, 0.1)" />
            <use xlinkHref="#gentle-wave" x="48" y="2" fill="rgba(213, 172, 236, 0.1)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(213, 172, 236, 0.1)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="rgba(213, 172, 236, 0.1)" />
          </g>
        </svg>
        <p className={styles.footer}>MIT Licensed | Copyright © {new Date().getFullYear()} zoy-l</p>
      </div>
    </Layout>
  )
}
