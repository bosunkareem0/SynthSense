import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'iot-integration': {
      functions: {
        'register-device': vi.fn(),
        'authorize-user': vi.fn(),
        'revoke-authorization': vi.fn(),
        'submit-reading': vi.fn(),
        'get-device': vi.fn(),
        'get-last-reading': vi.fn(),
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

describe('IoT Integration Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-device', () => {
    it('should register a new device successfully', async () => {
      const name = 'Taste Sensor'
      const deviceType = 'sensor'
      mockClarity.contracts['iot-integration'].functions['register-device'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('iot-integration', 'register-device', [name, deviceType])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('authorize-user', () => {
    it('should authorize a user successfully', async () => {
      const deviceId = 1
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['iot-integration'].functions['authorize-user'].mockReturnValue({ success: true })
      
      const result = await callContract('iot-integration', 'authorize-user', [deviceId, user])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the device owner', async () => {
      const deviceId = 1
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['iot-integration'].functions['authorize-user'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('iot-integration', 'authorize-user', [deviceId, user])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('revoke-authorization', () => {
    it('should revoke authorization successfully', async () => {
      const deviceId = 1
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['iot-integration'].functions['revoke-authorization'].mockReturnValue({ success: true })
      
      const result = await callContract('iot-integration', 'revoke-authorization', [deviceId, user])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the device owner', async () => {
      const deviceId = 1
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['iot-integration'].functions['revoke-authorization'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('iot-integration', 'revoke-authorization', [deviceId, user])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('submit-reading', () => {
    it('should submit a reading successfully', async () => {
      const deviceId = 1
      const timestamp = Math.floor(Date.now() / 1000)
      const data = 'Taste intensity: 7, Sweetness: 4, Sourness: 2'
      mockClarity.contracts['iot-integration'].functions['submit-reading'].mockReturnValue({ success: true })
      
      const result = await callContract('iot-integration', 'submit-reading', [deviceId, timestamp, data])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not authorized', async () => {
      const deviceId = 1
      const timestamp = Math.floor(Date.now() / 1000)
      const data = 'Unauthorized reading'
      mockClarity.contracts['iot-integration'].functions['submit-reading'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('iot-integration', 'submit-reading', [deviceId, timestamp, data])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-device', () => {
    it('should return device details', async () => {
      const deviceId = 1
      const expectedDevice = {
        owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'Taste Sensor',
        device_type: 'sensor',
        last_reading: {
          timestamp: 1625097600,
          data: 'Taste intensity: 7, Sweetness: 4, Sourness: 2'
        }
      }
      mockClarity.contracts['iot-integration'].functions['get-device'].mockReturnValue({ success: true, value: expectedDevice })
      
      const result = await callContract('iot-integration', 'get-device', [deviceId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedDevice)
    })
  })
  
  describe('get-last-reading', () => {
    it('should return the last reading', async () => {
      const deviceId = 1
      const expectedReading = {
        timestamp: 1625097600,
        data: 'Taste intensity: 7, Sweetness: 4, Sourness: 2'
      }
      mockClarity.contracts['iot-integration'].functions['get-last-reading'].mockReturnValue({ success: true, value: expectedReading })
      
      const result = await callContract('iot-integration', 'get-last-reading', [deviceId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedReading)
    })
    
    it('should return null if no reading exists', async () => {
      const deviceId = 2
      mockClarity.contracts['iot-integration'].functions['get-last-reading'].mockReturnValue({ success: true, value: null })
      
      const result = await callContract('iot-integration', 'get-last-reading', [deviceId])
      
      expect(result.success).toBe(true)
      expect(result.value).toBeNull()
    })
  })
})

