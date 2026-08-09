import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { Helmet } from "react-helmet-async";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const SITE_URL = "https://www.texsonics.net";

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const allItems: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {allItems.map((item, i) => {
            const isLast = i === allItems.length - 1;
            return (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="w-4 h-4" aria-hidden />}
                {isLast || !item.href ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {i === 0 ? <Home className="w-4 h-4 inline mr-1" /> : null}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="hover:text-primary transition-colors inline-flex items-center"
                  >
                    {i === 0 ? <Home className="w-4 h-4 mr-1" /> : null}
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
