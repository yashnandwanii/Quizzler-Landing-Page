// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile navigation toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.querySelector('i').classList.toggle('fa-bars');
        navToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        });
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Phone mockup rotation effect
const phoneMockup = document.querySelector('.phone-mockup');
if (phoneMockup) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        if (rate > -30) {
            phoneMockup.style.transform = `rotate(${-5 + rate * 0.1}deg)`;
        }
    });
}

// Statistics counter animation
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const target = counter.getAttribute('data-target') || counter.innerText.replace(/\D/g, '');
        const count = +counter.innerText.replace(/\D/g, '');
        const inc = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + inc);
            setTimeout(animateCounters, 1);
        } else {
            // Add suffix back if it exists
            const originalText = counter.getAttribute('data-original') || counter.innerText;
            if (originalText.includes('K')) {
                counter.innerText = target + 'K+';
            } else if (originalText.includes('.')) {
                counter.innerText = (target / 10).toFixed(1);
            } else {
                counter.innerText = target + '+';
            }
        }
    });
};

// Initialize counters when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Store original values
            document.querySelectorAll('.stat-number').forEach(stat => {
                stat.setAttribute('data-original', stat.innerText);
                stat.setAttribute('data-target', stat.innerText.replace(/\D/g, ''));
                stat.innerText = '0';
            });

            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Feature cards hover effect
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Video and screenshot lightbox handler
function initializeLightboxHandlers() {
    console.log('Initializing lightbox handlers...');

    // Handle both video demo and screenshot gallery items
    const videoItems = document.querySelectorAll('.video-item');
    const screenshotItems = document.querySelectorAll('.screenshot-item');

    console.log('Found video items:', videoItems.length);
    console.log('Found screenshot items:', screenshotItems.length);

    // Add click handlers to video items
    videoItems.forEach((item, index) => {
        console.log(`Adding video handler to item ${index}:`, item.className);
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            console.log('Video item clicked!', this.className);

            const youtubeId = this.getAttribute('data-youtube-id');
            const driveId = this.getAttribute('data-drive-id');

            if (youtubeId) {
                console.log('Opening YouTube video:', youtubeId);
                openYouTubeLightbox(youtubeId);
            } else if (driveId) {
                console.log('Opening Drive video:', driveId);
                openVideoLightbox(driveId);
            } else {
                console.error('No video ID found');
                alert('No video ID found!');
                return;
            }
        });

        // Add visual feedback
        item.style.cursor = 'pointer';
    });    // Add click handlers to screenshot items
    screenshotItems.forEach((item, index) => {
        console.log(`Adding screenshot handler to item ${index}:`, item.className);
        item.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // Skip if this is also a video item
            if (this.classList.contains('video-item')) {
                return;
            }

            const img = this.querySelector('.screenshot-image');
            if (!img) {
                console.log('No image found in screenshot item');
                return;
            }

            console.log('Opening image lightbox for:', img.src);
            openImageLightbox(img);
        });
    });
}

// Open YouTube lightbox
function openYouTubeLightbox(youtubeId) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    lightbox.innerHTML = `
        <div class="lightbox-content video-content">
            <iframe 
                src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1" 
                frameborder="0" 
                allow="autoplay; encrypted-media; picture-in-picture" 
                allowfullscreen
                style="width:100%; height:100%; border-radius:12px;">
            </iframe>
            <button class="lightbox-close" title="Close">&times;</button>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close handlers
    const closeHandler = function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    };

    const escHandler = function (e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };

    lightbox.addEventListener('click', closeHandler);
    document.addEventListener('keydown', escHandler);

    // Store close handler for cleanup
    lightbox._escHandler = escHandler;
}

// Open video lightbox
function openVideoLightbox(driveId) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';

    // Try Google Drive embed first, with fallback to direct download link
    const driveEmbedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    const driveDirectUrl = `https://drive.google.com/uc?export=download&id=${driveId}`;

    lightbox.innerHTML = `
        <div class="lightbox-content video-content">
            <div class="video-container">
                <iframe id="video-iframe" 
                    src="${driveEmbedUrl}" 
                    frameborder="0" 
                    allow="autoplay; encrypted-media; picture-in-picture" 
                    allowfullscreen
                    loading="lazy"
                    style="width:100%; height:100%; border-radius:12px;">
                </iframe>
                <div class="video-fallback" style="display:none; text-align:center; padding:40px; color:white;">
                    <p style="margin-bottom:20px;">Video preview not available</p>
                    <a href="https://drive.google.com/file/d/${driveId}/view" 
                       target="_blank" 
                       style="color:#7c3aed; text-decoration:underline;">
                        Open video in Google Drive →
                    </a>
                </div>
            </div>
            <button class="lightbox-close" title="Close">&times;</button>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Check if iframe loads properly, show fallback if not
    const iframe = lightbox.querySelector('#video-iframe');
    const fallback = lightbox.querySelector('.video-fallback');

    iframe.addEventListener('error', function () {
        console.log('Iframe failed to load, showing fallback');
        iframe.style.display = 'none';
        fallback.style.display = 'block';
    });

    // Timeout fallback
    setTimeout(() => {
        if (iframe.contentDocument === null) {
            console.log('Iframe timeout, showing fallback');
            iframe.style.display = 'none';
            fallback.style.display = 'block';
        }
    }, 5000);

    // Close handlers
    const closeHandler = function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    };

    const escHandler = function (e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };

    lightbox.addEventListener('click', closeHandler);
    document.addEventListener('keydown', escHandler);

    // Store close handler for cleanup
    lightbox._escHandler = escHandler;
}

// Open image lightbox
function openImageLightbox(img) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${img.src}" alt="${img.alt}" loading="lazy">
            <button class="lightbox-close" title="Close">&times;</button>
        </div>
    `;

    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // Close handlers
    const closeHandler = function (e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            closeLightbox(lightbox);
        }
    };

    const escHandler = function (e) {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
            document.removeEventListener('keydown', escHandler);
        }
    };

    lightbox.addEventListener('click', closeHandler);
    document.addEventListener('keydown', escHandler);

    // Store close handler for cleanup
    lightbox._escHandler = escHandler;
}

// Close lightbox function
function closeLightbox(lightbox) {
    if (lightbox && lightbox.parentNode) {
        if (lightbox._escHandler) {
            document.removeEventListener('keydown', lightbox._escHandler);
        }
        document.body.removeChild(lightbox);
        document.body.style.overflow = 'auto';
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing lightbox handlers');
    initializeLightboxHandlers();
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeLightboxHandlers);
} else {
    initializeLightboxHandlers();
}

// Download button click tracking
document.querySelectorAll('.download-btn, .btn-primary').forEach(btn => {
    // Only apply to download buttons
    if (btn.href && btn.href.includes('drive.google.com')) {
        btn.addEventListener('click', function (e) {
            // Add loading state briefly
            const originalContent = this.innerHTML;
            this.innerHTML = `
                <div class="loading"></div>
                <div class="btn-text">
                    <span class="btn-label">Downloading...</span>
                    <span class="btn-store">Starting download</span>
                </div>
            `;

            // Restore button after brief loading animation
            setTimeout(() => {
                this.innerHTML = originalContent;
            }, 2000);
        });
    }
});

// Form validation and submission (if contact form exists)
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const email = formData.get('email');
        const message = formData.get('message');

        if (!email || !message) {
            alert('Please fill in all required fields.');
            return;
        }

        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // Simulate form submission
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');

    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add active class to current navigation item based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Preload images for better performance
function preloadImages() {
    const imageUrls = [
        '../assets/app_logo.png',
        '../assets/icons/quiz.png',
        '../assets/icons/analytics.png',
        '../assets/icons/score.png',
        '../assets/icons/history.png'
    ];

    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    preloadImages();

    // Add CSS for lightbox
    const style = document.createElement('style');
    style.textContent = `
        .lightbox {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            cursor: pointer;
        }
        
        .lightbox-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .lightbox-content img {
            width: 100%;
            height: auto;
            border-radius: 12px;
        }
        
        .lightbox-close {
            position: absolute;
            top: -40px;
            right: -40px;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: background 0.3s ease;
        }
        
        .lightbox-close:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 20px;
            gap: 20px;
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .nav-link.active {
            color: #7c3aed;
        }
        
        @media (max-width: 768px) {
            .nav-menu {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
});

// Add resize event listener for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');

    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        if (navToggle) {
            navToggle.querySelector('i').classList.remove('fa-times');
            navToggle.querySelector('i').classList.add('fa-bars');
        }
    }
});

// Performance optimization: throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    // Your scroll-based functions here
}, 16)); // ~60fps
