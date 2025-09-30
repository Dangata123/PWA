class PWAInstall {
    constructor() {
        this.installButton = document.getElementById('installButton');
        this.installContainer = document.getElementById('installContainer');
        this.deferredPrompt = null;
        
        this.init();
    }
    
    init() {
        // Check if app is already installed
        if (this.isAppInstalled()) {
            this.hideInstallButton();
            return;
        }
        
        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        // Listen for app installed event
        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.hideInstallButton();
            this.showSuccessMessage();
            localStorage.setItem('appInstalled', 'true');
        });
        
        // Install button click handler
        this.installButton.addEventListener('click', () => {
            this.installApp();
        });
        
        // Check on page load if app is already installed
        window.addEventListener('load', () => {
            if (this.isAppInstalled()) {
                this.hideInstallButton();
            } else {
                // If no install prompt after 1 second, check display mode
                setTimeout(() => {
                    if (this.isRunningAsPWA()) {
                        this.hideInstallButton();
                        localStorage.setItem('appInstalled', 'true');
                    }
                }, 1000);
            }
        });
    }
    
    isAppInstalled() {
        return localStorage.getItem('appInstalled') === 'true';
    }
    
    isRunningAsPWA() {
        return window.matchMedia('(display-mode: standalone)').matches || 
               window.navigator.standalone === true;
    }
    
    showInstallButton() {
        this.installContainer.classList.remove('hidden');
        this.installContainer.classList.add('visible');
    }
    
    hideInstallButton() {
        this.installContainer.classList.remove('visible');
        this.installContainer.classList.add('hidden');
    }
    
    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }
        
        this.deferredPrompt.prompt();
        
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            this.deferredPrompt = null;
        }
    }
    
    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'App installed successfully!';
        this.installContainer.parentNode.insertBefore(message, this.installContainer.nextSibling);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize the PWA Install functionality
new PWAInstall();

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('PWA/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
