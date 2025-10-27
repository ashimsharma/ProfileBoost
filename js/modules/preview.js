// Preview Manager Module
export class PreviewManager {
    constructor(templateManager) {
        this.templateManager = templateManager;
        this.currentTemplate = 'minimalist';
        this.previewContainer = document.getElementById('resumePreview');
    }

    renderPreview(resumeData) {
        if (!this.previewContainer) return;

        const template = this.templateManager.getTemplate(this.currentTemplate);
        const html = template.render(resumeData);
        
        this.previewContainer.innerHTML = html;
        this.previewContainer.className = `preview-container border border-gray-200 rounded-lg p-8 bg-white min-h-[600px] shadow-inner template-${this.currentTemplate}`;
    }

    changeTemplate(templateName) {
        this.currentTemplate = templateName;
        const resumeData = window.app?.resumeBuilder?.getResumeData();
        if (resumeData) {
            this.renderPreview(resumeData);
        }
    }

    getPreviewHTML() {
        return this.previewContainer?.innerHTML || '';
    }
}
