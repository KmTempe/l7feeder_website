# portfolioData.js Schema

`portfolioData.js` is the content contract for the portfolio. Components should render this structure and avoid hardcoding personal content, links, section labels, feature text, or asset URLs.

## Top-Level Shape

```js
export const portfolioData = {
  site: {},
  profile: {},
  sections: [],
  contact: {},
  socials: [],
  resume: {},
  features: {},
  integrations: {},
  about: {},
  experience: [],
  education: [],
  skills: [],
  projects: [],
};
```

## `site`

Site-level metadata used by the footer, generated SEO files, and external references.

```js
site: {
  name: 'Portfolio display name',
  domain: 'https://example.com',
  repository: 'https://github.com/user/repo',
  footerNote: 'Short footer sentence',
  showVersion: true,
  builtWith: [{ label: 'React', href: 'https://react.dev' }],
  seo: {
    description: 'Short public site description',
    topics: ['DevOps'],
    technologyStack: ['Frontend: React, Vite'],
    pages: ['/'],
  },
}
```

## `profile`

Identity and hero content.

```js
profile: {
  name: 'Full Name',
  title: 'Professional title',
  tagline: 'Short summary',
  image: { src: 'https://...', alt: 'Full Name' },
  hero: {
    eyebrow: 'Hi, my name is',
    subtitle: 'Hero subtitle',
    cta: { label: 'Check out my work!', href: '#experience' },
  },
}
```

## `sections`

Single source for nav labels, section titles, and section numbering. Components look up their section by `id`.

```js
sections: [
  { id: 'home', navLabel: 'Home' },
  { id: 'projects', number: '03.', title: "Some Things I've Built", navLabel: 'Projects' },
]
```

Supported ids currently used by the app: `home`, `experience`, `projects`, `education`, `skills`, `contact`.

## `contact`

Contact identity, marketing copy, and form behavior.

```js
contact: {
  email: 'name@example.com',
  intro: 'Contact section intro',
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
}
```

## `socials`

Social/contact entries for the side panel. `href` creates a normal external link. `handle` creates a local popup/display action.

```js
socials: [
  { type: 'github', label: 'GitHub', href: 'https://github.com/user' },
  { type: 'discord', label: 'Discord', handle: 'username' },
]
```

Supported icon `type` values: `github`, `instagram`, `discord`.

## `skills`

Skill groups are arrays so individual skills can carry metadata. A plain skill is `{ label }`.

```js
skills: [
  {
    category: 'Tools & Platforms',
    items: [
      { label: 'Docker' },
      { label: 'Git', action: { type: 'link', href: 'https://github.com/user/repo' } },
      {
        label: 'Working in High Stress Environments',
        featured: true,
        action: { type: 'video', title: 'Working in High Stress Environments', src: 'https://...' },
      },
    ],
  },
]
```

Supported action types: `link`, `video`.

## `projects`

Projects support simple cards and richer featured cards. `image.src` should point to hosted assets such as Vercel Blob, not files under `public/`.

```js
projects: [
  {
    title: 'Project Name',
    description: 'Short project description',
    link: 'https://...',
    featured: true,
    image: {
      src: 'https://blob.example.com/diagram.svg',
      alt: 'Diagram description',
      caption: 'Stack diagram served from Vercel Blob storage',
    },
    highlights: ['Outcome or responsibility'],
    technologies: ['Docker'],
    roadmap: 'Next steps...',
  },
]
```

## Config Values

Build/runtime values belong in `src/config/siteConfig.js`, then `portfolioData.js` may reference them in documented fields. Do not create random top-level constants in `portfolioData.js` for one-off assets or feature behavior.
