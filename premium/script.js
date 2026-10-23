function checkout(type) {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.onrender.com/redirect&response_type=code&scope=identify&state=' + type;
}
function openPortal() {
    window.location.href = 'https://discord.com/api/oauth2/authorize?client_id=877644741339144244&redirect_uri=https://spyoweb.onrender.com/redirect&response_type=code&scope=identify&state=P';
}

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
if (urlParams.get('t') === '1') {
    alert('Your discord account does not have a premium subscription.');
}

function formatTimer(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const MAX_DURATION_HOURS = 48;
const MS_IN_MINUTE = 60 * 1000;
const PURCHASE_MIN = 50;
const PURCHASE_MAX = 200;
const PURCHASE_STATE_KEY = 'spyo_purchase_counts';
const PURCHASE_REFRESH_MS = 24 * 60 * 60 * 1000;
const purchaseFallbackCounts = {};

function initTimerConfigs() {
    return Array.from(document.querySelectorAll('[data-limited-timer]')).map((el) => {
        const rawHours = parseInt(el.dataset.durationHours, 10);
        const hours = Number.isFinite(rawHours) ? rawHours : 24;
        const clampedHours = Math.min(Math.max(hours, 1), MAX_DURATION_HOURS);
        const totalMinutes = clampedHours * 60;
        const rawOffset = parseInt(el.dataset.offsetMins, 10);
        const normalizedOffsetMinutes = ((Number.isFinite(rawOffset) ? rawOffset : 0) % totalMinutes + totalMinutes) % totalMinutes;
        return {
            el,
            durationMs: clampedHours * 60 * 60 * 1000,
            offsetMs: normalizedOffsetMinutes * MS_IN_MINUTE,
        };
    });
}

function updateLimitedTimers(timerConfigs) {
    const now = Date.now();
    timerConfigs.forEach(({ el, durationMs, offsetMs }) => {
        const elapsedWithOffset = (now + offsetMs) % durationMs;
        const remaining = durationMs - elapsedWithOffset || durationMs;
        el.textContent = formatTimer(remaining);
    });
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadPurchaseState() {
    if (typeof localStorage === 'undefined') return null;
    try {
        const raw = localStorage.getItem(PURCHASE_STATE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed.timestamp !== 'number' || typeof parsed.counts !== 'object') {
            return null;
        }
        return parsed;
    } catch (err) {
        console.warn('Unable to read purchase state', err);
        return null;
    }
}

function savePurchaseState(state) {
    if (typeof localStorage === 'undefined') return;
    try {
        localStorage.setItem(PURCHASE_STATE_KEY, JSON.stringify(state));
    } catch (err) {
        console.warn('Unable to persist purchase state', err);
    }
}

function ensurePurchaseState(planKeys) {
    const now = Date.now();
    let state = loadPurchaseState();
    let shouldPersist = false;

    if (!state || now - state.timestamp > PURCHASE_REFRESH_MS) {
        state = {
            timestamp: now,
            counts: {},
        };
        planKeys.forEach((key) => {
            state.counts[key] = randomInt(PURCHASE_MIN, PURCHASE_MAX);
        });
        shouldPersist = true;
    } else {
        planKeys.forEach((key) => {
            if (!Number.isFinite(state.counts[key])) {
                state.counts[key] = randomInt(PURCHASE_MIN, PURCHASE_MAX);
                shouldPersist = true;
            }
        });
    }

    if (shouldPersist) {
        savePurchaseState(state);
    }

    return state;
}

function getPurchaseCounts(planKeys) {
    const storageSupported = typeof localStorage !== 'undefined';
    if (!storageSupported) {
        planKeys.forEach((key) => {
            if (!Number.isFinite(purchaseFallbackCounts[key])) {
                purchaseFallbackCounts[key] = randomInt(PURCHASE_MIN, PURCHASE_MAX);
            }
        });
        return { counts: purchaseFallbackCounts };
    }
    const validKeys = planKeys.length ? planKeys : Object.keys(loadPurchaseState()?.counts || {});
    return ensurePurchaseState(validKeys) || { counts: {} };
}

const RECENT_LIVE_BOOKINGS = {
    monthly: [
        '⚡ Subscribed by SecOps Lead (6m ago)',
        '⚡ Subscribed by SOC Tier-2 Analyst (12m ago)',
        '⚡ Monthly pass renewed by Security Researcher (19m ago)',
        '⚡ Starter pack activated by DevOps Engineer (27m ago)',
        '⚡ Subscribed by Ethical Hacker (34m ago)',
        '⚡ Monthly access unlocked by Network Engineer (41m ago)',
        '⚡ Subscribed by Incident Response Specialist (49m ago)',
        '⚡ Starter pack activated by Cloud Sec Architect (55m ago)',
        '⚡ Monthly pass renewed by AppSec Tester (1h ago)',
        '⚡ Subscribed by Malware Analyst (1h ago)',
        '⚡ Monthly access unlocked by Sysadmin (2h ago)',
        '⚡ Subscribed by Forensic Investigator (2h ago)'
    ],
    lifetime: [
        '⚡ Lifetime license bought by Penetration Tester (9m ago)',
        '⚡ Lifetime Premium unlocked by Bug Bounty Hunter (15m ago)',
        '⚡ Lifetime VIP activated by Threat Hunter (23m ago)',
        '⚡ Lifetime access bought by Red Team Operator (31m ago)',
        '⚡ Perpetual license unlocked by Security Consultant (38m ago)',
        '⚡ Lifetime license bought by Offensive Sec Researcher (46m ago)',
        '⚡ Lifetime VIP unlocked by CISO / Team Lead (53m ago)',
        '⚡ Perpetual access purchased by Lead Pentester (1h ago)',
        '⚡ Lifetime VIP activated by Vulnerability Analyst (1h ago)',
        '⚡ Lifetime license bought by Exploit Developer (2h ago)',
        '⚡ Lifetime pass unlocked by Reverse Engineer (2h ago)',
        '⚡ Perpetual license bought by Cybersecurity Director (3h ago)'
    ],
    yearly: [
        '⚡ Annual pass purchased by CTF Competitor (11m ago)',
        '⚡ Yearly pass upgraded by Red Team Specialist (21m ago)',
        '⚡ Annual plan activated by InfoSec Engineer (36m ago)',
        '⚡ 1-Year access unlocked by Security Auditor (44m ago)',
        '⚡ Annual subscription renewed by Threat Intel Analyst (58m ago)',
        '⚡ 1-Year pass bought by Cyber Defense Analyst (1h ago)',
        '⚡ Yearly access unlocked by VAPT Consultant (1h ago)',
        '⚡ Annual subscription activated by Blue Team Lead (2h ago)',
        '⚡ 1-Year access upgraded by Security Engineer (2h ago)',
        '⚡ Annual plan purchased by Independent Researcher (3h ago)'
    ]
};

function updatePurchaseBadges() {
    const badges = document.querySelectorAll('[data-purchase-badge]');
    if (!badges.length) return;
    const planKeys = Array.from(new Set(Array.from(badges).map((badge) => badge.dataset.planKey).filter(Boolean)));
    const state = getPurchaseCounts(planKeys);

    badges.forEach((badge) => {
        const plan = badge.dataset.planLabel || 'this plan';
        const key = badge.dataset.planKey;
        const count = key && Number.isFinite(state.counts[key])
            ? state.counts[key]
            : randomInt(PURCHASE_MIN, PURCHASE_MAX);

        const primaryText = `${count}+ bought ${plan} in past month`;
        const list = RECENT_LIVE_BOOKINGS[key];
        
        badge.textContent = primaryText;
        badge.style.transition = 'opacity 0.35s ease';

        // Alternate smoothly between monthly count and recent live booking
        let showLive = false;
        let eventIdx = Math.floor(Math.random() * (list ? list.length : 1));
        setInterval(() => {
            showLive = !showLive;
            badge.style.opacity = '0';
            setTimeout(() => {
                if (showLive && list && list.length) {
                    badge.textContent = list[eventIdx % list.length];
                    eventIdx++;
                } else {
                    badge.textContent = primaryText;
                }
                badge.style.opacity = '1';
            }, 350);
        }, 6000 + Math.random() * 2500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        const timerConfigs = initTimerConfigs();
        if (timerConfigs.length) {
            updateLimitedTimers(timerConfigs);
            setInterval(() => updateLimitedTimers(timerConfigs), 1000);
        }
        updatePurchaseBadges();
        initEmailPopup();
        initStickyNavbar();
        initMobileMenu();
        initPaymentModal();
    } catch (error) {
        console.error('Failed to initialize premium timers or badges', error);
    }
});

function initStickyNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const handleScroll = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
}

function initMobileMenu() {
    const toggleBtn = document.getElementById('mobileNavToggle') || document.querySelector('.mobile-nav-toggle');
    const menu = document.querySelector('.navbar .menu');
    if (!toggleBtn || !menu) return;
    
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    });

    // Close when clicking links
    const navLinks = menu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggleBtn.classList.remove('active');
        });
    });
}

const CONTACT_EMAIL = 'contact@spyboy.in';

function initEmailPopup() {
    const trigger = document.getElementById('contactEmailBtn');
    const overlay = document.getElementById('emailPopup');
    const copyBtn = document.getElementById('copyEmailBtn');
    const closeBtn = document.getElementById('closeEmailBtn');

    if (!trigger || !overlay) return;

    const closePopup = () => overlay.classList.remove('active');
    const openPopup = (event) => {
        event.preventDefault();
        overlay.classList.add('active');
    };

    trigger.addEventListener('click', openPopup);
    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closePopup();
        }
    });
    if (closeBtn) {
        closeBtn.addEventListener('click', closePopup);
    }
    if (copyBtn) {
        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(CONTACT_EMAIL);
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy email';
                }, 1500);
            } catch (err) {
                window.prompt('Copy email address', CONTACT_EMAIL);
            }
        });
    }
}

// ════ PAYMENT MODAL & UPI INTEGRATION ════
const PREMIUM_PLANS = {
    monthly: {
        id: 'monthly',
        name: 'Monthly Plan',
        priceUsd: '$5',
        cadenceUsd: '/ month · Cancel anytime',
        priceInr: '₹420',
        cadenceInr: '/ month · Cancel anytime',
        paypalUrl: 'https://www.paypal.com/ncp/payment/CVPLSDZ3ECULW',
        rawInr: 420
    },
    lifetime: {
        id: 'lifetime',
        name: 'Lifetime Plan',
        priceUsd: '$25',
        cadenceUsd: 'one-time payment · perpetual access',
        priceInr: '₹2,100',
        cadenceInr: 'one-time payment (approx $25 USD)',
        paypalUrl: 'https://www.paypal.com/ncp/payment/X92PUHTV6U9TU',
        rawInr: 2100
    },
    yearly: {
        id: 'yearly',
        name: 'Yearly Plan',
        priceUsd: '$12',
        cadenceUsd: '/ year · effective $1/mo',
        priceInr: '₹1,000',
        cadenceInr: '/ year · effective ~₹83/mo',
        paypalUrl: 'https://www.paypal.com/ncp/payment/TPU3F6BXN258E',
        rawInr: 1000
    }
};

const UPI_DETAILS = {
    upiId: 'shubh7248@ptyes',
    payeeName: 'Spyo Productions',
    supportEmail: 'contact@spyboy.in',
    supportDiscord: 'https://spyboy.in/Discord'
};

let currentModalPlan = 'lifetime';
let currentModalMethod = 'paypal';

function openPaymentModal(planKey = 'lifetime', preferredMethod = null) {
    if (PREMIUM_PLANS[planKey]) {
        currentModalPlan = planKey;
    }
    if (preferredMethod === 'upi' || preferredMethod === 'paypal') {
        currentModalMethod = preferredMethod;
    }

    updateModalUI();

    const overlay = document.getElementById('paymentModalOverlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closePaymentModal() {
    const overlay = document.getElementById('paymentModalOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    toggleEmailProofBox(false);
}

function selectModalPlan(planKey) {
    if (!PREMIUM_PLANS[planKey]) return;
    currentModalPlan = planKey;
    updateModalUI();
}

function switchPaymentMethod(method) {
    if (method !== 'paypal' && method !== 'upi') return;
    currentModalMethod = method;
    updateModalUI();
}

function updateModalUI() {
    const plan = PREMIUM_PLANS[currentModalPlan] || PREMIUM_PLANS.lifetime;

    // 1. Update plan pills active state
    const pills = document.querySelectorAll('.plan-select-pill');
    pills.forEach((pill) => {
        if (pill.dataset.planSelect === currentModalPlan) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });

    // 2. Update method tabs
    const tabPaypal = document.getElementById('tabBtnPaypal');
    const tabUpi = document.getElementById('tabBtnUpi');
    const contentPaypal = document.getElementById('paypalTabContent');
    const contentUpi = document.getElementById('upiTabContent');

    if (currentModalMethod === 'upi') {
        if (tabUpi) tabUpi.classList.add('active');
        if (tabPaypal) tabPaypal.classList.remove('active');
        if (contentUpi) contentUpi.classList.add('active');
        if (contentPaypal) contentPaypal.classList.remove('active');
    } else {
        if (tabPaypal) tabPaypal.classList.add('active');
        if (tabUpi) tabUpi.classList.remove('active');
        if (contentPaypal) contentPaypal.classList.add('active');
        if (contentUpi) contentUpi.classList.remove('active');
    }

    // 3. Update PayPal tab details
    const elPaypalPlanName = document.getElementById('paypalPlanName');
    const elPaypalPlanPrice = document.getElementById('paypalPlanPrice');
    const elPaypalPlanCadence = document.getElementById('paypalPlanCadence');
    const elPaypalProceedBtn = document.getElementById('paypalProceedBtn');
    const elPaypalProceedPrice = document.getElementById('paypalProceedPrice');

    if (elPaypalPlanName) elPaypalPlanName.textContent = plan.name;
    if (elPaypalPlanPrice) elPaypalPlanPrice.textContent = plan.priceUsd;
    if (elPaypalPlanCadence) elPaypalPlanCadence.textContent = plan.cadenceUsd;
    if (elPaypalProceedPrice) elPaypalProceedPrice.textContent = plan.priceUsd;
    if (elPaypalProceedBtn) {
        elPaypalProceedBtn.href = plan.paypalUrl;
    }

    // 4. Update UPI tab details
    const elUpiPlanName = document.getElementById('upiPlanName');
    const elUpiPlanPrice = document.getElementById('upiPlanPrice');
    const elUpiPlanCadence = document.getElementById('upiPlanCadence');
    const elUpiStepAmount = document.getElementById('upiStepAmount');
    const elUpiIntentLink = document.getElementById('upiIntentLink');
    const elEmailSubjectPreview = document.getElementById('emailSubjectPreview');
    const elUpiDirectMailtoBtn = document.getElementById('upiDirectMailtoBtn');

    if (elUpiPlanName) elUpiPlanName.textContent = plan.name;
    if (elUpiPlanPrice) elUpiPlanPrice.textContent = plan.priceInr;
    if (elUpiPlanCadence) elUpiPlanCadence.textContent = plan.cadenceInr;
    if (elUpiStepAmount) elUpiStepAmount.textContent = plan.priceInr;

    // Mobile UPI deep link
    if (elUpiIntentLink) {
        const intentUrl = `upi://pay?pa=${encodeURIComponent(UPI_DETAILS.upiId)}&pn=${encodeURIComponent(UPI_DETAILS.payeeName)}&am=${plan.rawInr}&cu=INR&tn=${encodeURIComponent('Spyo ' + plan.name + ' Premium')}`;
        elUpiIntentLink.href = intentUrl;
    }

    // Update Email Drawer Subject and Mailto Link
    if (elEmailSubjectPreview) {
        elEmailSubjectPreview.textContent = `UPI Payment Proof - Spyo ${plan.name}`;
    }
    if (elUpiDirectMailtoBtn) {
        const subject = encodeURIComponent(`UPI Payment Proof - Spyo ${plan.name} (${plan.priceInr})`);
        const body = encodeURIComponent(
`Hi Spyo Team,

I have completed the UPI payment for Spyo ${plan.name}.

- Selected Plan: ${plan.name} (${plan.priceUsd} / ${plan.priceInr})
- Amount Transferred: ${plan.priceInr} INR
- UPI Transaction ID / UTR: [Please paste your 12-digit UTR/Ref here]
- My Discord Username or ID: [Please enter your Discord tag, e.g. user#0000 or user]

Please find my payment screenshot attached to this email.

Thanks!`
        );
        elUpiDirectMailtoBtn.href = `mailto:${UPI_DETAILS.supportEmail}?subject=${subject}&body=${body}`;
    }
}

function toggleEmailProofBox(forceState) {
    const drawer = document.getElementById('upiEmailDrawer');
    if (!drawer) return;
    if (typeof forceState === 'boolean') {
        if (forceState) {
            drawer.classList.add('active');
        } else {
            drawer.classList.remove('active');
        }
    } else {
        drawer.classList.toggle('active');
    }
}

function copyContactEmail() {
    const email = CONTACT_EMAIL || 'contact@spyboy.in';
    const copyBtn = document.getElementById('copyContactEmailBtn');
    const copyIcon = document.getElementById('copyEmailIcon');
    const copyText = document.getElementById('copyEmailText');

    const handleSuccess = () => {
        if (copyBtn) copyBtn.classList.add('copied');
        if (copyIcon) copyIcon.className = 'fas fa-check';
        if (copyText) copyText.textContent = 'Copied!';
        setTimeout(() => {
            if (copyBtn) copyBtn.classList.remove('copied');
            if (copyIcon) copyIcon.className = 'fas fa-copy';
            if (copyText) copyText.textContent = 'Copy';
        }, 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(handleSuccess).catch(() => {
            fallbackCopyText(email, handleSuccess);
        });
    } else {
        fallbackCopyText(email, handleSuccess);
    }
}

function copyUpiId() {
    const upiId = UPI_DETAILS.upiId;
    const copyBtn = document.getElementById('copyUpiIdBtn');
    const copyIcon = document.getElementById('copyIcon');
    const copyText = document.getElementById('copyText');

    const handleSuccess = () => {
        if (copyBtn) copyBtn.classList.add('copied');
        if (copyIcon) copyIcon.className = 'fas fa-check';
        if (copyText) copyText.textContent = 'Copied!';
        setTimeout(() => {
            if (copyBtn) copyBtn.classList.remove('copied');
            if (copyIcon) copyIcon.className = 'fas fa-copy';
            if (copyText) copyText.textContent = 'Copy ID';
        }, 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(upiId).then(handleSuccess).catch(() => {
            fallbackCopyText(upiId, handleSuccess);
        });
    } else {
        fallbackCopyText(upiId, handleSuccess);
    }
}

function fallbackCopyText(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
        document.execCommand('copy');
        if (cb) cb();
    } catch (e) {
        window.prompt('Copy UPI ID:', text);
    }
    document.body.removeChild(ta);
}

function initPaymentModal() {
    const overlay = document.getElementById('paymentModalOverlay');
    if (!overlay) return;

    // Close on overlay backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePaymentModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closePaymentModal();
        }
    });

    // Check URL parameters for direct link to modal / upi
    try {
        const params = new URLSearchParams(window.location.search);
        const payParam = (params.get('pay') || params.get('method') || '').toLowerCase();
        const planParam = (params.get('plan') || '').toLowerCase();
        if (payParam === 'upi' || window.location.hash === '#upi') {
            openPaymentModal(planParam || 'lifetime', 'upi');
        } else if (payParam === 'paypal') {
            openPaymentModal(planParam || 'lifetime', 'paypal');
        }
    } catch (err) {
        // Ignore URL parsing errors
    }
}

// Expose functions globally on window
window.openPaymentModal = openPaymentModal;
window.closePaymentModal = closePaymentModal;
window.selectModalPlan = selectModalPlan;
window.switchPaymentMethod = switchPaymentMethod;
window.copyUpiId = copyUpiId;
window.toggleEmailProofBox = toggleEmailProofBox;
window.copyContactEmail = copyContactEmail;

