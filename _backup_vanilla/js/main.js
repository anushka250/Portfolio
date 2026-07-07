document.addEventListener('DOMContentLoaded', async () => {
  
  // 1. Initialize Lenis Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Update ScrollTrigger with Lenis
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Fetch Portfolio Data
  try {
    const response = await fetch('data/portfolioData.json');
    const data = await response.json();
    populateUI(data);
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
  }

  // Mobile Menu Toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      mobileBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // 3. Magnetic hover effects
  const magneticEls = document.querySelectorAll('[data-magnetic]');
  magneticEls.forEach((el) => {
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    });
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power2.out' });
    });
  });

  // 4. Preloader fade out (Fixed slow loading)
  setTimeout(() => {
    gsap.to('.preloader', {
      opacity: 0,
      duration: 0.8,
      ease: 'power3.inOut',
      onComplete: () => {
        document.querySelector('.preloader').style.display = 'none';
        initAnimations();
      }
    });
  }, 200);

  // 5. Populate UI from JSON
  function populateUI(data) {
    // Hero
    document.getElementById('hero-name').textContent = data.hero.name;
    document.getElementById('hero-desc').textContent = data.hero.description;
    
    // Services are hardcoded in index.html

    // Skills rendered dynamically from data.js
    const renderSkills = (skillsArray, containerId) => {
      const container = document.getElementById(containerId);
      if(container && skillsArray) {
        skillsArray.forEach(skill => {
          const div = document.createElement('div');
          div.className = 'skill-card';
          // Ensure we don't apply border-radius to Canva or Photoshop unecessarily, only for DaVinci if needed, but it's fine
          const style = skill.name === 'DaVinci Resolve' ? 'style="border-radius: 8px;"' : '';
          div.innerHTML = `
            <div class="skill-header">
              <img src="${skill.icon}" alt="${skill.name}" class="skill-icon" ${style}>
              <h4 class="skill-title">${skill.name}</h4>
            </div>
            <p class="skill-desc">${skill.description}</p>
          `;
          container.appendChild(div);
        });
      }
    };
    
    if(typeof portfolioSkills !== 'undefined') {
      renderSkills(portfolioSkills.graphicDesign, 'graphic-design-skills');
      renderSkills(portfolioSkills.videoEditing, 'video-editing-skills');
    }

    // Projects
    const projectsGrid = document.getElementById('projects-grid');
    data.projects.forEach(project => {
      const card = document.createElement('a');
      card.href = "#";
      card.className = 'project-card';
      card.setAttribute('data-category', project.category);
      card.innerHTML = `
        <img src="${project.coverImage}" alt="${project.title}">
        <div class="project-overlay">
          <p class="project-category">${project.category}</p>
          <h3 class="project-title">${project.title}</h3>
          <p>${project.softwareUsed.join(' • ')}</p>
        </div>
      `;
      projectsGrid.appendChild(card);
    });

    // Instagram
    const igGrid = document.getElementById('ig-grid');
    data.instagram.forEach(post => {
      const card = document.createElement('a');
      card.href = post.url;
      card.target = "_blank";
      card.className = 'ig-card';
      card.innerHTML = `
        <img src="${post.image}" alt="Instagram Post" class="ig-image">
        <div class="ig-content">
          <p class="ig-caption">${post.caption}</p>
          <div class="ig-meta">
            <span><i class="ph ph-instagram-logo"></i> View</span>
            <span>${post.date}</span>
          </div>
        </div>
      `;
      igGrid.appendChild(card);
    });

    // Contact & Footer
    const contactInfo = document.getElementById('contact-info');
    contactInfo.innerHTML = `
      <div class="contact-item">
        <h4>Email</h4>
        <p><a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
      </div>
      <div class="contact-item">
        <h4>Phone</h4>
        <p>${data.contact.phone}</p>
      </div>
      <div class="contact-item">
        <h4>Location</h4>
        <p>${data.contact.location}</p>
      </div>
    `;

    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    const socials = document.getElementById('footer-socials');
    const socialLinks = ['linkedin', 'instagram', 'behance', 'dribbble'];
    socialLinks.forEach(platform => {
      if(data.contact[platform] && data.contact[platform] !== "#") {
        const a = document.createElement('a');
        a.href = data.contact[platform];
        a.className = 'social-link';
        a.innerHTML = `<i class="ph ph-${platform}-logo"></i>`;
        socials.appendChild(a);
      }
    });

    // Project Filtering Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');
        
        projectCards.forEach(card => {
          if(filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            gsap.to(card, { scale: 1, opacity: 1, duration: 0.4, display: 'block' });
          } else {
            gsap.to(card, { scale: 0.8, opacity: 0, duration: 0.4, display: 'none' });
          }
        });
      });
    });
  }

  // 6. GSAP Animations
  function initAnimations() {
    // Hero Animations
    const tl = gsap.timeline();
    tl.from('.hero-greeting', { y: 20, opacity: 0, duration: 0.8 })
      .from('.title-line', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }, "-=0.4")
      .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8 }, "-=0.4")
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.8 }, "-=0.6");

    // About Section Animation
    gsap.from('#about-manifesto', {
      scrollTrigger: {
        trigger: '.about-premium',
        start: 'top 60%',
      },
      y: 50,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out'
    });

    gsap.from('.about-manifesto .highlight', {
      scrollTrigger: {
        trigger: '.about-premium',
        start: 'top 60%',
      },
      color: 'var(--text-secondary)',
      duration: 1.5,
      stagger: 0.2,
      ease: 'power2.inOut',
      delay: 0.5
    });

    // Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.from(title, {
        scrollTrigger: {
          trigger: title,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    gsap.utils.toArray('.service-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: (index % 3) * 0.2, // Stagger up to 3 columns
        ease: 'power3.out'
      });
    });

    // Skill Card Animations
    gsap.utils.toArray('.skill-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card.parentElement,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: (index % 2) * 0.2,
        ease: 'power3.out'
      });
    });
    
    // Parallax Blobs
    gsap.to('.blob-1', {
      y: 200,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
    gsap.to('.blob-2', {
      y: -200,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }
});
