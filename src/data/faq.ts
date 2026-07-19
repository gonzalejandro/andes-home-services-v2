export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  title: string;
  items: FaqItem[];
};

export const faqSections: FaqSection[] = [
  {
    title: 'Before the Job',
    items: [
      {
        question: 'How do I get a quote?',
        answer:
          'Just fill out the contact form on our website or give us a call. You can also text us photos of your stumps — that helps us give you a faster, more accurate estimate. For larger or more complex jobs, we may schedule a quick site visit.',
      },
      {
        question: 'How much does stump grinding cost?',
        answer:
          'Pricing depends on the size, number, and accessibility of the stumps. Every job is different, so we provide free, no-obligation estimates tailored to your specific situation. Contact us with a few details and we will get you a quote quickly.',
      },
      {
        question: 'Do you offer discounts for multiple stumps?',
        answer:
          'Yes, we offer volume pricing when there are multiple stumps on the same property. The more stumps you need removed, the better the per-stump rate. Let us know how many you have when you request your estimate.',
      },
      {
        question: 'Do you offer free estimates?',
        answer:
          'Yes! We offer free estimates with no obligation. Contact us today to get your quote.',
      },
    ],
  },
  {
    title: 'During the Job',
    items: [
      {
        question: 'How long does stump grinding take?',
        answer:
          'Most stumps can be ground down in just a couple of hours, depending on the size. Small stumps may take 30 minutes to an hour, while larger stumps can take 2-3 hours.',
      },
      {
        question: 'Will stump grinding damage my lawn?',
        answer:
          'We do our best to minimize any impact to your yard. There will be some disturbance in the immediate area around the stump, but we clean up the work site when we are done. The area can be filled in and reseeded or sodded right away. We also offer ground protection mats to help protect your lawn and driveway along the path to the stump — an additional fee applies.',
      },
      {
        question: 'How loud is the equipment?',
        answer:
          'Stump grinders are loud — similar to a chainsaw or large lawnmower. We recommend letting your neighbors know ahead of time. We work during normal business hours to minimize any disruption.',
      },
      {
        question: 'Do you need water or power on-site?',
        answer:
          'No, our equipment is self-contained. We do not need access to water, electricity, or any other utilities on your property.',
      },
    ],
  },
  {
    title: 'Depth & Access',
    items: [
      {
        question: 'How deep do you grind?',
        answer:
          'We typically grind 6-12 inches below ground level, which is sufficient for most purposes. Our equipment can go up to 15 inches deep for projects like fence posts or foundation prep.',
      },
      {
        question: 'Can you grind stumps near structures or utilities?',
        answer:
          'Yes, we can work carefully around structures, fences, and other obstacles. We also call MISS DIG when necessary to locate underground utilities for safety. If you know of any underground utilities, please let us know in advance.',
      },
      {
        question: 'Can your equipment fit through a gate?',
        answer:
          'Yes, our stump grinder fits through gates as narrow as 36 inches. A gate or access fee may apply depending on the situation. If you have a tight access point, let us know when you request your estimate and we will confirm we can get to the stump.',
      },
    ],
  },
  {
    title: 'After the Job',
    items: [
      {
        question: 'What happens to the wood chips?',
        answer:
          'We can either leave the wood chips on-site (which make great mulch for your garden) or remove them if you prefer. Just let us know your preference when you contact us.',
      },
      {
        question: 'Can I plant a new tree where the stump was?',
        answer:
          'Yes, once the stump is ground down and the chips are cleared, the area can be filled with topsoil and a new tree can be planted. We recommend waiting a few weeks for the soil to settle before planting.',
      },
      {
        question: 'Will the stump grow back?',
        answer:
          'No. Stump grinding removes the stump well below the surface, which prevents regrowth. In rare cases, some root suckers may sprout from remaining roots, but these are easy to remove and will die off over time.',
      },
      {
        question: 'How long until I can use the area again?',
        answer:
          'You can use the area right away for most purposes. If you plan to lay sod, plant, or build on the spot, we recommend filling the hole with topsoil first and letting it settle for a week or two.',
      },
    ],
  },
  {
    title: 'Logistics',
    items: [
      {
        question: 'How do I prepare for the appointment?',
        answer:
          'Please clear the area around the stump of any loose items like garden hoses, decorations, or toys. If there are sprinkler heads or invisible fence wires nearby, mark them with flags so we can avoid them. Make sure we have clear access to the stump.',
      },
      {
        question: 'Do I need to be present during the grinding?',
        answer:
          "No, you don't need to be present. We can work around your schedule and will contact you when the job is complete.",
      },
      {
        question: 'What happens if it rains on the day of my appointment?',
        answer:
          'We may need to reschedule to avoid damaging your lawn on wet ground. If the job is time-sensitive and cannot wait, we can still get it done using ground protection mats — an additional fee applies. Otherwise, we will work with you to reschedule as soon as conditions allow.',
      },
      {
        question: 'Are you insured?',
        answer:
          'Yes, we are fully insured. We carry liability insurance on every job to protect your property and give you peace of mind. Proof of insurance is available upon request.',
      },
      {
        question: 'What areas do you serve?',
        answer:
          "We serve Macomb, Oakland, and Wayne counties. We're based in Ferndale and cover the Metro Detroit area and surrounding communities. We can also travel beyond our standard service area — a travel fee may apply to cover fuel and time.",
      },
    ],
  },
];

// Flat list for JSON-LD schema
export const faqItems = faqSections.flatMap((section) => section.items);
