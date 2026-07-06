import { siteConfig } from '../config/siteConfig.js';

export const portfolioData = {
  site: {
    name: 'Kosmas Temperekidis Portfolio',
    domain: 'https://l7feeders.dev',
    repository: 'https://github.com/KmTempe/portfolio-react',
    footerNote: 'Engineered with curiosity, practical support experience, and a DevOps mindset.',
    showVersion: true,
    builtWith: [
      { label: 'React', href: 'https://react.dev' },
      { label: 'Vite', href: 'https://vitejs.dev' },
      { label: 'Material Design 3', href: 'https://mui.com' }
    ],
    seo: {
      description: 'Portfolio for Kosmas Temperekidis, focused on IT support, DevOps, self-hosted services, and practical web tooling.',
      topics: [
        'DevOps',
        'Backend Development',
        'API Development',
        'Cloud Infrastructure',
        'Self-hosted Services',
        'System Architecture'
      ],
      technologyStack: [
        'Frontend: React, Vite, Material Design',
        'Backend: Node.js, Express',
        'Deployment: Vercel',
        'Infrastructure: Docker, Nginx'
      ],
      pages: ['/']
    }
  },

  profile: {
    name: 'Kosmas Temperekidis',
    title: 'IT Applications & Technical Support',
    tagline: 'Passionate about service and technical support, with a decisive and effective approach to achieving goals. A collaborative team player with high productivity.',
    image: {
      src: 'https://github.com/KmTempe.png',
      alt: 'Kosmas Temperekidis'
    },
    hero: {
      eyebrow: 'Hi, my name is',
      subtitle: 'I build things.',
      cta: {
        label: 'Check out my work!',
        href: '#experience'
      }
    }
  },

  sections: [
    { id: 'home', navLabel: 'Home' },
    { id: 'experience', number: '02.', title: "Where I've Worked", navLabel: 'Experience' },
    { id: 'projects', number: '03.', title: "Some Things I've Built", navLabel: 'Projects' },
    { id: 'education', number: '04.', title: 'Education', navLabel: 'Education' },
    { id: 'skills', number: '05.', title: 'Expertise', navLabel: 'Skills' },
    { id: 'contact', number: '06.', kicker: "What's Next?", title: 'Get In Touch', navLabel: 'Contact' }
  ],

  contact: {
    email: 'support@l7feeders.dev',
    intro: "I'm currently looking for new opportunities, and my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!",
    directLabel: 'contact me directly at',
    form: {
      enabled: true,
      sendOtpUrl: '/api/send-otp',
      verifyOtpUrl: '/api/verify-otp',
      otpLength: 7,
      otpDurationSeconds: 5 * 60,
      resendCooldownSeconds: 30,
      disabledMessage: 'Contact form is hidden due to technical reasons.',
      fields: {
        name: { label: 'Name', placeholder: 'Your name', maxLength: 64 },
        email: { label: 'Email', placeholder: 'Your email', maxLength: 128 },
        message: { label: 'Message', placeholder: 'How can I help?', maxLength: 1000 }
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
        successMessage: "Thank you for reaching out. I'll get back to you soon."
      }
    }
  },

  socials: [
    { type: 'github', label: 'GitHub', href: 'https://github.com/KmTempe' },
    { type: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/rememberthe5thofnovember1605/' },
    { type: 'discord', label: 'Discord', handle: 'vannesss' }
  ],

  resume: {
    buttonLabel: 'Resume',
    loadingLabel: 'Loading...',
    documentTitle: 'Kosmas Temperekidis resume',
    excludedSkillLabels: ['Working in High Stress Environments']
  },

  features: {
    snowfall: {
      enabled: false
    },
    snowflake: {
      enabled: true,
      preload: true,
      title: 'Snowflake',
      iframeTitle: 'Snowflake (Tor Project)',
      widgetUrl: 'https://snowflake.torproject.org/embed.html',
      siteUrl: 'https://snowflake.torproject.org/',
      openLabel: 'Open Snowflake widget',
      closeLabel: 'Hide Snowflake widget',
      tooltip: 'Anti-censorship: open Snowflake widget',
      websiteLabel: 'Open Snowflake website',
      description: 'Keep this tab open to help others bypass censorship.'
    }
  },

  integrations: {
    libredesk: siteConfig.integrations.libredesk
  },

  about: {
    description: [
      'Dedicated IT professional specializing in technical support and IT applications. Experienced in troubleshooting PoS terminals, managing e-commerce platforms, and delivering exceptional customer service with a focus on effective problem-solving and team collaboration.',
      'My journey in IT has been driven by a passion for solving complex problems and delivering efficient solutions. I enjoy working on both the front-end and back-end, ensuring a seamless user experience.'
    ]
  },

  experience: [
    {
      title: 'Customer and Technical Support Specialist',
      company: 'CQS S.A',
      period: 'March 2024 – Present',
      responsibilities: [
        'Technical support for PoS terminals (Cardlink-Worldline)',
        'Technical support for ERP software (Worldline All in One)',
        'Front Office and Back Office operations'
      ]
    },
    {
      title: 'Internship - Customer Support',
      company: 'Cosmote Store, Giannitsa',
      period: 'August 2023 – January 2024',
      responsibilities: [
        'Customer request registration and management',
        'Customer service and support',
        'Proposing solutions and answering customer inquiries'
      ]
    },
    {
      title: 'e-Commerce specialist',
      company: 'Free Wear, Giannitsa',
      period: 'February 2023 – April 2023',
      responsibilities: [
        'E-commerce platform management',
        'Product registration and editing in online store',
        'Photography and image editing for social media'
      ]
    }
  ],

  education: [
    {
      title: 'IT Applications Technician',
      institution: 'IEK Giannitsa',
      period: 'October 2022 – June 2023',
      description: 'Specialized training in IT applications with focus on PHP, SQL, Java, C++, JavaScript, and CMS platforms (WordPress, Joomla).'
    },
    {
      title: 'IT Applications Technician',
      institution: '3rd Vocational High School of Giannitsa',
      period: 'September 2014 – June 2017',
      description: 'Technical education covering Computer Networks, Python, Web Design (HTML, CSS, JS), Databases (PHP, SQL), and Computer Hardware.'
    }
  ],

  skills: [
    {
      category: 'Frameworks',
      items: [
        { label: 'PHP' },
        { label: 'JavaScript' },
        { label: 'Python' },
        { label: 'Next.js', action: { type: 'link', href: 'https://binlookup.l7feeders.dev/' } },
        { label: 'Vite' },
        { label: 'React' },
        { label: 'Flask' }
      ]
    },
    {
      category: 'Tools & Platforms',
      items: [
        { label: 'Git', action: { type: 'link', href: 'https://github.com/KmTempe/portfolio-react' } },
        { label: 'Docker' },
        { label: 'Docker Compose' },
        { label: 'MongoDB' },
        { label: 'PostgreSQL' },
        { label: 'Redis' },
        { label: 'Nginx Proxy Manager' },
        { label: 'Uptime Kuma' },
        { label: 'Vercel Blob' }
      ]
    },
    {
      category: 'Creative & Productivity',
      items: [
        { label: 'Adobe Photoshop' },
        { label: 'Adobe Lightroom' },
        { label: 'DaVinci Resolve' }
      ]
    },
    {
      category: 'Professional',
      items: [
        { label: 'Technical Support' },
        { label: 'Customer Service' },
        { label: 'E-commerce Management' },
        { label: 'Problem Solving' },
        { label: 'Team Collaboration' },
        {
          label: 'Working in High Stress Environments',
          featured: true,
          action: {
            type: 'video',
            title: 'Working in High Stress Environments',
            src: siteConfig.assets.stressVideoUrl
          }
        }
      ]
    }
  ],

  projects: [
    {
      title: 'Bin Lookup',
      description: 'A tool to check the issuer bank of a given card BIN (Bank Identification Number).',
      link: 'https://binlookup.l7feeders.dev/'
    },
    {
      title: 'Google Certified Device Checker',
      description: 'Search if a given device is certified from Google using the public available list from Google Play Help.',
      link: 'https://device-checker.l7feeders.dev/'
    },
    {
      title: 'CV Maker',
      description: 'A simple tool for auto generating CVs from json files.',
      link: 'https://cvmaker.l7feeders.dev/'
    },
    {
      title: 'LibreDesk SMS Proxy',
      description: 'Middleware that bridges LibreDesk events with the SMSGate Android app.It automates customer SMS notifications for ticket resolutions and status updates',
      link: 'https://github.com/KmTempe/libredesk-sms-proxy'
    },
    {
      title: 'Self-Hosted Media Platform & Homelab',
      description: 'Built and operate a self-hosted homelab centered on Jellyfin, with separate service stacks for media streaming, support, private cloud, photo management, monitoring, search, and invite-based onboarding. The Jellyfin instance currently manages 3.7 TB',
      link: 'https://ausrine.giize.com/',
      featured: true,
      image: {
        src: siteConfig.assets.homelabStackDiagramUrl,
        alt: 'Homelab Docker Compose architecture diagram',
        caption: 'Stack diagram'
      },
      highlights: [
        'Operate Jellyfin with the official server and web UI components, currently managing 3.6 TB of media.',
        'Tested real-world capacity for 10-12 simultaneous transcoding users and 20 non-transcoding users on a 1 Gbps connection.',
        'Use Nginx Proxy Manager as the public routing layer with SSL termination and protective rules for selected services.',
        'Automate invite onboarding with Wizarr and support mailbox workflows, leaving final approval under admin control.',
        'Monitor service health with Uptime Kuma so users can check platform status live.',
        'Hardening Jellyfin known holes on authentication (added 2FA & passkey support, automated password recovery via email and account recovery)'
      ],
      technologies: [
        'Docker Compose',
        'Nginx Proxy Manager',
        'PostgreSQL',
        'Redis',
        'Valkey',
      ],
      roadmap: 'Next steps include centralizing user database with LDAP and adding SSO through Google or Authelia.'
    }
  ]
};
