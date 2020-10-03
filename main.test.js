const {
      core: {describe, it, expect, run},
    } = window.jestLite;

describe('Initial State', () => {
  it('has some state', () => {
    expect(document.body.innerText).toContain('State: 0')
  })
})

run().then( ([{ errors }])  => {
  errors.length && console.log(`${errors}`)
})
