import AppGenerator, { IOpts } from './AppGenerator'

export default ({ cwd, args }: IOpts) => {
  const generator = new AppGenerator({
    cwd,
    args
  })

  generator.run()
}
