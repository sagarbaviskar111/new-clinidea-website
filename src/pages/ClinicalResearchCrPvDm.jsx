import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchCrPvDm = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research, Pharmacovigilance & Data Management");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research, Pharmacovigilance & Data Management | Clinidea Education",
  "seoDescription": "Master Clinical Research, Pharmacovigilance & Data Management with our premium certification course.",
  "pageUrl": "/clinical-research-cr-pv-dm-course",
  "courseTitle": "Advanced Certification Course in Clinical Research, Pharmacovigilance & Clinical Data Management",
  "courseSubtitle": "Clinical Research, Pharmacovigilance & Data Management",
  "courseDescription": "Accelerate your healthcare career with the industry's most comprehensive 6-month Advanced Certification Course in Clinical Research, Pharmacovigilance & Clinical Data Management. Master drug safety databases, clinical trial regulations, EDC platforms, and medical coding systems through practical live interactive sessions. This premium training program features training on Argus Safety & LSMV, and hands-on practical training on Pharmacovigilance database and EDC databases (we provide 3 months access with credentials), 3 Industry-Recognized Certifications, STAR-method mock interviews, ATS resume optimization, and 100% assured placement support.",
  "heroImage": "/course-images/cr-pv-dm.webp",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research, Pharmacovigilance & Data Management",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Monitor clinical trial sites, audit documents, and ensure strict GCP compliance." },
    { "icon": "🛡️", "title": "Drug Safety Associate", "desc": "Process adverse event cases (ICSRs) and manage pharmacovigilance safety databases." },
    { "icon": "📊", "title": "Clinical Data Manager / Coordinator", "desc": "Manage EDC database setup, clean trial data, resolve queries, and execute database lock." },
    { "icon": "⚕️", "title": "Medical Coder", "desc": "Code clinical events, history, and medications using MedDRA and WHO Drug dictionaries." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Stand out to hiring managers with custom resume building, mock interviews, and internal referrals." },
    { "icon": "📜", "title": "3 Professional Credentials", "desc": "Secure Course Completion, GCP Certification, and Internship experience proof." }
  ],
  "keyHighlights": [
    "Combined 3-in-1 Premium Domain Curriculum",
    "Live Mentor-Led Interactive Training",
    "Hands-on Safety Database Access",
    "Clinical Data Management (CDM) / EDC System Access",
    "eTMF (Trial Master File) System Access",
    "MedDRA & WHO-DD Coding Standards",
    "ICH-GCP E6 (R2) & FDA Compliance Training",
    "ATS Resume & LinkedIn Optimization",
    "Technical & HR STAR Mock Interviews",
    "100% Dedicated Placement Support",
    "Lifetime Access to Session Recordings & Resources"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education bridges the gap between academic education and industry requirements. Our 3-in-1 program combines three highly lucrative healthcare IT sectors into one comprehensive roadmap, focusing on:",
    "points": [
      "End-to-End Practical Workflow Understanding",
      "Triple Database Access (Pharmacovigilance database, eTMF & EDC/CDM)",
      "Global Regulatory & Quality Compliance Standards",
      "ATS-Compliant CV and STAR Interview Preparation"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "Our curriculum is structured to replicate real-world clinical operations, giving you absolute clarity on pharmaceutical workflows and clinical data processing.",
    "points": [
      {
        "title": "Drug Development & Trial Workflows",
        "desc": "Understand the complete journey from drug discovery to regulatory approval and marketing.",
        "icon": "🔄"
      },
      {
        "title": "Drug Safety Reporting & PV Operations",
        "desc": "Master adverse event triaging, processing, narrative writing, and global safety databases.",
        "icon": "🛡️"
      },
      {
        "title": "Clinical Data Management & EDC Access",
        "desc": "Learn database design, validation, and get direct student access to EDC platforms for data cleaning.",
        "icon": "📊"
      },
      {
        "title": "Medical Coding & Dictionaries",
        "desc": "Apply standard medical coding for adverse events and medications using MedDRA and WHO-DD.",
        "icon": "⚕️"
      },
      {
        "title": "Hands-on Safety Database & eTMF Access",
        "desc": "Navigate industry safety databases (Pharmacovigilance database), eTMF systems, and clinical trial data platforms (EDC) with direct student login access.",
        "icon": "💻"
      },
      {
        "title": "Audit, Inspection & QMS Readiness",
        "desc": "Prepare for regulatory inspectability and Quality Management System standards.",
        "icon": "✅"
      }
    ]
  },
  "targetAudience": [
    "B.Pharm & M.Pharm Graduates",
    "PharmD Graduates",
    "BSc & MSc Life Science Students",
    "Biotechnology Graduates",
    "Healthcare & Medical Graduates",
    "Freshers Seeking a Career in Pharma IT",
    "Professionals looking to transition into CDM/PV"
  ],
  "faqs": [
    {
      "question": "What is the benefit of a combined CR, PV, and CDM course?",
      "background": "Unlike single-domain courses, a combined certification gives you a massive advantage by qualifying you for multiple roles—Clinical Research Associate, Drug Safety Associate, or Clinical Data Coordinator—vastly increasing your job prospects.",
      "answer": "This combined program gives you comprehensive expertise across three major domains: Clinical Trials, Pharmacovigilance, and Data Management. By learning all three, you qualify for a much broader range of job roles, making you highly competitive for top MNCs and CROs."
    },
    {
      "question": "Will I get hands-on software experience?",
      "answer": "Yes. This program includes intensive hands-on practical training on Pharmacovigilance database (we provide 3 months access with credentials), EDC (Electronic Data Capture) systems, and medical coding systems using MedDRA and the WHO Drug Dictionary."
    },
    {
      "question": "What placement assistance is provided?",
      "answer": "We provide 100% assured placement support, which includes direct referrals to top CROs and pharmaceutical companies, customized ATS resume drafting, LinkedIn profile optimization, and multiple technical and HR mock interview preparation sessions."
    },
    {
      "question": "What is the qualification eligibility for this course?",
      "answer": "Graduates or final-year students of Pharmacy (B.Pharm, M.Pharm, PharmD), Life Sciences (BSc, MSc), Biotechnology, Medical/Healthcare degrees (MBBS, BDS, BHMS, BAMS), and other allied science branches are eligible."
    },
    {
      "question": "Are Clinical Research and Pharmacovigilance good career options in India?",
      "answer": "Yes, Clinical Research, Pharmacovigilance, and Clinical Data Management are highly rewarding careers in India. With the rapid expansion of global clinical trials and stringent drug safety regulations, top CROs and Pharmaceutical companies constantly hire trained professionals, offering excellent salary growth and job stability."
    }
  ],
  "modules": [
      {
          "title": "Clinical Research",
          "items": [
              "Drug discovery process & clinical trial phases (Phase I–IV)",
              "ICH-GCP guidelines, FDA regulations & ethical compliance",
              "Clinical trial design, protocol development & amendments",
              "Essential documents: Protocol, Investigator Brochure (IB), ICF",
              "Clinical site selection, initiation & feasibility studies",
              "Trial monitoring, site management & patient recruitment",
              "Ethics committee submissions & regulatory approvals",
              "Trial documentation, TMF management & audit readiness"
          ]
      },
      {
          "title": "Pharmacovigilance",
          "items": [
              "Fundamentals of drug safety & adverse drug reactions (ADRs)",
              "Global regulatory guidelines: ICH, FDA, EMA, WHO",
              "Individual Case Safety Reports (ICSRs) processing & evaluation",
              "Narrative writing & causality assessment (WHO-UMC scale)",
              "Training on Argus Safety & LSMV, and hands-on experience on Pharmacovigilance database (with 3 months access for practice)",
              "Aggregate safety reports: PSUR, PBRER & DSUR preparation",
              "Risk management plans (RMP) & REMS implementation",
              "Signal detection, data mining & safety trend analysis",
              "PV audits, inspections & quality management systems (QMS)"
          ]
      },
      {
          "title": "Clinical Data Management (CDM)",
          "items": [
              "Clinical Data Management lifecycle & study setup",
              "Case Report Form (CRF) design & data capture systems (EDC)",
              "Data validation, discrepancy management & query resolution",
              "Edit checks, data cleaning & database integrity checks",
              "Medical coding using MedDRA & WHO Drug Dictionary",
              "SAE reconciliation & external data handling",
              "CDISC standards (SDTM, ADaM) & database lock process",
              "Regulatory compliance (21 CFR Part 11) & audit readiness"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchCrPvDm;
