/* ===== JAVASCRIPT FUNCTIONALITY ===== */

// DOM Elements
const header = document.getElementById('header');
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const scrollUp = document.getElementById('scroll-up');
const contactForm = document.getElementById('contactForm');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const projectFilters = document.querySelectorAll('.projects__filter');
const projectCards = document.querySelectorAll('.projects__card');
const projectButtons = document.querySelectorAll('.projects__btn');

// Project data for modal
const projectData = {
    1: {
        title: "Estudio Arquitectura Digital",
        category: "Arquitectura",
        description: "Transformación digital completa de un estudio de arquitectura tradicional en Mendoza. Implementamos un sistema integral que incluye BIM, gestión de proyectos y automatización de procesos.",
        details: [
            "Migración completa a metodología BIM",
            "Implementación de software de gestión de proyectos",
            "Automatización de procesos de diseño",
            "Capacitación del equipo en nuevas tecnologías",
            "Integración de sistemas de renderizado 3D"
        ],
        results: [
            "40% de aumento en productividad",
            "Reducción del 60% en tiempo de diseño",
            "Mejora del 80% en precisión de proyectos",
            "ROI del 300% en el primer año"
        ],
        technologies: ["BIM", "Revit", "AutoCAD", "Navisworks", "Bluebeam"],
        image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop"
    },
    2: {
        title: "Sistema de Gestión Constructora",
        category: "Construcción",
        description: "Desarrollo e implementación de un sistema de gestión integral para una empresa constructora de Mendoza, optimizando todos los procesos desde la planificación hasta la entrega.",
        details: [
            "Sistema de gestión de proyectos personalizado",
            "Control de costos y presupuestos en tiempo real",
            "Gestión de recursos humanos y materiales",
            "Seguimiento de cronogramas y hitos",
            "Reportes automáticos y dashboards ejecutivos"
        ],
        results: [
            "25% de reducción en costos operativos",
            "Mejora del 45% en cumplimiento de plazos",
            "Reducción del 70% en errores de planificación",
            "Aumento del 35% en satisfacción del cliente"
        ],
        technologies: ["React", "Node.js", "PostgreSQL", "Docker", "AWS"],
        image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&h=400&fit=crop"
    },
    3: {
        title: "Optimización de Procesos",
        category: "Tecnología",
        description: "Rediseño y automatización completa de flujos de trabajo para un estudio de arquitectura, eliminando tareas repetitivas y mejorando la eficiencia operativa.",
        details: [
            "Análisis detallado de procesos actuales",
            "Identificación de cuellos de botella",
            "Diseño de flujos de trabajo optimizados",
            "Implementación de automatizaciones",
            "Capacitación y seguimiento continuo"
        ],
        results: [
            "50% de reducción en tiempo de procesos",
            "Eliminación del 80% de tareas manuales",
            "Mejora del 60% en precisión de datos",
            "Ahorro de 20 horas semanales por profesional"
        ],
        technologies: ["Python", "Zapier", "Airtable", "Slack", "Notion"],
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
    },
    4: {
        title: "Implementación BIM",
        category: "Arquitectura",
        description: "Migración completa a metodología BIM para un estudio de arquitectura, incluyendo capacitación del equipo, implementación de software y optimización de flujos de trabajo.",
        details: [
            "Evaluación de necesidades y objetivos",
            "Selección de software BIM apropiado",
            "Migración de proyectos existentes",
            "Capacitación intensiva del equipo",
            "Desarrollo de estándares y plantillas"
        ],
        results: [
            "100% de proyectos en metodología BIM",
            "Reducción del 40% en tiempo de coordinación",
            "Mejora del 90% en detección de conflictos",
            "Aumento del 50% en eficiencia de diseño"
        ],
        technologies: ["Revit", "Navisworks", "Dynamo", "BIM 360", "AutoCAD"],
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop"
    },
    5: {
        title: "Control de Calidad Digital",
        category: "Construcción",
        description: "Sistema de control de calidad digital para obra en construcción, permitiendo seguimiento en tiempo real y documentación automática de todos los procesos.",
        details: [
            "Sistema de checklist digital personalizado",
            "Fotografía y documentación automática",
            "Seguimiento de incidencias en tiempo real",
            "Reportes automáticos para stakeholders",
            "Integración con sistemas de gestión existentes"
        ],
        results: [
            "Reducción del 75% en tiempo de inspecciones",
            "Mejora del 85% en documentación de calidad",
            "Detección temprana del 90% de problemas",
            "Ahorro del 30% en costos de control de calidad"
        ],
        technologies: ["React Native", "Firebase", "TensorFlow", "Google Cloud", "Flutter"],
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop"
    },
    6: {
        title: "Análisis de Datos",
        category: "Tecnología",
        description: "Dashboard de análisis de datos para toma de decisiones en construcción, integrando múltiples fuentes de información y proporcionando insights en tiempo real.",
        details: [
            "Integración de múltiples fuentes de datos",
            "Dashboard ejecutivo personalizado",
            "Alertas automáticas y notificaciones",
            "Análisis predictivo de tendencias",
            "Reportes automáticos programados"
        ],
        results: [
            "Mejora del 60% en velocidad de toma de decisiones",
            "Reducción del 40% en costos operativos",
            "Identificación del 85% de oportunidades de mejora",
            "Aumento del 50% en transparencia de datos"
        ],
        technologies: ["Power BI", "Python", "SQL", "Azure", "Tableau"],
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    }
};

// ===== NAVIGATION FUNCTIONALITY =====

// Show/hide menu
function toggleMenu() {
    navMenu.classList.toggle('show-menu');
}

// Close menu
function closeMenu() {
    navMenu.classList.remove('show-menu');
}

// Active link
function activeLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}

// Scroll header
function scrollHeader() {
    if (this.scrollY >= 80) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

// Scroll up
function handleScrollUp() {
    if (this.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
}

// ===== SMOOTH SCROLLING =====

function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        closeMenu();
    }
}

// ===== PROJECT FILTERING =====

function filterProjects(filter) {
    const category = filter.getAttribute('data-filter');
    
    // Update active filter
    projectFilters.forEach(btn => btn.classList.remove('active'));
    filter.classList.add('active');
    
    // Filter projects
    projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== PROJECT MODAL =====

function openProjectModal(projectId) {
    const project = projectData[projectId];
    
    if (project) {
        modalTitle.textContent = project.title;
        
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy">
                </div>
                
                <div class="project-modal-info">
                    <div class="project-modal-category">
                        <span class="project-modal-tag">${project.category}</span>
                    </div>
                    
                    <p class="project-modal-description">${project.description}</p>
                    
                    <div class="project-modal-section">
                        <h4>Detalles del Proyecto</h4>
                        <ul>
                            ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-modal-section">
                        <h4>Resultados Obtenidos</h4>
                        <ul>
                            ${project.results.map(result => `<li>${result}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="project-modal-section">
                        <h4>Tecnologías Utilizadas</h4>
                        <div class="project-modal-technologies">
                            ${project.technologies.map(tech => `<span class="project-modal-tech">${tech}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        projectModal.classList.add('show-modal');
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal() {
    projectModal.classList.remove('show-modal');
    document.body.style.overflow = 'auto';
}

// ===== FORM VALIDATION =====

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return re.test(phone);
}

function showFormError(input, message) {
    const formGroup = input.closest('.contact__form-group');
    const existingError = formGroup.querySelector('.form-error');
    
    if (existingError) {
        existingError.remove();
    }
    
    const errorElement = document.createElement('span');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    formGroup.appendChild(errorElement);
    input.style.borderColor = '#ef4444';
}

function clearFormError(input) {
    const formGroup = input.closest('.contact__form-group');
    const errorElement = formGroup.querySelector('.form-error');
    
    if (errorElement) {
        errorElement.remove();
    }
    
    input.style.borderColor = '';
}

function validateForm() {
    let isValid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const message = document.getElementById('message');
    
    // Clear previous errors
    [name, email, phone, message].forEach(input => clearFormError(input));
    
    // Validate name
    if (!name.value.trim()) {
        showFormError(name, 'El nombre es requerido');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFormError(name, 'El nombre debe tener al menos 2 caracteres');
        isValid = false;
    }
    
    // Validate email
    if (!email.value.trim()) {
        showFormError(email, 'El email es requerido');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showFormError(email, 'Ingresa un email válido');
        isValid = false;
    }
    
    // Validate phone (optional)
    if (phone.value.trim() && !validatePhone(phone.value)) {
        showFormError(phone, 'Ingresa un teléfono válido');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showFormError(message, 'El mensaje es requerido');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFormError(message, 'El mensaje debe tener al menos 10 caracteres');
        isValid = false;
    }
    
    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            // Show success message
            contactForm.innerHTML = `
                <div class="form-success">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i>
                    <h3 style="color: #10b981; margin-bottom: 1rem;">¡Mensaje Enviado!</h3>
                    <p style="color: #6b7280; margin-bottom: 2rem;">
                        Gracias por contactarme. Te responderé en las próximas 24 horas.
                    </p>
                    <button type="button" class="btn btn--primary" onclick="location.reload()">
                        Enviar Otro Mensaje
                    </button>
                </div>
            `;
        }, 2000);
    }
}

// ===== ANIMATIONS ON SCROLL =====

function animateOnScroll() {
    const elements = document.querySelectorAll('.services__card, .experience__item, .projects__card, .testimonials__card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in');
        }
    });
}

// ===== LAZY LOADING =====

function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ===== UTILITY FUNCTIONS =====

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EVENT LISTENERS =====

// Navigation
navToggle.addEventListener('click', toggleMenu);
navClose.addEventListener('click', closeMenu);

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', smoothScroll);
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Scroll events
window.addEventListener('scroll', throttle(handleScrollUp, 100));
window.addEventListener('scroll', throttle(activeLink, 100));
window.addEventListener('scroll', debounce(animateOnScroll, 100));

// Scroll up button
scrollUp.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Project filtering
projectFilters.forEach(filter => {
    filter.addEventListener('click', () => filterProjects(filter));
});

// Project modal
projectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectId = button.getAttribute('data-project');
        openProjectModal(projectId);
    });
});

// Close modal
modalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeProjectModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('show-modal')) {
        closeProjectModal();
    }
});

// Form handling
contactForm.addEventListener('submit', handleFormSubmit);

// Real-time form validation
const formInputs = contactForm.querySelectorAll('input, textarea, select');
formInputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value.trim()) {
            clearFormError(input);
        }
    });
});

// ===== INITIALIZATION =====

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    animateOnScroll();
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Add loading animation to stats
    const stats = document.querySelectorAll('.home__stat-number');
    stats.forEach(stat => {
        const finalNumber = parseInt(stat.textContent);
        let currentNumber = 0;
        const increment = finalNumber / 50;
        
        const timer = setInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentNumber) + (stat.textContent.includes('+') ? '+' : '') + (stat.textContent.includes('%') ? '%' : '');
        }, 50);
    });
    
    // Add typing effect to hero title
    const heroTitle = document.querySelector('.home__title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical resources
function preloadResources() {
    const criticalImages = [
        'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS (if needed) =====

function trackEvent(eventName, eventData = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom analytics
    console.log('Event tracked:', eventName, eventData);
}

// Track form submissions
function trackFormSubmission() {
    trackEvent('form_submission', {
        form_name: 'contact_form',
        page_location: window.location.href
    });
}

// Track project views
function trackProjectView(projectId) {
    trackEvent('project_view', {
        project_id: projectId,
        project_title: projectData[projectId]?.title
    });
}

// ===== ACCESSIBILITY IMPROVEMENTS =====

// Keyboard navigation for modals
function handleModalKeyboard(e) {
    if (e.key === 'Tab') {
        const focusableElements = projectModal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    }
}

// Add keyboard event listener for modal
projectModal.addEventListener('keydown', handleModalKeyboard);

// Focus management for modal
function manageModalFocus() {
    const focusableElements = projectModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }
}

// Update modal open function to include focus management
const originalOpenProjectModal = openProjectModal;
openProjectModal = function(projectId) {
    originalOpenProjectModal(projectId);
    setTimeout(manageModalFocus, 100);
};

// ===== ERROR HANDLING =====

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can send error reports to your analytics service here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // You can send error reports to your analytics service here
});

// ===== EXPORT FUNCTIONS FOR GLOBAL USE =====

window.MatiasVillarruel = {
    openProjectModal,
    closeProjectModal,
    trackEvent,
    validateForm
}; 

// Game Configuration
const GAME_CONFIG = {
    GRAVITY: 0.5,
    JUMP_FORCE: -12,
    PLAYER_SPEED: 4,
    FRICTION: 0.8,
    PLATFORM_WIDTH: 120,
    PLATFORM_HEIGHT: 8,
    PLATFORM_SPACING: 80,
    INITIAL_PLATFORMS: 15,
    SCORE_MULTIPLIER: 10
};

// Game State Management
class GameState {
    constructor() {
        this.running = true;
        this.score = 0;
        this.lives = 3;
        this.hiScore = 15200;
        this.gameSpeed = 2;
    }

    reset() {
        this.running = true;
        this.score = 0;
        this.lives = 3;
    }

    updateHiScore() {
        if (this.score > this.hiScore) {
            this.hiScore = this.score;
            return true;
        }
        return false;
    }
}

// Player Class
class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 200;
        this.width = 24;
        this.height = 32;
        this.velY = 0;
        this.velX = 0;
        this.jumping = false;
        this.grounded = false;
        this.color = '#4488ff';
    }

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 200;
        this.velY = 0;
        this.velX = 0;
        this.grounded = false;
        this.jumping = false;
    }

    update(keys, platforms) {
        // Horizontal movement
        if (keys['ArrowLeft']) {
            this.velX = -GAME_CONFIG.PLAYER_SPEED;
        } else if (keys['ArrowRight']) {
            this.velX = GAME_CONFIG.PLAYER_SPEED;
        } else {
            this.velX *= GAME_CONFIG.FRICTION;
        }

        // Apply gravity
        this.velY += GAME_CONFIG.GRAVITY;

        // Update position
        this.x += this.velX;
        this.y += this.velY;

        // Horizontal boundaries
        this.x = Math.max(0, Math.min(this.x, this.canvas.width - this.width));

        // Platform collision detection
        this.checkPlatformCollisions(platforms);
    }

    checkPlatformCollisions(platforms) {
        this.grounded = false;
        
        for (let platform of platforms) {
            if (this.x < platform.x + platform.width &&
                this.x + this.width > platform.x &&
                this.y + this.height > platform.y &&
                this.y + this.height < platform.y + platform.height + 10 &&
                this.velY > 0) {
                
                this.y = platform.y - this.height;
                this.velY = 0;
                this.grounded = true;
                this.jumping = false;
                break;
            }
        }
    }

    jump() {
        if (this.grounded) {
            this.velY = GAME_CONFIG.JUMP_FORCE;
            this.jumping = true;
            this.grounded = false;
        }
    }

    draw(ctx) {
        // Main body
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Face
        ctx.fillStyle = '#ffddaa';
        ctx.fillRect(this.x + 6, this.y + 4, 12, 8);
        
        // Cap
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(this.x + 4, this.y, 16, 6);
        
        // Shoes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 2, this.y + 28, 8, 4);
        ctx.fillRect(this.x + 14, this.y + 28, 8, 4);
    }
}

// Platform Manager
class PlatformManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.platforms = [];
        this.createInitialPlatforms();
    }

    createInitialPlatforms() {
        this.platforms = [];
        
        // Initial platform where player spawns
        this.platforms.push({
            x: this.canvas.width / 2 - GAME_CONFIG.PLATFORM_WIDTH / 2,
            y: this.canvas.height - 150,
            width: GAME_CONFIG.PLATFORM_WIDTH,
            height: GAME_CONFIG.PLATFORM_HEIGHT,
            color: '#ff0044'
        });
        
        // Additional platforms
        for (let i = 1; i < GAME_CONFIG.INITIAL_PLATFORMS; i++) {
            this.platforms.push({
                x: Math.random() * (this.canvas.width - GAME_CONFIG.PLATFORM_WIDTH),
                y: this.canvas.height - 150 - (i * GAME_CONFIG.PLATFORM_SPACING),
                width: GAME_CONFIG.PLATFORM_WIDTH,
                height: GAME_CONFIG.PLATFORM_HEIGHT,
                color: '#ff0044'
            });
        }
    }

    update(playerY, canvasHeight) {
        // Generate new platforms when player goes up
        while (this.platforms[this.platforms.length - 1].y > -100) {
            this.platforms.push({
                x: Math.random() * (this.canvas.width - GAME_CONFIG.PLATFORM_WIDTH),
                y: this.platforms[this.platforms.length - 1].y - GAME_CONFIG.PLATFORM_SPACING,
                width: GAME_CONFIG.PLATFORM_WIDTH,
                height: GAME_CONFIG.PLATFORM_HEIGHT,
                color: '#ff0044'
            });
        }
        
        // Remove platforms that are off screen
        this.platforms = this.platforms.filter(platform => platform.y < canvasHeight + 100);
    }

    moveWorld(scoreIncrease) {
        this.platforms.forEach(platform => {
            platform.y += scoreIncrease;
        });
    }

    draw(ctx) {
        this.platforms.forEach(platform => {
            // Neon glow effect
            ctx.shadowColor = platform.color;
            ctx.shadowBlur = 20;
            
            // Main platform
            ctx.fillStyle = platform.color;
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Inner glow
            ctx.fillStyle = '#ff4488';
            ctx.fillRect(platform.x + 2, platform.y + 1, platform.width - 4, platform.height - 2);
            
            ctx.shadowBlur = 0;
        });
    }
}

// Background Manager
class BackgroundManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.backgroundImg = new Image();
        this.loadBackground();
    }

    loadBackground() {
        // Fallback SVG background with Pompidou-inspired design
        this.backgroundImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjNDA4MEZGIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMiIvPgogICAgICA8bGluZSB4MT0iMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSIxMDAiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICAgIDxsaW5lIHgxPSIxMDAiIHkxPSIwIiB4Mj0iMCIgeTI9IjEwMCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiLz4KICAgIDwvcGF0dGVybj4KICA8L2RlZnM+CiAgCiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPgogIAogIDxsaW5lIHgxPSIxMDAiIHkxPSI1MDAiIHgyPSI3MDAiIHkyPSIxMDAiIHN0cm9rZT0iI0ZGMDA0NCIgc3Ryb2tlLXdpZHRoPSIxNSIvPgogIDxyZWN0IHg9Ijk1IiB5PSI0OTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGMDA0NCIvPgogIDxyZWN0IHg9IjY5NSIgeT0iOTUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGMDA0NCIvPgogIAogIDxyZWN0IHg9IjAiIHk9IjU1MCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzMzMzMzMyIvPgogIDxyZWN0IHg9IjUwIiB5PSI1NjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI0ZGNDQ0NCIvPgogIDxyZWN0IHg9IjEwMCIgeT0iNTcwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiM0NDg4RkYiLz4KICA8cmVjdCB4PSIxNTAiIHk9IjU2NSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRkY0NDQ0Ii8+CiAgPHJlY3QgeD0iMjAwIiB5PSI1NzUiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iIzQ0ODhGRiIvPgo8L3N2Zz4K';
    }

    draw(ctx) {
        if (this.backgroundImg.complete && this.backgroundImg.naturalWidth > 0) {
            // Draw background image
            ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
            
            // Add night overlay
            ctx.fillStyle = 'rgba(0, 0, 40, 0.3)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // Fallback background
            ctx.fillStyle = '#000033';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw simplified Pompidou structure
            ctx.strokeStyle = '#4488ff';
            ctx.lineWidth = 3;
            
            // Steel structure
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 6; j++) {
                    let x = (this.canvas.width / 8) * i;
                    let y = (this.canvas.height / 6) * j;
                    ctx.strokeRect(x, y, this.canvas.width / 8, this.canvas.height / 6);
                    
                    // Diagonal crosses
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + this.canvas.width / 8, y + this.canvas.height / 6);
                    ctx.moveTo(x + this.canvas.width / 8, y);
                    ctx.lineTo(x, y + this.canvas.height / 6);
                    ctx.stroke();
                }
            }
            
            // Red diagonal escalator
            ctx.strokeStyle = '#ff0044';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(this.canvas.width * 0.2, this.canvas.height * 0.8);
            ctx.lineTo(this.canvas.width * 0.8, this.canvas.height * 0.2);
            ctx.stroke();
        }
    }
}

// UI Manager
class UIManager {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.hiScoreElement = document.getElementById('hiScore');
        this.livesElement = document.getElementById('lives');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
    }

    updateScore(score) {
        this.scoreElement.textContent = `SCORE: ${score.toString().padStart(6, '0')}`;
    }

    updateHiScore(hiScore) {
        this.hiScoreElement.textContent = `HI-SCORE: ${hiScore.toString().padStart(6, '0')}`;
    }

    updateLives(lives) {
        this.livesElement.textContent = `LIVES: x${lives}`;
    }

    showGameOver(score) {
        this.finalScoreElement.textContent = score;
        this.gameOverElement.style.display = 'block';
    }

    hideGameOver() {
        this.gameOverElement.style.display = 'none';
    }
}

// Main Game Class
class PompidouLeapGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {};
        
        this.gameState = new GameState();
        this.player = new Player(this.canvas);
        this.platformManager = new PlatformManager(this.canvas);
        this.backgroundManager = new BackgroundManager(this.canvas);
        this.uiManager = new UIManager();
        
        this.setupCanvas();
        this.setupEventListeners();
        this.start();
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEventListeners() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            if (e.key === ' ') {
                e.preventDefault();
                this.player.jump();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }

    update() {
        if (!this.gameState.running) return;

        // Update player
        this.player.update(this.keys, this.platformManager.platforms);

        // Check if player is going up (scoring)
        if (this.player.y < this.canvas.height / 2) {
            let scoreIncrease = Math.floor((this.canvas.height / 2 - this.player.y) / GAME_CONFIG.SCORE_MULTIPLIER);
            this.gameState.score += scoreIncrease;
            
            // Move world down
            this.player.y += scoreIncrease;
            this.platformManager.moveWorld(scoreIncrease);
            
            // Update platforms
            this.platformManager.update(this.player.y, this.canvas.height);
        }

        // Check game over
        if (this.player.y > this.canvas.height + 100) {
            this.gameOver();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw everything
        this.backgroundManager.draw(this.ctx);
        this.platformManager.draw(this.ctx);
        this.player.draw(this.ctx);
    }

    updateUI() {
        this.uiManager.updateScore(this.gameState.score);
        this.uiManager.updateLives(this.gameState.lives);
        
        if (this.gameState.updateHiScore()) {
            this.uiManager.updateHiScore(this.gameState.hiScore);
        }
    }

    gameOver() {
        this.gameState.running = false;
        this.uiManager.showGameOver(this.gameState.score);
    }

    restart() {
        this.gameState.reset();
        this.player.reset();
        this.platformManager.createInitialPlatforms();
        this.uiManager.hideGameOver();
        this.start();
    }

    start() {
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameState.running) return;
        
        this.update();
        this.draw();
        this.updateUI();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new PompidouLeapGame();
});

// Global restart function for the button
function restartGame() {
    if (window.game) {
        window.game.restart();
    }
} 

// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');

// Game state
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let level = 1;

// Player properties
const player = {
    x: 50,
    y: 500,
    width: 32,
    height: 32,
    speedX: 0,
    speedY: 0,
    onGround: false,
    frame: 0,
    frameCount: 0,
    direction: 1, // 1 = right, -1 = left
    jumping: false
};

// Game objects
const platforms = [
    { x: 0, y: 550, width: 800, height: 50 }, // Ground
    { x: 100, y: 450, width: 200, height: 20 }, // Platform 1
    { x: 400, y: 350, width: 200, height: 20 }, // Platform 2
    { x: 200, y: 250, width: 200, height: 20 }, // Platform 3
    { x: 500, y: 150, width: 200, height: 20 }, // Platform 4
];

const barrels = [];
const enemies = [];

// Input handling
const keys = {};

document.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});

// Button event listeners
startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause);

// Game functions
function startGame() {
    gameRunning = true;
    gamePaused = false;
    score = 0;
    lives = 3;
    level = 1;
    barrels.length = 0;
    enemies.length = 0;
    player.x = 50;
    player.y = 500;
    updateUI();
    gameLoop();
}

function togglePause() {
    if (gameRunning) {
        gamePaused = !gamePaused;
        pauseButton.textContent = gamePaused ? 'Reanudar' : 'Pausar';
    }
}

function updateUI() {
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('level').textContent = level;
}

function createBarrel() {
    if (Math.random() < 0.02) { // 2% chance per frame
        barrels.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speedY: 2 + Math.random() * 2
        });
    }
}

function updateBarrels() {
    for (let i = barrels.length - 1; i >= 0; i--) {
        const barrel = barrels[i];
        barrel.y += barrel.speedY;
        
        // Remove barrels that fall off screen
        if (barrel.y > canvas.height) {
            barrels.splice(i, 1);
            score += 10;
        }
        
        // Check collision with player
        if (checkCollision(player, barrel)) {
            lives--;
            barrels.splice(i, 1);
            if (lives <= 0) {
                gameOver();
            }
        }
    }
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updatePlayer() {
    // Handle input
    if (keys['ArrowLeft']) {
        player.speedX = -5;
        player.direction = -1;
    } else if (keys['ArrowRight']) {
        player.speedX = 5;
        player.direction = 1;
    } else {
        player.speedX = 0;
    }
    
    if (keys['Space'] && player.onGround) {
        player.speedY = -15;
        player.onGround = false;
        player.jumping = true;
    }
    
    // Apply gravity
    if (!player.onGround) {
        player.speedY += 0.8;
    }
    
    // Update position
    player.x += player.speedX;
    player.y += player.speedY;
    
    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    
    // Platform collision
    player.onGround = false;
    for (const platform of platforms) {
        if (checkCollision(player, platform)) {
            if (player.speedY > 0 && player.y < platform.y) {
                player.y = platform.y - player.height;
                player.speedY = 0;
                player.onGround = true;
                player.jumping = false;
            }
        }
    }
    
    // Animation
    if (player.speedX !== 0 && player.onGround) {
        player.frameCount++;
        if (player.frameCount > 5) {
            player.frame = (player.frame + 1) % 4;
            player.frameCount = 0;
        }
    }
    
    // Check if player reached the top
    if (player.y < 100) {
        level++;
        score += 100;
        player.x = 50;
        player.y = 500;
        updateUI();
    }
}

function gameOver() {
    gameRunning = false;
    alert(`¡Game Over! Puntuación: ${score}`);
}

function drawPlayer() {
    // Draw player as a colored rectangle for now
    ctx.fillStyle = '#ff6b6b';
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Draw direction indicator
    ctx.fillStyle = '#333';
    ctx.fillRect(player.x + (player.direction === 1 ? 20 : 0), player.y + 8, 8, 8);
}

function drawBarrels() {
    ctx.fillStyle = '#ffa500';
    for (const barrel of barrels) {
        ctx.fillRect(barrel.x, barrel.y, barrel.width, barrel.height);
    }
}

function drawPlatforms() {
    ctx.fillStyle = '#4a90e2';
    for (const platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
}

function drawBackground() {
    // Simple gradient background for now
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#4682B4');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Draw game objects
    drawPlatforms();
    drawBarrels();
    drawPlayer();
}

function update() {
    if (!gameRunning || gamePaused) return;
    
    updatePlayer();
    createBarrel();
    updateBarrels();
    updateUI();
}

function gameLoop() {
    update();
    draw();
    
    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Initialize game
updateUI();
draw(); 