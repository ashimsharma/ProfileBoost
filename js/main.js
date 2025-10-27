// Main Application Entry Point
import { ResumeBuilder } from './modules/resumeBuilder.js';
import { PreviewManager } from './modules/preview.js';
import { OptimizerManager } from './modules/optimizer.js';
import { ExportManager } from './modules/export.js';
import { StorageManager } from './modules/storage.js';
import { TemplateManager } from './modules/templates.js';

class App {
    constructor() {
        this.resumeBuilder = null;
        this.previewManager = null;
        this.optimizerManager = null;
        this.exportManager = null;
        this.storageManager = null;
        this.templateManager = null;
        this.currentTab = 'builder';
        this.autoSaveTimer = null;
    }

    async init() {
        console.log('Initializing ResumeGenius.AI...');
        
        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }

        // Initialize managers
        this.storageManager = new StorageManager();
        await this.storageManager.init();

        this.templateManager = new TemplateManager();
        this.previewManager = new PreviewManager(this.templateManager);
        this.resumeBuilder = new ResumeBuilder(this.previewManager, this.storageManager);
        this.optimizerManager = new OptimizerManager();
        this.exportManager = new ExportManager(this.previewManager);

        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved resume if exists
        await this.loadLastResume();

        // Start auto-save
        this.startAutoSave();

        // Check AI capabilities
        this.checkAICapabilities();

        console.log('ResumeGenius.AI initialized successfully!');
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Save button
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveResume());

        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => this.showExportModal());
        document.getElementById('closeExportModal')?.addEventListener('click', () => this.hideExportModal());
        document.getElementById('exportPDF')?.addEventListener('click', () => this.exportResume('pdf'));
        document.getElementById('exportDOCX')?.addEventListener('click', () => this.exportResume('docx'));
        document.getElementById('exportTXT')?.addEventListener('click', () => this.exportResume('txt'));

        // Dark mode toggle
        document.getElementById('darkModeToggle')?.addEventListener('click', () => this.toggleDarkMode());

        // Template selector
        document.getElementById('templateSelector')?.addEventListener('change', (e) => {
            this.previewManager.changeTemplate(e.target.value);
        });

        // Close modal on outside click
        document.getElementById('exportModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'exportModal') {
                this.hideExportModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveResume();
                }
                if (e.key === 'e') {
                    e.preventDefault();
                    this.showExportModal();
                }
            }
        });

        // Window beforeunload
        window.addEventListener('beforeunload', (e) => {
            if (this.resumeBuilder.hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-button').forEach(button => {
            const isActive = button.dataset.tab === tabName;
            button.classList.toggle('text-blue-600', isActive);
            button.classList.toggle('border-blue-600', isActive);
            button.classList.toggle('text-gray-500', !isActive);
            button.classList.toggle('border-transparent', !isActive);
            button.setAttribute('aria-selected', isActive);
        });

        // Show/hide tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            const isActive = content.id === `${tabName}-tab`;
            content.classList.toggle('hidden', !isActive);
        });
    }

    async saveResume() {
        try {
            const resumeData = this.resumeBuilder.getResumeData();
            await this.storageManager.saveResume(resumeData);
            this.showToast('Resume saved successfully!', 'success');
            this.resumeBuilder.markAsSaved();
        } catch (error) {
            console.error('Error saving resume:', error);
            this.showToast('Error saving resume', 'error');
        }
    }

    async loadLastResume() {
        try {
            const resumes = await this.storageManager.getAllResumes();
            if (resumes.length > 0) {
                const lastResume = resumes[0];
                this.resumeBuilder.loadResumeData(lastResume.content);
                console.log('Loaded last saved resume');
            }
        } catch (error) {
            console.error('Error loading resume:', error);
        }
    }

    startAutoSave() {
        // Auto-save every 30 seconds
        this.autoSaveTimer = setInterval(() => {
            if (this.resumeBuilder.hasUnsavedChanges()) {
                this.saveResume();
                console.log('Auto-saved resume');
            }
        }, 30000);
    }

    showExportModal() {
        const modal = document.getElementById('exportModal');
        modal?.classList.remove('hidden');
        modal?.classList.add('flex');
    }

    hideExportModal() {
        const modal = document.getElementById('exportModal');
        modal?.classList.add('hidden');
        modal?.classList.remove('flex');
    }

    async exportResume(format) {
        try {
            this.showLoading();
            const resumeData = this.resumeBuilder.getResumeData();
            
            switch (format) {
                case 'pdf':
                    await this.exportManager.exportToPDF(resumeData);
                    break;
                case 'docx':
                    await this.exportManager.exportToDOCX(resumeData);
                    break;
                case 'txt':
                    await this.exportManager.exportToText(resumeData);
                    break;
            }
            
            this.showToast(`Resume exported as ${format.toUpperCase()}`, 'success');
            this.hideExportModal();
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Error exporting resume', 'error');
        } finally {
            this.hideLoading();
        }
    }

    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.remove('hidden');
            toast.classList.add('show');
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 3000);
        }
    }

    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay?.classList.remove('hidden');
        overlay?.classList.add('flex');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay?.classList.add('hidden');
        overlay?.classList.remove('flex');
    }

    async checkAICapabilities() {
        // Check if Chrome Built-in AI APIs are available
        const aiStatus = {
            prompt: typeof window.ai?.createTextSession === 'function',
            writer: typeof window.ai?.writer === 'object',
            rewriter: typeof window.ai?.rewriter === 'object',
            summarizer: typeof window.ai?.summarizer === 'object',
            translator: typeof window.ai?.translator === 'object',
            proofreader: typeof window.ai?.proofreader === 'object'
        };

        console.log('AI Capabilities:', aiStatus);

        const hasAnyAI = Object.values(aiStatus).some(status => status);
        
        if (!hasAnyAI) {
            console.warn('Chrome Built-in AI APIs not available. Please use Chrome Canary with flags enabled.');
            this.showToast('AI features require Chrome Canary with AI flags enabled', 'info');
        }

        return aiStatus;
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
        window.app = app; // Make app globally accessible for debugging
    });
} else {
    const app = new App();
    app.init();
    window.app = app;
}

// Export for module usage
export { App };
