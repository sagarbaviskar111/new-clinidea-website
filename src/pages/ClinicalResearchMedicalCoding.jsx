import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchMedicalCoding = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research and Medical Coding");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Medical Coding Course | Clinidea Education",
  "seoDescription": "Master Medical Coding and Clinical Research with our comprehensive certification program.",
  "pageUrl": "/clinical-research-medical-coding-course",
  "courseTitle": "Advanced Certification Course in Clinical Research & Medical Coding",
  "courseSubtitle": "Clinical Research and Medical Coding",
  "courseDescription": "Build a secure career in the global healthcare IT sector with our 6-month Advanced Certification Course in Clinical Research & Medical Coding. Master the essential medical terminologies, ICD-10-CM coding, ICD-11 concepts, and coding dictionaries like MedDRA and WHO Drug Dictionary (WHO-DD). Get practical workflow training, 3 Industry-Recognized Certifications, STAR interview preparation, ATS resume building, and 100% assured placement support.",
  "heroImage": "/course-images/cr-medical-coding.webp",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research and Medical Coding",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Audit trial documentation, monitor site operations, and maintain GCP standards." },
    { "icon": "⚕️", "title": "Medical Coder", "desc": "Assign accurate medical codes to diagnoses, anatomical locations, and drugs." },
    { "icon": "🔍", "title": "Coding Quality Auditor", "desc": "Ensure coding accuracy, compliance with regulatory standards, and run query reconciliations." },
    { "icon": "📊", "title": "Clinical Data Analyst", "desc": "Ensure medical data coded in CDM/PV databases conforms to dictionary standards." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Access mock technical and HR calls, CV building, and direct corporate references." },
    { "icon": "📜", "title": "3 Industry Credentials", "desc": "Earn Course Completion, GCP, and Practical Internship certificates." }
  ],
  "keyHighlights": [
    "Specialized Medical Coding & Dictionary Centric Curriculum",
    "Live Interactive Online Mentorship",
    "eTMF (Trial Master File) System Access",
    "MedDRA & WHO-DD Coding Guidelines",
    "ICD-10-CM & CPT Coding Workflow Concepts",
    "ICH-GCP Guidelines & Regulatory Standards",
    "ATS-Friendly Resume Construction",
    "LinkedIn Profile Optimization",
    "Mock Interviews & STAR Method Training",
    "100% Dedicated Placement Support",
    "Lifetime Access to Session Recordings & Resources"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education prepares you for core operational roles in top pharma companies and healthcare IT giants. Our placement-oriented coding program emphasizes:",
    "points": [
      "Real-World Coding Case Studies & eTMF Access",
      "MedDRA & WHO-DD Coding Dictionaries Standards",
      "Clinical Terminology and Pathology Basics",
      "Mock Interviews & STAR Method Practice"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "We ensure you understand the clinical trial processes and how to correctly assign and validate medical codes for safety and research databases.",
    "points": [
      {
        "title": "Drug Development & Trial Workflows",
        "desc": "Understand clinical trial phases, drug discovery processes, and site operations.",
        "icon": "🔄"
      },
      {
        "title": "Medical Terminology & eTMF Access",
        "desc": "Master anatomy and pathology basics, and get practical hands-on access to eTMF systems for documentation.",
        "icon": "📋"
      },
      {
        "title": "MedDRA Coding Dictionaries",
        "desc": "Learn adverse event coding, system organ classes, coding hierarchy, and standard terms.",
        "icon": "⚕️"
      },
      {
        "title": "WHO Drug Dictionary Coding",
        "desc": "Master concomitant medications, active substances, and medicinal products coding.",
        "icon": "💊"
      },
      {
        "title": "Coding Discrepancy & Query Handling",
        "desc": "Handle coding discrepancies, data cleaning, and query resolution in clinical trials.",
        "icon": "🔍"
      },
      {
        "title": "Quality Control & Audit Readiness",
        "desc": "Understand standard coding guidelines, compliance, and quality auditing protocols.",
        "icon": "✅"
      }
    ]
  },
  "targetAudience": [
    "B.Pharm & M.Pharm Graduates",
    "PharmD Graduates",
    "BSc & MSc Life Science Students",
    "Biotechnology & Life Science Professionals",
    "Medical Science Graduates (BDS, BHMS, BAMS, MBBS)",
    "Freshers Seeking a Career in Medical Coding"
  ],
  "faqs": [
    {
      "question": "What is Medical Coding in Clinical Research?",
      "answer": "Medical coding involves translating medical descriptions of diagnoses, drug names, and adverse events from clinical trial reports into standard codes. This ensures uniform reporting across global regulatory bodies like FDA using MedDRA and WHO-DD dictionaries."
    },
    {
      "question": "Which coding dictionaries are taught in this course?",
      "answer": "This course covers standard global dictionaries: MedDRA (for adverse events, medical history, and indications) and the WHO Drug Dictionary (WHO-DD for drugs and active ingredients). It also introduces ICD-10-CM standards."
    },
    {
      "question": "Will I get job placement assistance?",
      "answer": "Yes, we provide 100% assured placement support. This includes customized ATS resume writing, STAR-based technical & HR mock interviews, LinkedIn profile optimization, and direct referrals to top CROs and healthcare companies."
    },
    {
      "question": "Who is eligible for this course?",
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
          "title": "Medical Coding",
          "items": [
              "Introduction to medical coding in clinical research & pharmacovigilance",
              "Medical terminology standards & clinical documentation understanding",
              "Coding dictionaries: MedDRA (adverse events) & WHO Drug Dictionary (drugs)",
              "Coding of adverse events, diseases & medical history terms",
              "Concomitant medications coding & reconciliation process",
              "SAE (Serious Adverse Event) coding & consistency checks",
              "Query management & discrepancy resolution in coding activities",
              "Coding quality control (QC) & audit readiness",
              "Role of medical coding in CDM, PV & regulatory submissions",
              "Regulatory compliance & standard coding guidelines adherence"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchMedicalCoding;
