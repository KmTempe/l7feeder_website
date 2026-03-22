export const portfolioData = {
  name: 'Kosmas Temperekidis',
  title: 'IT Applications & Technical Support',
  tagline: 'Passionate about service and technical support, with a decisive and effective approach to achieving goals. A collaborative team player with high productivity.',
  email: 'support@l7feeders.dev',

  about: {
    description: [
      'Dedicated IT professional specializing in technical support and IT applications. Experienced in troubleshooting PoS terminals, managing e-commerce platforms, and delivering exceptional customer service with a focus on effective problem-solving and team collaboration.',
      'My journey in IT has been driven by a passion for solving complex problems and delivering efficient solutions. I enjoy working on both the front-end and back-end, ensuring a seamless user experience.'
    ]
  },

  experience: [
    // {
    //   title: 'Dummy Job Title',
    //   company: 'Test Company Inc.',
    //   period: 'Future – Forever',
    //   responsibilities: [
    //     'Testing dynamic rendering of the experience section',
    //     'Ensuring the UI scales correctly with new data',
    //     'Verifying component reusability'
    //   ]
    // },
    {
      title: 'Customer and Technical Support Specialist',
      company: 'CQS S.A',
      period: 'March 2024 – Present',
      responsibilities: [
        'Technical support for PoS terminals (Cardlink-Worldline)',
        'Technical support for accounting software (Worldline All in One)',
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

  skills: {
    'Frameworks': ['PHP', 'JavaScript', 'Python', 'Next.js', 'Vite', 'React', 'Flask'],
    'Tools & Platforms': ['Git', 'Docker', 'Docker Compose', 'MongoDB', 'PostgreSQL'],
    'Creative & Productivity': ['Adobe Photoshop', 'Adobe Lightroom', 'DaVinci Resolve'],
    'Professional': ['Technical Support', 'Customer Service', 'E-commerce Management', 'Problem Solving', 'Team Collaboration']
  },

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
    }
  ]
};
