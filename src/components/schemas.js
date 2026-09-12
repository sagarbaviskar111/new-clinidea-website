// schemas.js — Structured Data (JSON-LD) for Clinidea Education
// Use each schema in the corresponding course page via SEOHead

// ────────────────────────────────────────
// 1. ORGANIZATION SCHEMA (use on every page)
// ────────────────────────────────────────
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Clinidea Education",
  alternateName: "Clinidea",
  url: "https://www.clinidea.in",
  logo: "https://www.clinidea.in/logo.webp",
  description:
    "Clinidea Education is India's leading institute for Clinical Research, Pharmacovigilance, Clinical Data Management, Regulatory Affairs, and Medical Writing training with 100% placement support.",
  foundingDate: "2018",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9370472071",
      contactType: "admissions",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+91-8999213129",
      contactType: "customer service",
      areaServed: "IN",
    },
  ],
  sameAs: [
    "https://linkedin.com/company/clinideaeducation",
    "https://www.pharmatalenthub.in",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Chhattisgarh",
    addressLocality: "Raipur",
  },
};

// ────────────────────────────────────────
// 2. CLINICAL RESEARCH COURSE SCHEMA
// ────────────────────────────────────────
export const clinicalResearchCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Certification in Clinical Research",
  description:
    "Comprehensive 6-month online certification in Clinical Research covering drug development, clinical trial operations, GCP compliance, adverse event reporting, and quality management. Includes 100% placement support.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Clinidea Education",
    sameAs: "https://www.clinidea.in",
  },
  url: "https://www.clinidea.in/clinical-research-course/",
  courseMode: "Online",
  educationalLevel: "Professional Certification",
  timeRequired: "P6M",
  inLanguage: "en",
  teaches: [
    "Clinical Trial Design",
    "ICH-GCP Guidelines",
    "Protocol Development",
    "Adverse Event Reporting",
    "Drug Development Process",
    "Clinical Trial Monitoring",
  ],
  hasCourseInstance: {
    "@type": "CourseInstance",
    courseMode: "Online",
    instructor: {
      "@type": "Person",
      name: "Clinidea Industry Expert Faculty",
    },
  },
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    url: "https://www.clinidea.in/clinical-research-course/",
  },
};

// ────────────────────────────────────────
// 3. PHARMACOVIGILANCE COURSE SCHEMA
// ────────────────────────────────────────
export const pharmacovigilanceCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Certification in Pharmacovigilance",
  description:
    "6-month online pharmacovigilance training covering drug safety fundamentals, ICSR writing, aggregate reporting (PSUR/PBRER), signal detection, MedDRA coding, and regulatory compliance for FDA, EMA, WHO.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Clinidea Education",
    sameAs: "https://www.clinidea.in",
  },
  url: "https://www.clinidea.in/pharmacovigilance-course/",
  courseMode: "Online",
  educationalLevel: "Professional Certification",
  timeRequired: "P6M",
  inLanguage: "en",
  teaches: [
    "Drug Safety Monitoring",
    "Adverse Drug Reactions",
    "ICSR Case Processing",
    "MedDRA Coding",
    "PSUR / PBRER Writing",
    "Signal Detection",
    "FDA EMA WHO Guidelines",
  ],
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    url: "https://www.clinidea.in/pharmacovigilance-course/",
  },
};

// ────────────────────────────────────────
// 4. CLINICAL DATA MANAGEMENT COURSE SCHEMA
// ────────────────────────────────────────
export const cdmCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Certification in Clinical Data Management",
  description:
    "6-month online CDM course covering CRF design, EDC systems, data validation, query management, MedDRA/WHO-DD coding, CDISC standards, and database lock processes for clinical trials.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Clinidea Education",
    sameAs: "https://www.clinidea.in",
  },
  url: "https://www.clinidea.in/clinical-data-management-course/",
  courseMode: "Online",
  educationalLevel: "Professional Certification",
  timeRequired: "P6M",
  teaches: [
    "CRF Design",
    "EDC Systems",
    "CDISC Standards",
    "Data Validation",
    "MedDRA WHO-DD Coding",
    "21 CFR Part 11",
  ],
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    url: "https://www.clinidea.in/clinical-data-management-course/",
  },
};

// ────────────────────────────────────────
// 5. REGULATORY AFFAIRS COURSE SCHEMA
// ────────────────────────────────────────
export const regulatoryAffairsCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Certification in Regulatory Affairs",
  description:
    "6-month online regulatory affairs course covering global drug approval processes (USFDA, EMA, CDSCO), CTD/eCTD dossier preparation, IND/NDA/ANDA submissions, labelling compliance, and lifecycle management.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Clinidea Education",
    sameAs: "https://www.clinidea.in",
  },
  url: "https://www.clinidea.in/regulatory-affairs-course/",
  courseMode: "Online",
  educationalLevel: "Professional Certification",
  timeRequired: "P6M",
  teaches: [
    "CTD eCTD Dossier",
    "USFDA Submissions",
    "EMA Guidelines",
    "CDSCO India",
    "IND NDA ANDA",
    "Drug Regulatory Compliance",
  ],
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    url: "https://www.clinidea.in/regulatory-affairs-course/",
  },
};

// ────────────────────────────────────────
// 6. MEDICAL WRITING COURSE SCHEMA
// ────────────────────────────────────────
export const medicalWritingCourseSchema = {
  "@context": "https://schema.org",
  "@type": "Course",
  name: "Advanced Certification in Medical Writing",
  description:
    "6-month online medical writing certification covering clinical regulatory documents (protocols, CSR, IB), PV safety writing (DSUR, PBRER, RMP), publication writing, and scientific communication standards.",
  provider: {
    "@type": "EducationalOrganization",
    name: "Clinidea Education",
    sameAs: "https://www.clinidea.in",
  },
  url: "https://www.clinidea.in/medical-writing-course/",
  courseMode: "Online",
  educationalLevel: "Professional Certification",
  timeRequired: "P6M",
  teaches: [
    "Clinical Study Reports",
    "Investigator Brochure",
    "DSUR PBRER Writing",
    "Scientific Publications",
    "Regulatory Documents",
    "ICH Guidelines",
  ],
  offers: {
    "@type": "Offer",
    category: "Professional Training",
    availability: "https://schema.org/InStock",
    url: "https://www.clinidea.in/medical-writing-course/",
  },
};

// ────────────────────────────────────────
// 7. FAQ SCHEMA BUILDER (reusable)
// ────────────────────────────────────────
export function buildFAQSchema(faqs) {
  // faqs: [{ question: "...", answer: "..." }, ...]
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ────────────────────────────────────────
// 8. BREADCRUMB SCHEMA BUILDER (reusable)
// ────────────────────────────────────────
export function buildBreadcrumbSchema(items) {
  // items: [{ name: "Home", url: "https://..." }, ...]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
