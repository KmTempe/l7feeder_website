const env = import.meta.env || globalThis.process?.env || {};

export const siteConfig = {
  assets: {
    homelabStackDiagramUrl: env.VITE_HOMELAB_STACK_DIAGRAM_URL
      || 'https://78dcc92loiyfdt17.public.blob.vercel-storage.com/docker-compose-diagram-as1AHJu3AIgz0HLWQIRQ1MQqgMDz58.svg',
    stressVideoUrl: env.VITE_STRESS_VIDEO_URL || '',
  },
  integrations: {
    libredesk: {
      baseUrl: env.VITE_LIBREDESK_BASE_URL || 'https://support.ausrine.giize.com',
      inboxId: env.VITE_LIBREDESK_INBOX_ID || '',
    },
  },
};
