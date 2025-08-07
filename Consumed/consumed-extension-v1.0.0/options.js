// Options Page JavaScript for Skroutz Life Price Extension

class OptionsManager {
  constructor() {
    this.elements = {
      wageTypeHourly: document.querySelector('input[name="wageType"][value="hourly"]'),
      wageTypeMonthly: document.querySelector('input[name="wageType"][value="monthly"]'),
      hourlyWageGroup: document.getElementById('hourlyWageGroup'),
      monthlyWageGroup: document.getElementById('monthlyWageGroup'),
      
      // Basic settings
      hourlyWage: document.getElementById('hourlyWage'),
      monthlyWage: document.getElementById('monthlyWage'),
      workHoursPerMonth: document.getElementById('workHoursPerMonth'),
      isEnabled: document.getElementById('isEnabled'),
      
      // Display options
      fontSize: document.getElementById('fontSize'),
      displayFormat: document.getElementById('displayFormat'),
      showBullet: document.getElementById('showBullet'),
      
      // Advanced settings
      customSelectors: document.getElementById('customSelectors'),
      updateInterval: document.getElementById('updateInterval'),
      debugMode: document.getElementById('debugMode'),
      
      // Language & localization
      language: document.getElementById('language'),
      currency: document.getElementById('currency'),
      
      // Buttons
      saveBtn: document.getElementById('saveBtn'),
      resetBtn: document.getElementById('resetBtn'),
      status: document.getElementById('status'),
      previewHours: document.getElementById('previewHours')
    };
    
    this.defaultSettings = {
      wageType: 'hourly',
      hourlyWage: 0,
      monthlyWage: 0,
      workHoursPerMonth: 160,
      isEnabled: true,
      fontSize: '1em', // Large
      displayFormat: 'fractional',
      showBullet: true,
      customSelectors: '',
      updateInterval: 1000,
      debugMode: false,
      language: 'el',
      currency: 'EUR'
    };
    
    this.init();
  }

  async init() {
    await this.loadSettings();
    this.setupEventListeners();
    this.updatePreview();
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(Object.keys(this.defaultSettings));
      
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
      this.elements.isEnabled.checked = result.isEnabled !== false;
      
      // Apply loaded settings or defaults
      Object.keys(this.defaultSettings).forEach(key => {
        const value = result[key] !== undefined ? result[key] : this.defaultSettings[key];
        
        if (this.elements[key]) {
          if (typeof value === 'boolean') {
            this.elements[key].checked = value;
          } else {
            this.elements[key].value = value;
          }
        }
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      this.showStatus('Error loading settings', 'error');
    }
  }

  setupEventListeners() {
    // Wage type toggle
    this.elements.wageTypeHourly.addEventListener('change', () => this.toggleWageInputs());
    this.elements.wageTypeMonthly.addEventListener('change', () => this.toggleWageInputs());
    
    // Save button
    this.elements.saveBtn.addEventListener('click', () => this.saveSettings());
    
    // Reset button
    this.elements.resetBtn.addEventListener('click', () => this.resetSettings());
    
    // Real-time preview updates
    this.elements.hourlyWage.addEventListener('input', () => this.updatePreview());
    this.elements.monthlyWage.addEventListener('input', () => this.updatePreview());
    this.elements.workHoursPerMonth.addEventListener('input', () => this.updatePreview());
    this.elements.displayFormat.addEventListener('change', () => this.updatePreview());
    
    // Auto-save on some changes
    this.elements.isEnabled.addEventListener('change', () => this.saveSettings());
    this.elements.fontSize.addEventListener('change', () => this.saveSettings());
    this.elements.showBullet.addEventListener('change', () => this.saveSettings());
  }

  toggleWageInputs() {
    if (this.elements.wageTypeHourly.checked) {
      this.elements.hourlyWageGroup.style.display = 'block';
      this.elements.monthlyWageGroup.style.display = 'none';
    } else {
      this.elements.hourlyWageGroup.style.display = 'none';
      this.elements.monthlyWageGroup.style.display = 'block';
    }
    this.updatePreview();
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
    const settings = this.getCurrentSettings();
    
    // Validation
    if (settings.wageType === 'hourly' && settings.hourlyWage <= 0) {
      this.showStatus('Please enter a valid hourly wage', 'error');
      this.elements.hourlyWage.focus();
      return;
    }

    if (settings.wageType === 'monthly' && settings.monthlyWage <= 0) {
      this.showStatus('Please enter a valid monthly salary', 'error');
      this.elements.monthlyWage.focus();
      return;
    }

    if (settings.wageType === 'monthly' && settings.workHoursPerMonth <= 0) {
      this.showStatus('Please enter valid work hours per month', 'error');
      this.elements.workHoursPerMonth.focus();
      return;
    }

    try {
      // Save to storage
      await chrome.storage.sync.set(settings);

      // Update all tabs with skroutz.gr
      const tabs = await chrome.tabs.query({ url: 'https://www.skroutz.gr/*' });
      for (const tab of tabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'updateSettings',
            settings: {
              hourlyWage: effectiveHourlyWage, // Send effective hourly wage
              isEnabled: settings.isEnabled,
              fontSize: settings.fontSize,
              displayFormat: settings.displayFormat,
              showBullet: settings.showBullet,
              customSelectors: settings.customSelectors,
              updateInterval: settings.updateInterval,
              debugMode: settings.debugMode,
              language: settings.language,
              currency: settings.currency
            }
          });
        } catch (error) {
          // Tab might not have content script loaded
          console.log('Could not update tab:', tab.id);
        }
      }

      this.showStatus('Settings saved successfully!', 'success');
      this.updatePreview();
      
      // Auto-hide success message
      setTimeout(() => {
        this.hideStatus();
      }, 3000);

    } catch (error) {
      console.error('Error saving settings:', error);
      this.showStatus('Error saving settings', 'error');
    }
  }

  getCurrentSettings() {
    return {
      wageType: this.elements.wageTypeHourly.checked ? 'hourly' : 'monthly',
      hourlyWage: parseFloat(this.elements.hourlyWage.value) || 0,
      monthlyWage: parseFloat(this.elements.monthlyWage.value) || 0,
      workHoursPerMonth: parseFloat(this.elements.workHoursPerMonth.value) || 160,
      isEnabled: this.elements.isEnabled.checked,
      fontSize: this.elements.fontSize.value,
      displayFormat: this.elements.displayFormat.value,
      showBullet: this.elements.showBullet.checked,
      customSelectors: this.elements.customSelectors.value,
      updateInterval: parseInt(this.elements.updateInterval.value) || 1000,
      debugMode: this.elements.debugMode.checked,
      language: this.elements.language.value,
      currency: this.elements.currency.value
    };
  }

  async resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to defaults?')) {
      return;
    }

    try {
      // Reset to defaults
      await chrome.storage.sync.set(this.defaultSettings);
      
      // Reload the page to reflect changes
      await this.loadSettings();
      
      this.showStatus('Settings reset to defaults', 'success');
      this.updatePreview();
      
      setTimeout(() => {
        this.hideStatus();
      }, 2000);

    } catch (error) {
      console.error('Error resetting settings:', error);
      this.showStatus('Error resetting settings', 'error');
    }
  }

  updatePreview() {
    const effectiveHourlyWage = this.getEffectiveHourlyWage();
    const displayFormat = this.elements.displayFormat.value;
    if (effectiveHourlyWage > 0) {
      const examplePrice = 50;
      const hours = examplePrice / effectiveHourlyWage;
      let displayText;
      switch (displayFormat) {
        case 'fractional':
          const wholeHours = Math.floor(hours);
          const minutes = Math.round((hours - wholeHours) * 60);
          displayText = `${wholeHours}h ${minutes}m`;
          break;
        case 'rounded':
          displayText = `${Math.round(hours)}`;
          break;
        default:
          displayText = `${hours.toFixed(2)}`;
      }
      this.elements.previewHours.textContent = displayText;
    } else {
      this.elements.previewHours.textContent = '0';
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
}

// Initialize options when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new OptionsManager();
}); 