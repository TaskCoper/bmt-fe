import { siteConfig } from '@/shared/config/site';
import { Logo } from '@/shared/components/common';

/** Public marketing footer used by the landing route group. */
export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm sm:flex-row lg:px-8">
        <Logo />
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
