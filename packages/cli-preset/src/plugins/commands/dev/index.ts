export default (api: any) => {
  api.registerCommand({
    name: 'dev',
    description: 'start a dev server for development',
    fn: () => {
      console.log(1)
    }
  })
}
