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
        badge.textContent = `${count}+ bought ${plan} in past month`;
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
    } catch (error) {
        console.error('Failed to initialize premium timers or badges', error);
    }
});
