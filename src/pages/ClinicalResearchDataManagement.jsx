import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchDataManagement = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research & Data Management");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Data Management Course | Clinidea Education",
  "seoDescription": "Learn Clinical Research & Data Management. Join Clinidea Education for a 6-month comprehensive online certification.",
  "pageUrl": "/clinical-research-data-management-course",
  "courseTitle": "Advanced Certification Course in Clinical Research & Clinical Data Management",
  "courseSubtitle": "Clinical Research & Data Management",
  "courseDescription": "Acquire top-demand skills in clinical trials and IT data systems with our 6-month Advanced Certification Course in Clinical Research & Clinical Data Management (CDM). Learn EDC study setup, query management, data cleaning, CDISC standards, and medical coding systems through live interactive online classes. Features hands-on practice, 3 Industry-Recognized Certifications, STAR interview preparation, ATS resume building, and 100% assured placement support.",
  "heroImage": "/course-images/cr-data-management.avif",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Data Management",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Audit trial documentation, monitor site operations, and maintain GCP standards." },
    { "icon": "📊", "title": "Clinical Data Manager", "desc": "Oversee the entire data management lifecycle from study build to database lock." },
    { "icon": "🔍", "title": "Clinical Data Coordinator", "desc": "Perform data entry validation, run edit check validations, and manage discrepancy queries." },
    { "icon": "⚕️", "title": "Medical Coder (CDM)", "desc": "Translate trial event reports into standardized codes using MedDRA and WHO-DD." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Access one-on-one resume formatting, LinkedIn building, mock calls, and corporate referrals." },
    { "icon": "📜", "title": "3 Industry Certifications", "desc": "Boost your CV with Course Completion, GCP, and Practical Internship certificates." }
  ],
  "keyHighlights": [
    "Specialized CDM & EDC System Focused Curriculum",
    "Live Online Interactive Mentorship",
    "Clinical Data Management (CDM) / EDC System Access",
    "eTMF (Trial Master File) System Access",
    "MedDRA & WHO-DD Coding Guidelines",
    "ICH-GCP Guidelines & 21 CFR Part 11 Compliance",
    "ATS-Friendly CV Construction",
    "LinkedIn Profile Optimization",
    "Mock Interviews & Corporate Communication Skills",
    "100% Dedicated Placement Support",
    "Lifetime Access to Session Recordings & Study Material"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education specializes in clinical database and operations training. Our placement-oriented data management program is built around standard CRO operations, emphasizing:",
    "points": [
      "Real-World EDC and eTMF Database Access",
      "Data Cleaning, Discrepancy & Query Management Workflows",
      "Industry Data Standards (CDISC, 21 CFR Part 11)",
      "Mock Interviews & Resume Upgradation"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "We ensure you understand the entire database design, data cleaning, and validation workflows that data managers execute daily.",
    "points": [
      {
        "title": "Drug Development & Trial Workflows",
        "desc": "Understand the clinical trial phases, drug discovery processes, and site operations.",
        "icon": "🔄"
      },
      {
        "title": "CDM Lifecycle & eTMF System Access",
        "desc": "Master DMP development, CRF designing, eTMF file management, and database locks.",
        "icon": "📋"
      },
      {
        "title": "EDC System Access & CRF Design",
        "desc": "Practice Electronic Data Capture system setup with direct database login access for clinical trial data entry.",
        "icon": "💻"
      },
      {
        "title": "Data Validation & Query Management",
        "desc": "Write edit checks, perform data cleaning, open/resolve discrepancy queries, and issue queries.",
        "icon": "🔍"
      },
      {
        "title": "Medical Coding Dictionary Standards",
        "desc": "Apply MedDRA and WHO Drug Dictionary coding standard terminology to adverse events and medicines.",
        "icon": "⚕️"
      },
      {
        "title": "Regulatory Compliance & Audit Readiness",
        "desc": "Understand 21 CFR Part 11 standards and data security guidelines to prepare for audits.",
        "icon": "✅"
      }
    ]
  },
  "targetAudience": [
    "B.Pharm & M.Pharm Graduates",
    "PharmD Graduates",
    "BSc & MSc Life Science Students",
    "Biotechnology & Bioinformatics Graduates",
    "Healthcare & Allied Science Professionals",
    "Freshers Seeking a Career in Clinical Data Management"
  ],
  "faqs": [
    {
      "question": "What is the role of a Clinical Data Manager?",
      "answer": "A Clinical Data Manager (CDM) ensures that clinical trial data is collected, managed, and reported accurately and securely. CDMs design CRFs, validate database entries, run quality checks, resolve discrepancy queries, and lock clinical databases for statistical analysis."
    },
    {
      "question": "Which databases are covered in this course?",
      "answer": "This course covers the practical core workflows of Electronic Data Capture (EDC) systems, explaining CRF setup, data entry, edit checks, discrepancy management, and database locking. It also includes coding terminology standard software MedDRA and WHO-DD."
    },
    {
      "question": "Does this course offer placement support?",
      "answer": "Yes, we provide 100% assured placement support. This includes building ATS-compliant CVs, mock technical and HR interviews, LinkedIn profile optimization, and direct referrals to top MNCs, pharma companies, and CROs."
    },
    {
      "question": "Who is eligible to enroll in this course?",
      "answer": "Anyone with a background in Pharmacy, Life Sciences, Biotechnology, Medical Sciences (MBBS, BDS, BHMS, BAMS), or nursing is eligible to apply for this clinical data management certification."
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

export default ClinicalResearchDataManagement;
