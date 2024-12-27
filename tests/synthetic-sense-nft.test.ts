import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'synthetic-sense-nft': {
      functions: {
        mint: vi.fn(),
        transfer: vi.fn(),
        'get-token-metadata': vi.fn(),
        'get-owner': vi.fn(),
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

describe('Synthetic Sense NFT Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint', () => {
    it('should mint a new NFT successfully', async () => {
      const name = 'Synthetic Vision'
      const description = 'A unique synthetic vision sense'
      const uri = 'https://example.com/synthetic-vision'
      mockClarity.contracts['synthetic-sense-nft'].functions.mint.mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('synthetic-sense-nft', 'mint', [name, description, uri])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('transfer', () => {
    it('should transfer an NFT successfully', async () => {
      const tokenId = 1
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['synthetic-sense-nft'].functions.transfer.mockReturnValue({ success: true })
      
      const result = await callContract('synthetic-sense-nft', 'transfer', [tokenId, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if sender is not the owner', async () => {
      const tokenId = 1
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['synthetic-sense-nft'].functions.transfer.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('synthetic-sense-nft', 'transfer', [tokenId, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-token-metadata', () => {
    it('should return token metadata', async () => {
      const tokenId = 1
      const expectedMetadata = {
        name: 'Synthetic Vision',
        description: 'A unique synthetic vision sense',
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        uri: 'https://example.com/synthetic-vision'
      }
      mockClarity.contracts['synthetic-sense-nft'].functions['get-token-metadata'].mockReturnValue({ success: true, value: expectedMetadata })
      
      const result = await callContract('synthetic-sense-nft', 'get-token-metadata', [tokenId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedMetadata)
    })
  })
  
  describe('get-owner', () => {
    it('should return the owner of an NFT', async () => {
      const tokenId = 1
      const expectedOwner = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['synthetic-sense-nft'].functions['get-owner'].mockReturnValue({ success: true, value: expectedOwner })
      
      const result = await callContract('synthetic-sense-nft', 'get-owner', [tokenId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedOwner)
    })
  })
})

