# ResumeGenius.AI — Intelligent Resume Builder & Job Match Optimizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Canary](https://img.shields.io/badge/Chrome-Canary%20Required-yellow.svg)](https://www.google.com/chrome/canary/)

A privacy-first, offline-capable web application that leverages **Google Chrome's Built-in AI APIs (Gemini Nano)** to help users create, optimize, and tailor professional resumes for specific job applications—entirely client-side, with no backend required.

## 🎯 Key Features

### Interactive Resume Builder
- **Step-by-step form interface** with live preview
- **Multiple resume formats**: Chronological, Functional, Combination, and Targeted
- **Dynamic sections**: Work Experience, Education, Skills, Projects, Certifications, Languages
- **Real-time preview** with professional document-style formatting
- **Multiple templates**: Minimalist, Modern, Classic, Executive

### AI-Powered Optimization
- **Smart resume optimization** using Chrome Built-in AI APIs
- **Keyword match analysis** with visual scoring (0-100%)
- **ATS compatibility checker** to ensure resumes pass Applicant Tracking Systems
- **Missing keywords detection** from job descriptions
- **Section-by-section AI suggestions** for improvement
- **Before/after comparison** view

### Export & Storage
- **Export to PDF, DOCX, and Plain Text**
- **Local storage** using IndexedDB (no cloud uploads)
- **Auto-save** every 30 seconds
- **Multiple resume versions** management

### Privacy & Offline Support
- **100% client-side processing** - no backend servers
- **Offline-capable PWA** with service worker caching
- **All data stays on your device** - complete privacy
- **Works without internet** after initial load

## 📋 Prerequisites

To use the AI features, you need:

1. **Chrome Canary** (Version 127 or later)
2. Enable the following flags in `chrome://flags/`:
   - `#optimization-guide-on-device-model` → **Enabled**
   - `#prompt-api-for-gemini-nano` → **Enabled**
   - `#text-safety-classifier` → **Enabled**

3. After enabling flags, restart Chrome Canary

## 🚀 Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/ashimsharma/ProfileBoost.git
cd ProfileBoost
```

2. Open `index.html` in Chrome Canary:
```bash
# On macOS
open -a "Google Chrome Canary" index.html

# On Linux
google-chrome-canary index.html

# On Windows
start chrome-canary index.html

# Or simply drag and drop index.html into Chrome Canary
```

3. Grant AI API permissions when prompted

### Using GitHub Pages

This app can be hosted on GitHub Pages. Simply visit the URL in Chrome Canary with the required flags enabled.

## 📖 Usage Guide

### Creating a Resume

1. **Select Resume Type**: Choose the format that best suits your career goals
2. **Fill Personal Information**: Name, email, phone, LinkedIn, portfolio
3. **Add Professional Summary**: Write or generate with AI
4. **Add Work Experience**: Include company, title, dates, and key achievements
5. **Add Education**: Institution, degree, major, graduation date
6. **Add Skills**: Technical and soft skills with autocomplete
7. **Optional Sections**: Projects, certifications, languages

### Optimizing for a Job

1. Navigate to the **AI Optimizer** tab
2. Input your resume (use builder, upload, or paste)
3. Paste the target job description
4. Select AI optimization features:
   - Generate tailored summary
   - Fix grammar/spelling
   - Enhance impact statements
   - Condense descriptions
5. Click **"✨ Optimize with AI"**
6. Review suggestions and apply changes

### Exporting Your Resume

1. Click the **Export** button in the header
2. Choose your preferred format:
   - **PDF** - For most job applications
   - **DOCX** - For editable Microsoft Word format
   - **Plain Text** - For ATS-friendly plain text

## 🏗️ Architecture

### Project Structure
```
ProfileBoost/
├── index.html                 # Main application entry
├── manifest.json              # PWA manifest
├── service-worker.js          # Offline support
├── css/
│   └── styles.css             # Custom Tailwind overrides
├── js/
│   ├── main.js                # App initialization
│   └── modules/
│       ├── resumeBuilder.js   # Form logic & data collection
│       ├── preview.js         # Live resume rendering
│       ├── optimizer.js       # AI optimization coordinator
│       ├── aiIntegrations.js  # Chrome AI API wrappers
│       ├── export.js          # PDF/DOCX generation
│       ├── storage.js         # IndexedDB operations
│       └── templates.js       # Resume template definitions
└── assets/
    └── icons/                 # PWA icons
```

### Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+ modules)
- **Styling**: Tailwind CSS (via CDN)
- **Storage**: IndexedDB
- **AI APIs**: Chrome Built-in AI (Prompt, Writer, Rewriter, Summarizer, Translator, Proofreader)
- **Export Libraries**: jsPDF, docx.js
- **PWA**: Service Worker for offline support

## 🤖 Chrome Built-in AI APIs Used

### 1. Prompt API
- Generate tailored professional summaries
- Create job-specific resume variations
- Suggest achievement bullet points

### 2. Proofreader API
- Fix grammar, punctuation, and spelling errors
- Ensure professional language quality

### 3. Rewriter API
- Enhance weak phrases
- Improve action verb usage
- Strengthen impact statements

### 4. Summarizer API
- Condense lengthy job descriptions
- Create concise skill summaries

### 5. Translator API
- Localize resumes for international applications
- Support multilingual resume creation

### 6. Writer API
- Auto-generate section content
- Create professional bullet points
- Write cover letter drafts

## 🎨 Features Breakdown

### Resume Builder
- ✅ Personal Information (name, email, phone, LinkedIn, portfolio)
- ✅ Professional Summary with AI generation
- ✅ Work Experience with achievements
- ✅ Education with GPA (optional)
- ✅ Skills with smart tags
- ✅ Projects with GitHub/demo links
- ✅ Certifications & Awards
- ✅ Languages with proficiency levels

### AI Optimizer
- ✅ Multiple resume input methods
- ✅ Job description analysis
- ✅ Keyword match scoring (0-100%)
- ✅ ATS compatibility checker
- ✅ Missing keywords detection
- ✅ AI-powered suggestions
- ✅ Before/after comparison

### Templates
- ✅ Minimalist (clean, simple design)
- ✅ Modern (contemporary styling)
- ✅ Classic (traditional format)
- ✅ Executive (professional layout)

### PWA Features
- ✅ Offline functionality
- ✅ "Add to Home Screen" capability
- ✅ Service Worker caching
- ✅ Responsive design (mobile-first)

## 🔒 Privacy & Security

- **No data leaves your device** - all processing is local
- **No tracking or analytics** - complete privacy
- **No account required** - instant use
- **No cloud storage** - data stays in your browser
- **Open source** - transparent code you can inspect

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Full keyboard navigation support
- ARIA labels on all interactive elements
- High contrast mode compatible
- Screen reader friendly

## 🐛 Troubleshooting

### AI Features Not Working

1. Ensure you're using Chrome Canary (version 127+)
2. Check that required flags are enabled in `chrome://flags/`
3. Restart Chrome Canary after enabling flags
4. Check browser console for error messages

### Resume Not Saving

1. Check browser storage permissions
2. Ensure IndexedDB is not disabled
3. Check available storage space
4. Try clearing browser cache and reload

### Export Not Working

1. Check that external libraries (jsPDF, docx.js) are loaded
2. Disable ad blockers that might block CDN resources
3. Check browser console for errors

## 🚧 Known Limitations

- Chrome Built-in AI APIs are experimental and may change
- PDF export uses basic text layout (no complex formatting)
- DOCX export requires docx.js library from CDN
- Large resumes may take longer to process with AI
- AI features require Chrome Canary with specific flags

## 🗺️ Roadmap

- [ ] Enhanced PDF export with better formatting
- [ ] More resume templates (10+ industry-specific)
- [ ] Cover letter generator
- [ ] Interview question generator
- [ ] Multi-resume management dashboard
- [ ] Resume analytics and version comparison
- [ ] Dark mode support
- [ ] Multilingual UI support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Chrome team for Built-in AI APIs
- Tailwind CSS for the styling framework
- jsPDF and docx.js for export functionality
- The open-source community

## 📧 Contact

Ashim Sharma - [@ashimsharma](https://github.com/ashimsharma)

Project Link: [https://github.com/ashimsharma/ProfileBoost](https://github.com/ashimsharma/ProfileBoost)

---

**Note**: This is a demonstration project for Chrome's Built-in AI APIs. Some features may require updates as the APIs evolve from experimental to stable releases.

## 📊 Problem Statement

> "78% of resumes are rejected by ATS systems before reaching human recruiters. Job seekers waste hours manually tailoring resumes for each application. ResumeGenius.AI uses on-device AI to instantly optimize resumes for any job posting—privately, offline, and for free."

## 🏆 Built for Chrome Built-in AI Challenge

This project showcases the capabilities of on-device AI for practical, privacy-focused applications that solve real-world problems.
