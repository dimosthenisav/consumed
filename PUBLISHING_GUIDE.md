# 🚀 Chrome Web Store Publishing Guide

This guide will walk you through publishing your "Consumed" extension to the Chrome Web Store.

## 📋 Prerequisites

1. **Google Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Sign in with your Google account
   - Pay the one-time $5.00 registration fee (if not already done)

2. **Extension Files Ready**
   - All files are prepared and tested
   - Icons are properly sized (16x16, 48x48, 128x128)
   - Privacy policy is created

## 📦 Prepare Your Extension Package

### 1. Create a ZIP File
```bash
# Create a zip file with all your extension files
zip -r consumed-extension.zip . -x "*.git*" "*.DS_Store*" "node_modules/*" "*.md" "PUBLISHING_GUIDE.md"
```

**Include these files in your ZIP:**
- manifest.json
- content.js
- popup.html, popup.js, popup.css
- options.html, options.js, options.css
- styles.css
- icons/ (folder with all icon files)
- privacy-policy.html

### 2. Verify Your Package
- Extract the ZIP file to a new folder
- Load it as an unpacked extension in Chrome
- Test all functionality thoroughly
- Ensure no errors in the console

## 🏪 Chrome Web Store Submission

### Step 1: Access Developer Dashboard
1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
2. Click "Add new item"
3. Upload your ZIP file

### Step 2: Store Listing Information

#### **Extension Details**
- **Name:** Consumed
- **Summary:** Transform prices into work hours on skroutz.gr
- **Detailed Description:**
```
Transform prices into work hours! See how long you need to work to afford items on skroutz.gr.

🎯 What it does:
• Automatically detects prices on skroutz.gr
• Shows work hours needed based on your hourly wage
• Helps you make smarter purchasing decisions
• Customizable display options

💰 Features:
• Set your hourly wage (net after taxes)
• Choose between hourly or monthly salary
• Customize display format (decimal, fractional, rounded)
• Personalize colors and text
• Works with Greek/European price formats

🔒 Privacy-focused:
• No tracking or data collection
• All settings stored locally
• No external servers or third-party services
• Compliant with GDPR and Chrome policies

Perfect for anyone who wants to understand the real "life cost" of their purchases!
```

#### **Category & Language**
- **Category:** Shopping
- **Language:** English
- **Country:** Greece (primary), Worldwide

### Step 3: Graphics & Media

#### **Required Images**
1. **Icon (128x128):** Use your existing icon
2. **Screenshot (1280x800):** Create a screenshot showing the extension in action on skroutz.gr
3. **Promotional Images:**
   - Small tile (440x280)
   - Large tile (920x680)

#### **Screenshot Guidelines**
- Show the extension working on skroutz.gr
- Display prices with work hours next to them
- Include the popup interface
- Use high-quality, clear images
- Avoid showing personal information

### Step 4: Privacy & Security

#### **Privacy Policy**
- **URL:** Host your privacy-policy.html on GitHub Pages or similar
- **Content:** Already created in privacy-policy.html

#### **Permissions Justification**
```
Storage: Stores your hourly wage and display preferences locally
Active Tab: Accesses current tab to detect prices on skroutz.gr
Host Permissions: Only accesses skroutz.gr to display work hours
```

### Step 5: Additional Information

#### **Support Site**
- Create a GitHub repository for support
- Add issues template for bug reports
- Include installation and usage instructions

#### **Contact Information**
- **Email:** [Your email]
- **Support URL:** [GitHub repository URL]

## 📝 Store Listing Optimization

### Keywords for SEO
- skroutz
- price calculator
- work hours
- shopping assistant
- budget tool
- financial awareness
- Greek shopping
- price reality check

### Description Tips
- Use emojis for visual appeal
- Highlight key benefits
- Include use cases
- Mention privacy features
- Add call-to-action

## 🔍 Review Process

### What Google Reviews
1. **Functionality:** Does it work as described?
2. **Security:** Any malicious code or data collection?
3. **Policy Compliance:** Follows Chrome Web Store policies
4. **User Experience:** Clear interface and instructions
5. **Privacy:** Proper privacy policy and data handling

### Common Rejection Reasons
- Missing privacy policy
- Unclear permission usage
- Broken functionality
- Poor user experience
- Policy violations

### Review Timeline
- **Initial Review:** 1-3 business days
- **Re-review (if rejected):** 1-2 business days
- **Final Approval:** Usually same day as approval

## 🎯 Post-Publication

### 1. Monitor Reviews
- Respond to user feedback
- Address bug reports quickly
- Update based on user suggestions

### 2. Analytics
- Monitor installation numbers
- Track user engagement
- Analyze user feedback

### 3. Updates
- Plan regular updates
- Add new features based on feedback
- Maintain compatibility with Chrome updates

## 📊 Marketing Your Extension

### 1. Social Media
- Share on Twitter, LinkedIn, Reddit
- Create demo videos
- Engage with relevant communities

### 2. Content Marketing
- Write blog posts about financial awareness
- Create tutorials and guides
- Share on Medium or personal blog

### 3. Community Engagement
- Share on Greek tech communities
- Engage with skroutz.gr users
- Participate in relevant forums

## 🔧 Troubleshooting

### Common Issues
1. **Rejection due to permissions:** Clarify why each permission is needed
2. **Privacy policy issues:** Ensure it covers all data handling
3. **Functionality problems:** Test thoroughly before submission
4. **Image quality:** Use high-resolution screenshots

### Support Resources
- [Chrome Web Store Developer Documentation](https://developer.chrome.com/docs/webstore/)
- [Developer Program Policies](https://developer.chrome.com/docs/webstore/program_policies/)
- [Chrome Extension Development Guide](https://developer.chrome.com/docs/extensions/)

## 🎉 Success Checklist

- [ ] Google Developer account created
- [ ] $5 registration fee paid
- [ ] Extension thoroughly tested
- [ ] ZIP file created and verified
- [ ] Privacy policy hosted online
- [ ] Screenshots and promotional images created
- [ ] Store listing information prepared
- [ ] Support site/contact information ready
- [ ] Extension submitted for review
- [ ] Monitoring setup for post-publication

Good luck with your Chrome Web Store submission! 🚀 