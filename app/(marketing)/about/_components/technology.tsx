import Wrapper from '@/components/common/wrapper'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Code, Lock, Globe, Sparkles } from 'lucide-react'

export default function TechnologySection() {
  const techStack = [
    "Next.js 16",
    "React 19", 
    "TypeScript",
    "Tailwind CSS",
    "Prisma",
    "PostgreSQL"
  ]

  const values = [
    {
      icon: Code,
      title: "Modern Architecture",
      description: "Built with cutting-edge technology that ensures performance, scalability, and maintainability for years to come."
    },
    {
      icon: Lock,
      title: "Security First",
      description: "Enterprise-grade security with end-to-end encryption, regular audits, and compliance with data protection standards."
    },
    {
      icon: Globe,
      title: "Accessibility Always",
      description: "Designed for everyone with WCAG 2.1 compliance, keyboard navigation, and screen reader support."
    },
    {
      icon: Sparkles,
      title: "Performance Obsessed",
      description: "Lightning-fast load times, optimized assets, and a seamless experience across all devices and connections."
    }
  ]

  return (
    <section className="py-16 md:py-32">
      <Wrapper className="px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built with Purpose</h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
              Our technology choices reflect our commitment to excellence, security, and user experience.
            </p>
          </div>

          <div className="mt-16">
            <div className="text-center">
              <h3 className="text-2xl font-semibold">Our Technology Stack</h3>
              <p className="text-muted-foreground mt-2">
                Powered by modern tools that deliver exceptional performance and reliability.
              </p>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <Card key={index} className="border-0 bg-muted/30 shadow-none">
                <CardContent className="p-8">
                  <div className="bg-primary/10 flex size-12 items-center justify-center rounded-lg">
                    <value.icon className="size-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground mt-2">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-primary/5 p-8 text-center">
            <h3 className="text-2xl font-semibold">Open to Feedback</h3>
            <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
              We're constantly improving based on user feedback and emerging technologies. 
              Clario evolves with the needs of our learning community.
            </p>
          </div>
        </div>
      </Wrapper>
    </section>
  )
}