// ─── Header Scroll Effect ───
const header = document.getElementById('header');
const readingProgress = document.getElementById('readingProgress');
const backToTop = document.getElementById('backToTop');
let lastScroll = 0;

function handleScroll() {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 80) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (readingProgress) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        readingProgress.style.width = `${scrollable > 0 ? Math.min(100, currentScroll / scrollable * 100) : 0}%`;
    }

    if (backToTop) backToTop.classList.toggle('visible', currentScroll > window.innerHeight);
    
    lastScroll = currentScroll;
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

// ─── Mobile Menu Toggle ───
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function setMenu(open) {
    menuOpen = open;
    menuToggle.classList.toggle('active', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

menuToggle.addEventListener('click', () => setMenu(!menuOpen));

// ─── Direct booking ───
const bookingUrl = 'https://m.booking.naver.com/booking/13/bizes/1702790';
document.querySelectorAll('.js-open-booking').forEach(link => {
    link.setAttribute('href', bookingUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noreferrer');
});

// ─── Section Scroll Spy ───
const sections = document.querySelectorAll('.section, .footer');
const dots = document.querySelectorAll('.floating-menu .dot');

function updateActiveDot() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        
        if (scrollPos >= top && scrollPos < bottom) {
            dots.forEach(d => d.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }
    });
    
    // Hide floating CTA on footer
    const footer = document.querySelector('.footer');
    if (footer) {
        const footerTop = footer.offsetTop;
        if (window.scrollY + window.innerHeight > footerTop + 100) {
            document.body.classList.add('footer-visible');
        } else {
            document.body.classList.remove('footer-visible');
        }
    }
}

window.addEventListener('scroll', updateActiveDot, { passive: true });
updateActiveDot();

// ─── Smooth Scroll ───
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if (this.classList.contains('js-open-finder')) return;
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            if (menuOpen) setMenu(false);
            const headerHeight = header.offsetHeight;
            const targetTop = target.offsetTop - headerHeight;
            window.scrollTo({
                top: targetTop,
                behavior: 'smooth'
            });
            window.setTimeout(() => {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }, 550);
        }
    });
});

// FAQ tools
const faqItems = document.querySelectorAll('.faq-item');
let bulkFaqAction = false;

faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
        if (!item.open || bulkFaqAction) return;

        faqItems.forEach(other => {
            if (other !== item) other.open = false;
        });
    });
});

const faqSearch = document.getElementById('faqSearch');
const faqEmpty = document.getElementById('faqEmpty');

faqSearch?.addEventListener('input', () => {
    const query = faqSearch.value.trim().toLocaleLowerCase('ko');
    let visibleCount = 0;
    faqItems.forEach(item => {
        const matches = !query || item.textContent.toLocaleLowerCase('ko').includes(query);
        item.hidden = !matches;
        if (matches) visibleCount += 1;
    });
    if (faqEmpty) faqEmpty.hidden = visibleCount !== 0;
});

document.getElementById('faqOpenAll')?.addEventListener('click', () => {
    bulkFaqAction = true;
    faqItems.forEach(item => { if (!item.hidden) item.open = true; });
    setTimeout(() => { bulkFaqAction = false; }, 100);
});

document.getElementById('faqCloseAll')?.addEventListener('click', () => {
    bulkFaqAction = true;
    faqItems.forEach(item => { item.open = false; });
    setTimeout(() => { bulkFaqAction = false; }, 100);
});

// ─── Scroll Reveal Animation ───
const revealElements = document.querySelectorAll(
    '.section h2, .section .sub, .section .body, .card, .flow-item, .feature, .faq-item, blockquote, .info-item, .membership-card, .cycle-item, .proof-card, .finder-prompt, .story-note, .space-quick-info'
);

revealElements.forEach((el, index) => {
    el.classList.add('reveal');
    if (el.matches('.cycle-item, .proof-card')) el.classList.add(index % 2 ? 'reveal-right' : 'reveal-left');
    else if (el.matches('.card, .membership-card')) el.classList.add('reveal-scale');
});

document.querySelectorAll('.flow-prompt').forEach((prompt, index) => {
    prompt.dataset.motion = ['float', 'sway', 'pulse'][index % 3];
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ─── Parallax Effect for Images ───
const parallaxImages = document.querySelectorAll('.visual-area img, .footer-visual img');

const parallaxObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.transform = 'scale(1)';
        }
    });
}, { threshold: 0.1 });

parallaxImages.forEach(img => {
    img.style.transform = 'scale(1.05)';
    img.style.transition = 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    parallaxObserver.observe(img);
});

document.querySelectorAll('video').forEach(video => video.play().catch(() => {}));

// ─── Shared toast ───
const siteToast = document.getElementById('siteToast');
let toastTimer;

function showToast(message) {
    if (!siteToast) return;
    siteToast.textContent = message;
    siteToast.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => siteToast.classList.remove('visible'), 2200);
}

// ─── Program finder ───
const timeFinder = document.getElementById('timeFinder');
const finderForm = document.getElementById('finderForm');
const finderResult = document.getElementById('finderResult');
const finderQuestions = document.getElementById('finderQuestions');
const finderAnswer = document.getElementById('finderAnswer');
const finderGo = document.getElementById('finderGo');
const finderRetry = document.getElementById('finderRetry');
let recommendedCard;
const programNames = {
    first60: '첫 시간 · 60분',
    mind90: '마음의 시간 · 90분',
    texture120: '결의 시간 · 120분',
    deep150: '깊은 시간 · 150분',
    custom: '맞춤의 시간'
};

document.querySelectorAll('.js-open-finder').forEach(button => {
    button.addEventListener('click', event => {
        event.preventDefault();
        finderForm?.reset();
        if (finderResult) finderResult.textContent = '';
        if (finderQuestions) finderQuestions.hidden = false;
        if (finderAnswer) finderAnswer.hidden = true;
        if (typeof timeFinder?.showModal === 'function') timeFinder.showModal();
        else timeFinder?.setAttribute('open', '');
        requestAnimationFrame(() => finderForm?.scrollTo({ top: 0 }));
    });
});

document.querySelectorAll('.js-close-finder').forEach(button => {
    button.addEventListener('click', () => timeFinder?.close());
});

timeFinder?.addEventListener('click', event => {
    if (event.target === timeFinder) timeFinder.close();
});

finderForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(finderForm);
    const condition = data.get('condition');
    const depth = data.get('depth');
    const available = data.get('available');
    let program = available === '60' ? 'first60' : 'mind90';

    if (available === '90') {
        program = 'mind90';
    } else if (available === '120') {
        program = condition === 'light' && depth === 'light' ? 'mind90' : 'texture120';
    } else if (available === '150') {
        program = condition === 'event' || depth === 'deep' ? 'deep150' : depth === 'standard' || condition === 'heavy' ? 'texture120' : 'mind90';
    } else if (available === 'flexible') {
        program = condition === 'heavy' && depth === 'deep' ? 'custom' : condition === 'event' || depth === 'deep' ? 'deep150' : depth === 'standard' || condition === 'heavy' ? 'texture120' : 'mind90';
    }

    if (finderResult) finderResult.textContent = `오늘 가장 가까운 시간은 ${programNames[program]}입니다.`;
    recommendedCard = document.querySelector(`[data-program="${program}"]`);
    if (finderQuestions) finderQuestions.hidden = true;
    if (finderAnswer) finderAnswer.hidden = false;
    finderForm?.scrollTo({ top: 0, behavior: 'smooth' });
});

finderRetry?.addEventListener('click', () => {
    finderForm?.reset();
    if (finderAnswer) finderAnswer.hidden = true;
    if (finderQuestions) finderQuestions.hidden = false;
    finderForm?.scrollTo({ top: 0 });
});

finderGo?.addEventListener('click', () => {
    timeFinder?.close();
    document.querySelectorAll('.card.recommended').forEach(item => item.classList.remove('recommended'));
    recommendedCard?.classList.add('recommended');
    recommendedCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => recommendedCard?.classList.remove('recommended'), 8000);
});

// ─── Mobile detail toggles ───
document.querySelectorAll('.detail-toggle').forEach(button => {
    button.dataset.label = button.textContent;
    button.addEventListener('click', () => {
        const container = button.closest('.card, .membership-card');
        const expanded = !container?.classList.contains('details-expanded');
        container?.classList.toggle('details-expanded', expanded);
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? '간단히 보기' : button.dataset.label || '포함 흐름 보기';
    });
});

// ─── Soft pointer response ───
document.querySelectorAll('.section, .footer').forEach(section => {
    section.addEventListener('pointermove', event => {
        const rect = section.getBoundingClientRect();
        section.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
        section.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
    }, { passive: true });
});

// ─── Reading convenience ───
backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.getElementById('section1')?.focus({ preventScroll: true }), 550);
});
