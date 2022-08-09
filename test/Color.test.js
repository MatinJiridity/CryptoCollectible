const { assert } = require('chai');

const Color = artifacts.require('./Color.sol');

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Color', (accounts) => {
  let contract

  before(async () => {
    contract = await Color.deployed()
  })

  describe('deployment', async () => {
    it('deploy successfully', async () => {
      const address = contract.address
      // console.log(address)
      assert.notEqual(address, '')
      assert.notEqual(address, 0x000)
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })
    it('has a name', async () => {
      const name = await contract.name()
      assert.equal(name, 'Color')
    })
    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      assert.equal(symbol, 'COLOR')
    })
  })

  describe('minting', async () => {
    it('creates a new token', async () => {
      const result = await contract.mint('#ffffff')
      const totalSupply = await contract.totalSupply()
      const event = result.logs[0].args

      assert.equal(totalSupply, 1)
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')
      // FAILURE: cannot mint same color twice
      await contract.mint('#ffffff').should.be.rejected;
    })
  })

  describe('indexing', async () => {
    it('lists colors', async () => {
      // Mint 3 more tokens
      await contract.mint('#eeeeee')
      await contract.mint('#dddddd')
      await contract.mint('#cccccc')
      const totalSupply = await contract.totalSupply()
      let color
      let result = [] 
      let expected = ['#ffffff','#eeeeee', '#dddddd', '#cccccc']
      for (let i = 1; i <= totalSupply; i++) {
        color = await contract.colors(i - 1)
        result.push(color)
      }
      assert.equal(result.join(','), expected.join(','))
    })
  })
})
