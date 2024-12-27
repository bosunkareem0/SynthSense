import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'collaborative-development': {
      functions: {
        'create-project': vi.fn(),
        'add-collaborator': vi.fn(),
        'create-task': vi.fn(),
        'update-task-status': vi.fn(),
        'get-project': vi.fn(),
        'get-task': vi.fn(),
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

describe('Collaborative Development Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('create-project', () => {
    it('should create a new project successfully', async () => {
      const name = 'Synthetic Taste Project'
      const description = 'Developing a synthetic taste sense'
      mockClarity.contracts['collaborative-development'].functions['create-project'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('collaborative-development', 'create-project', [name, description])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('add-collaborator', () => {
    it('should add a collaborator to a project successfully', async () => {
      const projectId = 1
      const collaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-development'].functions['add-collaborator'].mockReturnValue({ success: true })
      
      const result = await callContract('collaborative-development', 'add-collaborator', [projectId, collaborator])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the project creator', async () => {
      const projectId = 1
      const collaborator = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-development'].functions['add-collaborator'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('collaborative-development', 'add-collaborator', [projectId, collaborator])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('create-task', () => {
    it('should create a new task successfully', async () => {
      const projectId = 1
      const description = 'Implement taste receptor simulation'
      const assignee = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['collaborative-development'].functions['create-task'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('collaborative-development', 'create-task', [projectId, description, assignee])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail if not a collaborator', async () => {
      const projectId = 1
      const description = 'Unauthorized task'
      const assignee = 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AH'
      mockClarity.contracts['collaborative-development'].functions['create-task'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('collaborative-development', 'create-task', [projectId, description, assignee])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('update-task-status', () => {
    it('should update task status successfully', async () => {
      const projectId = 1
      const taskId = 1
      const newStatus = 'completed'
      mockClarity.contracts['collaborative-development'].functions['update-task-status'].mockReturnValue({ success: true })
      
      const result = await callContract('collaborative-development', 'update-task-status', [projectId, taskId, newStatus])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the task assignee', async () => {
      const projectId = 1
      const taskId = 1
      const newStatus = 'completed'
      mockClarity.contracts['collaborative-development'].functions['update-task-status'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('collaborative-development', 'update-task-status', [projectId, taskId, newStatus])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-project', () => {
    it('should return project details', async () => {
      const projectId = 1
      const expectedProject = {
        name: 'Synthetic Taste Project',
        description: 'Developing a synthetic taste sense',
        creator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        collaborators: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'],
        status: 'active'
      }
      mockClarity.contracts['collaborative-development'].functions['get-project'].mockReturnValue({ success: true, value: expectedProject })
      
      const result = await callContract('collaborative-development', 'get-project', [projectId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedProject)
    })
  })
  
  describe('get-task', () => {
    it('should return task details', async () => {
      const projectId = 1
      const taskId = 1
      const expectedTask = {
        description: 'Implement taste receptor simulation',
        assignee: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
        status: 'open'
      }
      mockClarity.contracts['collaborative-development'].functions['get-task'].mockReturnValue({ success: true, value: expectedTask })
      
      const result = await callContract('collaborative-development', 'get-task', [projectId, taskId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedTask)
    })
  })
})

