// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const faqAnswer = faqItem.querySelector('.faq-answer');
            const faqArrow = this.querySelector('.faq-arrow');
            const isOpen = faqItem.classList.contains('active');
            
            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = null;
                    item.querySelector('.faq-arrow').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ item
            if (isOpen) {
                faqItem.classList.remove('active');
                faqAnswer.style.maxHeight = null;
                faqArrow.style.transform = 'rotate(0deg)';
            } else {
                faqItem.classList.add('active');
                faqAnswer.style.maxHeight = faqAnswer.scrollHeight + 'px';
                faqArrow.style.transform = 'rotate(90deg)';
            }
        });
    });
});

// Cookie Consent functionality
function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookie-consent').style.display = 'none';
    // When you add analytics, initialize them here
    // Example: gtag('consent', 'update', { 'analytics_storage': 'granted' });
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookie-consent').style.display = 'none';
    // When you add analytics, disable them here
    // Example: gtag('consent', 'update', { 'analytics_storage': 'denied' });
}

function showCookieInfo() {
    document.getElementById('cookie-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCookieInfo(event) {
    if (event) {
        // If clicking the backdrop (not the modal content), close
        if (event.target === event.currentTarget) {
            document.getElementById('cookie-modal').style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
    } else {
        // Called directly (from close button)
        document.getElementById('cookie-modal').style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Check if user has already made a choice
document.addEventListener('DOMContentLoaded', function() {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
        // Show banner after a short delay for better UX
        setTimeout(function() {
            document.getElementById('cookie-consent').style.display = 'block';
        }, 500);
    }

    // Show/hide scroll to top button based on scroll position
    const scrollTopBtn = document.querySelector('.floating-scroll-top-btn');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'flex';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
});

