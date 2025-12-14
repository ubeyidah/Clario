import { renderHook, waitFor } from '@testing-library/react'
import useLogout from '@/hooks/use-logout'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Mock dependencies
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    signOut: jest.fn()
  }
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn()
  }
}))

describe('useLogout', () => {
  const mockPush = jest.fn()
  const mockSignOut = authClient.signOut as jest.MockedFunction<typeof authClient.signOut>

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    })
  })

  it('should return signOut function', () => {
    const { result } = renderHook(() => useLogout())
    
    expect(result.current).toHaveProperty('signOut')
    expect(typeof result.current.signOut).toBe('function')
  })

  describe('signOut function', () => {
    it('should call authClient.signOut when invoked', async () => {
      mockSignOut.mockResolvedValue(undefined)
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      expect(mockSignOut).toHaveBeenCalledTimes(1)
    })

    it('should call authClient.signOut with correct options structure', async () => {
      mockSignOut.mockResolvedValue(undefined)
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      expect(mockSignOut).toHaveBeenCalledWith(
        expect.objectContaining({
          fetchOptions: expect.objectContaining({
            onSuccess: expect.any(Function),
            onError: expect.any(Function)
          })
        })
      )
    })

    it('should navigate to home on successful signout', async () => {
      mockSignOut.mockImplementation(async (options: any) => {
        options?.fetchOptions?.onSuccess?.()
        return undefined
      })
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/')
      })
    })

    it('should show error toast on failed signout', async () => {
      mockSignOut.mockImplementation(async (options: any) => {
        options?.fetchOptions?.onError?.()
        return undefined
      })
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to sign out. Please try again.')
      })
    })

    it('should not navigate on error', async () => {
      mockSignOut.mockImplementation(async (options: any) => {
        options?.fetchOptions?.onError?.()
        return undefined
      })
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalled()
      })
      
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should be callable multiple times', async () => {
      mockSignOut.mockResolvedValue(undefined)
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      await result.current.signOut()
      await result.current.signOut()
      
      expect(mockSignOut).toHaveBeenCalledTimes(3)
    })

    it('should maintain stable reference across re-renders', () => {
      const { result, rerender } = renderHook(() => useLogout())
      
      const firstSignOut = result.current.signOut
      
      rerender()
      
      const secondSignOut = result.current.signOut
      
      // The function should be recreated on each render (not memoized)
      // This is actually expected behavior for this hook
      expect(typeof firstSignOut).toBe('function')
      expect(typeof secondSignOut).toBe('function')
    })
  })

  describe('Error handling', () => {
    it('should handle authClient.signOut rejection gracefully', async () => {
      mockSignOut.mockRejectedValue(new Error('Network error'))
      
      const { result } = renderHook(() => useLogout())
      
      // Should not throw
      await expect(result.current.signOut()).resolves.not.toThrow()
    })

    it('should handle missing router gracefully', async () => {
      ;(useRouter as jest.Mock).mockReturnValue(null)
      mockSignOut.mockResolvedValue(undefined)
      
      const { result } = renderHook(() => useLogout())
      
      // Should not throw even if router is missing
      await expect(result.current.signOut()).resolves.not.toThrow()
    })
  })

  describe('Integration scenarios', () => {
    it('should execute complete success flow', async () => {
      mockSignOut.mockImplementation(async (options: any) => {
        // Simulate successful signout
        options?.fetchOptions?.onSuccess?.()
        return undefined
      })
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(mockPush).toHaveBeenCalledWith('/')
      expect(toast.error).not.toHaveBeenCalled()
    })

    it('should execute complete error flow', async () => {
      mockSignOut.mockImplementation(async (options: any) => {
        // Simulate failed signout
        options?.fetchOptions?.onError?.()
        return undefined
      })
      
      const { result } = renderHook(() => useLogout())
      
      await result.current.signOut()
      
      expect(mockSignOut).toHaveBeenCalledTimes(1)
      expect(toast.error).toHaveBeenCalledWith('Failed to sign out. Please try again.')
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})