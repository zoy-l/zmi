import url from 'url'
import chalk from 'chalk'
import address from 'address'

const urlRe = /^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/

interface PrepareUrls {
  protocol?: string
  pathname?: string
  host: string
  port: number
}

export default function prepareUrls(opts: PrepareUrls) {
  const { protocol, host, port, pathname = '/' } = opts

  const formatUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port,
      pathname
    })
  const prettyPrintUrl = (hostname: string) =>
    url.format({
      protocol,
      hostname,
      port: chalk.bold(`${port}`),
      pathname
    })

  const isUnspecifiedHost = host === '0.0.0.0' || host === '::'

  let prettyHost
  let lanUrlForConfig
  let lanUrlForTerminal

  if (isUnspecifiedHost) {
    prettyHost = 'localhost'
    try {
      lanUrlForConfig = address.ip()
      if (lanUrlForConfig) {
        if (urlRe.test(lanUrlForConfig)) {
          lanUrlForTerminal = prettyPrintUrl(lanUrlForConfig)
        } else {
          lanUrlForConfig = undefined
        }
      }
    } catch (_e) {
      // ignored
    }
  } else {
    prettyHost = host
  }

  const localUrlForTerminal = prettyPrintUrl(prettyHost)
  const localUrlForBrowser = formatUrl(prettyHost)

  return {
    lanUrlForConfig,
    lanUrlForTerminal,
    localUrlForTerminal,
    localUrlForBrowser
  }
}
