import Wrapper from '@/components/common/wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Lightbulb, Rocket } from 'lucide-react'

export default function MissionSection() {
  return (
    <section id="mission" className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Our Mission</h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
            We&apos;re on a mission to transform education through technology that puts learning first, not complexity.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <Card className="border-0 bg-muted/30 shadow-none">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <Heart className="size-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Empower Learners</h3>
              <p className="text-muted-foreground mt-3">
                We believe everyone deserves access to quality education that adapts to their learning style and pace.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/30 shadow-none">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <Lightbulb className="size-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Simplify Teaching</h3>
              <p className="text-muted-foreground mt-3">
                We provide instructors with intuitive tools that let them focus on what matters most: sharing knowledge.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 bg-muted/30 shadow-none">
            <CardContent className="p-8 text-center">
              <div className="bg-primary/10 mx-auto flex size-16 items-center justify-center rounded-full">
                <Rocket className="size-8 text-primary" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">Drive Innovation</h3>
              <p className="text-muted-foreground mt-3">
                We&apos;re constantly pushing the boundaries of what&apos;s possible in online education, one feature at a time.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <blockquote className="text-muted-foreground mx-auto max-w-3xl text-lg italic">
            &quot;Education is not the filling of a pail, but the lighting of a fire. We&apos;re here to provide the match.&quot;
          </blockquote>
          <p className="text-muted-foreground mt-4 text-sm">— Our guiding principle</p>
        </div>
      </Wrapper>
    </section>
  )
}
