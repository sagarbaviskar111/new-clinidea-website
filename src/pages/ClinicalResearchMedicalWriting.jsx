import React, { useEffect, useState } from 'react';
import CoursePageLayout from '../components/CoursePageLayout';
import { BASE_URL } from '../config';

const ClinicalResearchMedicalWriting = () => {
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/courses`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data && Array.isArray(data)) {
           const course = data.find(c => c.name === "Clinical Research & Medical Writing");
           if (course) setCourseData(course);
        }
      })
      .catch(err => console.error('Error fetching course API:', err));
  }, []);

  const courseProps = {
  "seoTitle": "Clinical Research & Medical Writing Course | Clinidea Education",
  "seoDescription": "Become an expert Medical Writer with our Clinical Research & Medical Writing certification course.",
  "pageUrl": "/clinical-research-medical-writing-course",
  "courseTitle": "Advanced Certification Course in Clinical Research & Medical Writing",
  "courseSubtitle": "Clinical Research & Medical Writing",
  "courseDescription": "Master the art of scientific and regulatory writing with our 6-month Advanced Certification Course in Clinical Research & Medical Writing. Learn to draft essential documents like Clinical Study Reports (CSR), protocols, Investigator's Brochures (IB), aggregate safety summaries, and peer-reviewed manuscripts. Features live interactive online classes, 3 Industry-Recognized Certifications, STAR interview preparation, ATS resume building, and 100% assured placement support.",
  "heroImage": "/course-images/cr-medical-writing.webp",
  "youtubeUrl": "",
  "ctaCourseName": "Clinical Research & Medical Writing",
  "details": {
      "duration": "6 Months Intensive Training",
      "mode": "Online (Live Interactive)",
      "eligibility": "B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants."
  },
  "outcomes": [
    { "icon": "🏥", "title": "Clinical Research Associate", "desc": "Audit trial documentation, monitor site operations, and maintain GCP standards." },
    { "icon": "✍️", "title": "Medical Writer (Regulatory)", "desc": "Draft study protocols, Investigator's Brochures, Informed Consent Forms, and Clinical Study Reports." },
    { "icon": "🛡️", "title": "Safety Writer (PV)", "desc": "Draft regulatory safety reports like PSURs, DSURs, PBRERs, and Risk Management Plans." },
    { "icon": "🔬", "title": "Scientific Writer", "desc": "Draft peer-reviewed journal articles, review articles, clinical abstracts, and conference posters." },
    { "icon": "🤝", "title": "ATS-Optimized Placements", "desc": "Access one-on-one resume drafting, LinkedIn building, mock interviews, and corporate referrals." },
    { "icon": "📜", "title": "3 Industry Certifications", "desc": "Boost your profile with Course Completion, GCP, and Practical Internship certificates." }
  ],
  "keyHighlights": [
    "Specialized Regulatory & Scientific Writing Curriculum",
    "Live Online Interactive Mentorship Sessions",
    "Writing Protocols, CSRs, IBs, and ICFs",
    "Aggregate Safety Reports (PSUR/DSUR) Drafting",
    "ICH-GCP E6 (R2) & ICH E3 Guidelines Compliance",
    "ATS-Friendly CV Construction",
    "LinkedIn Profile Optimization",
    "Technical & HR STAR Mock Interviews",
    "100% Dedicated Placement Support",
    "Lifetime Access to Session Recordings & Resources"
  ],
  "whyChooseUs": {
    "title": "Why Choose Clinidea Education?",
    "description": "Clinidea Education prepares you for core documentation and medical communications roles in global pharma companies. Our placement-oriented writing program focuses on:",
    "points": [
      "Regulatory Writing Standards (ICH E3, FDA, EMA)",
      "Scientific Writing & Publication Formatting Guidelines",
      "Document Quality Control & Reference Management Tools",
      "Mock Interviews & ATS Resume Building"
    ]
  },
  "trainingApproach": {
    "title": "Practical Workflow-Based Learning",
    "description": "We ensure you understand the clinical trial process and how to structure and write every key clinical document standard required by regulatory bodies.",
    "points": [
      {
        "title": "Drug Development & Trial Workflows",
        "desc": "Understand the clinical trial phases, drug discovery processes, and site operations.",
        "icon": "🔄"
      },
      {
        "title": "Clinical Document Protocol & IB Development",
        "desc": "Learn to write study protocols, investigator brochures, and informed consent forms.",
        "icon": "✍️"
      },
      {
        "title": "Clinical Study Reports (CSR) Writing",
        "desc": "Master CSR structuring, data presentation, and summary document drafting.",
        "icon": "📋"
      },
      {
        "title": "Scientific & Publication Writing",
        "desc": "Draft peer-reviewed journal abstracts, manuscripts, and conference posters.",
        "icon": "🔬"
      },
      {
        "title": "Regulatory Documentation Guidelines",
        "desc": "Understand FDA, EMA, and ICH guidelines (ICH E3, E6) for regulatory writing.",
        "icon": "🛡️"
      },
      {
        "title": "Quality Control & Peer Review",
        "desc": "Ensure document quality, proofreading, style guides, and reference management.",
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
    "Freshers Seeking a Career in Medical Writing"
  ],
  "faqs": [
    {
      "question": "What is Medical Writing in Clinical Research?",
      "answer": "Medical writing involves creating well-structured scientific documents that describe clinical trial results, product use, and other medical information. Regulatory medical writers write documents required by government agencies like FDA (e.g. Protocols, CSRs, IBs)."
    },
    {
      "question": "What is the difference between regulatory and scientific writing?",
      "answer": "Regulatory writing involves preparing documents for regulatory submissions (such as IND, NDA, CSRs) according to strict guidelines. Scientific/publication writing involves writing research papers, journal articles, and abstracts for medical conferences."
    },
    {
      "question": "Does this course offer job placement support?",
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
          "title": "Medical Writing",
          "items": [
              "Principles of scientific writing & medical communication",
              "Literature search, referencing tools & plagiarism control",
              "Clinical trial documents: Protocol, CSR, IB, ICF writing",
              "Pharmacovigilance documents: RMP, DSUR, PBRER preparation",
              "Regulatory writing for submissions & regulatory summaries",
              "Publication writing: manuscripts, abstracts & posters",
              "Medical editing, QC process & style guide adherence",
              "Tools used in medical writing (EndNote, referencing software)"
          ]
      }
  ]
};

  return <CoursePageLayout {...courseProps} courseData={courseData} />;
};

export default ClinicalResearchMedicalWriting;
