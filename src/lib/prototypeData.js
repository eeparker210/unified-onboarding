export const business = {
  name: 'Mom and Pop Lollipop Shop',
  slug: 'mom-and-pop-lollipop-shop',
  category: 'Candy Store',
  domain: 'momandpoplollipop.com',
  directoryHost: 'location.com',
  tagline: 'Handmade sweets, gift boxes, and rainbow walls worth the trip.',
  summary:
    'Mom and Pop Lollipop Shop helps families, tourists, and event planners discover premium candy, party favors, and nostalgia treats across seven neighborhood storefronts.',
  phone: '(877) 555-0118',
  website: 'https://www.momandpoplollipop.com',
  status: 'Publicly sourced',
  openStatus: 'Open now',
  closeTime: 'Closes at 8:00 PM',
  locationCount: 7,
  recommendedPlan: 'Launch',
  pricePerMonth: 149,
  launchUrl: 'mom-and-pop-lollipop-shop.location.com',
  aiVisibilityScore: 78,
  readinessSummary:
    'Strong location coverage and structured data. Add richer FAQs and landing page copy to improve LLM citation quality.',
  brand: {
    primary: '#6558f5',
    secondary: '#ff5ca8',
    accent: '#ffd84d',
    ink: '#20212d',
    soft: '#e8eeff',
    cream: '#fffaf2',
    voice: ['Playful', 'Neighborly', 'Confident'],
    logoMark: 'MP',
    imageLabels: ['Storefront neon sign', 'Gift box assortment', 'Kids candy wall'],
  },
};

export const locations = [
  {
    id: 'mpl-001',
    name: 'Mom and Pop Lollipop Shop - Wicker Park',
    address: '1457 N Milwaukee Ave, Chicago, IL 60622',
    phone: '(312) 555-0145',
    hours: '9:00 AM - 8:00 PM',
    status: 'Ready',
  },
  {
    id: 'mpl-002',
    name: 'Mom and Pop Lollipop Shop - Lincoln Park',
    address: '2334 N Clark St, Chicago, IL 60614',
    phone: '(312) 555-0177',
    hours: '10:00 AM - 8:00 PM',
    status: 'Ready',
  },
  {
    id: 'mpl-003',
    name: 'Mom and Pop Lollipop Shop - Evanston',
    address: '608 Davis St, Evanston, IL 60201',
    phone: '(847) 555-0126',
    hours: '10:00 AM - 7:00 PM',
    status: 'Needs photo refresh',
  },
  {
    id: 'mpl-004',
    name: 'Mom and Pop Lollipop Shop - Naperville',
    address: '16 W Jefferson Ave, Naperville, IL 60540',
    phone: '(630) 555-0188',
    hours: '10:00 AM - 8:00 PM',
    status: 'Ready',
  },
  {
    id: 'mpl-005',
    name: 'Mom and Pop Lollipop Shop - Oak Park',
    address: '1042 Lake St, Oak Park, IL 60301',
    phone: '(708) 555-0104',
    hours: '10:00 AM - 7:00 PM',
    status: 'Needs holiday hours',
  },
  {
    id: 'mpl-006',
    name: 'Mom and Pop Lollipop Shop - Schaumburg',
    address: '5 Woodfield Mall, Schaumburg, IL 60173',
    phone: '(847) 555-0164',
    hours: '11:00 AM - 8:00 PM',
    status: 'Ready',
  },
  {
    id: 'mpl-007',
    name: 'Mom and Pop Lollipop Shop - Oak Brook',
    address: '212 Oakbrook Center, Oak Brook, IL 60523',
    phone: '(630) 555-0191',
    hours: '10:00 AM - 8:00 PM',
    status: 'Ready',
  },
];

export const jobOptions = [
  {
    id: 'visibility',
    title: 'Increase AI visibility',
    description:
      'Strengthen your presence in search, map surfaces, and AI assistants by publishing listings and local pages together.',
    outcomes: ['Listings preparation', 'Local pages creation', 'AI readiness check'],
  },
  {
    id: 'conversion',
    title: 'Increase conversion',
    description:
      'Turn discovery into action with polished pages, stronger calls to action, and ready-to-publish location details.',
    outcomes: ['CTA tuning', 'Pages preview', 'Social profiles sync'],
  },
  {
    id: 'customers',
    title: 'Connect with customers',
    description:
      'Make it easier for customers to engage with you, and for you to close the loop.',
    outcomes: ['Social profiles sync', 'Contact consistency', 'Prepare a campaign'],
  },
];

export const listingsPublishers = [
  {
    name: 'Google Business Profile',
    state: 'Ready to publish',
    detail: 'All 7 locations have the required data.',
  },
  {
    name: 'Facebook',
    state: 'Ready to publish',
    detail: 'Brand and address data are complete.',
  },
  {
    name: 'Apple Business Connect',
    state: '1 task left',
    detail: 'Add a square brand logo that is at least 64 px by 64 px.',
  },
];

export const pageHighlights = [
  'Structured schema for each storefront',
  'Store-specific hero copy generated from your brand voice',
  'Prominent directions, call, and order CTAs',
  'FAQ blocks tuned for AI answer retrieval',
];

export const aiChecks = [
  {
    label: 'Structured data coverage',
    value: 'Strong',
    note: 'Addresses, hours, and store identifiers are machine readable.',
  },
  {
    label: 'Citation confidence',
    value: 'Strong',
    note: 'Consistent data across listings and pages reduces ambiguity.',
  },
    {
    label: 'LLM answerability',
    value: 'Medium',
    note: 'Add richer product FAQs to improve long-tail question coverage.',
  },
];

export const postLaunchTasks = [
  {
    title: 'Add product FAQs',
    description: 'Help AI systems answer questions about sugar-free, seasonal, and party-order options.',
    impact: 'High impact',
  },
  {
    title: 'Review holiday hours',
    description: 'Two locations still need special hours before the next seasonal campaign.',
    impact: 'Quick win',
  },
  {
    title: 'Upgrade store photos',
    description: 'Fresh imagery will improve publisher approval and make your pages more engaging.',
    impact: 'Recommended',
  },
  {
    title: 'Connect Reviews',
    description: 'Bring in customer sentiment to support a stronger “connect with customers” workflow.',
    impact: 'Expansion',
  },
];
