# Deployment Guide for ResumeGenius.AI

## Quick Start

The application is ready to deploy! Here are your options:

### Option 1: GitHub Pages (Recommended)

1. Go to repository Settings
2. Navigate to Pages section
3. Select branch: `copilot/add-interactive-resume-builder`
4. Select folder: `/ (root)`
5. Click Save
6. Your app will be live at: `https://ashimsharma.github.io/ProfileBoost/`

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/ashimsharma/ProfileBoost.git
cd ProfileBoost

# Checkout the feature branch
git checkout copilot/add-interactive-resume-builder

# Serve locally (choose one method)
python3 -m http.server 8000
# OR
npx serve
# OR
php -S localhost:8000

# Open in Chrome Canary
open -a "Google Chrome Canary" http://localhost:8000
```

### Option 3: Vercel/Netlify

**Netlify:**
1. Connect your GitHub repository
2. Select branch: `copilot/add-interactive-resume-builder`
3. Build command: (leave empty)
4. Publish directory: `.`
5. Deploy!

**Vercel:**
1. Import GitHub repository
2. Select branch: `copilot/add-interactive-resume-builder`
3. Framework: Other
4. Build command: (leave empty)
5. Output directory: `.`
6. Deploy!

## Chrome Setup for AI Features

For AI features to work, users need:

1. **Chrome Canary** (Version 127+)
   - Download: https://www.google.com/chrome/canary/

2. **Enable Flags** in `chrome://flags/`:
   ```
   #optimization-guide-on-device-model → Enabled
   #prompt-api-for-gemini-nano → Enabled
   #text-safety-classifier → Enabled
   ```

3. **Restart Chrome Canary**

4. **Grant Permissions** when prompted

> **Note:** The app works without AI APIs but with limited optimization features.

## Icon Setup (Optional)

The app works without icons, but for a complete PWA experience:

1. Navigate to `assets/icons/`
2. Open `generate-icons.html` in a browser
3. Download all generated icons
4. Place them in `assets/icons/` directory

Or use online tools:
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/

Upload `assets/icons/icon.svg` to generate all sizes.

## Testing Checklist

Before submitting:

- [ ] Test in Chrome Canary with AI flags enabled
- [ ] Test offline functionality (Network tab → Offline)
- [ ] Test on mobile device (responsive design)
- [ ] Test all export formats (PDF, DOCX, TXT)
- [ ] Test auto-save (wait 30 seconds after entering data)
- [ ] Verify service worker registration
- [ ] Test keyboard navigation
- [ ] Check browser console for errors

## Demo Video Guidelines

Record a 3-minute video showing:

1. **Introduction (15s)**
   - Team name and project name
   - Problem statement: ATS rejection rates

2. **Demo (2 minutes)**
   - Create resume using builder
   - Show live preview updating
   - Add various sections (work, education, skills)
   - Switch to AI Optimizer tab
   - Paste job description
   - Run optimization
   - Show keyword match score and suggestions
   - Export to PDF

3. **Technical Highlights (30s)**
   - Mention all 6 AI APIs used
   - Highlight offline capability
   - Show privacy features (no backend)

4. **Conclusion (15s)**
   - Impact on job seekers
   - Future enhancements

## Hackathon Submission

### Written Description

**Title:** ResumeGenius.AI - Intelligent Resume Builder & Job Match Optimizer

**Features:**
- Interactive resume builder with live preview
- AI-powered optimization using Chrome Built-in AI
- Keyword matching and ATS compatibility scoring
- Offline-capable PWA with local storage
- Export to PDF, DOCX, and Plain Text
- 100% client-side, privacy-first approach

**APIs Used:**
1. Prompt API - Generate tailored summaries and extract keywords
2. Proofreader API - Fix grammar and spelling
3. Rewriter API - Enhance impact statements
4. Summarizer API - Condense lengthy descriptions
5. Translator API - Multilingual resume support
6. Writer API - Auto-generate section content

**Problem Solved:**
78% of resumes are rejected by ATS systems. Job seekers waste hours tailoring resumes. Our solution uses on-device AI to optimize resumes instantly—privately, offline, and free.

**Target Users:**
- Job seekers (students, career changers, professionals)
- Privacy-conscious users
- Users in areas with limited internet connectivity

### Code Repository

- **GitHub:** https://github.com/ashimsharma/ProfileBoost
- **Branch:** copilot/add-interactive-resume-builder
- **License:** MIT (Open Source)
- **Documentation:** Comprehensive README.md included

### Demo URL

After deploying to GitHub Pages:
```
https://ashimsharma.github.io/ProfileBoost/
```

## Troubleshooting

### AI Features Not Working
- Ensure Chrome Canary version 127+
- Check flags are enabled in chrome://flags/
- Restart browser after enabling flags
- Check console for AI capability warnings

### Export Not Working
- Check internet connection (CDN libraries)
- Disable ad blockers
- Check browser console for errors
- Try different export format

### Offline Not Working
- Open app online first to cache assets
- Check service worker registration
- Try hard refresh (Cmd/Ctrl + Shift + R)

## Support

For issues or questions:
- Create GitHub Issue
- Check README.md for documentation
- Review console logs for error messages

---

**Good luck with the hackathon submission! 🚀**
