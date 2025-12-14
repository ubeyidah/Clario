import { tryCatch } from '@/hooks/try-catch'

describe('tryCatch', () => {
  describe('Success cases', () => {
    it('should return success result when promise resolves', async () => {
      const successPromise = Promise.resolve('test data')
      const result = await tryCatch(successPromise)

      expect(result.data).toBe('test data')
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with object data', async () => {
      const objectData = { id: 1, name: 'Test' }
      const successPromise = Promise.resolve(objectData)
      const result = await tryCatch(successPromise)

      expect(result.data).toEqual(objectData)
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with null data', async () => {
      const successPromise = Promise.resolve(null)
      const result = await tryCatch(successPromise)

      expect(result.data).toBeNull()
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with undefined data', async () => {
      const successPromise = Promise.resolve(undefined)
      const result = await tryCatch(successPromise)

      expect(result.data).toBeUndefined()
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with array data', async () => {
      const arrayData = [1, 2, 3]
      const successPromise = Promise.resolve(arrayData)
      const result = await tryCatch(successPromise)

      expect(result.data).toEqual(arrayData)
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with boolean data', async () => {
      const successPromise = Promise.resolve(true)
      const result = await tryCatch(successPromise)

      expect(result.data).toBe(true)
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with number zero', async () => {
      const successPromise = Promise.resolve(0)
      const result = await tryCatch(successPromise)

      expect(result.data).toBe(0)
      expect(result.error).toBeNull()
    })

    it('should handle resolved promise with empty string', async () => {
      const successPromise = Promise.resolve('')
      const result = await tryCatch(successPromise)

      expect(result.data).toBe('')
      expect(result.error).toBeNull()
    })
  })

  describe('Failure cases', () => {
    it('should return failure result when promise rejects', async () => {
      const error = new Error('test error')
      const failurePromise = Promise.reject(error)
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toBe(error)
    })

    it('should handle rejected promise with string error', async () => {
      const failurePromise = Promise.reject('string error')
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toBe('string error')
    })

    it('should handle rejected promise with custom error object', async () => {
      const customError = { code: 'CUSTOM_ERROR', message: 'Custom error message' }
      const failurePromise = Promise.reject(customError)
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toEqual(customError)
    })

    it('should handle rejected promise with null error', async () => {
      const failurePromise = Promise.reject(null)
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toBeNull()
    })

    it('should handle rejected promise with undefined error', async () => {
      const failurePromise = Promise.reject(undefined)
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toBeUndefined()
    })

    it('should handle rejected promise with number error', async () => {
      const failurePromise = Promise.reject(404)
      const result = await tryCatch(failurePromise)

      expect(result.data).toBeNull()
      expect(result.error).toBe(404)
    })
  })

  describe('Type safety', () => {
    it('should maintain type inference for success data', async () => {
      interface User {
        id: number
        name: string
      }

      const user: User = { id: 1, name: 'John' }
      const successPromise = Promise.resolve(user)
      const result = await tryCatch(successPromise)

      if (result.error === null) {
        // TypeScript should infer result.data as User
        expect(result.data.id).toBe(1)
        expect(result.data.name).toBe('John')
      }
    })

    it('should handle custom error types', async () => {
      interface CustomError {
        code: string
        statusCode: number
      }

      const error: CustomError = { code: 'NOT_FOUND', statusCode: 404 }
      const failurePromise = Promise.reject(error)
      const result = await tryCatch<never, CustomError>(failurePromise)

      if (result.data === null) {
        expect(result.error?.code).toBe('NOT_FOUND')
        expect(result.error?.statusCode).toBe(404)
      }
    })
  })

  describe('Async operations', () => {
    it('should handle async function that resolves', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        return 'delayed data'
      }

      const result = await tryCatch(asyncFn())

      expect(result.data).toBe('delayed data')
      expect(result.error).toBeNull()
    })

    it('should handle async function that rejects', async () => {
      const asyncFn = async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        throw new Error('delayed error')
      }

      const result = await tryCatch(asyncFn())

      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(Error)
      expect((result.error as Error).message).toBe('delayed error')
    })

    it('should handle promise chain', async () => {
      const promise = Promise.resolve(5)
        .then(x => x * 2)
        .then(x => x + 3)

      const result = await tryCatch(promise)

      expect(result.data).toBe(13)
      expect(result.error).toBeNull()
    })

    it('should handle promise chain with rejection', async () => {
      const promise = Promise.resolve(5)
        .then(x => x * 2)
        .then(() => {
          throw new Error('Chain error')
        })

      const result = await tryCatch(promise)

      expect(result.data).toBeNull()
      expect(result.error).toBeInstanceOf(Error)
      expect((result.error as Error).message).toBe('Chain error')
    })
  })
})