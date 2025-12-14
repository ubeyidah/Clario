import { badgeClasses, courseStatusToVariant } from '@/lib/badge'
import { CourseStatus } from '@/lib/generated/prisma/enums'

describe('Badge utilities', () => {
  describe('badgeClasses', () => {
    it('should return base classes with neutral variant by default', () => {
      const result = badgeClasses()
      expect(result).toContain('text-xs')
      expect(result).toContain('uppercase')
      expect(result).toContain('px-2')
      expect(result).toContain('py-1')
      expect(result).toContain('rounded-md')
      expect(result).toContain('font-medium')
      expect(result).toContain('text-zinc-600')
      expect(result).toContain('bg-zinc-800/20')
    })

    it('should apply success variant classes', () => {
      const result = badgeClasses('success')
      expect(result).toContain('text-green-600')
      expect(result).toContain('bg-green-800/20')
    })

    it('should apply warning variant classes', () => {
      const result = badgeClasses('warning')
      expect(result).toContain('text-yellow-600')
      expect(result).toContain('bg-yellow-800/20')
    })

    it('should apply error variant classes', () => {
      const result = badgeClasses('error')
      expect(result).toContain('text-red-600')
      expect(result).toContain('bg-red-800/20')
    })

    it('should apply info variant classes', () => {
      const result = badgeClasses('info')
      expect(result).toContain('text-blue-600')
      expect(result).toContain('bg-blue-800/20')
    })

    it('should apply neutral variant classes explicitly', () => {
      const result = badgeClasses('neutral')
      expect(result).toContain('text-zinc-600')
      expect(result).toContain('bg-zinc-800/20')
    })

    it('should merge custom className', () => {
      const result = badgeClasses('success', 'custom-class')
      expect(result).toContain('custom-class')
      expect(result).toContain('text-green-600')
    })

    it('should handle multiple custom classes', () => {
      const result = badgeClasses('warning', 'class1 class2')
      expect(result).toContain('class1')
      expect(result).toContain('class2')
      expect(result).toContain('text-yellow-600')
    })

    it('should allow custom className to override default classes', () => {
      const result = badgeClasses('success', 'text-purple-500')
      // When using cn/twMerge, later classes override earlier ones
      expect(result).toContain('text-purple-500')
    })

    it('should maintain all base classes regardless of variant', () => {
      const variants: Array<'success' | 'warning' | 'error' | 'info' | 'neutral'> = [
        'success', 'warning', 'error', 'info', 'neutral'
      ]

      variants.forEach(variant => {
        const result = badgeClasses(variant)
        expect(result).toContain('text-xs')
        expect(result).toContain('uppercase')
        expect(result).toContain('px-2')
        expect(result).toContain('py-1')
        expect(result).toContain('rounded-md')
        expect(result).toContain('font-medium')
      })
    })
  })

  describe('courseStatusToVariant', () => {
    it('should map Draft status to info variant', () => {
      expect(courseStatusToVariant(CourseStatus.Draft)).toBe('info')
    })

    it('should map Published status to success variant', () => {
      expect(courseStatusToVariant(CourseStatus.Published)).toBe('success')
    })

    it('should map Archived status to warning variant', () => {
      expect(courseStatusToVariant(CourseStatus.Archived)).toBe('warning')
    })

    it('should handle all CourseStatus enum values', () => {
      const statuses = Object.values(CourseStatus)
      statuses.forEach(status => {
        const variant = courseStatusToVariant(status)
        expect(['success', 'warning', 'error', 'info', 'neutral']).toContain(variant)
      })
    })

    it('should return consistent mappings', () => {
      expect(courseStatusToVariant(CourseStatus.Draft)).toBe(courseStatusToVariant(CourseStatus.Draft))
      expect(courseStatusToVariant(CourseStatus.Published)).toBe(courseStatusToVariant(CourseStatus.Published))
      expect(courseStatusToVariant(CourseStatus.Archived)).toBe(courseStatusToVariant(CourseStatus.Archived))
    })
  })

  describe('Integration', () => {
    it('should work together to generate badge classes for course status', () => {
      const draftClasses = badgeClasses(courseStatusToVariant(CourseStatus.Draft))
      expect(draftClasses).toContain('text-blue-600')
      expect(draftClasses).toContain('bg-blue-800/20')

      const publishedClasses = badgeClasses(courseStatusToVariant(CourseStatus.Published))
      expect(publishedClasses).toContain('text-green-600')
      expect(publishedClasses).toContain('bg-green-800/20')

      const archivedClasses = badgeClasses(courseStatusToVariant(CourseStatus.Archived))
      expect(archivedClasses).toContain('text-yellow-600')
      expect(archivedClasses).toContain('bg-yellow-800/20')
    })

    it('should support custom classes with course status', () => {
      const classes = badgeClasses(
        courseStatusToVariant(CourseStatus.Published),
        'ml-2 font-bold'
      )
      expect(classes).toContain('ml-2')
      expect(classes).toContain('font-bold')
      expect(classes).toContain('text-green-600')
    })
  })
})