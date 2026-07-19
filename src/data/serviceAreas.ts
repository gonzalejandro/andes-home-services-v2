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
      'Residential stump grinding',
      'Contractor subcontracting',
      'Same-week scheduling when available',
      'Free estimates',
    ],
  },
  {
    slug: 'wayne-county',
    name: 'Wayne County',
    county: 'Wayne',
    description:
      'Serving Wayne County homeowners, landscapers, and contractors with reliable stump grinding. Whether you are clearing a lot in Detroit, Dearborn, Livonia, or the surrounding suburbs, we grind stumps efficiently and clean up when we are done.',
    highlights: [
      'Deep grinding for fence and foundation prep',
      'Wood chip removal or on-site mulch',
      'Fully insured crews',
      'Metro Detroit coverage',
    ],
  },
  {
    slug: 'oakland-county',
    name: 'Oakland County',
    county: 'Oakland',
    description:
      'Based in Ferndale, we regularly serve Oakland County communities including Troy, Rochester Hills, Pontiac, and Bloomfield. Count on professional stump grinding equipment and local, dependable service.',
    highlights: [
      'Stumps of all sizes',
      'Tight-access grinding when possible',
      'Contractor partnerships welcome',
      'Free, no-obligation quotes',
    ],
  },
];
