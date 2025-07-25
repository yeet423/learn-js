// Main JavaScript for Mumbai Drainage Monitoring System

// Global variables
let currentPage = 'dashboard';
let notifications = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeMobileMenu();
    initializeNotifications();
    updateLastUpdateTime();
    setInterval(updateLastUpdateTime, 30000); // Update every 30 seconds
});

// Navigation functionality
function initializeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath.split('/').pop() || 
            (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
            link.classList.add('text-blue-600', 'font-semibold', 'border-b-2', 'border-blue-600', 'pb-1');
            link.classList.remove('text-gray-600');
        }
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // Animate hamburger icon
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Notification system
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            showNotificationPanel();
        });
    }
    
    // Sample notifications
    notifications = [
        {
            id: 1,
            type: 'warning',
            title: 'High Water Level',
            message: 'Sensor #3 reporting 85cm water level',
            time: new Date(Date.now() - 300000), // 5 minutes ago
            read: false
        },
        {
            id: 2,
            type: 'info',
            title: 'System Update',
            message: 'New sensors added to network',
            time: new Date(Date.now() - 1800000), // 30 minutes ago
            read: false
        },
        {
            id: 3,
            type: 'critical',
            title: 'Emergency Alert',
            message: 'Flooding detected in Andheri area',
            time: new Date(Date.now() - 3600000), // 1 hour ago
            read: true
        }
    ];
    
    updateNotificationBadge();
}

function showNotificationPanel() {
    const panel = createNotificationPanel();
    document.body.appendChild(panel);
    
    // Animate in
    setTimeout(() => {
        panel.classList.add('opacity-100');
        panel.classList.remove('opacity-0');
    }, 10);
    
    // Auto close after 10 seconds
    setTimeout(() => {
        closeNotificationPanel(panel);
    }, 10000);
}

function createNotificationPanel() {
    const panel = document.createElement('div');
    panel.className = 'fixed top-16 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 opacity-0 transition-opacity duration-300';
    
    const unreadCount = notifications.filter(n => !n.read).length;
    
    panel.innerHTML = `
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="font-semibold text-gray-800">Notifications</h3>
            <div class="flex space-x-2">
                <span class="bg-red-500 text-white text-xs px-2 py-1 rounded-full">${unreadCount} new</span>
                <button onclick="closeNotificationPanel(this.closest('.fixed'))" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="max-h-64 overflow-y-auto">
            ${notifications.map(notification => `
                <div class="p-3 border-b border-gray-100 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}">
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 mt-1">
                            <i class="fas ${getNotificationIcon(notification.type)} ${getNotificationColor(notification.type)}"></i>
                        </div>
                        <div class="flex-grow">
                            <h4 class="font-medium text-sm text-gray-800">${notification.title}</h4>
                            <p class="text-xs text-gray-600 mt-1">${notification.message}</p>
                            <p class="text-xs text-gray-400 mt-1">${formatTime(notification.time)}</p>
                        </div>
                        ${!notification.read ? '<div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>' : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="p-3 text-center border-t border-gray-200">
            <button onclick="markAllAsRead()" class="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Mark all as read
            </button>
        </div>
    `;
    
    return panel;
}

function closeNotificationPanel(panel) {
    panel.classList.add('opacity-0');
    panel.classList.remove('opacity-100');
    setTimeout(() => {
        if (panel.parentNode) {
            panel.parentNode.removeChild(panel);
        }
    }, 300);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'critical': return 'fa-exclamation-triangle';
        case 'warning': return 'fa-exclamation-circle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
    }
}

function getNotificationColor(type) {
    switch (type) {
        case 'critical': return 'text-red-500';
        case 'warning': return 'text-yellow-500';
        case 'info': return 'text-blue-500';
        default: return 'text-gray-500';
    }
}

function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) {
        return `${minutes}m ago`;
    } else if (hours < 24) {
        return `${hours}h ago`;
    } else {
        return `${days}d ago`;
    }
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    updateNotificationBadge();
    const panels = document.querySelectorAll('.fixed.top-16.right-4');
    panels.forEach(panel => closeNotificationPanel(panel));
}

function updateNotificationBadge() {
    const badge = document.querySelector('#notificationBtn .absolute');
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (badge) {
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

// Update last update time
function updateLastUpdateTime() {
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleTimeString();
    }
}

// Utility functions
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform translate-x-full transition-transform duration-300 ${getToastColor(type)}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 10);
    
    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

function getToastColor(type) {
    switch (type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        default: return 'bg-blue-500';
    }
}

// Loading state management
function showLoading(element) {
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    spinner.innerHTML = '<div class="loading-spinner"></div>';
    
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    
    if (element) {
        element.appendChild(spinner);
    }
}

function hideLoading(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    
    if (element) {
        const spinner = element.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Export data functionality
function exportData(data, filename, format = 'json') {
    let content, mimeType;
    
    switch (format) {
        case 'csv':
            content = convertToCSV(data);
            mimeType = 'text/csv';
            filename += '.csv';
            break;
        case 'json':
        default:
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            filename += '.json';
            break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function convertToCSV(data) {
    if (!Array.isArray(data) || data.length === 0) {
        return '';
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            return typeof value === 'string' ? `"${value}"` : value;
        }).join(','))
    ].join('\n');
    
    return csvContent;
}

// Error handling
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    showToast('An error occurred. Please refresh the page.', 'error');
});

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to open search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        // Open search functionality (to be implemented)
        showToast('Search functionality coming soon!', 'info');
    }
    
    // Escape to close modals/panels
    if (event.key === 'Escape') {
        const panels = document.querySelectorAll('.fixed.top-16.right-4');
        panels.forEach(panel => closeNotificationPanel(panel));
        
        const chatbot = document.getElementById('chatbotBox');
        if (chatbot && !chatbot.classList.contains('hidden')) {
            chatbot.classList.add('hidden');
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A' && event.target.getAttribute('href').startsWith('#')) {
        event.preventDefault();
        const targetId = event.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add fade-in animation to elements when they come into view
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
});