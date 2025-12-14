import { courseSchema, fileUploadSchema, fileDeleteSchema, COURSE_CATEGORIES_ENUM } from '@/lib/zod-validation'
import { CourseLevel, CourseStatus } from '@/lib/generated/prisma/enums'

describe('Zod Validation Schemas', () => {
  describe('COURSE_CATEGORIES_ENUM', () => {
    it('should export array of course category labels', () => {
      expect(Array.isArray(COURSE_CATEGORIES_ENUM)).toBe(true)
      expect(COURSE_CATEGORIES_ENUM.length).toBeGreaterThan(0)
    })

    it('should contain expected categories', () => {
      expect(COURSE_CATEGORIES_ENUM).toContain('Technology')
      expect(COURSE_CATEGORIES_ENUM).toContain('Business')
      expect(COURSE_CATEGORIES_ENUM).toContain('Design')
    })
  })

  describe('courseSchema', () => {
    const validCourse = {
      title: 'Introduction to Programming',
      description: 'Learn programming basics with this comprehensive course',
      price: 99.99,
      duration: 10.5,
      level: CourseLevel.Beginner,
      category: 'Technology',
      shortDescription: 'A great course for beginners',
      slug: 'intro-to-programming',
      status: CourseStatus.Draft,
      fileKey: 'abc-123-thumbnail.jpg'
    }

    describe('Valid inputs', () => {
      it('should validate correct course data', () => {
        const result = courseSchema.safeParse(validCourse)
        expect(result.success).toBe(true)
      })

      it('should accept minimum valid title length', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          title: '12345' // exactly 5 characters
        })
        expect(result.success).toBe(true)
      })

      it('should accept maximum valid title length', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          title: 'a'.repeat(100) // exactly 100 characters
        })
        expect(result.success).toBe(true)
      })

      it('should accept minimum valid description length', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          description: '123456' // exactly 6 characters
        })
        expect(result.success).toBe(true)
      })

      it('should accept minimum price', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          price: 1
        })
        expect(result.success).toBe(true)
      })

      it('should accept minimum duration', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          duration: 0.1
        })
        expect(result.success).toBe(true)
      })

      it('should accept maximum duration', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          duration: 500
        })
        expect(result.success).toBe(true)
      })

      it('should coerce string numbers to numbers for price', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          price: '50'
        })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.price).toBe(50)
        }
      })

      it('should coerce string numbers to numbers for duration', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          duration: '20.5'
        })
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.duration).toBe(20.5)
        }
      })
    })

    describe('Title validation', () => {
      it('should reject title shorter than 5 characters', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          title: '1234'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 5 characters')
        }
      })

      it('should reject title longer than 100 characters', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          title: 'a'.repeat(101)
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('cannot exceed 100 characters')
        }
      })
    })

    describe('Description validation', () => {
      it('should reject description shorter than 6 characters', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          description: '12345'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 6 characters')
        }
      })
    })

    describe('Price validation', () => {
      it('should reject price less than 1', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          price: 0
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 1')
        }
      })

      it('should reject negative price', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          price: -10
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Duration validation', () => {
      it('should reject duration less than 0.1', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          duration: 0.09
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('at least 0.1 hour')
        }
      })

      it('should reject duration greater than 500', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          duration: 501
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('cannot exceed 500 hours')
        }
      })
    })

    describe('Level validation', () => {
      it('should accept valid CourseLevel enum values', () => {
        Object.values(CourseLevel).forEach(level => {
          const result = courseSchema.safeParse({
            ...validCourse,
            level
          })
          expect(result.success).toBe(true)
        })
      })

      it('should reject invalid level', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          level: 'InvalidLevel'
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Category validation', () => {
      it('should accept valid categories', () => {
        COURSE_CATEGORIES_ENUM.forEach(category => {
          const result = courseSchema.safeParse({
            ...validCourse,
            category
          })
          expect(result.success).toBe(true)
        })
      })

      it('should reject invalid category', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          category: 'InvalidCategory'
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Short description validation', () => {
      it('should accept minimum length', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          shortDescription: '123456'
        })
        expect(result.success).toBe(true)
      })

      it('should accept maximum length', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          shortDescription: 'a'.repeat(255)
        })
        expect(result.success).toBe(true)
      })

      it('should reject too short', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          shortDescription: '12345'
        })
        expect(result.success).toBe(false)
      })

      it('should reject too long', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          shortDescription: 'a'.repeat(256)
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Slug validation', () => {
      it('should accept valid slug', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          slug: 'valid-slug-123'
        })
        expect(result.success).toBe(true)
      })

      it('should reject slug shorter than 3 characters', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          slug: 'ab'
        })
        expect(result.success).toBe(false)
      })
    })

    describe('Status validation', () => {
      it('should accept valid CourseStatus enum values', () => {
        Object.values(CourseStatus).forEach(status => {
          const result = courseSchema.safeParse({
            ...validCourse,
            status
          })
          expect(result.success).toBe(true)
        })
      })

      it('should reject invalid status', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          status: 'InvalidStatus'
        })
        expect(result.success).toBe(false)
      })
    })

    describe('FileKey validation', () => {
      it('should accept valid file key', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          fileKey: 'valid-file-key-123.jpg'
        })
        expect(result.success).toBe(true)
      })

      it('should reject file key shorter than 3 characters', () => {
        const result = courseSchema.safeParse({
          ...validCourse,
          fileKey: 'ab'
        })
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toContain('thumbnail url is required')
        }
      })
    })

    describe('Missing fields', () => {
      it('should reject missing required fields', () => {
        const result = courseSchema.safeParse({})
        expect(result.success).toBe(false)
      })

      it('should reject when title is missing', () => {
        const { title, ...rest } = validCourse
        const result = courseSchema.safeParse(rest)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('fileUploadSchema', () => {
    const validFileUpload = {
      fileName: 'test-file.jpg',
      contentType: 'image/jpeg',
      size: 1024,
      isImage: true
    }

    describe('Valid inputs', () => {
      it('should validate correct file upload data', () => {
        const result = fileUploadSchema.safeParse(validFileUpload)
        expect(result.success).toBe(true)
      })

      it('should accept non-image files', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          isImage: false,
          contentType: 'application/pdf'
        })
        expect(result.success).toBe(true)
      })

      it('should accept minimum file size', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          size: 1
        })
        expect(result.success).toBe(true)
      })

      it('should accept large file size', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          size: 10000000
        })
        expect(result.success).toBe(true)
      })
    })

    describe('Invalid inputs', () => {
      it('should reject empty fileName', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          fileName: ''
        })
        expect(result.success).toBe(false)
      })

      it('should reject empty contentType', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          contentType: ''
        })
        expect(result.success).toBe(false)
      })

      it('should reject size less than 1', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          size: 0
        })
        expect(result.success).toBe(false)
      })

      it('should reject negative size', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          size: -100
        })
        expect(result.success).toBe(false)
      })

      it('should reject missing isImage', () => {
        const { isImage, ...rest } = validFileUpload
        const result = fileUploadSchema.safeParse(rest)
        expect(result.success).toBe(false)
      })

      it('should reject non-boolean isImage', () => {
        const result = fileUploadSchema.safeParse({
          ...validFileUpload,
          isImage: 'true'
        })
        expect(result.success).toBe(false)
      })
    })
  })

  describe('fileDeleteSchema', () => {
    describe('Valid inputs', () => {
      it('should validate correct file delete data', () => {
        const result = fileDeleteSchema.safeParse({
          key: 'file-key-123.jpg'
        })
        expect(result.success).toBe(true)
      })

      it('should accept long file keys', () => {
        const result = fileDeleteSchema.safeParse({
          key: 'very-long-file-key-with-uuid-' + 'a'.repeat(100)
        })
        expect(result.success).toBe(true)
      })
    })

    describe('Invalid inputs', () => {
      it('should reject empty key', () => {
        const result = fileDeleteSchema.safeParse({
          key: ''
        })
        expect(result.success).toBe(false)
      })

      it('should reject missing key', () => {
        const result = fileDeleteSchema.safeParse({})
        expect(result.success).toBe(false)
      })

      it('should reject null key', () => {
        const result = fileDeleteSchema.safeParse({
          key: null
        })
        expect(result.success).toBe(false)
      })

      it('should reject undefined key', () => {
        const result = fileDeleteSchema.safeParse({
          key: undefined
        })
        expect(result.success).toBe(false)
      })
    })
  })
})