// Global variables
let isAnimating = false;
let observedCounters = new Set();

// Get current page from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const fileName = path.split('/').pop();
    return fileName === '' || fileName === 'index.html' ? 'index.html' : fileName;
}

// Update active navigation based on current page
function updateActiveNavigation() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('text-primary', 'font-medium');
        link.classList.add('text-muted-foreground');
        
        const href = link.getAttribute('href');
        if ((currentPage === 'index.html' && href === 'index.html') ||
            (currentPage !== 'index.html' && href === currentPage)) {
            link.classList.remove('text-muted-foreground');
            link.classList.add('text-primary', 'font-medium');
        }
    });
}

// Mobile menu functionality
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('open');
    }
}

function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.remove('open');
    }
}

// Product filtering functionality
function filterProducts(category) {
    const products = document.querySelectorAll('.product-item');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    if (products.length === 0) return; // Not on products page
    
    // Update button states
    filterBtns.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-primary-foreground', 'active');
        btn.classList.add('bg-muted', 'text-muted-foreground');
    });
    
    // Find the clicked button and activate it
    const activeBtn = Array.from(filterBtns).find(btn => 
        btn.textContent.toLowerCase().includes(category === 'all' ? 'all' : category)
    );
    if (activeBtn) {
        activeBtn.classList.remove('bg-muted', 'text-muted-foreground');
        activeBtn.classList.add('bg-primary', 'text-primary-foreground', 'active');
    }
    
    // Filter products with animation
    products.forEach(product => {
        const productCategory = product.dataset.category;
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
            product.style.opacity = '0';
            setTimeout(() => {
                product.style.opacity = '1';
            }, 50);
        } else {
            product.style.opacity = '0';
            setTimeout(() => {
                product.style.display = 'none';
            }, 200);
        }
    });
}

// Product search functionality
function setupProductSearch() {
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-item');
            
            products.forEach(product => {
                const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
                const description = product.querySelector('p')?.textContent.toLowerCase() || '';
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }
}

// Blog search and filter functionality
function setupBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const categorySelect = document.getElementById('blog-category');
    
    function filterBlogArticles() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const selectedCategory = categorySelect ? categorySelect.value : '';
        const articles = document.querySelectorAll('.blog-article');
        
        articles.forEach(article => {
            const title = article.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = article.querySelector('p')?.textContent.toLowerCase() || '';
            const category = article.dataset.category || '';
            
            const matchesSearch = !searchTerm || title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;
            
            if (matchesSearch && matchesCategory) {
                article.classList.remove('hidden');
                article.style.display = 'block';
            } else {
                article.classList.add('hidden');
                article.style.display = 'none';
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', filterBlogArticles);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterBlogArticles);
    }
}

// Counter animation functionality
function animateCounter(counter) {
    if (observedCounters.has(counter)) return;
    
    observedCounters.add(counter);
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            counter.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            counter.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Intersection Observer for counters
function setupCounterObserver() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length === 0) return;
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Form handling
function setupForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = 'Sending...';
                
                setTimeout(() => {
                    alert('Thank you for your message! We\'ll get back to you soon.');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 1000);
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });
}

// Add smooth animations for step items
function setupStepAnimations() {
    const stepItems = document.querySelectorAll('.step-item');
    
    if (stepItems.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1
    });
    
    stepItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
}

// Handle window resize for mobile menu
function handleResize() {
    if (window.innerWidth >= 768) {
        closeMobileMenu();
    }
}

// Enhanced button interactions
function setupButtonInteractions() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        // Add ripple effect on click for primary buttons
        button.addEventListener('click', function(e) {
            if (button.classList.contains('bg-primary')) {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Handle smooth scrolling within a page (for anchor links)
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup page-specific functionality
function setupPageSpecificFeatures() {
    const currentPage = getCurrentPage();
    
    // Page-specific initialization
    switch (currentPage) {
        case 'products.html':
            setupProductSearch();
            // Initialize filter buttons
            const allFilterBtn = document.querySelector('[data-testid="filter-all"]');
            if (allFilterBtn && !allFilterBtn.classList.contains('active')) {
                filterProducts('all');
            }
            break;
            
        case 'blog.html':
            setupBlogSearch();
            break;
            
        default:
            // Common functionality for all pages
            break;
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing FarmUrban website...');
    
    // Setup core functionality that works on all pages
    setupCounterObserver();
    setupForms();
    setupStepAnimations();
    setupButtonInteractions();
    setupSmoothScrolling();
    
    // Setup page-specific features
    setupPageSpecificFeatures();
    
    // Update navigation to show current page
    updateActiveNavigation();
    
    // Handle window events
    window.addEventListener('resize', handleResize);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuBtn = document.querySelector('[data-testid="button-mobile-menu"]');
        
        if (mobileMenu && mobileMenuBtn && 
            !mobileMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // Set initial opacity for smooth loading
        if (!img.style.opacity) {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        }
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Add fade-in animation for sections
    const sections = document.querySelectorAll('section');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(section);
    });
    
    console.log('FarmUrban website initialized successfully!');
});

// Export functions for global access
window.FarmUrban = {
    toggleMobileMenu,
    filterProducts,
    animateCounter,
    getCurrentPage
};