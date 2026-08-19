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

  // Contact Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    requirement: 'Graphics',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRequirementClick = (req: string) => {
    setFormData(prev => ({ ...prev, requirement: req }));
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Client-side Validation
    if (!formData.firstName.trim()) {
      setStatusMessage({ type: 'error', text: 'First name is required.' });
      return;
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    if (!formData.message.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your message.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Thank you! Your message has been sent successfully.'
        });
        // Clear form fields on success
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          country: '',
          requirement: 'Graphics',
          message: ''
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to send message. Please try again.'
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <section id="hero" className="hero-designer-canvas" ref={heroRef}>
          {/* Subtle Grid Canvas Background */}
          <div className="hero-grid-bg"></div>

          {/* Sea-Glass Aurora Glows */}
          <div className="hero-aurora-glow glow-1"></div>
          <div className="hero-aurora-glow glow-2"></div>

          <div className="hero-canvas-container">
            {/* Top Micro-Metadata Badge (Design Canvas Spec) */}
            <div className="canvas-meta-bar hero-greeting">
              <span className="meta-tag">
                <span className="meta-dot"></span> CANVAS 01 // ART DIRECTION
              </span>
              <span className="meta-tag meta-right">
                SCALE: 100% | #67C6C8
              </span>
            </div>

            {/* Main Editorial Typography Composition */}
            <div className="hero-typography-wrapper">
              {/* Script/Serif Accent Name */}
              <div className="hero-name-badge hero-greeting">
                <span className="script-accent">Anushka Mall</span>
                <span className="designer-role-pill">PORTFOLIO '26</span>
              </div>

              {/* Oversized Graphic Designer Title with Bounding Box & Vector Handles */}
              <div className="hero-title-bounding-box hero-title">
                {/* SVG Bezier Pen Tool Overlay */}
                <svg className="pen-tool-svg" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 20 150 C 60 40, 140 40, 180 150" stroke="#67C6C8" strokeWidth="2.5" strokeDasharray="4 4" />
                  {/* Bezier Handles & Anchor Points */}
                  <line x1="20" y1="150" x2="40" y2="90" stroke="#67C6C8" strokeWidth="1.5" />
                  <circle cx="40" cy="90" r="4" fill="#0A1419" stroke="#67C6C8" strokeWidth="2" />
                  <rect x="14" y="144" width="12" height="12" fill="#67C6C8" />
                  <rect x="174" y="144" width="12" height="12" fill="#67C6C8" />
                  
                  {/* Pen Nib Icon */}
                  <g className="pen-nib-graphic" transform="translate(155, 65) rotate(-45)">
                    <path d="M0 0 L12 -24 L24 0 L12 36 Z" fill="#67C6C8" />
                    <circle cx="12" cy="-4" r="2.5" fill="#0A1419" />
                    <line x1="12" y1="-4" x2="12" y2="36" stroke="#0A1419" strokeWidth="1.5" />
                  </g>
                </svg>

                {/* Bounding Box Corner Handles */}
                <div className="bounding-handle handle-tl"></div>
                <div className="bounding-handle handle-tr"></div>
                <div className="bounding-handle handle-bl"></div>
                <div className="bounding-handle handle-br"></div>
                <div className="bounding-dimensions">W: 100% &times; H: AUTO</div>

                <h1 className="designer-heading">
                  <span className="heading-line line-1">GRAPHIC</span>
                  <span className="heading-line line-2">
                    DESIGNER<span className="accent-dot">.</span>
                  </span>
                </h1>
              </div>

              {/* Subtitle / Tagline */}
              <p className="hero-desc">
                Visual stories, bold ideas, and purposeful design.
              </p>
            </div>

            {/* Design Tool Inspector Bar & CTAs */}
            <div className="hero-bottom-bar">
              {/* Secondary CTAs */}
              <div className="hero-cta" style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                <OriginKitWaterButton href="#services" label="View My Work" paddingX={38} paddingY={15} rounded={9999} font={{ fontSize: 17, fontWeight: 600 }} textColor="black" />
                <OriginKitWaterButton href="#contact" label="Let's Talk" paddingX={38} paddingY={15} rounded={9999} font={{ fontSize: 17, fontWeight: 600 }} textColor="black" />
              </div>

              {/* Design Tool Micro Indicators */}
              <div className="design-tools-strip">
                <div className="tool-chip" title="Vector Pen Tool">
                  <i className="ph ph-pen-nib"></i>
                  <span>VECTOR</span>
                </div>
                <div className="tool-chip" title="Typography">
                  <i className="ph ph-text-t"></i>
                  <span>TYPE</span>
                </div>
                <div className="tool-chip" title="Color Palette">
                  <i className="ph ph-palette"></i>
                  <span>COLOR</span>
                </div>
                <div className="tool-chip" title="Grid Alignment">
                  <i className="ph ph-grid-four"></i>
                  <span>GRID</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-premium">
          <div className="container about-container">
            <h2 className="section-title text-center" style={{ marginBottom: '2.5rem' }}>ABOUT ME</h2>
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
            <h2 className="section-title text-center" style={{ marginBottom: '2.5rem' }}>WHAT I MADE</h2>
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
                    <div className="service-actions">
                      <button 
                        className="btn-service-action live-demo-btn" 
                        onClick={() => {
                          if (service.title === "Poster Design") openGallery();
                          else if (service.title === "Edits") openInstaModal();
                          else if (service.link) openLightbox(service.link);
                        }}
                      >
                        VIEW
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
                    image: { src: poster.src, alt: poster.alt }
                  }))}
                  cardWidth={350}
                  cardHeight={500}
                  radius={0}
                  autoplay={false}
                  showTitle={false}
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        <section id="skills" className="skills section-padding">
          <div className="container" style={{ textAlign: 'center' }}>
            <h2 className="section-title" style={{ marginBottom: '3rem' }}>Software & Expertise</h2>
            
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
            <h2 className="section-title text-center" style={{ marginBottom: '2.5rem' }}>CONTACT</h2>
            <div className="contact-premium-wrapper centered">
              {/* Center Aligned Form */}
              <div className="contact-form-container">
                <h3 className="contact-title text-center" style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Let's Create Something Premium</h3>
                <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Fill out the form below and I'll get back to you shortly.</p>

                <form className="premium-form" onSubmit={handleContactSubmit}>
                  {statusMessage && (
                    <div className={`form-alert ${statusMessage.type}`}>
                      {statusMessage.text}
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label>First name <span className="required">*</span></label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="First name" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Last name" 
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email <span className="required">*</span></label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Country</label>
                    <select 
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="India">India</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Your Requirement</label>
                    <div className="requirement-pills justify-center">
                      {['Website', 'Graphics', 'Video'].map((req) => (
                        <button 
                          key={req}
                          type="button" 
                          className={`req-pill ${formData.requirement === req ? 'active' : ''}`}
                          onClick={() => handleRequirementClick(req)}
                        >
                          {req}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>How can I help? <span className="required">*</span></label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Feel free to outline your ideas or needs..." 
                      rows={4}
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn-submit-premium w-100 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                  </button>
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
