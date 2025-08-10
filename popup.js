// Popup JavaScript for Skroutz Life Price Extension

class PopupManager {
  constructor() {
    this.elements = {
      extensionToggle: document.getElementById('extensionToggle'),
      wageTypeHourly: document.querySelector('input[name="wageType"][value="hourly"]'),
      wageTypeMonthly: document.querySelector('input[name="wageType"][value="monthly"]'),
      hourlyWageGroup: document.getElementById('hourlyWageGroup'),
      monthlyWageGroup: document.getElementById('monthlyWageGroup'),
      workHoursGroup: document.getElementById('workHoursGroup'),
      hourlyWage: document.getElementById('hourlyWage'),
      monthlyWage: document.getElementById('monthlyWage'),
      workHoursPerMonth: document.getElementById('workHoursPerMonth'),
      saveBtn: document.getElementById('saveBtn'),
      optionsBtn: document.getElementById('optionsBtn'),
      status: document.getElementById('status'),
      exampleHours: document.getElementById('exampleHours')
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updateExample();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get([
        'wageType',
        'hourlyWage',
        'monthlyWage',
        'workHoursPerMonth',
        'isEnabled'
      ]);
      
      // Set extension toggle state
      this.elements.extensionToggle.checked = result.isEnabled !== false; // Default to true
      
      // Set wage type
      const wageType = result.wageType || 'hourly';
      if (wageType === 'monthly') {
        this.elements.wageTypeMonthly.checked = true;
        this.toggleWageInputs();
      } else {
        this.elements.wageTypeHourly.checked = true;
      }
      
      // Load values
      this.elements.hourlyWage.value = result.hourlyWage || '';
      this.elements.monthlyWage.value = result.monthlyWage || '';
      this.elements.workHoursPerMonth.value = result.workHoursPerMonth || '160';
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('Error loading settings', 'error');
    }
  }

  setupEventListeners() {
    // Extension toggle
    this.elements.extensionToggle.addEventListener('change', () => {
      // Update example immediately when toggle changes
      this.updateExample();
    });
    
    // Wage type toggle
    this.elements.wageTypeHourly.addEventListener('change', () => this.toggleWageInputs());
    this.elements.wageTypeMonthly.addEventListener('change', () => this.toggleWageInputs());
    
    // Save button
    this.elements.saveBtn.addEventListener('click', () => this.saveSettings());
    
    // Options button
    this.elements.optionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
    
    // Real-time example updates
    this.elements.hourlyWage.addEventListener('input', () => this.updateExample());
    this.elements.monthlyWage.addEventListener('input', () => this.updateExample());
    this.elements.workHoursPerMonth.addEventListener('input', () => this.updateExample());
    
    // Enter key to save
    this.elements.hourlyWage.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSettings();
    });
    
    this.elements.monthlyWage.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.saveSettings();
    });
  }

  toggleWageInputs() {
    if (this.elements.wageTypeHourly.checked) {
      this.elements.hourlyWageGroup.style.display = 'block';
      this.elements.monthlyWageGroup.style.display = 'none';
      this.elements.workHoursGroup.style.display = 'none';
    } else {
      this.elements.hourlyWageGroup.style.display = 'none';
      this.elements.monthlyWageGroup.style.display = 'block';
      this.elements.workHoursGroup.style.display = 'block';
    }
    this.updateExample();
  }

  getEffectiveHourlyWage() {
    if (this.elements.wageTypeHourly.checked) {
      return parseFloat(this.elements.hourlyWage.value) || 0;
    } else {
      const monthlyWage = parseFloat(this.elements.monthlyWage.value) || 0;
      const workHours = parseFloat(this.elements.workHoursPerMonth.value) || 160;
      return monthlyWage > 0 && workHours > 0 ? monthlyWage / workHours : 0;
    }
  }

  async saveSettings() {
    const isEnabled = this.elements.extensionToggle.checked;
    const wageType = this.elements.wageTypeHourly.checked ? 'hourly' : 'monthly';
    const hourlyWage = parseFloat(this.elements.hourlyWage.value) || 0;
    const monthlyWage = parseFloat(this.elements.monthlyWage.value) || 0;
    const workHoursPerMonth = parseFloat(this.elements.workHoursPerMonth.value) || 160;

    // Validation
    if (wageType === 'hourly' && hourlyWage <= 0) {
      this.showStatus('Please enter a valid hourly wage', 'error');
      this.elements.hourlyWage.focus();
      return;
    }

    if (wageType === 'monthly' && monthlyWage <= 0) {
      this.showStatus('Please enter a valid monthly salary', 'error');
      this.elements.monthlyWage.focus();
      return;
    }

    if (wageType === 'monthly' && workHoursPerMonth <= 0) {
      this.showStatus('Please enter valid work hours per month', 'error');
      this.elements.workHoursPerMonth.focus();
      return;
    }

    // Save to storage
    const effectiveHourlyWage = this.getEffectiveHourlyWage();
    try {
      await chrome.storage.sync.set({
        isEnabled,
        wageType,
        hourlyWage,
        monthlyWage,
        workHoursPerMonth,
        effectiveHourlyWage
      });

      // Update content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url) {
        // Check if it's a supported Greek ecommerce site
        const supportedSites = [
          'skroutz.gr', 'public.gr', 'plaisio.gr', 'kotsovolos.gr', 'mediamarkt.gr',
          'e-shop.gr', 'sklavenitis.gr', 'praktiker.gr'
        ];
        
        const isSupportedSite = supportedSites.some(site => tab.url.includes(site));
        
        if (isSupportedSite) {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: { 
              hourlyWage: effectiveHourlyWage,
              isEnabled: isEnabled
            }
          });
        }
      }

      this.showStatus('Settings saved successfully!', 'success');
      this.updateExample();
      setTimeout(() => {
        this.hideStatus();
      }, 2000);

    } catch (error) {
      this.showStatus('Error saving settings', 'error');
    }
  }

  updateExample() {
    const isEnabled = this.elements.extensionToggle.checked;
    const effectiveHourlyWage = this.getEffectiveHourlyWage();
    
    if (!isEnabled) {
      this.elements.exampleHours.textContent = 'disabled';
      return;
    }
    
    // Always use just the time value without "ώρες"
    if (effectiveHourlyWage > 0) {
      const examplePrice = 50; // €50 example
      const hours = (examplePrice / effectiveHourlyWage).toFixed(2);
      this.elements.exampleHours.textContent = `${hours}`;
    } else {
      this.elements.exampleHours.textContent = '0';
    }
  }

  showStatus(message, type = 'success') {
    this.elements.status.textContent = message;
    this.elements.status.className = `status ${type}`;
  }

  hideStatus() {
    this.elements.status.textContent = '';
    this.elements.status.className = 'status';
  }

  isValidHexColor(hex) {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 