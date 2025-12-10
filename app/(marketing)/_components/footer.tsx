import Wrapper from '@/components/common/wrapper'
import Image from 'next/image'
import Link from 'next/link'

const links = [
  {
    group: 'Platform',
    items: [
      { title: 'Courses', href: '/courses' },
      { title: 'Instructors', href: '/instructors' },
      { title: 'Learning Paths', href: '/paths' },
      { title: 'Support', href: '/support' },
      { title: 'Get Started', href: '/sign-in' },
    ],
  },
  {
    group: 'For Learners',
    items: [
      { title: 'My Dashboard', href: '#' },
      { title: 'Saved Courses', href: '#' },
      { title: 'Skill Tracker', href: '#' },
      { title: 'Certifications', href: '#' },
      { title: 'Mobile App', href: '#' },
    ],
  },
  {
    group: 'For Creators',
    items: [
      { title: 'Teach on Claro', href: '#' },
      { title: 'Creator Dashboard', href: '#' },
      { title: 'Course Builder', href: '#' },
      { title: 'Revenue Insights', href: '#' },
      { title: 'Community', href: '#' },
    ],
  },
  {
    group: 'Legal',
    items: [
      { title: 'Terms of Service', href: '#' },
      { title: 'Privacy Policy', href: '#' },
      { title: 'Cookie Policy', href: '#' },
      { title: 'Security', href: '#' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="bg-muted/50 pt-20 dark:bg-transparent">
      <Wrapper className="px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <Link href="/" aria-label="go home" className="block size-fit">
              <Image src="/clario.png" width={40} height={40} alt="clario" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Claro is a modern learning platform that helps you gain real skills and grow at your own pace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:col-span-3">
            {links.map((link, index) => (
              <div key={index} className="space-y-4 text-sm">
                <span className="block font-medium">{link.group}</span>
                {link.items.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className="text-muted-foreground hover:text-primary block duration-150"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t py-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()} Claro. All rights reserved.
          </span>

          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            <span className="text-muted-foreground">
              Built by{" "}
              <Link
                href="https://github.com/ubeyidah"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                Ubeyidah
              </Link>
            </span>
          </div>
        </div>
      </Wrapper>
    </footer>
  )
}
