/**
 * Public API of the `landing` feature.
 * Other layers import ONLY from this barrel — never from internal files.
 */
export { ContactSection } from './components/contact-section';
export { CtaSection } from './components/cta-section';
export { FeaturedProjects } from './components/featured-projects';
export { LandingFooter } from './components/landing-footer';
export { LandingHero } from './components/landing-hero';
export { LandingNavbar } from './components/landing-navbar';
export { ProcessSection } from './components/process-section';
export { ServicesSection } from './components/services-section';
export { StatsSection } from './components/stats-section';
export {
  LANDING_NAV,
  LANDING_SECTIONS,
  type LandingSectionId,
} from './constants/landing.constants';
