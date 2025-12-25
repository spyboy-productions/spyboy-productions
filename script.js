$(document).ready(function() {
  $(window).on('scroll', function() {
    if (this.scrollY > 20) {
      $('.navbar').addClass('sticky');
    } else {
      $('.navbar').removeClass('sticky');
    }
    if (this.scrollY > 500) {
      $('.scroll-up-btn').addClass('show');
    } else {
      $('.scroll-up-btn').removeClass('show');
    }
  });

  $('.scroll-up-btn').on('click', function() {
    $('html').animate({ scrollTop: 0 });
  });
  
  $('.menu-btn').on('click', function() {
    $('.navbar .menu').toggleClass('active');
    $('.menu-btn i').toggleClass('active');
  });

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    new Typed('.typing', {
      strings: [
        "Cyber security Bot",
        "Cyber security App",
        "Cyber security Blog",
        "Cyber security Tools",
        "Cyber security API",
        "Cyber security Library",
        "Cyber security Framework",
        "Providing free tutorials",
        "Cyber security Chat Server",
      ],
      typeSpeed: 100,
      backSpeed: 60,
      loop: true,
    });
  } else {
    document.querySelector('.typing')?.classList.add('sr-only');
  }

  const carouselOptions = {
    margin: 20,
    loop: !prefersReducedMotion,
    autoplay: !prefersReducedMotion,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    responsive: {
      0:{
        items: 1,
        nav: false
      },
      600:{
        items: 2,
        nav: false
      },
      1000:{
        items: 3,
        nav: false
      }
    }
  };
  $('.carousel').owlCarousel(carouselOptions);
  $('.bot-preview-carousel').owlCarousel({
    ...carouselOptions,
    responsive: {
      0: { items: 1, nav: false },
      600: { items: 2, nav: false },
      1000: { items: 3, nav: false }
    }
  });

  initEmailPopup();
  initHeroExploreCta();
  initBlogFeed();
  const timerConfigs = initLimitedTimers();
  if (timerConfigs.length) {
    updateLimitedTimers(timerConfigs);
    setInterval(() => updateLimitedTimers(timerConfigs), 1000);
  }
});

function initHeroExploreCta() {
  const exploreBtn = document.querySelector('.hero-explore-btn');
  if (!exploreBtn) return;
  exploreBtn.addEventListener('click', () => {
    const selector = exploreBtn.dataset.scrollTo || '#projects';
    const target = document.querySelector(selector);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function initBlogFeed() {
  const carouselNode = document.querySelector('.blog-feed-carousel');
  if (!carouselNode) return;
  const emptyState = document.querySelector('.blog-feed-empty');
  const refreshBtn = document.querySelector('.blog-refresh-btn');
  const $carousel = $('.blog-feed-carousel');
  let carouselInitialized = false;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const activateCarousel = () => {
    $carousel.owlCarousel({
      margin: 24,
      loop: !prefersReducedMotion.matches,
      autoplay: !prefersReducedMotion.matches,
      autoplayTimeout: 3500,
      autoplayHoverPause: true,
      responsive: {
        0: { items: 1, nav: false },
        700: { items: 2, nav: false },
        1100: { items: 3, nav: false }
      }
    });
    carouselInitialized = true;
  };

  const resetCarousel = () => {
    if (!carouselInitialized) return;
    $carousel.trigger('destroy.owl.carousel');
    $carousel.removeClass('owl-loaded');
    $carousel.find('.owl-stage-outer').children().unwrap();
    carouselInitialized = false;
  };

  const formatBlogDate = (node) => {
    const date = node ? new Date(node.textContent) : null;
    if (!date || Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const stripHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html || '';
    return temp.textContent || temp.innerText || '';
  };

  const truncate = (text, limit = 180) => {
    if (text.length <= limit) return text;
    return `${text.slice(0, limit).trim()}…`;
  };

  const buildSlideElement = (item) => {
    const title = item.querySelector('title')?.textContent?.trim() || 'Untitled post';
    const link = item.querySelector('link')?.textContent?.trim() || 'https://spyboy.blog/';
    const description = stripHtml(item.querySelector('description')?.textContent || '');
    const date = formatBlogDate(item.querySelector('pubDate'));

    const wrapper = document.createElement('div');
    wrapper.className = 'blog-slide';

    if (date) {
      const dateEl = document.createElement('p');
      dateEl.className = 'blog-slide-date';
      dateEl.textContent = date;
      wrapper.appendChild(dateEl);
    }

    const titleEl = document.createElement('h4');
    titleEl.textContent = title;
    wrapper.appendChild(titleEl);

    if (description) {
      const excerpt = document.createElement('p');
      excerpt.className = 'blog-slide-excerpt';
      excerpt.textContent = truncate(description);
      wrapper.appendChild(excerpt);
    }

    const linkEl = document.createElement('a');
    linkEl.className = 'blog-slide-link';
    linkEl.href = link;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener';
    linkEl.textContent = 'Read post →';
    wrapper.appendChild(linkEl);

    return wrapper;
  };

  const populateFeed = (items) => {
    resetCarousel();
    carouselNode.innerHTML = '';
    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      fragment.appendChild(buildSlideElement(item));
    });
    carouselNode.appendChild(fragment);
    activateCarousel();
  };

  const setEmptyState = (message) => {
    if (!emptyState) return;
    emptyState.hidden = !message;
    emptyState.textContent = message || '';
  };

  const fetchFeed = async () => {
    setEmptyState('Fetching the latest intel…');
    try {
      const response = await fetch('https://spyboy.blog/feed/');
      if (!response.ok) throw new Error('Feed unavailable');
      const xmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(xmlText, 'text/xml');
      const items = Array.from(doc.querySelectorAll('item')).slice(0, 5);
      if (!items.length) throw new Error('No posts located');
      populateFeed(items);
      setEmptyState('');
    } catch (error) {
      console.error('Failed to load blog feed', error);
      setEmptyState('Unable to load blog posts right now. Try again in a moment.');
    }
  };

  refreshBtn?.addEventListener('click', () => {
    fetchFeed();
  });

  fetchFeed();
}

const CONTACT_EMAIL = 'contact@spyboy.in';

function initEmailPopup() {
  const trigger = document.getElementById('contactEmailBtn');
  const overlay = document.getElementById('emailPopup');
  const copyBtn = document.getElementById('copyEmailBtn');
  const closeBtn = document.getElementById('closeEmailBtn');
  const emailValue = document.getElementById('contactEmailValue');

  if (!trigger || !overlay) return;

  const closePopup = () => overlay.classList.remove('active');
  const openPopup = (event) => {
    event.preventDefault();
    overlay.classList.add('active');
  };

  trigger.addEventListener('click', openPopup);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closePopup();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closePopup();
  });
  if (closeBtn) closeBtn.addEventListener('click', closePopup);
  if (emailValue) emailValue.textContent = CONTACT_EMAIL;

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
        copyBtn.textContent = 'Copied!';
      } catch (err) {
        window.prompt('Copy email', CONTACT_EMAIL);
      } finally {
        setTimeout(() => {
          copyBtn.textContent = 'Copy email';
        }, 1600);
      }
    });
  }
}

const MAX_TIMER_HOURS = 48;
const MS_PER_MINUTE = 60 * 1000;

function formatTimer(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function initLimitedTimers() {
  const nodes = document.querySelectorAll('[data-limited-timer]');
  if (!nodes.length) return [];

  return Array.from(nodes).map((el) => {
    const requestedHours = parseInt(el.dataset.durationHours, 10);
    const durationHours = Number.isFinite(requestedHours) ? requestedHours : 24;
    const clampedHours = Math.min(Math.max(durationHours, 1), MAX_TIMER_HOURS);
    const requestedOffset = parseInt(el.dataset.offsetMins, 10);
    const totalMinutes = clampedHours * 60;
    const normalizedOffset = ((Number.isFinite(requestedOffset) ? requestedOffset : 0) % totalMinutes + totalMinutes) % totalMinutes;

    return {
      el,
      durationMs: clampedHours * 60 * 60 * 1000,
      offsetMs: normalizedOffset * MS_PER_MINUTE
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
