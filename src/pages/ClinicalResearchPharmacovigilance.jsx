import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchPharmacovigilance = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research & Pharmacovigilance");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Best Clinical Research & Pharmacovigilance Course Online | 100% Placement",
  "seoDescription": "Looking for the best Clinical Research and Pharmacovigilance course? Get advanced certification training with hands-on Pharmacovigilance database practice (we provide 3 months access with credentials) and 100% placement assistance. Enroll now!",
  "pageUrl": "/clinical-research-pharmacovigilance-course",
  "courseTitle": "Advanced Certification Course In Clinical Research & Pharmacovigilance",
  "courseSubtitle": "Clinical Research & Pharmacovigilance",
  "courseDescription": "Transform your career with the industry's best 6-month Advanced Certification Course in Clinical Research & Pharmacovigilance online training program. Master drug safety operations, ICH-GCP guidelines, get training on Argus Safety & LSMV, and hands-on Pharmacovigilance database processing (with 3 months access with credentials) through practical real-world case studies. This intensive pharmacovigilance certification course includes 3 Industry-Recognized Certifications (Course Completion, GCP, and Internship), ATS-friendly CV building, and 100% assured placement support to help you secure top jobs in leading pharmaceutical companies and CROs.",
  "heroImage": "/course-images/cr-pharmacovigilance.webp",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Pharmacovigilance",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech, BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Work as a CRA monitoring clinical trials and ensuring site compliance." },
    { "icon": "🛡️", "title": "Pharmacovigilance Associate", "desc": "Process ICSRs, manage safety data, and detect adverse drug events." },
    { "icon": "📊", "title": "Clinical Data Coordinator", "desc": "Manage clinical data, handle queries, and oversee data validation." },
    { "icon": "✍️", "title": "Aggregate Report Writer", "desc": "Draft essential regulatory safety reports like PSURs and DSURs." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Get hired fast with our ATS-friendly resume building, mock interviews, and referrals." },
    { "icon": "📜", "title": "3 Industry Certifications", "desc": "Validate your skills with Course Completion, GCP, and Internship certificates." }
  ],
  "keyHighlights": [
    "Industry-Oriented Curriculum",
    "Live Interactive Online Training",
    "Training by Industry Experts",
    "Hands-on Safety Database Access",
    "eTMF (Trial Master File) System Access",
    "Case-Study Based Learning",
    "ATS-Friendly Resume Building",
    "LinkedIn Profile Optimization",
    "Technical & HR Mock Interviews",
    "Personality Development & Soft Skills",
    "100% Assured Placement Support",
    "Lifetime Access to Recordings & Resources"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education helps students and professionals build successful careers in Clinical Research and Pharmacovigilance through industry-oriented learning and placement-focused methodologies. Unlike traditional theoretical programs, our approach focuses on:",
    "points": [
      "Practical Workflow Understanding & Database Access",
      "Regulatory & Compliance Training",
      "Professional Skill Development",
      "Corporate Interview & Placement Preparation"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "Our program is designed using practical workflow-based explanations, industry-oriented examples, and case-study discussions that help students understand real pharmaceutical and healthcare operations.",
    "points": [
      {
        "title": "Drug Development Lifecycle & Clinical Trial Workflow",
        "desc": "Understand the complete journey from drug discovery to post-marketing.",
        "icon": "🔄"
      },
      {
        "title": "Drug Safety Reporting & PV Operations",
        "desc": "Master pharmacovigilance operations, triage, and global safety standards.",
        "icon": "🛡️"
      },
      {
        "title": "eTMF System Access & Trial Documentation",
        "desc": "Get practical hands-on access to eTMF (Electronic Trial Master File) systems and master audit readiness.",
        "icon": "📋"
      },
      {
        "title": "Adverse Event Reporting Standards",
        "desc": "Get trained on processing and communicating adverse events effectively.",
        "icon": "📞"
      },
      {
        "title": "Hands-on Safety Database Access",
        "desc": "Gain real-world practical exposure with direct student access to the Pharmacovigilance database and MedDRA medical coding.",
        "icon": "💻"
      },
      {
        "title": "Audit, Inspection & QMS Readiness",
        "desc": "Prepare for real-world industry regulatory audits and Quality Management Systems.",
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
    "Freshers Looking for Pharma Careers",
    "Professionals Planning Career Transition"
  ],
  "modules": [
      {
          "title": "1. Clinical Research",
          "items": [
              "Drug Discovery Process & Clinical Trial Phases (Phase I–IV)",
              "ICH-GCP E6 (R2), Indian GCP & Global Regulatory Guidelines",
              "Protocol Development, CRF Design & Informed Consent Process",
              "Site Selection, Feasibility Studies & Trial Monitoring",
              "Trial Documentation (eTMF) & Source Data Verification (SDV)",
              "Safety Reporting (SAE, SUSAR) & 21 CFR Part 11 Compliance"
          ]
      },
      {
          "title": "2. Pharmacovigilance",
          "items": [
              "Fundamentals of Drug Safety & Adverse Drug Reactions (ADRs)",
              "Global PV Regulations (US FDA, EMA, CIOMS) & GVP Modules",
              "Individual Case Safety Reports (ICSR) Processing & Triage",
              "Medical Coding using MedDRA & WHO Drug Dictionary (WHO-DD)",
              "Training on Argus Safety & LSMV, and hands-on experience on Pharmacovigilance database (with 3 months access for practice)",
              "Aggregate Reports (PSUR/PBRER, DSUR) & Signal Detection",
              "Pharmacovigilance Audits, Inspections & QMS"
          ]
      },
      {
          "title": "3. Soft Skills, ATS Resume & Career Development",
          "items": [
              "Professional Corporate Communication & Email Writing",
              "Behavioral Interview Training (Mastering the STAR Method)",
              "One-on-one guidance for building an ATS-Compliant CV to beat screening bots",
              "LinkedIn Profile Optimization & Professional Branding",
              "Technical & HR Mock Interview Sessions with Detailed Feedback"
          ]
      }
  ],
  "faqs": [
    {
      "question": "What is the duration of this Clinical Research & Pharmacovigilance course?",
      "answer": "This is a comprehensive 6-month intensive training program conducted via online live interactive sessions, complete with session recordings and lifetime resource access."
    },
    {
      "question": "What certifications will I receive upon completion?",
      "answer": "Upon successfully completing the 6-month program, you will be awarded three distinct, industry-recognized credentials: a Course Completion Certificate, a Good Clinical Practice (GCP) Certificate, and an Internship Certificate."
    },
    {
      "question": "Does this course include practical software training?",
      "answer": "Absolutely. You will receive specialized, hands-on training on industry-leading safety databases such as Pharmacovigilance database (with 3 months access with credentials), as well as Medical Coding using MedDRA and the WHO Drug Dictionary (WHO-DD)."
    },
    {
      "question": "What kind of placement support does Clinidea Education offer?",
      "answer": "We offer 100% assured placement support. This includes helping you craft an ATS-friendly CV, optimizing your LinkedIn profile, conducting STAR method mock interviews, and providing internal referrals to top pharmaceutical companies and CROs."
    },
    {
      "question": "What are the career opportunities after completing this course?",
      "answer": "Graduates can pursue high-demand roles such as Drug Safety Associate, Pharmacovigilance Scientist, Clinical Research Coordinator, and Regulatory Affairs Executive in top multinational CROs and pharma companies."
    },
    {
      "question": "Is Pharmacovigilance a good career in India?",
      "answer": "Yes, Pharmacovigilance is a highly rewarding career in India. With the rapid growth of the pharmaceutical industry and strict global regulatory requirements for drug safety, there is a consistent and high demand for trained Pharmacovigilance professionals in top CROs and Pharma companies."
    }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchPharmacovigilance;
