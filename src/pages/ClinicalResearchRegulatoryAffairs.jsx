import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchRegulatoryAffairs = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research & Regulatory Affairs");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Regulatory Affairs | Clinidea Education",
  "seoDescription": "Advance your career with our Clinical Research & Regulatory Affairs course. Master global regulatory guidelines and compliance.",
  "pageUrl": "/clinical-research-regulatory-affairs-course",
  "courseTitle": "Advanced Certification Course in Clinical Research & Regulatory Affairs",
  "courseSubtitle": "Clinical Research & Regulatory Affairs",
  "courseDescription": "Build specialized expertise in global pharma drug compliance with our 6-month Advanced Certification Course in Clinical Research & Regulatory Affairs. Learn CTD/eCTD dossier compilation, submission workflows (IND, NDA, ANDA), CDSCO & global health authority regulations (USFDA, EMA) through live interactive online training. Features 3 Industry-Recognized Certifications, STAR interview prep, ATS resume support, and 100% assured placement support.",
  "heroImage": "/course-images/cr-regulatory-affairs.webp",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Regulatory Affairs",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Audit trial documentation, monitor site operations, and maintain GCP standards." },
    { "icon": "⚖️", "title": "Regulatory Affairs Associate", "desc": "Draft, compile, and submit regulatory dossiers to global health authorities." },
    { "icon": "📋", "title": "Dossier Compilation Executive", "desc": "Organize data according to CTD/eCTD formatting guidelines across modules." },
    { "icon": "🔍", "title": "Regulatory Compliance Specialist", "desc": "Monitor post-approval changes, manage variations, renewals, and ensure labeling compliance." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Access mock technical and HR calls, CV building, and direct corporate references." },
    { "icon": "📜", "title": "3 Professional Certifications", "desc": "Earn Course Completion, GCP, and Practical Internship credentials." }
  ],
  "keyHighlights": [
    "Specialized Regulatory Affairs & Dossier Compilation Curriculum",
    "Live Online Interactive Mentorship Sessions",
    "CTD/eCTD Dossier (IND, NDA, ANDA) Formats",
    "Global Regulatory Guidelines (USFDA, EMA, CDSCO, ICH)",
    "ICH-GCP E6 (R2) & Post-Approval Lifecycle Changes",
    "ATS-Friendly CV Construction",
    "LinkedIn Profile Optimization",
    "Technical & HR STAR Mock Interviews",
    "100% Dedicated Placement Support",
    "Lifetime Access to Session Recordings & Resources"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education prepares you for crucial regulatory and compliance roles in global pharma companies. Our placement-oriented regulatory affairs program focuses on:",
    "points": [
      "CTD/eCTD Dossier Formats & Electronic Submissions",
      "Global Health Authority Approval Pathways",
      "Regulatory Variations & Lifecycle Management",
      "Mock Interviews & Resume Upgradation"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "We ensure you understand the clinical trial compliance guidelines and how to compile and submit dossiers to health authorities.",
    "points": [
      {
        "title": "Drug Development & Regulatory Pathways",
        "desc": "Understand the clinical trial phases, drug discovery processes, and global approval pathways.",
        "icon": "🔄"
      },
      {
        "title": "Dossier Preparation (CTD/eCTD)",
        "desc": "Compile Module 1-5 documents for IND, NDA, ANDA, and MAA submissions.",
        "icon": "📋"
      },
      {
        "title": "Regulatory Guidelines Compliance",
        "desc": "Master USFDA, EMA, CDSCO, and global ICH guidelines and regulations.",
        "icon": "🛡️"
      },
      {
        "title": "Clinical Trial Approvals & Submissions",
        "desc": "Learn CTA submission processes to regulators and ethics committees.",
        "icon": "🏥"
      },
      {
        "title": "Post-Marketing Compliance",
        "desc": "Understand variations, renewals, drug safety regulations, and labeling compliance.",
        "icon": "🔍"
      },
      {
        "title": "Inspection, Auditing & QMS Readiness",
        "desc": "Prepare dossiers and organisations for regulatory inspectability and audits.",
        "icon": "✅"
      }
    ]
  },
  "targetAudience": [
    "B.Pharm & M.Pharm Graduates",
    "PharmD Graduates",
    "BSc & MSc Life Science Students",
    "Biotechnology & Life Science Professionals",
    "Healthcare & Medical Graduates (BDS, BHMS, BAMS, MBBS)",
    "Freshers Seeking a Career in Regulatory Affairs"
  ],
  "faqs": [
    {
      "question": "What is Regulatory Affairs in Clinical Research?",
      "answer": "Regulatory Affairs (RA) acts as the link between pharmaceutical companies and global regulatory authorities (like FDA, EMA, or CDSCO). RA professionals ensure that all drug development and manufacturing processes comply with laws to secure and maintain market approvals."
    },
    {
      "question": "What is a CTD/eCTD Dossier?",
      "answer": "The Common Technical Document (CTD) is a set of specifications for a regulatory submission dossier. The electronic CTD (eCTD) is the standard format for submitting dossiers (IND, NDA, ANDA) to regulatory agencies like the USFDA and EMA."
    },
    {
      "question": "Does this course offer placement support?",
      "answer": "Yes, we provide 100% assured placement support. This includes customized ATS resume writing, STAR-based technical & HR mock interviews, LinkedIn profile optimization, and direct referrals to top CROs and healthcare companies."
    },
    {
      "question": "Who is eligible to enroll in this course?",
      "answer": "Life science graduates (BSc, MSc), pharmacy graduates (B.Pharm, M.Pharm, PharmD), and medical practitioners (BDS, BHMS, BAMS, MBBS, nursing) are eligible to enroll."
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
          "title": "Regulatory Affairs (RA)",
          "items": [
              "Overview of global regulatory authorities (USFDA, EMA, CDSCO, ICH)",
              "Drug development lifecycle & approval pathways",
              "CTD/eCTD dossier structure & compilation",
              "IND, NDA, ANDA & ANDS submission processes",
              "Regulatory strategy planning & product registration",
              "Post-approval changes, variations & lifecycle management",
              "Labelling, packaging & artwork compliance requirements",
              "Regulatory documentation, tracking & submission management"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchRegulatoryAffairs;
