# 💰 Skroutz Life Price Chrome Extension

A Chrome extension for [skroutz.gr](https://www.skroutz.gr) that displays the number of work hours required to purchase items based on your hourly wage. This extension helps you make more informed purchasing decisions by showing the real "life cost" of products.

## ✨ Features

### 🎯 Core Functionality
- **Price Detection**: Automatically detects prices on all skroutz.gr pages
- **Work Hours Calculation**: Shows how many hours you need to work to buy each item
- **Real-time Updates**: Handles dynamically loaded content with MutationObserver
- **Greek/European Price Format**: Correctly parses prices like "1.234,56 €"

### 🎨 Customization
- **Custom Hourly Wage**: Set your net hourly wage after taxes
- **Custom Messages**: Personalize the display text (e.g., "ώρες", "hours", "ώρες δουλειάς")
- **Color Customization**: Choose your preferred text color
- **Display Formats**: Decimal, fractional, or rounded hour display
- **Font Size Options**: Small, medium, or large text

### 🔧 Advanced Settings
- **Custom Price Selectors**: Add custom CSS selectors if price detection fails
- **Update Intervals**: Configure how often to check for new prices
- **Debug Mode**: Enable console logging for troubleshooting
- **Language Support**: Greek and English interface
- **Currency Support**: Euro, USD, and GBP

### 🔒 Privacy & Security
- **No Tracking**: No user data sent to external servers
- **Local Storage**: All settings stored locally or via Chrome sync
- **Manifest V3**: Uses latest Chrome extension security standards
- **Minimal Permissions**: Only requires access to skroutz.gr

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download the Extension**
   ```bash
   git clone <repository-url>
   cd skroutz-life-price-extension
   ```

2. **Open Chrome Extensions**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the extension folder
   - The extension should now appear in your extensions list

4. **Create Icons** (Optional)
   - Replace the placeholder files in `icons/` with actual PNG images
   - Recommended sizes: 16x16, 48x48, and 128x128 pixels

### Method 2: Chrome Web Store (Future)
- The extension will be available on the Chrome Web Store once published

## 📖 Usage

### Basic Setup

1. **Set Your Hourly Wage**
   - Click the extension icon in your toolbar
   - Enter your net hourly wage (after taxes)
   - Click "Save Settings"

2. **Browse skroutz.gr**
   - Visit any page on skroutz.gr
   - You'll see work hours displayed next to prices
   - Example: "€299.99 • 24.00 ώρες"

### Advanced Configuration

1. **Access Options Page**
   - Click the extension icon → "Advanced Options"
   - Or go to `chrome://extensions/` → Find the extension → "Options"

2. **Customize Display**
   - Choose display format (decimal, fractional, rounded)
   - Set custom message and color
   - Adjust font size and bullet point display

3. **Import/Export Settings**
   - Export your settings to backup or share
   - Import settings from another device

## 🛠️ Technical Details

### Architecture
- **Manifest V3**: Latest Chrome extension manifest version
- **Content Script**: Runs on skroutz.gr pages to detect and modify prices
- **Popup Interface**: Quick settings access via extension icon
- **Options Page**: Comprehensive settings management
- **Storage**: Chrome sync storage for cross-device consistency

### Price Detection
The extension uses multiple strategies to detect prices:
```javascript
const priceSelectors = [
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
```

### Price Parsing
Handles Greek/European number format:
- Input: "1.234,56 €" → Output: 1234.56
- Supports various price formats and currencies

## 🎯 Use Cases

### Personal Finance
- **Budget Awareness**: See the real cost of purchases in time
- **Impulse Control**: Think twice before buying expensive items
- **Value Assessment**: Compare items based on work hours needed

### Financial Planning
- **Savings Goals**: Understand how long you need to work for big purchases
- **Expense Tracking**: Visualize spending in terms of time investment
- **Lifestyle Choices**: Make informed decisions about discretionary spending

## 🔧 Troubleshooting

### Common Issues

**Prices Not Detected**
1. Check if the extension is enabled
2. Verify your hourly wage is set
3. Try adding custom selectors in Advanced Options
4. Enable debug mode to see console logs

**Extension Not Working**
1. Refresh the skroutz.gr page
2. Check if the extension is enabled in Chrome
3. Try disabling and re-enabling the extension
4. Check console for error messages

**Settings Not Saving**
1. Ensure you have Chrome sync enabled
2. Check available storage space
3. Try resetting to defaults and reconfiguring

### Debug Mode
Enable debug mode in Advanced Options to see detailed console logs for troubleshooting.

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Load as unpacked extension in Chrome
3. Make changes to files
4. Reload the extension to test changes

### File Structure
```
skroutz-life-price-extension/
├── manifest.json          # Extension manifest
├── content.js            # Main content script
├── popup.html            # Popup interface
├── popup.js              # Popup logic
├── popup.css             # Popup styles
├── options.html          # Options page
├── options.js            # Options logic
├── options.css           # Options styles
├── styles.css            # Content script styles
├── icons/                # Extension icons
│   ├── consumedlogo.png
│   ├── consumedlogo.png
│   └── consumedlogo.png
└── README.md             # This file
```

### Adding Features
1. **New Settings**: Add to `defaultSettings` in options.js
2. **Price Selectors**: Update `priceSelectors` array in content.js
3. **Display Formats**: Extend the switch statement in `updatePreview()`
4. **Languages**: Add translations and language detection

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the concept of "life price" extensions
- Built specifically for the Greek e-commerce market
- Designed with privacy and user experience in mind

## 📞 Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Enable debug mode for detailed error information

---

**Note**: This extension is not affiliated with skroutz.gr. It's an independent tool designed to enhance the shopping experience on their platform. 