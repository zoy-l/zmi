beforeEach(() => {
  jest.resetModules()
})

test('normal', () => {
  const args: any[] = []
  jest.doMock('@babel/register', () => (opts: Record<string, any>) => {
    args.push(opts)
  })

  expect(args).toEqual([])
})
