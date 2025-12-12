import Wrapper from '@/components/common/wrapper'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ReactNode } from 'react'
import { Eye, TrendingUp, Zap, Shield } from 'lucide-react'

export const SOLUTION_PILLARS = [
  {
    title: "Simplicity First",
    icon: Eye,
    description: "Clean, distraction-free learning environment designed for focus and retention. Every element serves a purpose.",
    features: [
      "Minimalist interface design",
      "Intuitive navigation patterns", 
      "Focus mode for deep learning",
      "Mobile-optimized experience"
    ]
  },
  {
    title: "Smart Progress",
    icon: TrendingUp,
    description: "Comprehensive tracking and insights for both students and instructors to measure and celebrate learning achievements.",
    features: [
      "Real-time progress dashboards",
      "Achievement badges and certificates",
      "Detailed analytics for instructors",
      "Personalized learning paths"
    ]
  },
  {
    title: "Modern Tools",
    icon: Zap,
    description: "Built with today's learners in mind, featuring fast performance, seamless integrations, and intelligent automation.",
    features: [
      "Lightning-fast page loads",
      "Smart content recommendations",
      "Automated grading and feedback",
      "Seamless third-party integrations"
    ]
  },
  {
    title: "Seamless Experience",
    icon: Shield,
    description: "From course creation to completion, every step is designed to be smooth, secure, and supportive of learning goals.",
    features: [
      "Unified course management",
      "Secure payment processing",
      "24/7 platform reliability",
      "Dedicated support team"
    ]
  }
] as const;

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px] dark:opacity-50"
    />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
  </div>
)

export default function SolutionSection() {
  return (
    <section id="solution" className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">A Better Way to Learn</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our platform is built around four core pillars that address the biggest challenges in online education.
          </p>
        </div>

        <div className="lg:grid-cols-2 mx-auto mt-8 grid gap-8 [--color-background:var(--color-muted)] [--color-card:var(--color-muted)] *:text-center md:mt-16 dark:[--color-muted:var(--color-zinc-900)]">
          {SOLUTION_PILLARS.map((pillar) => (
            <Card className="group border-0 shadow-none bg-transparent" key={pillar.title}>
              <CardHeader className="pb-3">
                <CardDecorator>
                  <pillar.icon
                    className="size-6"
                    aria-hidden
                  />
                </CardDecorator>

                <h3 className="mt-6 font-medium text-xl">{pillar.title}</h3>
              </CardHeader>

              <CardContent className='-mt-7'>
                <p className="text-muted-foreground text-sm mb-6">{pillar.description}</p>
                <ul className="text-left space-y-2">
                  {pillar.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm">
                      <div className="bg-primary/10 flex size-1.5 rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Wrapper>
    </section>
  )
}