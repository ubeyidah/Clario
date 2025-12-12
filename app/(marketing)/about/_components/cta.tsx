import Wrapper from '@/components/common/wrapper'
import { Button } from '@/components/ui/button'
import { ArrowRight, GraduationCap, Users } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-primary/5 rounded-3xl p-12 md:p-16">
            <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-primary text-white">
              <GraduationCap className="size-10" />
            </div>
            
            <h2 className="text-balance mt-8 text-4xl font-semibold lg:text-5xl">
              Join the Learning Revolution
            </h2>
            
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg">
              Whether you're here to learn new skills or share your knowledge with others, 
              Clario provides the tools and community you need to succeed.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/sign-in">
                  Get Started Now
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" className="gap-2" asChild>
                <Link href="/courses">
                  <Users className="size-4" />
                  Explore Courses
                </Link>
              </Button>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <p className="text-muted-foreground mt-1 text-sm">Active Learners</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">500+</div>
                <p className="text-muted-foreground mt-1 text-sm">Expert Instructors</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">98%</div>
                <p className="text-muted-foreground mt-1 text-sm">Satisfaction Rate</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <p className="text-muted-foreground text-sm">
              Ready to transform your learning experience? 
              <Link href="/sign-in" className="text-primary ml-1 hover:underline">
                Start your journey today →
              </Link>
            </p>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}