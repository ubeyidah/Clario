
import Wrapper from '@/components/common/wrapper'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-16">
      <Wrapper className="rounded-3xl border px-6 py-12 md:py-20 lg:py-32">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Start Learning with Clario
          </h2>
          <p className="mt-4">
            Join thousands of learners and instructors in a modern, seamless platform.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg">
              <Link href="/sign-in">
                <span>Get Started Now</span>
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline">
              <Link href="/courses">
                <span>Explore Courses</span>
              </Link>
            </Button>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}
