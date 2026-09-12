// SEOHead.jsx — Clinidea Education
// Install: npm install react-helmet-async
// Wrap your App with <HelmetProvider> from react-helmet-async

import { Helmet } from "react-helmet-async";

/**
 * SEOHead — Universal SEO component for all pages
 *
 * Usage:
 *   <SEOHead
 *     title="Clinical Research Course India | Clinidea Education"
 *     description="Join India's top clinical research certification..."
 *     canonical="https://www.clinidea.in/clinical-research-course/"
 *     schema={courseSchema}           // optional JSON-LD object
 *     ogImage="https://..."           // optional social share image
 *   />
 */
export default function SEOHead({
  title,
  description,
  canonical,
  schema,
  ogImage = "https://www.clinidea.in/favicon.png",
  ogType = "website",
  noIndex = false,
}) {
  return (
    <Helmet>
      {/* ── Basic Meta ── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* ── Open Graph (Facebook / WhatsApp / LinkedIn) ── */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Clinidea Education" />
      <meta property="og:locale" content="en_IN" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ── Schema.org JSON-LD ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
