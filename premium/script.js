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
