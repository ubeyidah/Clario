import { cn, formatETB, formatDuration, truncateText } from '@/lib/utils'

describe('Utils', () => {
  describe('cn (className merger)', () => {
    it('should merge multiple class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional')).toBe('base conditional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })

    it('should handle undefined and null', () => {
      expect(cn('base', undefined, null)).toBe('base')
    })

    it('should merge Tailwind classes correctly', () => {
      expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
    })

    it('should handle empty input', () => {
      expect(cn()).toBe('')
    })

    it('should handle arrays', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3')
    })

    it('should handle objects', () => {
      expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3')
    })
  })

  describe('formatETB', () => {
    describe('Valid numbers', () => {
      it('should format positive integers', () => {
        expect(formatETB(100)).toBe('ETB 100.00')
      })

      it('should format decimal numbers', () => {
        expect(formatETB(123.45)).toBe('ETB 123.45')
      })

      it('should format large numbers with thousands separator', () => {
        expect(formatETB(1000000)).toContain('1,000,000')
      })

      it('should format zero', () => {
        expect(formatETB(0)).toBe('ETB 0.00')
      })

      it('should format negative numbers', () => {
        const result = formatETB(-50)
        expect(result).toContain('50')
        expect(result).toContain('ETB')
      })

      it('should always show two decimal places', () => {
        expect(formatETB(10)).toBe('ETB 10.00')
        expect(formatETB(10.5)).toBe('ETB 10.50')
      })

      it('should round to two decimal places', () => {
        expect(formatETB(10.999)).toBe('ETB 11.00')
        expect(formatETB(10.994)).toBe('ETB 10.99')
      })

      it('should format very small positive numbers', () => {
        expect(formatETB(0.01)).toBe('ETB 0.01')
      })

      it('should format very large numbers', () => {
        const result = formatETB(999999999.99)
        expect(result).toContain('999,999,999.99')
        expect(result).toContain('ETB')
      })
    })

    describe('Invalid inputs', () => {
      it('should handle NaN', () => {
        expect(formatETB(NaN)).toBe('ETB 0')
      })

      it('should handle Infinity', () => {
        const result = formatETB(Infinity)
        expect(result).toContain('ETB')
      })

      it('should handle negative Infinity', () => {
        const result = formatETB(-Infinity)
        expect(result).toContain('ETB')
      })
    })

    describe('Edge cases', () => {
      it('should handle numbers close to zero', () => {
        expect(formatETB(0.001)).toBe('ETB 0.00')
      })

      it('should handle maximum safe integer', () => {
        const result = formatETB(Number.MAX_SAFE_INTEGER)
        expect(result).toContain('ETB')
      })

      it('should handle minimum safe integer', () => {
        const result = formatETB(Number.MIN_SAFE_INTEGER)
        expect(result).toContain('ETB')
      })
    })
  })

  describe('formatDuration', () => {
    describe('Valid durations', () => {
      it('should format whole hours', () => {
        expect(formatDuration(1)).toBe('1:00')
        expect(formatDuration(3)).toBe('3:00')
        expect(formatDuration(10)).toBe('10:00')
      })

      it('should format decimal hours as minutes', () => {
        expect(formatDuration(0.3)).toBe('30:00')
        expect(formatDuration(0.5)).toBe('50:00')
        expect(formatDuration(0.1)).toBe('10:00')
      })

      it('should handle decimal values less than 1', () => {
        expect(formatDuration(0.01)).toBe('1:00')
        expect(formatDuration(0.99)).toBe('99:00')
      })

      it('should format zero', () => {
        expect(formatDuration(0)).toBe('0:00')
      })

      it('should handle large hour values', () => {
        expect(formatDuration(100)).toBe('100:00')
        expect(formatDuration(999)).toBe('999:00')
      })

      it('should floor fractional hours', () => {
        expect(formatDuration(3.7)).toBe('3:00')
        expect(formatDuration(5.9)).toBe('5:00')
      })

      it('should round fractional minutes', () => {
        expect(formatDuration(0.456)).toBe('46:00')
        expect(formatDuration(0.125)).toBe('13:00')
      })
    })

    describe('Invalid inputs', () => {
      it('should handle NaN', () => {
        expect(formatDuration(NaN)).toBe('0:00')
      })

      it('should handle negative numbers', () => {
        expect(formatDuration(-1)).toBe('0:00')
        expect(formatDuration(-0.5)).toBe('0:00')
      })

      it('should handle Infinity', () => {
        const result = formatDuration(Infinity)
        expect(result).toContain(':00')
      })
    })

    describe('Edge cases', () => {
      it('should handle very small positive decimals', () => {
        expect(formatDuration(0.001)).toBe('0:00')
      })

      it('should handle boundary between decimal and whole', () => {
        expect(formatDuration(0.999)).toBe('100:00')
        expect(formatDuration(1.001)).toBe('1:00')
      })
    })
  })

  describe('truncateText', () => {
    describe('Basic truncation', () => {
      it('should not truncate short text', () => {
        expect(truncateText('Short', 20)).toBe('Short')
      })

      it('should truncate long text with default length', () => {
        const longText = 'This is a very long text that needs truncation'
        const result = truncateText(longText)
        expect(result).toBe('This is a very long ...')
        expect(result.length).toBe(23) // 20 chars + '...'
      })

      it('should truncate with custom max length', () => {
        expect(truncateText('Hello World', 5)).toBe('Hello...')
      })

      it('should return exact length text without truncation', () => {
        expect(truncateText('Exact length here!!', 19)).toBe('Exact length here!!')
      })

      it('should truncate text longer than max length', () => {
        expect(truncateText('This is too long', 10)).toBe('This is to...')
      })
    })

    describe('Edge cases', () => {
      it('should handle empty string', () => {
        expect(truncateText('', 20)).toBe('')
      })

      it('should handle single character', () => {
        expect(truncateText('A', 20)).toBe('A')
      })

      it('should handle max length of 0', () => {
        expect(truncateText('Hello', 0)).toBe('...')
      })

      it('should handle max length of 1', () => {
        expect(truncateText('Hello', 1)).toBe('H...')
      })

      it('should handle very long text', () => {
        const veryLongText = 'a'.repeat(1000)
        const result = truncateText(veryLongText, 50)
        expect(result.length).toBe(53)
        expect(result.endsWith('...')).toBe(true)
      })

      it('should handle text with special characters', () => {
        expect(truncateText('Hello 世界!', 5)).toBe('Hello...')
      })

      it('should handle text with emojis', () => {
        expect(truncateText('Hello 👋 World 🌍', 10)).toBe('Hello 👋 Wo...')
      })

      it('should handle text with newlines', () => {
        expect(truncateText('Line 1\nLine 2\nLine 3', 10)).toBe('Line 1\nLin...')
      })

      it('should handle text with tabs', () => {
        expect(truncateText('Hello\tWorld', 8)).toBe('Hello\tWo...')
      })
    })

    describe('Boundary conditions', () => {
      it('should handle text exactly one character longer than limit', () => {
        expect(truncateText('12345', 4)).toBe('1234...')
      })

      it('should preserve text exactly at limit', () => {
        expect(truncateText('12345', 5)).toBe('12345')
      })

      it('should not truncate when length equals maxLength', () => {
        const text = 'a'.repeat(20)
        expect(truncateText(text, 20)).toBe(text)
      })
    })

    describe('Unicode handling', () => {
      it('should handle text with accented characters', () => {
        expect(truncateText('Café résumé', 6)).toBe('Café r...')
      })

      it('should handle text with various unicode characters', () => {
        expect(truncateText('Hello™ ©2024', 8)).toBe('Hello™ ©...')
      })
    })
  })
})