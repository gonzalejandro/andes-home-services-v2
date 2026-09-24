export const site = {
  name: 'Andes Stump Grinding',
  title: 'Andes Stump Grinding | Professional Stump Grinding Services',
  description:
    'Professional stump grinding services in Metro Detroit. Serving Macomb, Oakland, and Wayne counties from Ferndale.',
  url: 'https://www.andesstumpgrinding.com',
  email: 'info@andeshomeservices.com',
  phone: '(248) 509-5011',
  phoneTel: '+12485095011',
  location: {
    city: 'Ferndale',
    region: 'MI',
    areaServed: ['Macomb County', 'Oakland County', 'Wayne County'],
  },
  social: {
    facebook: 'https://www.facebook.com/p/Andes-Stump-Grinding-61584649354878/',
    instagram: 'https://www.instagram.com/andesstumpgrinding/',
    google: 'https://maps.app.goo.gl/qC7ef8qoVcdMPR2w8',
  },
} as const;

/*
 * The designer's header carries five links; Service Areas, Gallery and Reviews
 * live in the footer so they stay one click away site-wide.
 */
export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;

export const footerNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Services' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
] as const;
