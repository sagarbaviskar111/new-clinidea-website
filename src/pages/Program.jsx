import React, { useEffect } from 'react';
import SEOHead from '../components/SEOHead';
import SharedCourseGrid from '../components/SharedCourseGrid';

const Program = () => {
  useEffect(() => {
    if (window.initializeTheme) window.initializeTheme(window.jQuery);
  }, []);

  return (
    <>

      <SEOHead
        title="Premium Healthcare Courses | Clinical Research & PV | Clinidea Education"
        description="Enroll in India's top Clinical Research & PV programs. Better than Cliniminds and Cliniindia, our industry-aligned syllabus offers 100% placement support in Pharmacovigilance, Regulatory Affairs, and Medical Coding."
        canonical="https://clinidea.in/program"
        ogImage="https://clinidea.in/images/about.webp"
        schema={{
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Advanced Certification in Clinical Research & Pharmacovigilance",
          "description": "Premium Healthcare career training program offering deep expertise in Clinical Research, Pharmacovigilance, Data Management, and Medical Coding with 100% placement support in India.",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Clinidea Education",
            "sameAs": "https://clinidea.in"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "512"
          },
          "offers": {
            "@type": "Offer",
            "category": "Educational Program",
            "price": "Contact Us",
            "priceCurrency": "INR"
          }
        }}
      />


	
	
	<section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.webp)' }}
		data-stellar-background-ratio="0.5">
		<div className="overlay"></div>
		<div className="container">
			<div className="row no-gutters slider-text align-items-end">
				<div className="col-md-9 pb-5">
					<p className="breadcrumbs mb-2"><span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> <span>Programs <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span></p>
					<h1 className="mb-0 bread">Courses</h1>
				</div>
			</div>
		</div>
	</section>

	<section className="ftco-section">
		
		<div className="row justify-content-center pb-5 mb-3">
			<div className="col-md-8 heading-section text-center ftco-animate">
				<h2>Clinidea Education Advanced Certification Course</h2>
				<span className="subheading">Transforming Aspirations into Careers</span>
			</div>
		</div>

		
		<SharedCourseGrid />
	</section>

	<section className="ftco-section">
		<div className="container">
			<div className="row justify-content-center pb-5 mb-3">
				<div className="col-md-7 heading-section text-center ftco-animate">
					<h2>We can help you build your career</h2>
					<span className="subheading">We offer Mentorship Programs</span>
				</div>
			</div>
			<div className="row">
				<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
					<div className="d-block text-center">
						<div className="icon d-flex justify-content-center align-items-center">
							<span className="flaticon-goal"></span>
						</div>
						<div className="media-body p-2 mt-3">
							<h3 className="heading">Career Guidance</h3>
							<p>We help you craft an impressive CV, optimize your LinkedIn profile, and master job
								interviews to land your dream role in clinical research and life sciences.</p>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
					<div className="d-block text-center">
						<div className="icon d-flex justify-content-center align-items-center">
							<span className="flaticon-stress"></span>
						</div>
						<div className="media-body p-2 mt-3">
							<h3 className="heading">Industry Knowledge</h3>
							<p>Our mentors provide in-depth insights into clinical research, pharmacovigilance, and
								clinical data management, ensuring you’re job-ready with relevant knowledge.</p>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
					<div className="d-block text-center">
						<div className="icon d-flex justify-content-center align-items-center">
							<span className="flaticon-crm"></span>
						</div>
						<div className="media-body p-2 mt-3">
							<h3 className="heading">Networking Opportunities</h3>
							<p>We provide opportunities to connect with professionals in the industry, helping you
								expand your network and gain valuable industry contacts.</p>
						</div>
					</div>
				</div>
				<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
					<div className="d-block text-center">
						<div className="icon d-flex justify-content-center align-items-center">
							<span className="flaticon-marriage"></span>
						</div>
						<div className="media-body p-2 mt-3">
							<h3 className="heading">Mock Interviews</h3>
							<p>Our mock interview sessions help you develop confidence, prepare for behavioral
								interviews, and gain insights from hiring managers to stand out in the job market.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>


	<section className="ftco-section bg-light">
		<div className="container">
			<div className="row justify-content-center pb-5 mb-3">
				<div className="col-md-7 heading-section text-center ftco-animate">
					<h2>Why Clinidea Education Works?</h2>
					<span className="subheading">Key Benefits of Our Program</span>
				</div>
			</div>


				<div className="row">
					<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
						<div className="d-block text-center">
							<div className="icon d-flex justify-content-center align-items-center">
								<span className="flaticon-account"></span>
							</div>
							<div className="media-body p-2 mt-3">
								<h3 className="heading">Accountability</h3>
								<p>Stay focused and motivated with personalized mentorship and expert guidance tailored
									to your career goals in clinical research, pharmacovigilance, and data management.
								</p>
							</div>
						</div>
					</div>

					<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
						<div className="d-block text-center">
							<div className="icon d-flex justify-content-center align-items-center">
								<span className="flaticon-skills"></span>
							</div>
							<div className="media-body p-2 mt-3">
								<h3 className="heading">Expertise</h3>
								<p>Learn from industry professionals. Gain real-world knowledge that aligns with
									employer expectations in the life sciences sector.</p>
							</div>
						</div>
					</div>

					<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
						<div className="d-block text-center">
							<div className="icon d-flex justify-content-center align-items-center">
								<span className="flaticon-performance"></span>
							</div>
							<div className="media-body p-2 mt-3">
								<h3 className="heading">Speed</h3>
								<p>Accelerate your career path by gaining job-ready skills and knowledge that employers
									are actively looking for in clinical research and life sciences.</p>
							</div>
						</div>
					</div>

					<div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
						<div className="d-block text-center">
							<div className="icon d-flex justify-content-center align-items-center">
								<span className="flaticon-event"></span>
							</div>
							<div className="media-body p-2 mt-3">
								<h3 className="heading">Career Delivery</h3>
								<p>Receive continuous mentorship, interview preparation, and job placement support until
									you secure your first role in the industry.</p>
							</div>
						</div>
					</div>
				</div>

		</div>
	</section>

	



	
</>
  );
};

export default Program;
