/**
 * Public API of the `landing` feature.
 * Other layers import ONLY from this barrel — never from internal files.
 */
export { LandingNavbar } from './components/landing-navbar';
export { LandingHero } from './components/landing-hero';
export { ServicesSection } from './components/services-section';
export { ProcessSection } from './components/process-section';
export { FeaturedProjects } from './components/featured-projects';
export { StatsSection } from './components/stats-section';
export { CtaSection } from './components/cta-section';
export { ContactSection } from './components/contact-section';
export { LandingFooter } from './components/landing-footer';
export {
  LANDING_SECTIONS,
  LANDING_NAV,
  type LandingSectionId,
} from './constants/landing.constants';
