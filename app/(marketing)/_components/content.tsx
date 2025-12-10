import Wrapper from '@/components/common/wrapper'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ContentSection() {
  return (
    <section className="py-16 md:py-28">
      <Wrapper className="space-y-8 px-6 md:space-y-12">
        <Image
          className="rounded-(--radius) grayscale w-full"
          src="/photo-learn.avif" alt="learning image"
          height="400"
          width="400"
          loading="lazy"
        />

        <div className="grid gap-6 md:grid-cols-2 md:gap-12">
          <h2 className="text-4xl font-medium">
            Clario brings courses, tools, and learners together in one platform.
          </h2>
          <div className="space-y-6">
            <p>
              Clario is more than just a course platform. It provides smart tracking, seamless integrations, and a clean interface to help instructors teach and students learn effectively.
            </p>

            <Button
              asChild
              variant="secondary"
              size="sm"
              className="gap-1 pr-1.5">
              <Link href="/about">
                <span>Learn More</span>
                <ChevronRight className="size-2" />
              </Link>
            </Button>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}
