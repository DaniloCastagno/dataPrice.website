// Authentication and Profile Management System
class AuthManager {
    constructor() {
        this.isLoggedIn = false;
        this.userEmail = null;
        this.userProfile = null;
        this.init();
    }
    
    init() {
        this.checkAuthState();
        this.setupProfileButton();
        this.updateNavigation();
    }
    
    checkAuthState() {
        this.isLoggedIn = sessionStorage.getItem('dataPriceLoggedIn') === 'true';
        this.userEmail = sessionStorage.getItem('dataPriceUserEmail');
        this.userProfile = JSON.parse(sessionStorage.getItem('dataPriceUserProfile') || '{}');
    }
    
    setupProfileButton() {
        const nav = document.querySelector('.nav-links');
        if (!nav) return;
        
        // Remove existing profile button if any
        const existingProfile = nav.querySelector('.profile-btn');
        if (existingProfile) {
            existingProfile.remove();
        }
        
        if (this.isLoggedIn) {
            // Add profile button for logged-in users
            const profileLi = document.createElement('li');
            profileLi.innerHTML = `
                <a href="#" class="profile-btn" id="profileBtn">
                    <span class="profile-icon">👤</span>
                    <span class="profile-text">Account</span>
                </a>
            `;
            
            // Add profile button at the end (right side)
            nav.appendChild(profileLi);
            
            // Add click event
            document.getElementById('profileBtn').addEventListener('click', (e) => {
                e.preventDefault();
                this.showProfileModal();
            });
        } else {
            // Add login button for non-logged-in users
            const loginLi = document.createElement('li');
            loginLi.innerHTML = `
                <a href="auth/login.html" class="cta-button login-btn">
                    <span class="login-icon">🔐</span>
                    <span class="login-text">Login</span>
                </a>
            `;
            
            // Add login button at the end (right side)
            nav.appendChild(loginLi);
        }
    }
    
    updateNavigation() {
        // Update mobile menu if exists
        this.updateMobileMenu();
    }
    
    updateMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (!mobileToggle) return;
        
        // Add mobile-specific profile styling
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .profile-btn {
                    background: var(--primary-color) !important;
                    color: white !important;
                    padding: 8px 16px !important;
                    border-radius: 6px !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                    font-weight: 600 !important;
                }
                
                .profile-btn .profile-icon {
                    font-size: 1.2rem;
                }
                
                .profile-btn .profile-text {
                    font-size: 0.9rem;
                }
                
                .login-btn {
                    display: flex !important;
                    align-items: center !important;
                    gap: 0.5rem !important;
                    font-weight: 600 !important;
                }
                
                .login-btn .login-icon {
                    font-size: 1.1rem;
                }
                
                .login-btn .login-text {
                    font-size: 0.9rem;
                }
            }
            
            .profile-btn {
                color: var(--primary-color);
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .profile-btn:hover {
                color: var(--accent-color);
            }
            
            .profile-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .profile-modal.active {
                opacity: 1;
                visibility: visible;
            }
            
            .profile-modal-content {
                background: var(--white);
                border-radius: 16px;
                padding: 2rem;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
                transform: scale(0.8);
                transition: all 0.3s ease;
            }
            
            .profile-modal.active .profile-modal-content {
                transform: scale(1);
            }
            
            .profile-header {
                text-align: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--border-color);
            }
            
            .profile-avatar {
                width: 80px;
                height: 80px;
                background: var(--primary-color);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                color: white;
                margin: 0 auto 1rem;
            }
            
            .profile-options {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .profile-options li {
                margin-bottom: 0.5rem;
            }
            
            .profile-option {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                border-radius: 8px;
                text-decoration: none;
                color: var(--neutral-dark);
                transition: background 0.3s ease;
                cursor: pointer;
            }
            
            .profile-option:hover {
                background: var(--light-gray);
                color: var(--neutral-dark);
            }
            
            .profile-option-icon {
                font-size: 1.5rem;
                width: 24px;
                text-align: center;
            }
            
            .profile-option-text {
                flex: 1;
            }
            
            .profile-option-subtitle {
                font-size: 0.8rem;
                color: var(--neutral-mid);
                margin-top: 0.2rem;
            }
            
            .profile-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--neutral-mid);
                transition: color 0.3s ease;
            }
            
            .profile-close:hover {
                color: var(--neutral-dark);
            }
        `;
        
        if (!document.querySelector('#profile-styles')) {
            style.id = 'profile-styles';
            document.head.appendChild(style);
        }
    }
    
    showProfileModal() {
        const modal = this.createProfileModal();
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeProfileModal(modal);
            }
        });
    }
    
    createProfileModal() {
        const userInitial = this.userEmail ? this.userEmail.charAt(0).toUpperCase() : 'U';
        const companyName = this.userEmail ? this.userEmail.split('@')[1].split('.')[0] : 'Company';
        
        const modal = document.createElement('div');
        modal.className = 'profile-modal';
        modal.innerHTML = `
            <div class="profile-modal-content">
                <button class="profile-close" onclick="authManager.closeProfileModal(this.closest('.profile-modal'))">&times;</button>
                
                <div class="profile-header">
                    <div class="profile-avatar">${userInitial}</div>
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--neutral-dark);">${companyName.charAt(0).toUpperCase() + companyName.slice(1)}</h3>
                    <p style="margin: 0; color: var(--neutral-mid); font-size: 0.9rem;">${this.userEmail || 'user@company.com'}</p>
                </div>
                
                <ul class="profile-options">
                    <li>
                        <a href="dashboard.html" class="profile-option">
                            <span class="profile-option-icon">📊</span>
                            <div class="profile-option-text">
                                <div>Dashboard</div>
                                <div class="profile-option-subtitle">View your analytics and reports</div>
                            </div>
                        </a>
                    </li>
                    
                    <li>
                        <div class="profile-option" onclick="authManager.showComingSoon('Account Settings')">
                            <span class="profile-option-icon">⚙️</span>
                            <div class="profile-option-text">
                                <div>Account Settings</div>
                                <div class="profile-option-subtitle">Manage your profile and preferences</div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <div class="profile-option" onclick="authManager.showComingSoon('Billing & Plans')">
                            <span class="profile-option-icon">💳</span>
                            <div class="profile-option-text">
                                <div>Billing & Plans</div>
                                <div class="profile-option-subtitle">Manage subscription and payments</div>
                            </div>
                        </div>
                    </li>
                    
                    <li>
                        <a href="contact.html" class="profile-option">
                            <span class="profile-option-icon">💬</span>
                            <div class="profile-option-text">
                                <div>Support</div>
                                <div class="profile-option-subtitle">Get help from our team</div>
                            </div>
                        </a>
                    </li>
                    
                    <li>
                        <div class="profile-option" onclick="authManager.showComingSoon('Team Management')">
                            <span class="profile-option-icon">👥</span>
                            <div class="profile-option-text">
                                <div>Team Management</div>
                                <div class="profile-option-subtitle">Invite and manage team members</div>
                            </div>
                        </div>
                    </li>
                    
                    <li style="border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 1rem;">
                        <div class="profile-option" onclick="authManager.logout()">
                            <span class="profile-option-icon" style="color: #dc2626;">🚪</span>
                            <div class="profile-option-text">
                                <div style="color: #dc2626;">Sign Out</div>
                                <div class="profile-option-subtitle">Log out of your account</div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        `;
        
        return modal;
    }
    
    closeProfileModal(modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    showComingSoon(feature) {
        alert(`${feature} coming soon! 🚀\n\nWe're working hard to bring you the best experience. This feature will be available in our next update.\n\nFor immediate assistance, please contact our support team.`);
    }
    
    logout() {
        const isConfirmed = confirm('Are you sure you want to sign out?\n\nYou will need to log in again to access your dashboard.');
        
        if (isConfirmed) {
            // Clear session data
            sessionStorage.removeItem('dataPriceLoggedIn');
            sessionStorage.removeItem('dataPriceUserEmail');
            sessionStorage.removeItem('dataPriceUserProfile');
            
            // Close modal if open
            const modal = document.querySelector('.profile-modal');
            if (modal) {
                this.closeProfileModal(modal);
            }
            
            // Show success message
            setTimeout(() => {
                alert('You have been signed out successfully.');
                // Redirect to home page
                window.location.href = window.location.pathname.includes('/auth/') ? '../index.html' : 'index.html';
            }, 100);
        }
    }
}

// Initialize auth manager when DOM is loaded
let authManager;
document.addEventListener('DOMContentLoaded', function() {
    authManager = new AuthManager();
});

// Make it globally available
window.AuthManager = AuthManager;