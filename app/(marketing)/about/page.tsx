import { Metadata } from 'next'
import AboutHero from './_components/about-hero'
import MissionSection from './_components/mission'
import ProblemSection from './_components/problem'
import SolutionSection from './_components/solution'
import TechnologySection from './_components/technology'
import CTASection from './_components/cta'

export const metadata: Metadata = {
  title: 'About Clario - Modern Learning Platform',
  description: 'Learn about Clario\'s mission to provide clear, focused learning experiences for students and instructors. Discover our approach to modern education.',
  openGraph: {
    title: 'About Clario - Modern Learning Platform',
    description: 'Learn about Clario\'s mission to provide clear, focused learning experiences for students and instructors.',
    type: 'website',
  },
}

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <MissionSection />
      <ProblemSection />
      <SolutionSection />
      <TechnologySection />
      <CTASection />
    </main>
  )
}