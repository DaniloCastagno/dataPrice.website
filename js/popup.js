// Welcome Popup Functionality
class WelcomePopup {
    constructor() {
        this.currentSlide = 0;
        this.slides = [];
        this.autoSlideInterval = null;
        this.slideDelay = 3000; // 3 seconds
        this.init();
    }

    init() {
        // Check if popup should be shown (only on first visit or every 24 hours)
        if (this.shouldShowPopup()) {
            // Add a small delay to ensure DOM is fully loaded
            setTimeout(() => {
                this.createPopup();
                this.bindEvents();
                this.startAutoSlide();
                this.showPopup();
            }, 1000); // 1 second delay
        }
    }

    shouldShowPopup() {
        // Use sessionStorage instead of localStorage for session-based popup
        const popupShownThisSession = sessionStorage.getItem('dataPricePopupShown');
        
        // Check if user is returning to the tab (for mobile tab switching)
        const lastActiveTime = sessionStorage.getItem('dataPriceLastActive');
        const now = new Date().getTime();
        const fiveMinutesAgo = 5 * 60 * 1000; // 5 minutes in milliseconds
        
        // If popup was shown this session, don't show again
        if (popupShownThisSession) {
            return false;
        }
        
        // If user was active recently (tab switching), don't show popup
        if (lastActiveTime && (now - parseInt(lastActiveTime)) < fiveMinutesAgo) {
            return false;
        }
        
        return true;
    }

    createPopup() {
        const popupHTML = `
            <div class="welcome-popup-overlay" id="welcomePopup">
                <div class="welcome-popup">
                    <button class="popup-close" id="popupClose">&times;</button>
                    <div class="popup-slider">
                        <div class="popup-slide active">
                            <div class="slide-content">
                                <div class="icon">🎯</div>
                                <h2>Our Mission</h2>
                                <p>Transform your business data into profitable insights. We make enterprise-level analytics accessible for small businesses.</p>
                            </div>
                            <button class="popup-next-btn" data-next="1">Next →</button>
                        </div>
                        <div class="popup-slide">
                            <div class="slide-content">
                                <div class="icon">💡</div>
                                <h2>What We Offer</h2>
                                <p>Custom dashboards, predictive analytics, data automation, and actionable business intelligence tailored to your needs.</p>
                            </div>
                            <button class="popup-next-btn" data-next="2">Next →</button>
                        </div>
                        <div class="popup-slide">
                            <div class="slide-content">
                                <div class="icon">📈</div>
                                <h2>How We Help</h2>
                                <p>Increase profits by 25%, reduce manual work by 60%, and make data-driven decisions that drive real growth.</p>
                            </div>
                            <button class="popup-next-btn" data-next="3">Next →</button>
                        </div>
                        <div class="popup-slide">
                            <div class="slide-content">
                                <div class="icon">🚀</div>
                                <h2>Ready to Start?</h2>
                                <p>Ready to make data-driven decisions for your business? Get your professional consultation today.</p>
                            </div>
                            <a href="index.html" class="popup-cta">Get Started Now</a>
                        </div>
                    </div>
                    <div class="popup-indicators">
                        <div class="popup-dot active" data-slide="0"></div>
                        <div class="popup-dot" data-slide="1"></div>
                        <div class="popup-dot" data-slide="2"></div>
                        <div class="popup-dot" data-slide="3"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', popupHTML);
        this.slides = document.querySelectorAll('.popup-slide');
        this.dots = document.querySelectorAll('.popup-dot');
    }

    bindEvents() {
        const overlay = document.getElementById('welcomePopup');
        const closeBtn = document.getElementById('popupClose');
        
        // Close popup events
        closeBtn.addEventListener('click', () => this.closePopup());
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.closePopup();
        });
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closePopup();
        });
        
        // Dot navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.goToSlide(index);
                this.restartAutoSlide();
            });
        });
        
        // Next button navigation
        const nextButtons = document.querySelectorAll('.popup-next-btn');
        nextButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const nextSlide = parseInt(btn.getAttribute('data-next'));
                this.goToSlide(nextSlide);
                this.restartAutoSlide();
            });
        });
        
        // Pause auto-slide on hover
        const popup = document.querySelector('.welcome-popup');
        popup.addEventListener('mouseenter', () => this.pauseAutoSlide());
        popup.addEventListener('mouseleave', () => this.startAutoSlide());
    }

    showPopup() {
        const overlay = document.getElementById('welcomePopup');
        // Small delay to ensure CSS is loaded
        setTimeout(() => {
            overlay.classList.add('active');
        }, 100);
    }

    closePopup() {
        const overlay = document.getElementById('welcomePopup');
        overlay.classList.remove('active');
        
        // Store that popup was shown this session
        sessionStorage.setItem('dataPricePopupShown', 'true');
        
        // Remove from DOM after animation
        setTimeout(() => {
            overlay.remove();
            this.pauseAutoSlide();
        }, 300);
    }

    goToSlide(index) {
        // Remove active classes
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[this.currentSlide].classList.add('prev');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Set new slide
        this.currentSlide = index;
        
        // Add active classes
        setTimeout(() => {
            this.slides.forEach(slide => slide.classList.remove('prev'));
            this.slides[this.currentSlide].classList.add('active');
            this.dots[this.currentSlide].classList.add('active');
        }, 100);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }

    startAutoSlide() {
        this.pauseAutoSlide(); // Clear any existing interval
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.slideDelay);
    }

    pauseAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }

    restartAutoSlide() {
        this.pauseAutoSlide();
        this.startAutoSlide();
    }
}

// Session and visibility management
class SessionManager {
    constructor() {
        this.setupVisibilityTracking();
        this.updateLastActive();
    }
    
    setupVisibilityTracking() {
        // Track page visibility for tab switching
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.updateLastActive();
            }
        });
        
        // Track window focus for app switching
        window.addEventListener('focus', () => {
            this.updateLastActive();
        });
        
        // Track mouse activity
        document.addEventListener('mousemove', () => {
            this.updateLastActive();
        });
        
        // Track keyboard activity
        document.addEventListener('keydown', () => {
            this.updateLastActive();
        });
    }
    
    updateLastActive() {
        sessionStorage.setItem('dataPriceLastActive', new Date().getTime().toString());
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize session management
    new SessionManager();
    
    // Only show popup on home page
    const currentPath = window.location.pathname.toLowerCase();
    const isHomePage = currentPath === '/' || 
                      currentPath.includes('index.html') || 
                      currentPath === '/dataprice.website/' ||
                      currentPath.endsWith('/') ||
                      currentPath === '' ||
                      currentPath.includes('website/index.html') ||
                      currentPath.includes('website/') && !currentPath.includes('.html');
    
    if (isHomePage) {
        new WelcomePopup();
    }
});

// Export for manual control if needed
window.WelcomePopup = WelcomePopup;