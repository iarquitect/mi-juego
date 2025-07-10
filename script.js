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
function scrollUp() {
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
window.addEventListener('scroll', throttle(scrollHeader, 100));
window.addEventListener('scroll', throttle(scrollUp, 100));
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