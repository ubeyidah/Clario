import Wrapper from '@/components/common/wrapper'
import { Button } from '@/components/ui/button'
import { BookOpen, Target, Users } from 'lucide-react'

export default function AboutHero() {
  return (
    <>
      <div
        aria-hidden
        className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block">
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

      <section className="overflow-hidden">
        <Wrapper className="px-6 pt-28 lg:pt-24">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl">Building the Future of Learning</h1>
            <p className="text-muted-foreground mx-auto my-8 max-w-2xl text-xl">We believe education should be clear, focused, and empowering for everyone involved. Clario is our answer to modern learning challenges.</p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="#mission">Our Mission</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#solution">What We Do</a>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <BookOpen className="size-8 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Clear Learning</h3>
              <p className="text-muted-foreground mt-2 text-sm">Distraction-free environment designed for focus and retention</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <Target className="size-8 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Real Growth</h3>
              <p className="text-muted-foreground mt-2 text-sm">Track progress and celebrate achievements along your learning journey</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <Users className="size-8 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Simple Discovery</h3>
              <p className="text-muted-foreground mt-2 text-sm">Find the right courses and connect with instructors effortlessly</p>
            </div>
          </div>
        </Wrapper>
      </section>
    </>
  )
}