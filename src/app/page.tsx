'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { portfolioData } from '../data/portfolioData';
import { portfolioSkills } from '../data/skills';
import { OriginKitWaterButton } from '../components/ui/OriginKitWaterButton';
import Smooth3DSlideshow from '../components/ui/Smooth3DSlideshow';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState<boolean>(false);
  const [showInstaModal, setShowInstaModal] = useState<boolean>(false);

  // Handle browser back button
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state?.gallery) {
        setShowGallery(true);
      } else {
        setShowGallery(false);
      }

      if (state?.insta) {
        setShowInstaModal(true);
      } else {
        setShowInstaModal(false);
      }

      if (!state?.lightbox) {
        setLightboxImg(null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const openGallery = () => {
    window.history.pushState({ gallery: true }, '');
    setShowGallery(true);
  };

  const openInstaModal = () => {
    window.history.pushState({ insta: true }, '');
    setShowInstaModal(true);
  };

  const closeInstaModal = () => {
    if (window.history.state?.insta) {
      window.history.back();
    } else {
      setShowInstaModal(false);
    }
  };

  const openLightbox = (src: string) => {
    window.history.pushState({ lightbox: true, gallery: showGallery }, '');
    setLightboxImg(src);
  };

  const closeLightbox = () => {
    if (window.history.state?.lightbox) {
      window.history.back();
    } else {
      setLightboxImg(null);
    }
  };

  const closeGallery = () => {
    if (window.history.state?.gallery) {
      window.history.back();
    } else {
      setShowGallery(false);
    }
  };

  useEffect(() => {
    // Simple GSAP animation
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-greeting, .hero-title, .hero-desc',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.hero',
            start: 'top 80%',
            toggleActions: 'restart none none reset'
          }
        }
      );

      gsap.fromTo('.about-manifesto',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-premium',
            start: 'top 80%',
            toggleActions: 'restart none none reset'
          }
        }
      );
      gsap.fromTo('.service-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.services-grid',
            start: 'top 80%',
            toggleActions: 'restart none none reset'
          }
        }
      );
      gsap.fromTo('.skill-card',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top 80%',
            toggleActions: 'restart none none reset'
          }
        }
      );

    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef}>
      {/* Global Background Animation */}
      <div className="global-bg-elements">
        <div className="global-blob blob-3"></div>
        <div className="global-blob blob-4"></div>
      </div>

      <header className="header">
        <div className="header-logo" style={{ 
          width: '65px', 
          height: '65px', 
          borderRadius: '50%', 
          backgroundColor: 'white', 
          overflow: 'hidden', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
        }}>
          <img src="/images/WA0038.jpeg" alt="Anushka Mall Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', transform: 'scale(2.5) translateY(12%)' }} />
        </div>
        <nav className="nav" id="nav-menu" style={{ background: 'transparent', border: 'none', padding: 0 }}>
          <OriginKitWaterButton rounded={50} paddingX={32} paddingY={16}>
            <div style={{ display: 'flex', gap: '2rem', padding: '1rem 2rem', color: 'black' }}>
              <a href="#hero" className="nav-link">Home</a>
              <a href="#about" className="nav-link">About</a>
              <a href="#services" className="nav-link">Work</a>
              <a href="#skills" className="nav-link">Skills</a>
              <a href="#contact" className="nav-link">Contact</a>
            </div>
          </OriginKitWaterButton>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className="hero" ref={heroRef}>
          <div className="hero-bg-elements">
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>
          </div>
          <div className="hero-container">
            <div className="hero-content">
              <p className="hero-greeting">Hello, I'm Anushka Mall</p>
              <h1 className="hero-title">
                <span className="text-gradient">Graphic Designer</span>
              </h1>
              <p className="hero-desc">
                {portfolioData.hero.description}
              </p>
              <div className="hero-cta" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <OriginKitWaterButton href="#services" label="View My Work" paddingX={32} paddingY={14} rounded={9999} font={{ fontSize: 16, fontWeight: 600 }} textColor="black" />
                <OriginKitWaterButton href="#contact" label="Let's Talk" paddingX={32} paddingY={14} rounded={9999} font={{ fontSize: 16, fontWeight: 600 }} textColor="black" />
              </div>
            </div>


          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-premium">
          <div className="container about-container">
            <h2 className="about-manifesto">
              I specialize in transforming complex ideas into visually engaging stories through
              <span className="highlight"> Poster Design</span>, <span className="highlight">Social Media Creatives</span>,
              <span className="highlight"> Banners</span>, <span className="highlight">Standees</span>, and <span className="highlight">Backdrops</span>.
              Leveraging tools like <span className="highlight">Photoshop</span>, <span className="highlight">Figma</span>,
              and <span className="highlight">Canva</span>, I continuously explore new design trends to craft print and digital experiences.
              My approach blends meticulous attention to detail with bold creativity—delivering designs that are not only aesthetically
              striking but profoundly purpose-driven.
            </h2>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services section-padding">
          <div className="container">
            <h2 className="section-title">What I Made</h2>
            <div className="services-grid">
              {portfolioData.services.map((service: any, index) => (
                <div
                  className="service-card"
                  key={index}
                >
                  <div className="service-card-image-wrapper">
                    <img src={service.image} alt={service.title} className="service-card-image" loading="lazy" />
                    <div className="service-card-overlay"></div>
                  </div>
                  <div className="service-card-content">
                    <h3 className="service-title">{service.title}</h3>
                    <p className="service-desc">{service.description}</p>
                    <div className="service-tech-stack">
                      {service.techStack?.map((tech: string, i: number) => (
                        <span key={i} className="tech-badge">{tech}</span>
                      ))}
                    </div>
                    <div className="service-actions">
                      <button className="btn-service-action github-btn">
                        <i className="ph ph-github-logo"></i> GitHub
                      </button>
                      <button 
                        className="btn-service-action live-demo-btn" 
                        onClick={() => {
                          if (service.title === "Poster Design") openGallery();
                          else if (service.title === "Edits") openInstaModal();
                          else if (service.link) openLightbox(service.link);
                        }}
                      >
                        <i className="ph ph-arrow-up-right"></i> Live Demo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Posters Modal */}
        {showGallery && (
          <div className="gallery-overlay">
            <div className="gallery-modal-content">
              <button className="gallery-close" onClick={closeGallery}>&times;</button>
              <h2 className="section-title text-center" style={{ marginTop: '2rem' }}>Poster Gallery</h2>
              <div style={{ height: '70vh', width: '100%', marginTop: '2rem' }}>
                <Smooth3DSlideshow 
                  slides={portfolioData.posters.map(poster => ({
                    image: { src: poster.src, alt: poster.alt },
                    title: poster.alt
                  }))}
                  cardWidth={350}
                  cardHeight={500}
                  radius={10}
                  autoplay={true}
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        <section id="skills" className="skills section-padding">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="section-title">Software & Expertise</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto 4rem auto', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Hover over the icons below to see my primary toolkit and how I utilize each software to craft premium designs.</p>
            
            <div className="animated-tooltip-container">
              {[...portfolioSkills.graphicDesign, ...portfolioSkills.videoEditing].map((skill, index) => (
                <div className="animated-tooltip-item" key={index}>
                  <div className="animated-tooltip-popup">
                    <div className="tooltip-name">{skill.name}</div>
                    <div className="tooltip-desc">{skill.description}</div>
                  </div>
                  <Image src={skill.icon} alt={skill.name} width={90} height={90} className="animated-tooltip-image" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* Contact Section */}
        <section id="contact" className="contact section-padding">
          <div className="container">
            <div className="contact-premium-wrapper centered">
              {/* Center Aligned Form */}
              <div className="contact-form-container">
                <h2 className="contact-title text-center">Let's Create Something Premium</h2>
                <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fill out the form below and I'll get back to you shortly.</p>

                <form className="premium-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>First name <span className="required">*</span></label>
                      <input type="text" placeholder="First name" required />
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <input type="text" placeholder="Last name" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email <span className="required">*</span></label>
                      <input type="email" placeholder="Email" required />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" placeholder="Phone" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Country <span className="required">*</span></label>
                    <select required defaultValue="">
                      <option value="" disabled>Your Country</option>
                      <option value="us">United States</option>
                      <option value="uk">United Kingdom</option>
                      <option value="in">India</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Requirement</label>
                    <div className="requirement-pills justify-center">
                      <button type="button" className="req-pill">Website</button>
                      <button type="button" className="req-pill">Graphics</button>
                      <button type="button" className="req-pill">Video</button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>How can I help?</label>
                    <textarea placeholder="Feel free to outline your ideas or needs..." rows={4}></textarea>
                  </div>

                  <button type="button" className="btn-submit-premium w-100 mt-4">Submit Application</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer" style={{ padding: '2rem 0', display: 'flex', justifyContent: 'center' }}>
          <div className="container footer-content" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <p className="copyright" style={{ textAlign: 'center', width: '100%' }}>&copy; {new Date().getFullYear()} Anushka Mall. All rights reserved.</p>
          </div>
        </footer>
      </main>

      {/* Insta Pages Modal */}
      {showInstaModal && (
        <div className="gallery-overlay">
          <div className="gallery-modal-content" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <button className="gallery-close" onClick={closeInstaModal}>&times;</button>
            <h2 className="section-title text-center" style={{ marginTop: '2rem', fontSize: '2.5rem' }}>My Instagram Pages</h2>
            <div className="insta-cards-container">
              <a href="https://www.instagram.com/anushka_mall_25?igsh=eW50MzgwMWg0Zmgx" target="_blank" rel="noopener noreferrer" className="insta-card">
                <div className="insta-icon"><i className="ph ph-instagram-logo"></i></div>
                <h3>@anushka_mall_25</h3>
                <p>Artworks</p>
              </a>
              <a href="https://www.instagram.com/ams__diaries?igsh=MWIzbzJvZTIzYjFvNw==" target="_blank" rel="noopener noreferrer" className="insta-card">
                <div className="insta-icon"><i className="ph ph-instagram-logo"></i></div>
                <h3>@ams__diaries</h3>
                <p>Edits</p>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
            <img src={lightboxImg} alt="Preview" className="lightbox-img" />
          </div>
        </div>
      )}
    </div>
  );
}
