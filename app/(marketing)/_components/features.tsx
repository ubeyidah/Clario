import Wrapper from '@/components/common/wrapper'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'
import { BarChart2, Monitor, Layers } from "lucide-react";

export const CLARIO_FEATURES = [
  {
    title: "Smart Progress Tracking",
    icon: BarChart2,
    description:
      "Track lessons, quizzes, and certificates in one place  always synced and easy to follow.",
  },
  {
    title: "A Learning Space Made for Focus",
    icon: Monitor,
    description:
      "A clean, distraction-free interface that helps students stay consistent and fully engaged.",
  },
  {
    title: "Tools That Make Learning Smooth",
    icon: Layers,
    description:
      "Fast navigation, quick shortcuts, and a modern design that keeps everything simple and intuitive.",
  },

] as const;
export default function Features() {
  return (
    <section className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Designed for modern education</h2>
          <p className="mt-4">Modern tools that simplify teaching, guiding learners with clarity and confidence.</p>
        </div>
        <div className="lg:grid-cols-3 mx-auto mt-8 grid gap-6 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          {
            CLARIO_FEATURES.map((feature) => (
              <Card className="group border-0 shadow-none bg-transparent" key={feature.title}>
                <CardHeader className="pb-3">
                  <CardDecorator>
                    <feature.icon
                      className="size-6"
                      aria-hidden
                    />
                  </CardDecorator>

                  <h3 className="mt-6 font-medium">{feature.title}</h3>
                </CardHeader>

                <CardContent className='-mt-7'>
                  <p className="text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))
          }
        </div>
      </Wrapper>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
)
