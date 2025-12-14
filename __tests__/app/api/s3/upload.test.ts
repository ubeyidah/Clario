/**
 * Tests for S3 Upload API Route
 * 
 * Note: These tests validate the API route logic, validation, and error handling.
 * Actual S3 operations and Arcjet security checks are mocked.
 */

import { POST } from '@/app/api/s3/upload/route'
import { requireAdmin } from '@/app/data/admin/require-admin'
import arcjet from '@/lib/arcjet'
import { S3 } from '@/lib/s3-client'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextResponse } from 'next/server'

// Mock all dependencies
jest.mock('@/app/data/admin/require-admin')
jest.mock('@/lib/arcjet')
jest.mock('@/lib/s3-client')
jest.mock('@aws-sdk/s3-request-presigner')
jest.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_S3_BUCKET_NAME_IMG: 'test-bucket'
  }
}))

describe('POST /api/s3/upload', () => {
  const mockSession = {
    user: {
      id: 'user-123',
      role: 'admin'
    }
  }

  const mockArcjetProtect = jest.fn()
  const mockRequireAdmin = requireAdmin as jest.MockedFunction<typeof requireAdmin>
  const mockGetSignedUrl = getSignedUrl as jest.MockedFunction<typeof getSignedUrl>

  beforeEach(() => {
    jest.clearAllMocks()
    
    mockRequireAdmin.mockResolvedValue(mockSession as any)
    
    // Mock arcjet
    ;(arcjet as any).withRule = jest.fn().mockReturnValue({
      withRule: jest.fn().mockReturnValue({
        protect: mockArcjetProtect
      })
    })
    
    // Default: allow requests
    mockArcjetProtect.mockResolvedValue({
      isDenied: () => false,
      reason: {}
    })
    
    mockGetSignedUrl.mockResolvedValue('https://presigned-url.example.com')
  })

  describe('Successful upload flow', () => {
    it('should return presigned URL for valid file upload request', async () => {
      const validRequest = {
        fileName: 'test-image.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBe('presigned url generated')
      expect(data.data).toHaveProperty('presignedUrl')
      expect(data.data).toHaveProperty('key')
      expect(data.data.presignedUrl).toBe('https://presigned-url.example.com')
      expect(data.data.key).toContain('test-image.jpg')
    })

    it('should generate unique keys for each request', async () => {
      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request1 = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const request2 = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response1 = await POST(request1)
      const response2 = await POST(request2)

      const data1 = await response1.json()
      const data2 = await response2.json()

      expect(data1.data.key).not.toBe(data2.data.key)
      expect(data1.data.key).toContain('test.jpg')
      expect(data2.data.key).toContain('test.jpg')
    })
  })

  describe('Authentication and authorization', () => {
    it('should require admin authentication', async () => {
      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      await POST(request)

      expect(mockRequireAdmin).toHaveBeenCalled()
    })

    it('should use user ID for arcjet fingerprinting', async () => {
      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      await POST(request)

      expect(mockArcjetProtect).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fingerprint: 'user-123'
        })
      )
    })
  })

  describe('Arcjet security checks', () => {
    it('should reject bot detection', async () => {
      mockArcjetProtect.mockResolvedValue({
        isDenied: () => true,
        reason: {
          isBot: () => true,
          isRateLimit: () => false
        }
      })

      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.message).toBe('We detected automated or unusual activity.')
    })

    it('should reject rate limit exceeded', async () => {
      mockArcjetProtect.mockResolvedValue({
        isDenied: () => true,
        reason: {
          isBot: () => false,
          isRateLimit: () => true
        }
      })

      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(429)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Please wait a few seconds before trying again.')
    })

    it('should reject other denial reasons', async () => {
      mockArcjetProtect.mockResolvedValue({
        isDenied: () => true,
        reason: {
          isBot: () => false,
          isRateLimit: () => false
        }
      })

      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.success).toBe(false)
      expect(data.message).toBe('Forbidden')
    })
  })

  describe('Input validation', () => {
    it('should reject missing fileName', async () => {
      const invalidRequest = {
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(invalidRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.message).toBeDefined()
    })

    it('should reject empty fileName', async () => {
      const invalidRequest = {
        fileName: '',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(invalidRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should reject missing contentType', async () => {
      const invalidRequest = {
        fileName: 'test.jpg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(invalidRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should reject size less than 1', async () => {
      const invalidRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 0,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(invalidRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })

    it('should reject missing isImage field', async () => {
      const invalidRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(invalidRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
    })
  })

  describe('Error handling', () => {
    it('should handle internal server errors gracefully', async () => {
      mockGetSignedUrl.mockRejectedValue(new Error('S3 connection failed'))

      const validRequest = {
        fileName: 'test.jpg',
        contentType: 'image/jpeg',
        size: 1024,
        isImage: true
      }

      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(validRequest)
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.message).toBe('internal server error')
    })

    it('should handle malformed JSON', async () => {
      const request = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: 'invalid json'
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
    })
  })

  describe('File type handling', () => {
    it('should handle image files', async () => {
      const request = {
        fileName: 'photo.png',
        contentType: 'image/png',
        size: 2048,
        isImage: true
      }

      const req = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(request)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should handle non-image files', async () => {
      const request = {
        fileName: 'document.pdf',
        contentType: 'application/pdf',
        size: 5000,
        isImage: false
      }

      const req = new Request('http://localhost/api/s3/upload', {
        method: 'POST',
        body: JSON.stringify(request)
      })

      const response = await POST(req)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })
  })
})