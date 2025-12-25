const STAT_VALUES = {
    'stat-open-source': '14 projects',
    'stat-apps': '5+ apps',
    'stat-bot-servers': '6,500+ servers',
    'stat-active-users': '100k+ members',
    'stat-app-users': '1M+ installs',
    'stat-blog-hits': '11,202,248 hits',
    'stat-discord-members': '13k+ members',
    'stat-github-stars': '4,000+ stars',
    'stat-github-forks': '1,000+ forks',
};

function setStatValue(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value;
}

document.addEventListener('DOMContentLoaded', () => {
    Object.entries(STAT_VALUES).forEach(([id, value]) => setStatValue(id, value));
});
