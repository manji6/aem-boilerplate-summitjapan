import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  getMetadata,
} from './aem.js';

/**
 * Initialize Adobe Client Data Layer
 */
function initializeDataLayer() {
  window.adobeDataLayer = window.adobeDataLayer || [];

  // Push initial page data
  window.adobeDataLayer.push({
    pageContext: {
      pageType: getMetadata('template') || 'default',
      pageName: document.title,
      pageURL: window.location.href,
      referrer: document.referrer,
    },
    _experienceplatform: {
      identification: {
        core: {
          ecid:
            sessionStorage.getItem('com.adobe.reactor.dataElements.ECID') ||
            null,
        },
      },
    },
    web: {
      webPageDetails: {
        name: document.title,
        URL: window.location.href,
        server: window.location.hostname,
        referrer: document.referrer,
      },
    },
  });
}

/**
 * Send PageView event to Adobe Data Layer
 */
let pageViewSent = false;

function sendPageViewEvent() {
  if (!window.adobeDataLayer || pageViewSent) return;

  window.adobeDataLayer.push({
    event: 'pageView',
    eventInfo: {
      pageName: document.title,
      pageURL: window.location.href,
      timestamp: new Date().toISOString(),
    },
  });

  pageViewSent = true;
  console.log('PageView event sent to Adobe Data Layer');
}

/**
 * Send custom event to Adobe Data Layer
 * @param {Event} event - The event object (optional)
 * @param {string} eventName - Name of the event
 * @param {string} elementType - Type of element
 * @param {string} elementId - ID or identifier of the element
 * @param {Object} additionalData - Additional data to include in the event
 */
export function sendCustomEvent(
  event,
  eventName,
  elementType = 'unknown',
  elementId = '',
  additionalData = {},
) {
  if (!window.adobeDataLayer) return;

  const target = event?.target || {};
  const elementText = target.textContent?.trim() || '';
  const elementHref = target.href || '';

  window.adobeDataLayer.push({
    event: eventName,
    eventInfo: {
      elementType,
      elementId: elementId || target.id || target.className || 'unknown',
      elementText,
      elementHref,
      timestamp: new Date().toISOString(),
      ...additionalData,
    },
  });

  console.log(`${eventName} event sent to Adobe Data Layer:`, {
    elementType,
    elementId: elementId || target.id || target.className || 'unknown',
    elementText,
    ...additionalData,
  });
}

/**
 * Send click event to Adobe Data Layer
 * @param {Event} event - The click event
 * @param {string} elementType - Type of element (button, link, etc.)
 * @param {string} elementId - ID or identifier of the element
 * @param {Object} additionalData - Additional data to include in the event
 */
export function sendClickEvent(
  event,
  elementType = 'button',
  elementId = '',
  additionalData = {},
) {
  sendCustomEvent(event, 'click', elementType, elementId, additionalData);
}

/**
 * Add click event listeners to buttons only
 * @param {Element} container - Container element to search for clickable elements
 */
function addClickListeners(container) {
  // Add listeners to buttons only
  const buttons = container.querySelectorAll(
    'button, .button, [role="button"]',
  );
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      sendClickEvent(event, 'button', button.id || button.className);
    });
  });
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost'))
      sessionStorage.setItem('fonts-loaded', 'true');
  } catch (e) {
    // do nothing
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);

  // Add click listeners after decoration
  addClickListeners(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();

  // Initialize Adobe Data Layer early
  initializeDataLayer();

  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();

  // Start Tags loading early (non-blocking)
  setTimeout(loadTags, 500); // 0.5秒後に読み込み開始
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => {
    // Load Tags if not already loaded
    if (!tagsLoaded) {
      if (document.readyState === 'complete') {
        loadTags();
      } else {
        window.addEventListener('load', loadTags);
      }
    }

    return import('./delayed.js');
  }, 1000); // 3秒から1秒に短縮
  // load anything that can be postponed to the latest here
}

/**
 * Load Tags(Launch) safely
 */
let tagsLoaded = false;

function loadTags() {
  if (tagsLoaded) return; // Prevent duplicate loading

  try {
    const script = document.createElement('script');
    script.src =
      'https://assets.adobedtm.com/075dc62c985c/9f33a4631af8/launch-056d6498c666-development.min.js';
    script.async = true;
    script.onerror = (err) => console.error('Error loading Tags:', err);
    script.onload = () => {
      console.log('Tags loaded successfully');
      tagsLoaded = true;
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error in loadTags:', error);
  }
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();

  // Send PageView event when page is fully loaded and Tags are ready
  const sendPageViewWhenReady = () => {
    if (tagsLoaded) {
      // Tags are loaded, send PageView immediately
      sendPageViewEvent();
    } else {
      // Tags not loaded yet, wait a bit more
      setTimeout(sendPageViewWhenReady, 200);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(sendPageViewWhenReady, 500);
  } else {
    window.addEventListener('load', () => {
      setTimeout(sendPageViewWhenReady, 500);
    });
  }
}

loadPage();
