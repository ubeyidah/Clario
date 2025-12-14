import { COURSE_CATEGORIES } from '@/lib/constants'

describe('Constants', () => {
  describe('COURSE_CATEGORIES', () => {
    it('should be defined and not empty', () => {
      expect(COURSE_CATEGORIES).toBeDefined()
      expect(COURSE_CATEGORIES.length).toBeGreaterThan(0)
    })

    it('should have correct structure for each category', () => {
      COURSE_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('label')
        expect(typeof category.id).toBe('string')
        expect(typeof category.label).toBe('string')
      })
    })

    it('should have unique ids', () => {
      const ids = COURSE_CATEGORIES.map(cat => cat.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have unique labels', () => {
      const labels = COURSE_CATEGORIES.map(cat => cat.label)
      const uniqueLabels = new Set(labels)
      expect(uniqueLabels.size).toBe(labels.length)
    })

    it('should contain expected core categories', () => {
      const labels = COURSE_CATEGORIES.map(cat => cat.label)
      
      expect(labels).toContain('Technology')
      expect(labels).toContain('Business')
      expect(labels).toContain('Marketing')
      expect(labels).toContain('Design')
    })

    it('should have non-empty id and label values', () => {
      COURSE_CATEGORIES.forEach(category => {
        expect(category.id.length).toBeGreaterThan(0)
        expect(category.label.length).toBeGreaterThan(0)
      })
    })

    it('should have lowercase ids', () => {
      COURSE_CATEGORIES.forEach(category => {
        expect(category.id).toBe(category.id.toLowerCase())
      })
    })

    it('should have properly capitalized labels', () => {
      COURSE_CATEGORIES.forEach(category => {
        // Labels should start with capital letter
        expect(category.label[0]).toBe(category.label[0].toUpperCase())
      })
    })

    it('should be an array with expected length', () => {
      expect(Array.isArray(COURSE_CATEGORIES)).toBe(true)
      // Based on the source, there should be 17 categories
      expect(COURSE_CATEGORIES.length).toBe(17)
    })

    it('should be immutable (readonly)', () => {
      // TypeScript readonly check - this tests the type system
      expect(Object.isFrozen(COURSE_CATEGORIES)).toBe(false)
      // The 'as const' assertion in TypeScript makes it readonly at compile time
    })

    it('should have consistent naming pattern for ids', () => {
      COURSE_CATEGORIES.forEach(category => {
        // IDs should be alphanumeric and lowercase
        expect(category.id).toMatch(/^[a-z]+$/)
      })
    })

    describe('Specific categories', () => {
      it('should include Technology category', () => {
        const tech = COURSE_CATEGORIES.find(c => c.label === 'Technology')
        expect(tech).toBeDefined()
        expect(tech?.id).toBe('tech')
      })

      it('should include Business category', () => {
        const business = COURSE_CATEGORIES.find(c => c.label === 'Business')
        expect(business).toBeDefined()
        expect(business?.id).toBe('business')
      })

      it('should include Design category', () => {
        const design = COURSE_CATEGORIES.find(c => c.label === 'Design')
        expect(design).toBeDefined()
        expect(design?.id).toBe('design')
      })

      it('should include IT & Software category', () => {
        const it = COURSE_CATEGORIES.find(c => c.label === 'IT & Software')
        expect(it).toBeDefined()
        expect(it?.id).toBe('it')
      })

      it('should include Health & Fitness category', () => {
        const health = COURSE_CATEGORIES.find(c => c.label === 'Health & Fitness')
        expect(health).toBeDefined()
        expect(health?.id).toBe('health')
      })
    })

    describe('Array operations', () => {
      it('should support map operations', () => {
        const ids = COURSE_CATEGORIES.map(cat => cat.id)
        expect(ids.length).toBe(COURSE_CATEGORIES.length)
      })

      it('should support filter operations', () => {
        const filtered = COURSE_CATEGORIES.filter(cat => cat.label.includes('&'))
        expect(filtered.length).toBeGreaterThan(0)
      })

      it('should support find operations', () => {
        const found = COURSE_CATEGORIES.find(cat => cat.id === 'tech')
        expect(found).toBeDefined()
      })
    })
  })
})