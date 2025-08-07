#!/bin/bash

# Package Extension for Chrome Web Store
echo "🚀 Packaging Consumed Extension for Chrome Web Store..."

# Create a clean package directory
PACKAGE_DIR="consumed-extension-package"
rm -rf "$PACKAGE_DIR"
mkdir "$PACKAGE_DIR"

# Copy required files
echo "📁 Copying extension files..."
cp manifest.json "$PACKAGE_DIR/"
cp content.js "$PACKAGE_DIR/"
cp popup.html "$PACKAGE_DIR/"
cp popup.js "$PACKAGE_DIR/"
cp popup.css "$PACKAGE_DIR/"
cp options.html "$PACKAGE_DIR/"
cp options.js "$PACKAGE_DIR/"
cp options.css "$PACKAGE_DIR/"
cp styles.css "$PACKAGE_DIR/"

# Copy icons directory
if [ -d "icons" ]; then
    cp -r icons "$PACKAGE_DIR/"
    echo "✅ Icons copied"
else
    echo "⚠️  Warning: icons directory not found"
fi

# Create ZIP file
echo "📦 Creating ZIP package..."
cd "$PACKAGE_DIR"
zip -r ../consumed-extension-v1.0.0.zip . -x "*.DS_Store*"
cd ..

# Clean up
rm -rf "$PACKAGE_DIR"

echo "✅ Extension packaged successfully!"
echo "📦 Package: consumed-extension-v1.0.0.zip"
echo ""
echo "🎯 Next steps:"
echo "1. Test the ZIP file by extracting and loading as unpacked extension"
echo "2. Go to Chrome Web Store Developer Dashboard"
echo "3. Upload the ZIP file"
echo "4. Fill in store listing information"
echo "5. Submit for review"
echo ""
echo "📖 See PUBLISHING_GUIDE.md for detailed instructions" 