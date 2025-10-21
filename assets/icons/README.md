# Icons

To generate the required PWA icons, you can:

1. Use the provided `icon.svg` as a base
2. Convert it to PNG at various sizes using an online tool like:
   - https://realfavicongenerator.net/
   - https://www.favicon-generator.org/
   - Or use ImageMagick locally:

```bash
# If you have ImageMagick installed
for size in 72 96 128 144 152 192 384 512; do
  convert icon.svg -resize ${size}x${size} icon-${size}x${size}.png
done
```

3. Or open `generate-icons.html` in a browser to generate icons automatically

Required icon sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

For development, the app will work without these icons, but they're required for a complete PWA experience.
