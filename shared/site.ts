export const site = {
  name: 'Fieldnotes',
  wordmark: 'fieldnotes.dev',
  description:
    'Notes on making things for the web. A little engineering, a little design, and everything in between.',
  author: 'The Fieldnotes editors',
  featuredPath: '/blog/building-for-the-long-way-round',
  navigation: [
    { label: 'Journal', key: 'J', to: '/' },
    { label: 'Handbook', key: 'H', to: '/start' },
    { label: 'About', key: 'A', to: '/about' },
  ],
  categories: ['Engineering', 'Design', 'Workflow', 'Notes'],
  showWorkbench: true,
  showSpaceFooter: true,
} as const
