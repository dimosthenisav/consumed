# 🚀 Publishing Guide: Consumed Extension to Google Chrome Web Store

## 📋 Prerequisites

### 1. **Google Developer Account**
- Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
- Sign in with your Google account
- Pay the **one-time $5.00 USD registration fee** (required for all developers)
- Complete the developer account setup

### 2. **Extension Files Ready**
- ✅ All extension files are in your repository
- ✅ Extension is tested and working properly
- ✅ No errors in Chrome DevTools

## 📦 Step 1: Prepare Your Extension Package

### 1.1 **Create Production Build**
```bash
# Make sure you're in the extension directory
cd /path/to/your/consumed-extension

# Create a clean production folder
mkdir consumed-production
cp -r * consumed-production/
cd consumed-production

# Remove development files (if any)
rm -rf .git .gitignore node_modules package-lock.json
```

### 1.2 **Verify Required Files**
Ensure these files are present:
- ✅ `manifest.json` (Manifest V3)
- ✅ `popup.html` & `popup.js` & `popup.css`
- ✅ `content.js`
- ✅ `options.html` & `options.js` & `options.css`
- ✅ `styles.css`
- ✅ `icons/` folder with all icon sizes
- ✅ `README.md`
- ✅ `privacy-policy.html`

### 1.3 **Create ZIP File**
```bash
# Create the ZIP file for upload
zip -r consumed-extension-v1.0.0.zip . -x "*.DS_Store" "*.git*"
```

## 🖼️ Step 2: Prepare Store Assets

### 2.1 **Screenshots (Required)**
Create screenshots showing your extension in action:
- **Minimum**: 1 screenshot (1280x800 or 640x400)
- **Recommended**: 3-5 screenshots
- **Format**: PNG or JPEG
- **Content**: Show extension working on different Greek ecommerce sites

**Screenshot Ideas:**
1. Extension popup with toggle and wage settings
2. Price conversion on skroutz.gr product page
3. Price conversion on public.gr listing page
4. Extension working on mediamarkt.gr
5. Options page with advanced settings

### 2.2 **Promotional Images**
- **Small Tile**: 440x280px (required)
- **Large Tile**: 920x680px (required)
- **Marquee**: 1400x560px (optional)

### 2.3 **Icon**
- **128x128px** (required)
- Use your existing `icons/consumedlogo.png`

## 📝 Step 3: Prepare Store Listing

### 3.1 **Extension Details**

**Name**: `Consumed - Price to Work Hours`

**Short Description** (132 characters max):
```
Transform prices into work hours on Greek ecommerce sites
```

**Detailed Description**:
```
Consumed helps you make smarter purchasing decisions by showing how many hours you need to work to afford items on popular Greek ecommerce websites.

🔍 **How it works:**
• Set your hourly wage in the extension popup
• Browse your favorite Greek online stores
• See work hours next to every price automatically
• Toggle the extension on/off with one click

🛍️ **Supported Greek Ecommerce Sites:**
• Skroutz.gr (price comparison)
• Public.gr (electronics)
• Plaisio.gr (electronics)
• Kotsovolos.gr (electronics & appliances)
• MediaMarkt.gr (electronics & appliances)
• E-shop.gr (various categories)
• Sklavenitis.gr (supermarket)
• Praktiker.gr (home improvement)

⚙️ **Features:**
• Easy ON/OFF toggle
• Support for hourly and monthly wages
• Automatic calculation of effective hourly rate
• Works on both listing and product pages
• Clean, modern interface
• No data collection or tracking

💰 **Make Better Decisions:**
Instead of seeing "€299" for a smartphone, see "24h 30m" of work needed. This reality check helps you make more informed purchasing decisions.

Perfect for anyone who wants to be more mindful about their spending on Greek ecommerce sites!
```

### 3.2 **Category & Language**
- **Category**: Productivity
- **Language**: English
- **Region**: Greece (primary), Worldwide

### 3.3 **Privacy Policy**
- **Privacy Policy URL**: Create a simple privacy policy page
- **Data Usage**: "This extension does not collect, store, or transmit any personal data"

## 🌐 Step 4: Create Privacy Policy

### 4.1 **Simple Privacy Policy**
Create a basic privacy policy stating:
- No data collection
- No personal information stored
- No tracking
- Local processing only
- No third-party services

### 4.2 **Host Privacy Policy**
- Upload to GitHub Pages, or
- Use a simple hosting service
- Include the URL in your store listing

## 📤 Step 5: Upload to Chrome Web Store

### 5.1 **Access Developer Dashboard**
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click "Add new item"
3. Upload your ZIP file

### 5.2 **Fill Store Listing**
1. **Store listing** tab:
   - Upload screenshots
   - Add promotional images
   - Fill description
   - Set category and language

2. **Privacy practices** tab:
   - Add privacy policy URL
   - Declare no data collection
   - No personal information

3. **Package** tab:
   - Upload your ZIP file
   - Verify manifest.json is valid

### 5.3 **Pricing & Distribution**
- **Price**: Free
- **Visibility**: Public
- **Regions**: All regions (or specific to Greece)

## 🔍 Step 6: Submit for Review

### 6.1 **Pre-Submission Checklist**
- [ ] All required fields filled
- [ ] Screenshots uploaded
- [ ] Privacy policy URL provided
- [ ] ZIP file uploaded successfully
- [ ] No errors in manifest.json
- [ ] Extension tested thoroughly

### 6.2 **Submit for Review**
1. Click "Submit for review"
2. Wait for Google's review process (typically 1-3 business days)
3. Check email for status updates

## 📊 Step 7: Post-Publication

### 7.1 **Monitor Performance**
- Check Chrome Web Store analytics
- Monitor user reviews and ratings
- Track installation numbers

### 7.2 **User Support**
- Respond to user reviews
- Address bug reports
- Consider user feedback for updates

### 7.3 **Updates**
- Plan regular updates
- Test thoroughly before publishing updates
- Update version number in manifest.json

## 🚨 Common Issues & Solutions

### **Manifest V3 Requirements**
- Ensure manifest.json uses Manifest V3
- Check all permissions are necessary
- Verify content script matches are correct

### **Review Rejections**
- **Privacy issues**: Ensure clear privacy policy
- **Functionality**: Test on all supported sites
- **Screenshots**: Show actual functionality
- **Description**: Be clear about what the extension does

### **Technical Issues**
- **ZIP file**: Ensure all files are included
- **Icons**: Verify all required icon sizes
- **Permissions**: Only request necessary permissions

## 📈 Marketing Tips

### **Store Optimization**
- Use relevant keywords in description
- High-quality screenshots
- Clear, compelling description
- Regular updates to stay relevant

### **Promotion**
- Share on social media
- Greek tech communities
- Personal finance blogs
- Reddit communities (r/Greece, r/personalfinance)

## 🔄 Update Process

### **For Future Updates**
1. Update version in `manifest.json`
2. Test thoroughly
3. Create new ZIP file
4. Upload to Chrome Web Store
5. Submit for review

---

## 📞 Support

If you encounter issues during the publishing process:
- Check [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- Review [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program_policies/)
- Contact Chrome Web Store support if needed

---

**Good luck with your publication! 🚀** 