export const testPortfolioData = {
  site: {
    name: 'Test Portfolio',
    domain: 'https://example.com',
    repository: 'https://github.com/example/portfolio',
    footerNote: 'Built from test data.',
    showVersion: true,
    builtWith: [
      { label: 'React', href: 'https://react.dev' },
      { label: 'Vite', href: 'https://vitejs.dev' },
      { label: 'Material Design 3', href: 'https://mui.com' },
    ],
    seo: {
      description: 'Test portfolio description.',
      topics: ['Testing'],
      technologyStack: ['Frontend: React, Vite'],
      pages: ['/'],
    },
  },
  profile: {
    name: 'Test User',
    title: 'Test Engineer',
    tagline: 'Builds testable systems.',
    image: {
      src: 'https://example.com/avatar.png',
      alt: 'Test User',
    },
    hero: {
      eyebrow: 'Hi, my name is',
      subtitle: 'I test things.',
      cta: { label: 'Check out my work!', href: '#experience' },
    },
  },
  sections: [
    { id: 'home', navLabel: 'Home' },
    { id: 'experience', number: '02.', title: "Where I've Worked", navLabel: 'Experience' },
    { id: 'projects', number: '03.', title: "Some Things I've Built", navLabel: 'Projects' },
    { id: 'education', number: '04.', title: 'Education', navLabel: 'Education' },
    { id: 'skills', number: '05.', title: 'Expertise', navLabel: 'Skills' },
    { id: 'contact', number: '06.', kicker: "What's Next?", title: 'Get In Touch', navLabel: 'Contact' },
  ],
  contact: {
    email: 'test@example.com',
    intro: 'Test contact intro.',
    directLabel: 'contact me directly at',
    form: {
      enabled: true,
      sendOtpUrl: '/api/send-otp',
      verifyOtpUrl: '/api/verify-otp',
      otpLength: 7,
      otpDurationSeconds: 300,
      resendCooldownSeconds: 30,
      disabledMessage: 'Contact form is hidden due to technical reasons.',
      fields: {
        name: { label: 'Name', placeholder: 'Your name', maxLength: 64 },
        email: { label: 'Email', placeholder: 'Your email', maxLength: 128 },
        message: { label: 'Message', placeholder: 'How can I help?', maxLength: 1000 },
      },
      labels: {
        send: 'Send Message',
        sending: 'Sending code...',
        verify: 'Verify & Send',
        verifying: 'Verifying...',
        edit: 'Edit form',
        resend: 'Resend code',
        emailVerification: 'Email Verification',
        verificationCode: 'Verification Code',
        codeExpiresIn: 'Code expires in',
        successTitle: 'Message Sent!',
        successMessage: "Thank you for reaching out. I'll get back to you soon.",
      },
    },
  },
  socials: [
    { type: 'github', label: 'GitHub', href: 'https://github.com/example' },
    { type: 'instagram', label: 'Instagram', href: 'https://instagram.com/example' },
    { type: 'discord', label: 'Discord', handle: 'example' },
  ],
  resume: {
    buttonLabel: 'Resume',
    loadingLabel: 'Loading...',
    documentTitle: 'Test User resume',
    excludedSkillLabels: ['Working in High Stress Environments'],
  },
  features: {
    snowflake: {
      enabled: true,
      preload: true,
      title: 'Snowflake',
      iframeTitle: 'Snowflake (Tor Project)',
      widgetUrl: 'https://snowflake.torproject.org/embed.html',
      siteUrl: 'https://snowflake.torproject.org/',
      openLabel: 'Open Snowflake widget',
      closeLabel: 'Close Snowflake widget',
      tooltip: 'Anti-censorship: open Snowflake widget',
      websiteLabel: 'Open Snowflake website',
      description: 'Keep this tab open to help others bypass censorship.',
    },
  },
  integrations: {},
  about: {
    description: ['About test user.'],
  },
  experience: [
    {
      title: 'Software Engineer',
      company: 'Tech Corp',
      period: '2020 - Present',
      responsibilities: ['Developed features', 'Fixed bugs'],
    },
  ],
  education: [
    {
      title: 'Bachelor of Science',
      institution: 'University of Technology',
      period: '2016 - 2020',
      description: 'Major in Computer Science',
    },
  ],
  skills: [
    {
      category: 'Languages',
      items: [{ label: 'JavaScript' }, { label: 'Python' }],
    },
    {
      category: 'Frameworks',
      items: [
        { label: 'React' },
        { label: 'Next.js', action: { type: 'link', href: 'https://binlookup.l7feeders.dev/' } },
      ],
    },
    {
      category: 'Tools & Platforms',
      items: [
        { label: 'Git', action: { type: 'link', href: 'https://github.com/KmTempe/portfolio-react' } },
        { label: 'Docker' },
      ],
    },
  ],
  projects: [
    {
      title: 'Project 1',
      description: 'Description 1',
      link: 'https://example.com/1',
    },
    {
      title: 'Project 2',
      description: 'Description 2',
    },
  ],
};

export function getTestSection(sectionId) {
  return testPortfolioData.sections.find((section) => section.id === sectionId) || {};
}
