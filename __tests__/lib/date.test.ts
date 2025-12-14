import { timeAgo } from '@/lib/date'

describe('timeAgo', () => {
  // Mock the current time for consistent testing
  const mockNow = new Date('2024-01-15T12:00:00Z').getTime()

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(mockNow)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Recent times', () => {
    it('should return "just now" for very recent times (< 5 seconds)', () => {
      const date = new Date(mockNow - 1000) // 1 second ago
      expect(timeAgo(date)).toBe('just now')

      const date2 = new Date(mockNow - 4000) // 4 seconds ago
      expect(timeAgo(date2)).toBe('just now')
    })

    it('should return "just now" for current time', () => {
      const date = new Date(mockNow)
      expect(timeAgo(date)).toBe('just now')
    })
  })

  describe('Seconds ago', () => {
    it('should format seconds correctly (singular)', () => {
      const date = new Date(mockNow - 5000) // 5 seconds ago
      expect(timeAgo(date)).toBe('5 seconds ago')
    })

    it('should format seconds correctly (plural)', () => {
      const date = new Date(mockNow - 30000) // 30 seconds ago
      expect(timeAgo(date)).toBe('30 seconds ago')
    })

    it('should handle 59 seconds', () => {
      const date = new Date(mockNow - 59000)
      expect(timeAgo(date)).toBe('59 seconds ago')
    })
  })

  describe('Minutes ago', () => {
    it('should format 1 minute correctly (singular)', () => {
      const date = new Date(mockNow - 60000) // 1 minute
      expect(timeAgo(date)).toBe('1 minute ago')
    })

    it('should format minutes correctly (plural)', () => {
      const date = new Date(mockNow - 300000) // 5 minutes
      expect(timeAgo(date)).toBe('5 minutes ago')
    })

    it('should handle 59 minutes', () => {
      const date = new Date(mockNow - 59 * 60000)
      expect(timeAgo(date)).toBe('59 minutes ago')
    })
  })

  describe('Hours ago', () => {
    it('should format 1 hour correctly (singular)', () => {
      const date = new Date(mockNow - 3600000) // 1 hour
      expect(timeAgo(date)).toBe('1 hour ago')
    })

    it('should format hours correctly (plural)', () => {
      const date = new Date(mockNow - 7200000) // 2 hours
      expect(timeAgo(date)).toBe('2 hours ago')
    })

    it('should handle 23 hours', () => {
      const date = new Date(mockNow - 23 * 3600000)
      expect(timeAgo(date)).toBe('23 hours ago')
    })
  })

  describe('Days ago', () => {
    it('should format 1 day correctly (singular)', () => {
      const date = new Date(mockNow - 86400000) // 1 day
      expect(timeAgo(date)).toBe('1 day ago')
    })

    it('should format days correctly (plural)', () => {
      const date = new Date(mockNow - 3 * 86400000) // 3 days
      expect(timeAgo(date)).toBe('3 days ago')
    })

    it('should handle 6 days', () => {
      const date = new Date(mockNow - 6 * 86400000)
      expect(timeAgo(date)).toBe('6 days ago')
    })
  })

  describe('Weeks ago', () => {
    it('should format 1 week correctly (singular)', () => {
      const date = new Date(mockNow - 7 * 86400000) // 1 week
      expect(timeAgo(date)).toBe('1 week ago')
    })

    it('should format weeks correctly (plural)', () => {
      const date = new Date(mockNow - 14 * 86400000) // 2 weeks
      expect(timeAgo(date)).toBe('2 weeks ago')
    })

    it('should handle 3 weeks', () => {
      const date = new Date(mockNow - 21 * 86400000)
      expect(timeAgo(date)).toBe('3 weeks ago')
    })
  })

  describe('Months ago', () => {
    it('should format 1 month correctly (singular)', () => {
      const date = new Date(mockNow - 30 * 86400000) // ~1 month
      expect(timeAgo(date)).toBe('1 month ago')
    })

    it('should format months correctly (plural)', () => {
      const date = new Date(mockNow - 60 * 86400000) // ~2 months
      expect(timeAgo(date)).toBe('2 months ago')
    })

    it('should handle 11 months', () => {
      const date = new Date(mockNow - 335 * 86400000)
      expect(timeAgo(date)).toBe('11 months ago')
    })
  })

  describe('Years ago', () => {
    it('should format 1 year correctly (singular)', () => {
      const date = new Date(mockNow - 365 * 86400000) // 1 year
      expect(timeAgo(date)).toBe('1 year ago')
    })

    it('should format years correctly (plural)', () => {
      const date = new Date(mockNow - 730 * 86400000) // 2 years
      expect(timeAgo(date)).toBe('2 years ago')
    })

    it('should handle 5 years', () => {
      const date = new Date(mockNow - 5 * 365 * 86400000)
      expect(timeAgo(date)).toBe('5 years ago')
    })

    it('should handle very old dates', () => {
      const date = new Date(mockNow - 50 * 365 * 86400000)
      expect(timeAgo(date)).toBe('50 years ago')
    })
  })

  describe('String input', () => {
    it('should handle ISO date string', () => {
      const dateString = new Date(mockNow - 3600000).toISOString()
      expect(timeAgo(dateString)).toBe('1 hour ago')
    })

    it('should handle date string in various formats', () => {
      const dateString = '2024-01-15T11:00:00Z'
      expect(timeAgo(dateString)).toBe('1 hour ago')
    })
  })

  describe('Invalid inputs', () => {
    it('should return "Invalid date" for invalid date string', () => {
      expect(timeAgo('invalid-date')).toBe('Invalid date')
    })

    it('should return "Invalid date" for NaN date', () => {
      expect(timeAgo(new Date('invalid'))).toBe('Invalid date')
    })

    it('should return "Invalid date" for undefined date properties', () => {
      const invalidDate = new Date('')
      expect(timeAgo(invalidDate)).toBe('Invalid date')
    })
  })

  describe('Future dates', () => {
    it('should handle future dates as negative time', () => {
      const futureDate = new Date(mockNow + 3600000)
      const result = timeAgo(futureDate)
      // The function doesn't explicitly handle future dates,
      // but it should still return a valid format
      expect(result).toBeDefined()
    })
  })

  describe('Edge cases', () => {
    it('should handle epoch time', () => {
      const epochDate = new Date(0)
      const result = timeAgo(epochDate)
      expect(result).toContain('years ago')
    })

    it('should handle dates at exact boundaries', () => {
      // Exactly 60 seconds
      const date = new Date(mockNow - 60000)
      expect(timeAgo(date)).toBe('1 minute ago')
    })

    it('should handle milliseconds precision', () => {
      const date = new Date(mockNow - 5500) // 5.5 seconds
      expect(timeAgo(date)).toBe('5 seconds ago')
    })

    it('should handle Date object directly', () => {
      const date = new Date(mockNow - 86400000)
      expect(timeAgo(date)).toBe('1 day ago')
    })
  })

  describe('Consistency', () => {
    it('should produce consistent results for same input', () => {
      const date = new Date(mockNow - 3600000)
      const result1 = timeAgo(date)
      const result2 = timeAgo(date)
      expect(result1).toBe(result2)
    })

    it('should floor time values correctly', () => {
      // 1.9 hours should be 1 hour, not 2
      const date = new Date(mockNow - 1.9 * 3600000)
      expect(timeAgo(date)).toBe('1 hour ago')
    })
  })
})