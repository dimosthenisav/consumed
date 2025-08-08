// Skroutz Life Price Extension
// Content script for skroutz.gr

class SkroutzLifePrice {
  constructor() {
    this.hourlyWage = 0;
    this.isEnabled = true;
    this.priceSelectors = [
      '.price',
      '.product-price',
      '.price-range',
      '.price-current',
      '.price-new',
      '.price-old',
      '[data-price]',
      '.price-value',
      '.price-amount',
      '.price-euro'
    ];
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupMutationObserver();
    this.processPrices();
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

    const priceText = this.extractPrice(element);
    if (!priceText) return;

    const price = this.parsePrice(priceText);
    if (price <= 0) return;

    const hours = this.calculateHours(price);
    if (hours <= 0) return;

    this.addLifePriceDisplay(element, hours);
    element.dataset.lifePriceProcessed = 'true';
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
    // Start with default selectors
    this.priceSelectors = [
      '.price',
      '.product-price',
      '.price-range',
      '.price-current',
      '.price-new',
      '.price-old',
      '[data-price]',
      '.price-value',
      '.price-amount',
      '.price-euro',
      // Additional selectors for skroutz.gr product pages
      '[class*="price"]',
      '[class*="Price"]',
      '[class*="euro"]',
      '[class*="€"]'
    ];
    
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