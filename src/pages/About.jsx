import React, { useState, useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { Autoplay } from 'swiper/modules';
import '../../public/css/StudentSlider.css';
import { BASE_URL } from '../config';

const About = () => {
  const [studentImages, setStudentImages] = useState([]);

  useEffect(() => {
    if (window.initializeTheme) window.initializeTheme(window.jQuery);

    fetch(`${BASE_URL}/api/studentsimg`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setStudentImages(data);
        }
      })
      .catch(err => console.warn('API Error for student images:', err.message));
  }, []);

  return (
    <div>
      <SEOHead
        title="About Us | Top Clinical Research & Pharmacovigilance Institute | Clinidea"
        description="Learn more about Clinidea Education, our expert founders, faculty, and our mission to provide placement-backed training in Clinical Research, Pharmacovigilance, and Data Management."
        canonical="https://clinidea.in/about"
        ogImage="https://clinidea.in/images/about.webp"
      />

      {/* Top Contact Bar */}


      {/* Navbar */}


      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>About Us <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
              <h1 className="mb-0 bread">About Clinidea Education</h1>
            </div>
          </div>
        </div>
      </section>

      {/* Main About Content */}
      <style>{`
        .about-modern-section {
          padding: 80px 0;
          background: var(--color-bg-light);
          color: var(--color-text-dark);
          font-family: var(--font-sans);
        }
        .about-intro-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--color-text-dark);
          margin-bottom: 20px;
        }
        .about-intro-text {
          font-size: 1.15rem;
          color: var(--color-text-muted);
          line-height: 1.8;
          max-width: 900px;
          margin: 0 auto;
        }
        .highlight-bold {
          color: var(--color-secondary);
          font-weight: 700;
        }
        .about-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 30px;
          margin-top: 60px;
        }

        .about-card-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          display: inline-block;
        }
        .about-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 15px;
        }
        .about-card-text {
          font-size: 1rem;
          color: var(--color-text-muted);
          line-height: 1.7;
        }
        .impact-section {
          background: linear-gradient(135deg, #ebf8ff 0%, var(--color-bg-light) 100%);
          padding: 80px 0;
        }
        .impact-list {
          list-style: none;
          padding: 0;
          margin-top: 30px;
        }
        .impact-list li {
          font-size: 1.1rem;
          color: var(--color-text-dark);
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;
          background: #fff;
          padding: 15px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02);
        }
        .impact-list li::before {
          content: '✔';
          color: #3182ce;
          font-weight: bold;
          margin-right: 15px;
          font-size: 1.2rem;
        }
        .why-us-section {
          padding: 80px 0;
          background: #fff;
        }
        .why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 25px;
          margin-top: 50px;
        }
        .why-item {
          display: flex;
          align-items: flex-start;
          background: var(--color-bg-light);
          padding: 25px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          transition: background 0.3s ease, transform 0.3s ease;
        }
        .why-item:hover {
          background: var(--color-white);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .why-icon {
          font-size: 1.8rem;
          margin-right: 15px;
          min-width: 35px;
        }
        .why-content h4 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 8px;
        }
        .why-content p {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.6;
        }
        @media (max-width: 991px) {
          .founder-text {
            text-align: center !important;
            margin-top: 30px;
          }
        }
      `}</style>

      {/* Intro Section */}
      <section className="about-modern-section text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h2 className="about-intro-title">About Clinidea Education</h2>
              <p className="about-intro-text mb-4">
                Clinidea Education is a career-focused training institute dedicated to helping students build strong, <span className="highlight-bold">job-ready skills</span> in Clinical Research, Pharmacovigilance, Clinical Data Management, Regulatory Affairs, and Medical Writing. We focus on preparing students for real industry roles by combining structured learning with practical <span className="highlight-bold">career guidance</span>.
              </p>
              <p className="about-intro-text" style={{ fontSize: '1.25rem', fontWeight: 600, color: '#2b6cb0' }}>
                Our goal is simple — to guide students from learning to earning with confidence.
              </p>
            </div>
          </div>

          <div className="about-grid">
            <div className="card-premium p-4 text-start h-100">
              <div className="about-card-icon">📘</div>
              <h3 className="about-card-title">What We Do</h3>
              <p className="about-card-text">
                At Clinidea Education, we provide industry-aligned training programs designed to match real healthcare and life science job requirements. Our training is not just theoretical — it is focused on how the industry actually works.
              </p>
              <p className="about-card-text mt-3">
                We help students understand core concepts, workflows, and expectations. Along with technical knowledge, we also focus on <span className="highlight-bold">career development skills</span> like CV building, LinkedIn optimization, and interview preparation to ensure students are fully job-ready.
              </p>
            </div>

            <div className="card-premium p-4 text-start h-100">
              <div className="about-card-icon">🎯</div>
              <h3 className="about-card-title">Our Mission</h3>
              <p className="about-card-text">
                Our mission is to empower students with the right knowledge, skills, and guidance so they can start successful careers in the healthcare and life sciences industry.
              </p>
              <p className="about-card-text mt-3">
                We aim to make learning meaningful by focusing on practical understanding, clarity, and <span className="highlight-bold">career direction</span>, rather than just theory.
              </p>
            </div>

            <div className="card-premium p-4 text-start h-100">
              <div className="about-card-icon">👁️</div>
              <h3 className="about-card-title">Our Vision</h3>
              <p className="about-card-text">
                Our vision is to become a trusted learning platform in healthcare education that consistently produces skilled and <span className="highlight-bold">industry-ready professionals</span>.
              </p>
              <p className="about-card-text mt-3">
                We want to create a space where every student feels supported, guided, and confident to enter the professional world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="founder-section" style={{ padding: '80px 0', background: '#fff' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-4 col-md-6 mb-4 mb-lg-0 text-center">
              <div className="position-relative d-inline-block">
                <img
                  loading="lazy"
                  src="/Founder.webp"
                  alt="Tushar Patil - Founder"
                  className="img-fluid rounded-circle shadow-lg"
                  style={{ width: '280px', height: '280px', objectFit: 'cover', border: '5px solid var(--color-bg-light)' }}
                />
                <div className="mt-4">
                  <h3 className="mb-1" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 800, color: 'var(--color-text-dark)', fontSize: '2rem', letterSpacing: '-0.5px' }}>Tushar Patil</h3>
                  <p className="mb-2" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: 'var(--color-secondary, #2b6cb0)', fontSize: '1.15rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Founder</p>
                  <p style={{ fontFamily: '"Inter", sans-serif', color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500, lineHeight: 1.5, margin: 0 }}>Pharmacovigilance Professional & Career Coach</p>
                </div>
              </div>
            </div>
            <div className="col-lg-7 offset-lg-1 founder-text">
              <h2 className="about-intro-title mb-4">Meet Our Founder</h2>
              <p className="about-card-text" style={{ fontSize: '1.1rem' }}>
                Mr. Tushar Patil is the Founder of Clinidea Education, an institute focused on bridging the gap between academic learning and industry requirements in the clinical research and pharmaceutical sector. With a clear vision to make industry-relevant education accessible, he has been actively involved in guiding and training students for successful careers.
              </p>
              <p className="about-card-text mt-3" style={{ fontSize: '1.1rem' }}>
                He has helped students from Pharmacy, Life Science, and Medical backgrounds build strong careers in Clinical Research, Pharmacovigilance, Clinical Data Management, Regulatory Affairs, Medical Writing, Medical Coding, and other related domains. He plays a key role in student placements, program design, and overall business development of the organization. His approach emphasizes practical knowledge, skill development, and industry readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="impact-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-5 mb-4 mb-lg-0">
              <div className="position-relative">
                <img loading="lazy" src="/images/our_impact.webp" alt="Students in healthcare" className="img-fluid" style={{ borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '8px solid white' }} />
              </div>
            </div>
            <div className="col-lg-6 offset-lg-1">
              <h2 className="about-intro-title">🌍 Our Impact</h2>
              <p className="about-card-text" style={{ fontSize: '1.1rem' }}>
                At Clinidea Education, we believe in creating real <span className="highlight-bold">career transformation</span>. Our continuous mentorship ensures that students are never alone in their journey — we guide them until they are fully prepared for their first professional role.
              </p>
              <ul className="impact-list">
                <li>Understand industry expectations clearly</li>
                <li>Build professional resumes and LinkedIn profiles</li>
                <li>Gain extreme confidence for technical and HR interviews</li>
                <li>Learn how to approach job opportunities strategically</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Clinidea Education */}
      <section className="why-us-section">
        <div className="container">
          <div className="text-center">
            <h2 className="about-intro-title">Why Clinidea Education</h2>
            <p className="about-intro-text">
              What makes Clinidea Education different is our student-first approach and commitment to real career outcomes, not just training. We focus on building strong foundations that help students confidently enter the healthcare and life sciences industry.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-item">
              <div className="why-icon">📌</div>
              <div className="why-content">
                <h4>Industry-Relevant Curriculum</h4>
                <p>Designed as per global standards and real job requirements in Clinical Research, Pharmacovigilance, and more.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">👨‍🏫</div>
              <div className="why-content">
                <h4>Expert Mentorship</h4>
                <p>Learn directly from industry-experienced mentors who guide you with real-world insights and practical understanding.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">💼</div>
              <div className="why-content">
                <h4>Career-Focused Training</h4>
                <p>Every module is designed to make you job-ready with clear focus on roles, responsibilities, and industry expectations.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">📊</div>
              <div className="why-content">
                <h4>CV, LinkedIn & Interview Support</h4>
                <p>Complete guidance to build professional profiles, improve visibility, and prepare for interviews with confidence.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🧠</div>
              <div className="why-content">
                <h4>Concept + Clarity Based Learning</h4>
                <p>We focus on simplifying complex topics so students truly understand how the clinical industry actually works.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🚀</div>
              <div className="why-content">
                <h4>100% Assured Placement Support</h4>
                <p>Dedicated support and referrals until you are confident and ready to secure a job opportunity.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🤝</div>
              <div className="why-content">
                <h4>Personalized Attention</h4>
                <p>Small batch sizes ensure every student gets individual guidance and proper 1-on-1 mentorship.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">🌍</div>
              <div className="why-content">
                <h4>Real Industry Exposure</h4>
                <p>Training aligned with actual workflows, compliance standards, and hiring practices followed in top companies.</p>
              </div>
            </div>
            <div className="why-item">
              <div className="why-icon">💻</div>
              <div className="why-content">
                <h4>Hands-On Practical Approach</h4>
                <p>Work on case scenarios and get familiar with software tools used in Clinical Data Management and Pharmacovigilance.</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <h3 style={{ fontWeight: 800, color: '#2b6cb0', fontStyle: 'italic', fontSize: '1.6rem' }}>
              "We don’t just train students — we prepare them for real careers."
            </h3>
          </div>
        </div>
      </section>

      {/* MSME Registration Section */}
      <section className="msme-section py-5" style={{ background: 'var(--color-bg-light)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8 text-center text-lg-start d-flex flex-column flex-lg-row align-items-center bg-white p-4 rounded-4 shadow-sm border" style={{ gap: '2rem' }}>
              <img src="/images/msme_logo_official.png" alt="MSME Logo" style={{ width: '150px', height: '150px', objectFit: 'contain' }} className="rounded-3 shadow-sm" />
              <div>
                <h3 className="mb-3" style={{ color: 'var(--color-primary)', fontWeight: 800 }}>Govt. Recognised MSME</h3>
                <p className="mb-1" style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)' }}><strong>Name of Enterprise:</strong> CLINIDEA EDUCATION</p>
                <p className="mb-1" style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)' }}><strong>Udyam Registration Number:</strong> UDYAM-MH-14-0169362</p>
                <p className="mb-0" style={{ fontSize: '1.1rem', color: 'var(--color-text-dark)' }}><strong>Date of Registration:</strong> 05/11/2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Slider Section */}
      {studentImages.length > 0 && (
        <section className="ftco-section bg-dark py-5">
          <div className="container">
            <div className="text-center mb-5">
              <h2 style={{ color: '#fff', fontWeight: '700' }}>Happy Students & Feedback</h2>
              <p style={{ color: 'var(--color-text-muted)' }}>Real success stories from our students 🚀</p>
            </div>
            <Swiper
              modules={[Autoplay]}
              spaceBetween={25}
              slidesPerView={3}
              loop={true}
              speed={1200}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              style={{ paddingBottom: '30px' }}
            >
              {studentImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="student-card">
                    <img loading="lazy" src={img} alt={`student-${index}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {/* Footer */}

    </div>
  );
};

export default About;
