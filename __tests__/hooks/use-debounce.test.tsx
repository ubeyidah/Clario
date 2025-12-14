import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/use-debouce'

// Mock timers
jest.useFakeTimers()

describe('useDebounce', () => {
  afterEach(() => {
    jest.clearAllTimers()
  })

  describe('Basic functionality', () => {
    it('should return initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 300))
      expect(result.current).toBe('initial')
    })

    it('should debounce value changes with default delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      )

      expect(result.current).toBe('initial')

      // Change value
      rerender({ value: 'updated' })

      // Value should not change immediately
      expect(result.current).toBe('initial')

      // Fast-forward time by 299ms (just before delay)
      act(() => {
        jest.advanceTimersByTime(299)
      })
      expect(result.current).toBe('initial')

      // Fast-forward remaining 1ms
      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(result.current).toBe('updated')
    })

    it('should debounce value changes with custom delay', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 500 } }
      )

      expect(result.current).toBe('initial')

      rerender({ value: 'updated', delay: 500 })

      act(() => {
        jest.advanceTimersByTime(499)
      })
      expect(result.current).toBe('initial')

      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(result.current).toBe('updated')
    })
  })

  describe('Multiple rapid changes', () => {
    it('should only update to the last value after rapid changes', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'value1' } }
      )

      // Rapidly change values
      rerender({ value: 'value2' })
      act(() => jest.advanceTimersByTime(100))

      rerender({ value: 'value3' })
      act(() => jest.advanceTimersByTime(100))

      rerender({ value: 'value4' })
      act(() => jest.advanceTimersByTime(100))

      // Still showing initial value
      expect(result.current).toBe('value1')

      // Complete the last debounce
      act(() => {
        jest.advanceTimersByTime(200)
      })

      // Should update to the last value
      expect(result.current).toBe('value4')
    })

    it('should reset timer on each value change', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'value1' } }
      )

      rerender({ value: 'value2' })
      act(() => jest.advanceTimersByTime(200))

      // Change again before timer completes
      rerender({ value: 'value3' })

      // Original timer should be cancelled, value still initial
      expect(result.current).toBe('value1')

      // Complete new timer
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toBe('value3')
    })
  })

  describe('Different data types', () => {
    it('should work with number values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 0 } }
      )

      expect(result.current).toBe(0)

      rerender({ value: 42 })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toBe(42)
    })

    it('should work with boolean values', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: false } }
      )

      expect(result.current).toBe(false)

      rerender({ value: true })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toBe(true)
    })

    it('should work with object values', () => {
      const obj1 = { id: 1, name: 'Test' }
      const obj2 = { id: 2, name: 'Updated' }

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: obj1 } }
      )

      expect(result.current).toEqual(obj1)

      rerender({ value: obj2 })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toEqual(obj2)
    })

    it('should work with array values', () => {
      const arr1 = [1, 2, 3]
      const arr2 = [4, 5, 6]

      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: arr1 } }
      )

      expect(result.current).toEqual(arr1)

      rerender({ value: arr2 })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toEqual(arr2)
    })

    it('should work with null and undefined', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: null as string | null } }
      )

      expect(result.current).toBeNull()

      rerender({ value: undefined as string | null | undefined })
      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toBeUndefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle zero delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 0),
        { initialProps: { value: 'initial' } }
      )

      rerender({ value: 'updated' })

      act(() => {
        jest.advanceTimersByTime(0)
      })

      expect(result.current).toBe('updated')
    })

    it('should handle very long delay', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 10000),
        { initialProps: { value: 'initial' } }
      )

      rerender({ value: 'updated' })

      act(() => {
        jest.advanceTimersByTime(9999)
      })
      expect(result.current).toBe('initial')

      act(() => {
        jest.advanceTimersByTime(1)
      })
      expect(result.current).toBe('updated')
    })

    it('should cleanup timer on unmount', () => {
      const { rerender, unmount } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'initial' } }
      )

      rerender({ value: 'updated' })

      // Unmount before timer completes
      unmount()

      // Advance timers - should not cause any issues
      act(() => {
        jest.advanceTimersByTime(300)
      })

      // No assertions needed - test passes if no errors occur
      expect(true).toBe(true)
    })

    it('should handle same value updates', () => {
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 300),
        { initialProps: { value: 'same' } }
      )

      rerender({ value: 'same' })

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current).toBe('same')
    })
  })

  describe('Delay changes', () => {
    it('should respect delay changes', () => {
      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 300 } }
      )

      rerender({ value: 'updated', delay: 500 })

      // Old delay should not trigger update
      act(() => {
        jest.advanceTimersByTime(300)
      })
      expect(result.current).toBe('initial')

      // New delay should trigger update
      act(() => {
        jest.advanceTimersByTime(200)
      })
      expect(result.current).toBe('updated')
    })
  })
})