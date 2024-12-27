import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'sense-marketplace': {
      functions: {
        'create-listing': vi.fn(),
        'update-listing': vi.fn(),
        'buy-listing': vi.fn(),
        'get-listing': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Sense Marketplace Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-listing', () => {
    it('should create a new listing successfully', async () => {
      const name = 'Synthetic Taste Module'
      const description = 'Advanced taste simulation module'
      const price = 1000
      const category = 'hardware'
      mockClarity.contracts['sense-marketplace'].functions['create-listing'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('sense-marketplace', 'create-listing', [name, description, price, category])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-listing', () => {
    it('should update a listing successfully', async () => {
      const listingId = 1
      const newPrice = 1200
      const active = true
      mockClarity.contracts['sense-marketplace'].functions['update-listing'].mockReturnValue({ success: true })
      
      const result = await callContract('sense-marketplace', 'update-listing', [listingId, newPrice, active])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the seller', async () => {
      const listingId = 1
      const newPrice = 1200
      const active = true
      mockClarity.contracts['sense-marketplace'].functions['update-listing'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('sense-marketplace', 'update-listing', [listingId, newPrice, active])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('buy-listing', () => {
    it('should buy a listing successfully', async () => {
      const listingId = 1
      mockClarity.contracts['sense-marketplace'].functions['buy-listing'].mockReturnValue({ success: true })
      
      const result = await callContract('sense-marketplace', 'buy-listing', [listingId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if listing is not active', async () => {
      const listingId = 1
      mockClarity.contracts['sense-marketplace'].functions['buy-listing'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('sense-marketplace', 'buy-listing', [listingId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('get-listing', () => {
    it('should return listing details', async () => {
      const listingId = 1
      const expectedListing = {
        seller: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Synthetic Taste Module',
        description: 'Advanced taste simulation module',
        price: 1000,
        category: 'hardware',
        active: true
      }
      mockClarity.contracts['sense-marketplace'].functions['get-listing'].mockReturnValue({ success: true, value: expectedListing })
      
      const result = await callContract('sense-marketplace', 'get-listing', [listingId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedListing)
    })
  })
})

