import React, { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is the eligibility for these courses?",
      answer: "B.Pharm, M.Pharm, Life Sciences graduates, and Medical professionals (MBBS, BDS, etc.) are eligible."
    },
    {
      question: "Do you provide placement assistance?",
      answer: "Yes, we provide 100% assured placement support including resume building, mock interviews, and direct referrals to industry leaders."
    },
    {
      question: "Are the classes online or offline?",
      answer: "Our courses are 100% Live Online, giving you the flexibility to learn from anywhere without compromising on quality."
    },
    {
      question: "Will I get a certificate after completion?",
      answer: "Yes, an industry-recognized certificate is awarded upon successful completion of the course and assessments."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section bg-light py-5 py-md-5" id="faqs">
      <div className="container px-4 px-md-5">
        <div className="text-center mb-5">
          <div className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
            <i className="fa fa-question-circle me-2"></i> FAQS
          </div>
          <h2 className="fw-bold mb-3" style={{ color: "var(--color-primary)", letterSpacing: "-0.5px" }}>
            Frequently Asked Questions
          </h2>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px', fontSize: '1.1rem' }}>
            Find answers to the most common questions about Clinidea Education's courses, placements, and certification.
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="faq-accordion">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item card border-0 mb-3 shadow-sm rounded-4 overflow-hidden ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                  style={{ transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  <div className="faq-question card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
                    <h4 className="mb-0 fw-bold" style={{ fontSize: '1.1rem', color: activeIndex === index ? 'var(--color-primary)' : '#334155', transition: 'color 0.3s ease' }}>
                      {faq.question}
                    </h4>
                    <span 
                      className="faq-toggle-icon rounded-circle bg-light d-flex justify-content-center align-items-center shrink-0 ms-3" 
                      style={{ width: '40px', height: '40px', transition: 'transform 0.4s ease', transform: activeIndex === index ? 'rotate(180deg)' : 'rotate(0deg)', backgroundColor: activeIndex === index ? 'var(--color-primary)' : '#f8fafc', color: activeIndex === index ? 'white' : 'var(--color-primary)' }}
                    >
                      <i className={`fa ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                    </span>
                  </div>
                  
                  <div 
                    className="faq-answer-wrapper" 
                    style={{ 
                      maxHeight: activeIndex === index ? '150px' : '0', 
                      opacity: activeIndex === index ? '1' : '0',
                      overflow: 'hidden', 
                      transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                      backgroundColor: '#f8fafc'
                    }}
                  >
                    <div className="faq-answer card-body p-4 pt-2 border-top-0">
                      <p className="mb-0 text-muted" style={{ fontSize: '1rem', lineHeight: '1.6' }}>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .faq-item {
          border-left: 4px solid transparent !important;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .faq-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .faq-item.active {
          border-left-color: var(--color-primary) !important;
          background-color: #fff !important;
        }
        @media (max-width: 768px) {
          .faq-question h4 {
            font-size: 1rem !important;
            line-height: 1.4;
          }
          .faq-toggle-icon {
            width: 32px !important;
            height: 32px !important;
          }
          .faq-answer p {
            font-size: 0.95rem !important;
          }
        }
      `}} />
    </section>
  );
};

export default FAQSection;
