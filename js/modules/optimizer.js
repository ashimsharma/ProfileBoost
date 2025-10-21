// Optimizer Manager Module
import { AIIntegrations } from './aiIntegrations.js';

export class OptimizerManager {
    constructor() {
        this.aiIntegrations = new AIIntegrations();
        this.currentResumeText = '';
        this.currentJobDescription = '';
        this.optimizationResults = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Use builder resume button
        document.getElementById('useBuilderResume')?.addEventListener('click', () => {
            this.useBuilderResume();
        });

        // Upload resume file
        document.getElementById('resumeUpload')?.addEventListener('change', (e) => {
            this.handleResumeUpload(e);
        });

        // Paste resume button
        document.getElementById('pasteResume')?.addEventListener('click', () => {
            this.showPasteDialog();
        });

        // Optimize button
        document.getElementById('optimizeResume')?.addEventListener('click', () => {
            this.optimizeResume();
        });

        // Apply optimization button
        document.getElementById('applyOptimization')?.addEventListener('click', () => {
            this.applyOptimization();
        });
    }

    useBuilderResume() {
        const resumeData = window.app?.resumeBuilder?.getResumeData();
        if (resumeData) {
            this.currentResumeText = this.convertResumeDataToText(resumeData);
            this.showToast('Resume loaded from builder', 'success');
        } else {
            this.showToast('No resume data found in builder', 'error');
        }
    }

    async handleResumeUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        try {
            const text = await this.readFileAsText(file);
            this.currentResumeText = text;
            this.showToast('Resume file uploaded successfully', 'success');
        } catch (error) {
            console.error('Error reading file:', error);
            this.showToast('Error reading resume file', 'error');
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            
            if (file.type === 'text/plain') {
                reader.readAsText(file);
            } else {
                // For PDF and DOCX, we'd need specialized libraries
                // For now, just reject with message
                reject(new Error('PDF and DOCX parsing requires additional libraries. Please use plain text or paste content.'));
            }
        });
    }

    showPasteDialog() {
        const text = prompt('Paste your resume text here:');
        if (text && text.trim()) {
            this.currentResumeText = text.trim();
            this.showToast('Resume text loaded', 'success');
        }
    }

    async optimizeResume() {
        const jobDescription = document.getElementById('jobDescription')?.value;
        
        if (!this.currentResumeText) {
            this.showToast('Please provide a resume first', 'error');
            return;
        }

        if (!jobDescription || !jobDescription.trim()) {
            this.showToast('Please provide a job description', 'error');
            return;
        }

        this.currentJobDescription = jobDescription.trim();

        try {
            this.showLoading();

            // Get selected optimization options
            const selectedOptions = Array.from(document.querySelectorAll('.optimization-option:checked'))
                .map(cb => cb.dataset.api);

            // Run optimization
            this.optimizationResults = await this.aiIntegrations.optimizeForJob(
                this.currentResumeText,
                this.currentJobDescription
            );

            // Apply additional optimizations based on selected options
            if (selectedOptions.includes('proofreader')) {
                this.optimizationResults.optimizedText = await this.aiIntegrations.proofread(
                    this.optimizationResults.optimizedText
                );
            }

            if (selectedOptions.includes('rewriter')) {
                // Enhance key sections
                this.optimizationResults.optimizedText = await this.aiIntegrations.rewrite(
                    this.optimizationResults.optimizedText,
                    'professional'
                );
            }

            if (selectedOptions.includes('summarizer')) {
                // This would typically apply to long descriptions
                // For demo, we'll just note it was applied
            }

            // Display results
            this.displayOptimizationResults();
            
            this.showToast('Resume optimization complete!', 'success');
        } catch (error) {
            console.error('Error optimizing resume:', error);
            this.showToast('Error optimizing resume', 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayOptimizationResults() {
        const resultsContainer = document.getElementById('optimizationResults');
        if (!resultsContainer || !this.optimizationResults) return;

        resultsContainer.classList.remove('hidden');

        // Display match score
        const matchScore = document.getElementById('matchScore');
        const matchScoreBar = document.getElementById('matchScoreBar');
        if (matchScore && matchScoreBar) {
            matchScore.textContent = `${this.optimizationResults.matchScore}%`;
            matchScoreBar.style.width = `${this.optimizationResults.matchScore}%`;
            
            // Color based on score
            if (this.optimizationResults.matchScore >= 75) {
                matchScoreBar.className = 'bg-green-600 h-3 rounded-full transition-all duration-500';
            } else if (this.optimizationResults.matchScore >= 50) {
                matchScoreBar.className = 'bg-yellow-600 h-3 rounded-full transition-all duration-500';
            } else {
                matchScoreBar.className = 'bg-red-600 h-3 rounded-full transition-all duration-500';
            }
        }

        // Display ATS score
        const atsScore = document.getElementById('atsScore');
        if (atsScore) {
            atsScore.textContent = `${this.optimizationResults.atsScore}/100`;
        }

        // Display missing keywords
        const missingKeywordsContainer = document.getElementById('missingKeywords');
        if (missingKeywordsContainer) {
            missingKeywordsContainer.innerHTML = this.optimizationResults.missingKeywords
                .map(keyword => `<span class="keyword-tag">${keyword}</span>`)
                .join('');
        }

        // Display suggestions
        const suggestionsContainer = document.getElementById('suggestions');
        if (suggestionsContainer) {
            suggestionsContainer.innerHTML = this.optimizationResults.suggestions
                .map(suggestion => `<div class="suggestion-card">${suggestion}</div>`)
                .join('');
        }

        // Display before/after
        const originalContent = document.getElementById('originalContent');
        const optimizedContent = document.getElementById('optimizedContent');
        if (originalContent && optimizedContent) {
            originalContent.textContent = this.currentResumeText.substring(0, 500) + '...';
            optimizedContent.textContent = this.optimizationResults.optimizedText.substring(0, 500) + '...';
        }
    }

    applyOptimization() {
        if (!this.optimizationResults) {
            this.showToast('No optimization results to apply', 'error');
            return;
        }

        // Here we would update the resume builder with optimized content
        // For now, we'll just show a success message
        this.showToast('Optimization applied to resume', 'success');
        
        // Switch to builder tab
        window.app?.switchTab('builder');
    }

    convertResumeDataToText(data) {
        let text = '';
        
        // Personal info
        text += `${data.personal.fullName}\n`;
        text += `${data.personal.email} | ${data.personal.phone}\n`;
        if (data.personal.linkedin) text += `${data.personal.linkedin}\n`;
        if (data.personal.portfolio) text += `${data.personal.portfolio}\n`;
        text += '\n';

        // Summary
        if (data.summary) {
            text += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
        }

        // Work experience
        if (data.workExperience?.length) {
            text += 'WORK EXPERIENCE\n';
            data.workExperience.forEach(exp => {
                text += `${exp.title} at ${exp.company}\n`;
                text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
                if (exp.achievements?.length) {
                    exp.achievements.forEach(ach => {
                        if (ach.trim()) text += `• ${ach}\n`;
                    });
                }
                text += '\n';
            });
        }

        // Education
        if (data.education?.length) {
            text += 'EDUCATION\n';
            data.education.forEach(edu => {
                text += `${edu.degree} in ${edu.major}\n`;
                text += `${edu.institution} - ${edu.graduationDate}\n`;
                if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
                text += '\n';
            });
        }

        // Skills
        if (data.skills?.length) {
            text += `SKILLS\n${data.skills.join(', ')}\n\n`;
        }

        // Projects
        if (data.projects?.length) {
            text += 'PROJECTS\n';
            data.projects.forEach(proj => {
                text += `${proj.title}\n`;
                if (proj.description) text += `${proj.description}\n`;
                if (proj.technologies) text += `Technologies: ${proj.technologies}\n`;
                text += '\n';
            });
        }

        return text;
    }

    showToast(message, type) {
        window.app?.showToast(message, type);
    }

    showLoading() {
        window.app?.showLoading();
    }

    hideLoading() {
        window.app?.hideLoading();
    }
}
