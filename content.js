// Skroutz Life Price Extension
// Content script for skroutz.gr

class SkroutzLifePrice {
  constructor() {
    this.hourlyWage = 0;
    this.isEnabled = true;
    this.currentSite = this.detectCurrentSite();
    this.priceSelectors = this.getSiteSpecificSelectors();
    
    this.init();
  }

  detectCurrentSite() {
    const hostname = window.location.hostname;
    if (hostname.includes('skroutz.gr')) return 'skroutz';
    if (hostname.includes('public.gr')) return 'public';
    if (hostname.includes('plaisio.gr')) return 'plaisio';
    if (hostname.includes('kotsovolos.gr')) return 'kotsovolos';
    if (hostname.includes('mediamarkt.gr')) return 'mediamarkt';
    if (hostname.includes('e-shop.gr')) return 'eshop';
    if (hostname.includes('sklavenitis.gr')) return 'sklavenitis';
    if (hostname.includes('praktiker.gr')) return 'praktiker';
    return 'generic';
  }

  getSiteSpecificSelectors() {
    const baseSelectors = [
      '.price',
      '.product-price',
      '.price-current',
      '.price-new',
      '.price-old',
      '[data-price]',
      '.price-value',
      '.price-amount',
      '.price-euro'
    ];

    const siteSelectors = {
      skroutz: [
        ...baseSelectors,
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro'
      ],
      public: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '[data-testid*="price"]',
        '.product-price-current'
      ],
      plaisio: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      kotsovolos: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      mediamarkt: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      eshop: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      sklavenitis: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      praktiker: [
        ...baseSelectors,
        '.product-price',
        '.price-current',
        '.price-new',
        '.price-old',
        '.price-value',
        '.price-amount',
        '.price-euro',
        '.product-price-current'
      ],
      generic: baseSelectors
    };

    return siteSelectors[this.currentSite] || baseSelectors;
  }

  async init() {
    await this.loadSettings();
    this.setupMutationObserver();
    this.processPrices();
    
    // Debug: Log current site and selectors
    if (this.debugMode) {
      console.log('Consumed Extension - Current site:', this.currentSite);
      console.log('Consumed Extension - Price selectors:', this.priceSelectors);
    }
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'hourlyWage',
        'effectiveHourlyWage',
        'isEnabled',
        'fontSize',
        'displayFormat',
        'showBullet',
        'customSelectors',
        'updateInterval',
        'debugMode',
        'language',
        'currency'
      ]);
      
      // Use effective hourly wage (calculated from popup) or fall back to direct hourly wage
      this.hourlyWage = result.effectiveHourlyWage || result.hourlyWage || 0;
      this.isEnabled = result.isEnabled !== false;
      this.fontSize = result.fontSize || '0.85em';
      this.displayFormat = result.displayFormat || 'fractional';
      this.showBullet = result.showBullet !== false;
      this.customSelectors = result.customSelectors || '';
      this.updateInterval = result.updateInterval || 1000;
      this.debugMode = result.debugMode || false;
      this.language = result.language || 'el';
      this.currency = result.currency || 'EUR';
      
      // Update price selectors with custom ones
      this.updatePriceSelectors();
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      if (!this.isEnabled || this.hourlyWage <= 0) return;
      
      let shouldProcess = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldProcess = true;
        }
      });
      
      if (shouldProcess) {
        setTimeout(() => this.processPrices(), 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

    processPrices() {
    if (!this.isEnabled || this.hourlyWage <= 0) return;

    this.priceSelectors.forEach(selector => {
      const priceElements = document.querySelectorAll(selector);
      priceElements.forEach(element => {
        if (!element.dataset.lifePriceProcessed) {
          this.processPriceElement(element);
        }
      });
    });
  }

  processPriceElement(element) {
    // Check if this element or its parent already has a life price display
    if (element.querySelector('.life-price-display') || 
        element.closest('[data-life-price-processed]')) {
      return;
    }

    // Skip if element is within .filters-price component
    if (element.closest('.filters-price') !== null) {
      return;
    }

    const priceText = this.extractPrice(element);
    if (!priceText) return;

    const price = this.parsePrice(priceText);
    if (price <= 0) return;

    const hours = this.calculateHours(price);
    if (hours <= 0) return;

    this.addLifePriceDisplay(element, hours);
    element.dataset.lifePriceProcessed = 'true';
  }

  isPriceRangeFilterElement(element) {
    // Only check for the specific .filters-price component
    return element.closest('.filters-price') !== null;
  }

  isFilterComponent(element) {
    // Check if element is within a filter section
    const filterSelectors = [
      '.filters',
      '.sidebar',
      '.filter-section',
      '.filter-container',
      '.price-filter',
      '.range-filter',
      '[data-filter]',
      '.filter-options'
    ];
    
    // Check if element is in a filter section
    const isInFilterSection = filterSelectors.some(selector => 
      element.closest(selector) !== null
    );
    
    // Specifically check for price range filter elements
    const isPriceRangeFilter = element.closest('.price-range') !== null ||
                               element.closest('[class*="price-range"]') !== null ||
                               element.closest('[class*="price-filter"]') !== null;
    
    // Check if element contains filter-specific text
    const filterTexts = ['από', 'έως', 'και άνω', 'περιοχή τιμών'];
    const hasFilterText = filterTexts.some(text => 
      element.textContent?.toLowerCase().includes(text.toLowerCase())
    );
    
    // Check if it's in the left sidebar (where filters typically are)
    const isInLeftSidebar = element.closest('.sidebar') !== null || 
                           element.closest('.filters') !== null ||
                           element.closest('[class*="filter"]') !== null;
    
    const isFilter = isInFilterSection || isPriceRangeFilter || (hasFilterText && isInLeftSidebar);
    
    // Debug logging
    if (this.debugMode && isFilter) {
      console.log('Skipping filter component:', element, 'Reason:', {
        isInFilterSection,
        isPriceRangeFilter,
        hasFilterText,
        isInLeftSidebar
      });
    }
    
    return isFilter;
  }

  extractPrice(element) {
    // Try to get price from various attributes and text content
    const priceText = element.textContent || element.innerText || '';
    
    // Look for price patterns in Greek/European format (including skroutz.gr format)
    // Handle formats like: "18.940 00 €", "64,29 €", "64.29 €"
    const priceMatch = priceText.match(/(\d{1,3}(?:\.\d{3})*(?:\s\d{2})?)\s*€?/);
    if (priceMatch) {
      return priceMatch[1];
    }

    // Also try alternative patterns for skroutz.gr
    const altPriceMatch = priceText.match(/(\d+(?:[.,]\d{2})?)\s*€/);
    if (altPriceMatch) {
      return altPriceMatch[1];
    }

    // Handle "από" (from) prices like "από 64,29 €"
    const fromPriceMatch = priceText.match(/από\s+(\d+(?:[.,]\d{2})?)\s*€/);
    if (fromPriceMatch) {
      return fromPriceMatch[1];
    }

    // Handle "έως" (up to) prices like "έως 64,29 €"
    const upToPriceMatch = priceText.match(/έως\s+(\d+(?:[.,]\d{2})?)\s*€/);
    if (upToPriceMatch) {
      return upToPriceMatch[1];
    }

    // Handle prices with "€" at the beginning like "€64,29"
    const euroFirstMatch = priceText.match(/€\s*(\d+(?:[.,]\d{2})?)/);
    if (euroFirstMatch) {
      return euroFirstMatch[1];
    }

    // Handle prices with just numbers and euro symbol
    const simplePriceMatch = priceText.match(/(\d+(?:[.,]\d{2})?)\s*€/);
    if (simplePriceMatch) {
      return simplePriceMatch[1];
    }

    // Handle car leasing specific formats like "195€" or "2.100€"
    const leasingPriceMatch = priceText.match(/(\d{1,3}(?:\.\d{3})*)\s*€/);
    if (leasingPriceMatch) {
      return leasingPriceMatch[1];
    }

    // Handle prices with dot as thousands separator like "2.100€"
    const dotSeparatedMatch = priceText.match(/(\d{1,3}(?:\.\d{3})*)\s*€/);
    if (dotSeparatedMatch) {
      return dotSeparatedMatch[1];
    }

    // Also check data attributes
    const dataPrice = element.dataset.price || element.getAttribute('data-price');
    if (dataPrice) {
      return dataPrice;
    }

    return null;
  }

  parsePrice(priceText) {
    // Handle Greek/European number format (1.234,56)
    // Also handle skroutz.gr format like "18.940 00" (space-separated)
    let cleanPrice = priceText.replace(/\s+/g, ''); // Remove spaces
    cleanPrice = cleanPrice.replace(/\./g, '').replace(',', '.'); // Handle decimal separators
    const price = parseFloat(cleanPrice);
    return isNaN(price) ? 0 : price;
  }

  calculateHours(price) {
    if (this.hourlyWage <= 0) return 0;
    return price / this.hourlyWage;
  }

  addLifePriceDisplay(element, hours) {
    // Check if already processed
    if (element.querySelector('.life-price-display')) return;

    const displayText = this.formatHours(hours);
    
    const lifePriceElement = document.createElement('span');
    lifePriceElement.className = `life-price-display ${this.showBullet ? '' : 'no-bullet'}`;
    lifePriceElement.textContent = displayText;
    lifePriceElement.style.color = '#ffffff';
    lifePriceElement.style.backgroundColor = '#007AFF';
    lifePriceElement.style.fontSize = this.fontSize;
    lifePriceElement.style.fontWeight = '600';
    lifePriceElement.style.padding = '4px 8px';
    lifePriceElement.style.borderRadius = '6px';
    lifePriceElement.style.marginLeft = '8px';
    lifePriceElement.style.display = 'inline-block';
    lifePriceElement.style.lineHeight = '1.2';
    lifePriceElement.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    lifePriceElement.style.verticalAlign = 'middle';
    lifePriceElement.setAttribute('aria-label', `${displayText} of work needed`);
    
    // Try to insert after the price text specifically
    const priceText = element.textContent.trim();
    if (priceText && priceText.includes('€')) {
      // Insert after the price element
      element.appendChild(lifePriceElement);
    } else {
      // Fallback: append to the element
      element.appendChild(lifePriceElement);
    }
    
    if (this.debugMode) {
      console.log('Added life price display:', displayText, 'for element:', element);
    }
  }

  formatHours(hours) {
    switch (this.displayFormat) {
      case 'fractional':
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return `${wholeHours}h ${minutes}m`;
      case 'rounded':
        return `${Math.round(hours)}`;
      default: // decimal
        return `${hours.toFixed(2)}`;
    }
  }

  updatePriceSelectors() {
    // Get site-specific selectors
    this.priceSelectors = this.getSiteSpecificSelectors();
    
    // Add custom selectors if provided
    if (this.customSelectors && this.customSelectors.trim()) {
      const customSelectors = this.customSelectors
        .split('\n')
        .map(selector => selector.trim())
        .filter(selector => selector.length > 0);
      
      this.priceSelectors = [...this.priceSelectors, ...customSelectors];
    }
    
    if (this.debugMode) {
      console.log('Updated price selectors:', this.priceSelectors);
    }
  }

  updateSettings(newSettings) {
    Object.assign(this, newSettings);
    this.updatePriceSelectors();
    this.refreshAllPrices();
  }

  refreshAllPrices() {
    // Remove all existing life price displays
    document.querySelectorAll('.life-price-display').forEach(el => el.remove());
    
    // Remove processed markers
    document.querySelectorAll('[data-life-price-processed]').forEach(el => {
      delete el.dataset.lifePriceProcessed;
    });
    
    // Reprocess all prices
    this.processPrices();
  }
}

// Initialize the extension
let lifePriceExtension;

// Listen for messages from popup/options
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateSettings') {
    if (lifePriceExtension) {
      lifePriceExtension.updateSettings(request.settings);
    }
    sendResponse({ success: true });
  } else if (request.action === 'getSettings') {
    if (lifePriceExtension) {
      sendResponse({
        hourlyWage: lifePriceExtension.hourlyWage,
        textColor: lifePriceExtension.textColor, // This will now be #007AFF
        isEnabled: lifePriceExtension.isEnabled,
        fontSize: lifePriceExtension.fontSize,
        displayFormat: lifePriceExtension.displayFormat,
        showBullet: lifePriceExtension.showBullet,
        customSelectors: lifePriceExtension.customSelectors,
        updateInterval: lifePriceExtension.updateInterval,
        debugMode: lifePriceExtension.debugMode,
        language: lifePriceExtension.language,
        currency: lifePriceExtension.currency
      });
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    lifePriceExtension = new SkroutzLifePrice();
  });
} else {
  lifePriceExtension = new SkroutzLifePrice();
} 