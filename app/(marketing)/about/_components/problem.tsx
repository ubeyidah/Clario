import Wrapper from '@/components/common/wrapper'
import { AlertTriangle, Clock, Layout, Users } from 'lucide-react'

export default function ProblemSection() {
  const problems = [
    {
      icon: Layout,
      title: "Cluttered Interfaces",
      description: "Most learning platforms overwhelm users with complex navigation and distracting elements that pull focus away from actual learning."
    },
    {
      icon: Clock,
      title: "Poor Progress Tracking",
      description: "Students struggle to see their real progress, while instructors lack meaningful insights into learner engagement and completion rates."
    },
    {
      icon: Users,
      title: "Fragmented Experience",
      description: "Course creation, student management, and learning activities often live in separate systems, creating disjointed experiences for everyone."
    },
    {
      icon: AlertTriangle,
      title: "Outdated Technology",
      description: "Many platforms are built on legacy technology that's slow, inaccessible, and doesn't meet the expectations of modern learners."
    }
  ]

  return (
    <section className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Why Clario Exists</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              We saw the problems holding online education back and decided to build something better.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {problems.map((problem, index) => (
              <div key={index} className="flex gap-4">
                <div className="bg-destructive/10 flex size-12 shrink-0 items-center justify-center rounded-lg">
                  <problem.icon className="size-6 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{problem.title}</h3>
                  <p className="text-muted-foreground mt-2">{problem.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-muted/30 p-8 text-center">
            <h3 className="text-2xl font-semibold">The Cost of Poor Learning Experiences</h3>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              When learning platforms fail, students lose motivation, instructors waste time on administrative tasks, 
              and organizations struggle to achieve their educational goals. We're here to change that.
            </p>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}