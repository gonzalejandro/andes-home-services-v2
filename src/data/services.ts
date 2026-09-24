import bandit from '../assets/Bandit.jpg';
import stumpGrinding from '../assets/stump-grinding.webp';

export const services = [
  {
    slug: 'stump-grinding',
    // Looping clip and panel colour for the home-page hover cards
    clip: 'grinding4',
    clipAlt: 'Stump grinder cutting a tree stump down below grade',
    panel: 'cream' as const,
    cropTop: true,
    // Services-page crop (see `crops` in pages/services/index.astro)
    crop: 'upper' as const,
    title: 'Stump Grinding',
    shortDescription:
      'Professional stump removal to keep your property clean and safe. Fully insured.',
    description:
      'Professional stump removal services to keep your property clean and safe. We use professional stump grinding equipment to efficiently remove tree stumps of all sizes. Fully insured for your protection.',
    image: bandit,
    imageAlt: 'Stump grinder on a residential job site',
    highlights: [
      'Residential and commercial properties',
      'Stumps of all sizes',
      'Wood chips left on-site or removed',
      'Grinding up to 15 inches deep for fence and foundation prep',
      'Fully insured crews',
    ],
  },
  {
    slug: 'bush-stumps-roots-grinding',
    // Looping clip and panel colour for the home-page hover cards
    clip: 'grinding6',
    clipAlt: 'Grinder clearing bush stumps and surface roots',
    panel: 'accent' as const,
    crop: 'low' as const,
    title: 'Bush Stumps/Roots Grinding',
    shortDescription:
      'Grinding for tree stumps, bush stumps, and surface roots. Fast, safe, and fully insured.',
    description:
      'We grind tree stumps, bush stumps, and problematic surface roots using professional stump grinding equipment. Whether you are clearing a single stump or cleaning up roots after landscaping, we remove the obstacle and leave your property ready for the next step.',
    image: stumpGrinding,
    imageAlt: 'Stump and root grinding on a residential property',
    highlights: [
      'Tree stumps, bush stumps, and surface roots',
      'Residential and commercial properties',
      'Deep grinding for fence and foundation prep',
      'Professional stump grinding equipment',
      'Fully insured crews',
    ],
  },
  {
    slug: 'chip-removal',
    // Looping clip and panel colour for the home-page hover cards
    clip: 'cleanup2',
    clipAlt: 'Crew hauling away grinding chips and tidying the work area',
    panel: 'mint' as const,
    crop: 'lowest' as const,
    title: 'Chip Removal',
    shortDescription:
      'Wood chip cleanup after stump grinding so your yard is neat and ready to use.',
    description:
      'After stump grinding, wood chips and debris can pile up fast. We haul away grinding chips and clean up the work area so your lawn, driveway, or job site is left tidy — or we can leave chips on-site for mulch if you prefer.',
    image: bandit,
    imageAlt: 'Stump grinder on a job site',
    highlights: [
      'Cleanup after stump grinding',
      'Chips hauled off-site or left for mulch on request',
      'Neat finish for lawns, driveways, and job sites',
      'Available as a standalone service or add-on',
      'Fully insured crews',
    ],
  },
];



/*
 * Services-page capability cards. Each one plays a looping clip from
 * public/videos; `crop` biases the frame so the machine stays in shot.
 */
export const capabilities = [
  {
    emoji: '🌳',
    title: 'Residential Stump Grinding',
    description:
      'Any size, any species, any location in your yard. We grind 6–12" below grade so you can plant, sod, or build right over it.',
    clip: 'grinding5',
    clipAlt: 'Stump grinder working next to a retaining wall in a residential yard',
    crop: 'low' as const,
  },
  {
    emoji: '🏗️',
    title: 'Commercial & Lot Clearing',
    description:
      'Multiple stumps for developers, HOAs, and landscapers. Volume pricing available for 5+ stumps per visit.',
    clip: 'cleanup1',
    clipAlt: 'Crew member clearing grindings with a blower on a tree-lined street',
    crop: 'lowest' as const,
  },
  {
    emoji: '🌱',
    title: 'Root Chasing',
    description:
      'Surface roots lifting your sidewalk or driveway? We trace and grind them out so they stop causing damage.',
    clip: 'grinding3',
    clipAlt: 'Grinding out roots close to a stone house wall',
    crop: 'lowest' as const,
  },
  {
    emoji: '🧹',
    title: 'Cleanup & Backfill',
    description:
      'We rake up the grindings, or haul them off and backfill with topsoil and seed so the spot disappears completely.',
    clip: 'cleanup3',
    clipAlt: 'Crew member raking and leveling the ground after grinding',
    crop: 'low' as const,
  },
  {
    emoji: '🚪',
    title: 'Tight Access Jobs',
    description:
      'Our compact grinder fits through a 36" gate. Fenced backyards, side yards, and slopes are no problem.',
    clip: 'clip2',
    clipAlt: 'Compact stump grinder driving through a narrow side yard',
    crop: 'lower' as const,
  },
  {
    emoji: '⚡',
    title: 'Storm Damage Response',
    description:
      "Tree already down? We'll take care of the stump quickly so your yard gets back to normal fast.",
    clip: 'machine2',
    clipAlt: 'Stump grinder being driven down a wet street after a winter storm',
    crop: 'high' as const,
  },
];

export const processSteps = [
  {
    title: 'You send us a photo',
    description:
      "Text or email a picture of the stump, your address, and your name. We'll reply with a quote usually within the hour or 1 business day.",
  },
  {
    title: 'You get a free quote',
    description:
      "When you're ready to move forward we schedule around you, including evenings, Saturdays and Sundays. You don't even need to be home.",
  },
  {
    title: 'We schedule MISS DIG',
    description:
      "We book MISS DIG, Michigan's free utility-marking service, to flag underground lines before grinding. It takes up to 3 business days.",
    link: { text: 'MISS DIG', href: '/about#miss-dig' },
  },
  {
    title: 'We perform the grinding',
    description:
      'A day after MISS DIG finishes marking all utilities, our crew shows up, grinds the stump below grade, and cleans up the area so everything looks nice and tidy.',
  },
  {
    title: 'You enjoy your yard',
    description:
      "Pay when the job's done: cash, card, mobile apps, or check. No deposits, no surprises.",
  },
];
