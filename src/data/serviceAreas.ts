export type ServiceArea = {
  slug: string;
  name: string;
  county: string;
  description: string;
  highlights: string[];
};

export const serviceAreas: ServiceArea[] = [
  {
    slug: 'macomb-county',
    name: 'Macomb County',
    county: 'Macomb',
    description:
      'Andes Stump Grinding provides fast, professional stump removal throughout Macomb County. From Sterling Heights to Warren and Clinton Township, we bring commercial-grade equipment and fully insured service to residential and commercial properties.',
    highlights: [
      'Stump, bush stump, and root grinding',
      'Deep grinding for fence and foundation prep',
      'Wood chip cleanup or on-site mulch',
      'Residential and commercial properties',
      'Fully insured crews',
      'Free estimates with no obligation',
    ],
  },
  {
    slug: 'wayne-county',
    name: 'Wayne County',
    county: 'Wayne',
    description:
      'Serving Wayne County homeowners, landscapers, and contractors with reliable stump grinding. Whether you are clearing a lot in Detroit, Dearborn, Livonia, or the surrounding suburbs, we grind stumps efficiently and clean up when we are done.',
    highlights: [
      'Tree stump, bush stump, and surface root removal',
      'Sub-surface grinding for fence posts and foundations',
      'Chips hauled away or left as mulch',
      'Jobs of all sizes — residential and commercial',
      'Fully insured for your protection',
      'No-obligation quotes at no cost',
    ],
  },
  {
    slug: 'oakland-county',
    name: 'Oakland County',
    county: 'Oakland',
    description:
      'Based in Ferndale, we regularly serve Oakland County communities including Troy, Rochester Hills, Pontiac, and Bloomfield. Count on professional stump grinding equipment and local, dependable service.',
    highlights: [
      'Stumps, bush roots, and surface roots ground down',
      'Below-grade grinding for construction and landscaping prep',
      'Wood chip removal or repurposed as garden mulch',
      'Homes, commercial lots, and contractor projects',
      'Full liability insurance on every job',
      'Free quotes — no strings attached',
    ],
  },
];
