// Resume Builder Module
export class ResumeBuilder {
    constructor(previewManager, storageManager) {
        this.previewManager = previewManager;
        this.storageManager = storageManager;
        this.resumeData = this.initializeResumeData();
        this.unsavedChanges = false;
        this.debounceTimer = null;
        
        this.init();
    }

    initializeResumeData() {
        return {
            id: this.generateId(),
            type: 'chronological',
            personal: {
                fullName: '',
                email: '',
                phone: '',
                linkedin: '',
                portfolio: ''
            },
            summary: '',
            workExperience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: []
        };
    }

    init() {
        this.setupFormListeners();
        this.setupCollapsibleSections();
        this.setupResumeTypeSelection();
        this.setupDynamicSections();
    }

    setupFormListeners() {
        // Personal information inputs
        ['fullName', 'email', 'phone', 'linkedin', 'portfolio'].forEach(field => {
            const input = document.getElementById(field);
            if (input) {
                input.addEventListener('input', (e) => {
                    this.resumeData.personal[field] = e.target.value;
                    this.markAsChanged();
                    this.updatePreview();
                });
            }
        });

        // Summary textarea
        const summaryInput = document.getElementById('summary');
        if (summaryInput) {
            summaryInput.addEventListener('input', (e) => {
                this.resumeData.summary = e.target.value;
                this.markAsChanged();
                this.updatePreview();
            });
        }
    }

    setupCollapsibleSections() {
        document.querySelectorAll('.section-header').forEach(header => {
            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';
                const content = header.nextElementSibling;
                const icon = header.querySelector('svg');
                const addButton = header.parentElement.querySelector('[class*="add-btn"]');

                header.setAttribute('aria-expanded', !isExpanded);
                
                if (isExpanded) {
                    content.classList.add('hidden');
                    icon.classList.add('rotate-180');
                    if (addButton) addButton.classList.add('hidden');
                } else {
                    content.classList.remove('hidden');
                    icon.classList.remove('rotate-180');
                    if (addButton) addButton.classList.remove('hidden');
                }
            });
        });
    }

    setupResumeTypeSelection() {
        document.querySelectorAll('input[name="resumeType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.resumeData.type = e.target.value;
                this.markAsChanged();
                this.updatePreview();
            });
        });
    }

    setupDynamicSections() {
        // Work Experience
        document.getElementById('addWorkExperience')?.addEventListener('click', () => {
            this.addWorkExperience();
        });

        // Education
        document.getElementById('addEducation')?.addEventListener('click', () => {
            this.addEducation();
        });

        // Skills
        document.getElementById('addSkill')?.addEventListener('click', () => {
            this.addSkill();
        });

        document.getElementById('skillInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addSkill();
            }
        });

        // Projects
        document.getElementById('addProject')?.addEventListener('click', () => {
            this.addProject();
        });

        // Certifications
        document.getElementById('addCertification')?.addEventListener('click', () => {
            this.addCertification();
        });

        // Languages
        document.getElementById('addLanguage')?.addEventListener('click', () => {
            this.addLanguage();
        });
    }

    addWorkExperience() {
        const id = this.generateId();
        const entry = {
            id,
            company: '',
            title: '',
            location: '',
            startDate: '',
            endDate: '',
            current: false,
            achievements: ['']
        };

        this.resumeData.workExperience.push(entry);
        this.renderWorkExperience(entry);
        this.markAsChanged();
        this.updatePreview();
    }

    renderWorkExperience(entry) {
        const container = document.getElementById('workExperienceContainer');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.dataset.id = entry.id;
        entryDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900">Work Experience Entry</h3>
                <button type="button" class="remove-entry-btn" onclick="window.app.resumeBuilder.removeWorkExperience('${entry.id}')">
                    ✕ Remove
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                    <input type="text" data-field="title" value="${entry.title}" 
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input type="text" data-field="company" value="${entry.company}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" data-field="location" value="${entry.location}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="flex items-center text-sm text-gray-700">
                        <input type="checkbox" data-field="current" ${entry.current ? 'checked' : ''}
                            class="w-4 h-4 text-blue-600 rounded mr-2">
                        Currently working here
                    </label>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="month" data-field="startDate" value="${entry.startDate}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="month" data-field="endDate" value="${entry.endDate}" ${entry.current ? 'disabled' : ''}
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div class="sm:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">Key Achievements</label>
                    <div class="achievements-container" data-entry-id="${entry.id}">
                        ${entry.achievements.map((ach, idx) => `
                            <div class="flex gap-2 mb-2">
                                <input type="text" data-achievement-index="${idx}" value="${ach}"
                                    placeholder="• Describe your achievement..."
                                    class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                                <button type="button" class="px-2 py-1 text-red-600 hover:bg-red-50 rounded" onclick="window.app.resumeBuilder.removeAchievement('${entry.id}', ${idx})">✕</button>
                            </div>
                        `).join('')}
                    </div>
                    <button type="button" class="mt-2 text-sm text-blue-600 hover:text-blue-700" onclick="window.app.resumeBuilder.addAchievement('${entry.id}')">
                        + Add Achievement
                    </button>
                </div>
            </div>
        `;

        container.appendChild(entryDiv);
        this.attachEntryListeners(entryDiv, 'workExperience', entry.id);
    }

    addEducation() {
        const id = this.generateId();
        const entry = {
            id,
            institution: '',
            degree: '',
            major: '',
            location: '',
            graduationDate: '',
            gpa: ''
        };

        this.resumeData.education.push(entry);
        this.renderEducation(entry);
        this.markAsChanged();
        this.updatePreview();
    }

    renderEducation(entry) {
        const container = document.getElementById('educationContainer');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.dataset.id = entry.id;
        entryDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900">Education Entry</h3>
                <button type="button" class="remove-entry-btn" onclick="window.app.resumeBuilder.removeEducation('${entry.id}')">
                    ✕ Remove
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                    <input type="text" data-field="institution" value="${entry.institution}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input type="text" data-field="degree" value="${entry.degree}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Major/Field</label>
                    <input type="text" data-field="major" value="${entry.major}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" data-field="location" value="${entry.location}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                    <input type="month" data-field="graduationDate" value="${entry.graduationDate}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">GPA (Optional)</label>
                    <input type="text" data-field="gpa" value="${entry.gpa}"
                        placeholder="e.g., 3.8/4.0"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
            </div>
        `;

        container.appendChild(entryDiv);
        this.attachEntryListeners(entryDiv, 'education', entry.id);
    }

    addSkill() {
        const input = document.getElementById('skillInput');
        const skill = input.value.trim();
        
        if (skill && !this.resumeData.skills.includes(skill)) {
            this.resumeData.skills.push(skill);
            this.renderSkill(skill);
            input.value = '';
            this.markAsChanged();
            this.updatePreview();
        }
    }

    renderSkill(skill) {
        const container = document.getElementById('skillsContainer');
        const skillTag = document.createElement('div');
        skillTag.className = 'skill-tag';
        skillTag.innerHTML = `
            <span>${skill}</span>
            <button type="button" class="text-blue-800 hover:text-blue-900" onclick="window.app.resumeBuilder.removeSkill('${skill}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        `;
        container.appendChild(skillTag);
    }

    addProject() {
        const id = this.generateId();
        const entry = {
            id,
            title: '',
            description: '',
            technologies: '',
            githubUrl: '',
            demoUrl: ''
        };

        this.resumeData.projects.push(entry);
        this.renderProject(entry);
        this.markAsChanged();
        this.updatePreview();
    }

    renderProject(entry) {
        const container = document.getElementById('projectsContainer');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.dataset.id = entry.id;
        entryDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900">Project Entry</h3>
                <button type="button" class="remove-entry-btn" onclick="window.app.resumeBuilder.removeProject('${entry.id}')">
                    ✕ Remove
                </button>
            </div>
            <div class="space-y-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <input type="text" data-field="title" value="${entry.title}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea data-field="description" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">${entry.description}</textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                    <input type="text" data-field="technologies" value="${entry.technologies}"
                        placeholder="e.g., React, Node.js, MongoDB"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                        <input type="url" data-field="githubUrl" value="${entry.githubUrl}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                        <input type="url" data-field="demoUrl" value="${entry.demoUrl}"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    </div>
                </div>
            </div>
        `;

        container.appendChild(entryDiv);
        this.attachEntryListeners(entryDiv, 'projects', entry.id);
    }

    addCertification() {
        const id = this.generateId();
        const entry = {
            id,
            name: '',
            issuer: '',
            date: '',
            url: ''
        };

        this.resumeData.certifications.push(entry);
        this.renderCertification(entry);
        this.markAsChanged();
        this.updatePreview();
    }

    renderCertification(entry) {
        const container = document.getElementById('certificationsContainer');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.dataset.id = entry.id;
        entryDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900">Certification Entry</h3>
                <button type="button" class="remove-entry-btn" onclick="window.app.resumeBuilder.removeCertification('${entry.id}')">
                    ✕ Remove
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                    <input type="text" data-field="name" value="${entry.name}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                    <input type="text" data-field="issuer" value="${entry.issuer}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date Obtained</label>
                    <input type="month" data-field="date" value="${entry.date}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Credential URL</label>
                    <input type="url" data-field="url" value="${entry.url}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
            </div>
        `;

        container.appendChild(entryDiv);
        this.attachEntryListeners(entryDiv, 'certifications', entry.id);
    }

    addLanguage() {
        const id = this.generateId();
        const entry = {
            id,
            language: '',
            proficiency: 'intermediate'
        };

        this.resumeData.languages.push(entry);
        this.renderLanguage(entry);
        this.markAsChanged();
        this.updatePreview();
    }

    renderLanguage(entry) {
        const container = document.getElementById('languagesContainer');
        const entryDiv = document.createElement('div');
        entryDiv.className = 'entry-item';
        entryDiv.dataset.id = entry.id;
        entryDiv.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-semibold text-gray-900">Language Entry</h3>
                <button type="button" class="remove-entry-btn" onclick="window.app.resumeBuilder.removeLanguage('${entry.id}')">
                    ✕ Remove
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <input type="text" data-field="language" value="${entry.language}"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                    <select data-field="proficiency"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                        <option value="native" ${entry.proficiency === 'native' ? 'selected' : ''}>Native</option>
                        <option value="fluent" ${entry.proficiency === 'fluent' ? 'selected' : ''}>Fluent</option>
                        <option value="advanced" ${entry.proficiency === 'advanced' ? 'selected' : ''}>Advanced</option>
                        <option value="intermediate" ${entry.proficiency === 'intermediate' ? 'selected' : ''}>Intermediate</option>
                        <option value="basic" ${entry.proficiency === 'basic' ? 'selected' : ''}>Basic</option>
                    </select>
                </div>
            </div>
        `;

        container.appendChild(entryDiv);
        this.attachEntryListeners(entryDiv, 'languages', entry.id);
    }

    attachEntryListeners(entryDiv, sectionName, entryId) {
        const inputs = entryDiv.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const field = e.target.dataset.field;
                const entry = this.resumeData[sectionName].find(item => item.id === entryId);
                
                if (entry && field) {
                    if (e.target.type === 'checkbox') {
                        entry[field] = e.target.checked;
                        
                        // Handle current employment checkbox
                        if (field === 'current') {
                            const endDateInput = entryDiv.querySelector('[data-field="endDate"]');
                            if (endDateInput) {
                                endDateInput.disabled = e.target.checked;
                                if (e.target.checked) {
                                    entry.endDate = '';
                                    endDateInput.value = '';
                                }
                            }
                        }
                    } else {
                        entry[field] = e.target.value;
                    }
                    
                    this.markAsChanged();
                    this.updatePreview();
                }
            });
        });

        // Handle achievements separately
        const achievementsInputs = entryDiv.querySelectorAll('[data-achievement-index]');
        achievementsInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.achievementIndex);
                const entry = this.resumeData.workExperience.find(item => item.id === entryId);
                
                if (entry && entry.achievements) {
                    entry.achievements[index] = e.target.value;
                    this.markAsChanged();
                    this.updatePreview();
                }
            });
        });
    }

    addAchievement(entryId) {
        const entry = this.resumeData.workExperience.find(item => item.id === entryId);
        if (entry) {
            entry.achievements.push('');
            const container = document.querySelector(`[data-entry-id="${entryId}"]`);
            if (container) {
                const index = entry.achievements.length - 1;
                const achievementDiv = document.createElement('div');
                achievementDiv.className = 'flex gap-2 mb-2';
                achievementDiv.innerHTML = `
                    <input type="text" data-achievement-index="${index}" value=""
                        placeholder="• Describe your achievement..."
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                    <button type="button" class="px-2 py-1 text-red-600 hover:bg-red-50 rounded" onclick="window.app.resumeBuilder.removeAchievement('${entryId}', ${index})">✕</button>
                `;
                container.appendChild(achievementDiv);
                
                const input = achievementDiv.querySelector('input');
                input.addEventListener('input', (e) => {
                    entry.achievements[index] = e.target.value;
                    this.markAsChanged();
                    this.updatePreview();
                });
            }
        }
    }

    removeAchievement(entryId, index) {
        const entry = this.resumeData.workExperience.find(item => item.id === entryId);
        if (entry && entry.achievements) {
            entry.achievements.splice(index, 1);
            // Re-render the work experience entry
            const entryDiv = document.querySelector(`[data-id="${entryId}"]`);
            if (entryDiv) {
                entryDiv.remove();
                this.renderWorkExperience(entry);
            }
            this.markAsChanged();
            this.updatePreview();
        }
    }

    removeWorkExperience(id) {
        this.resumeData.workExperience = this.resumeData.workExperience.filter(item => item.id !== id);
        document.querySelector(`#workExperienceContainer [data-id="${id}"]`)?.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    removeEducation(id) {
        this.resumeData.education = this.resumeData.education.filter(item => item.id !== id);
        document.querySelector(`#educationContainer [data-id="${id}"]`)?.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    removeSkill(skill) {
        this.resumeData.skills = this.resumeData.skills.filter(s => s !== skill);
        const container = document.getElementById('skillsContainer');
        const skillTags = Array.from(container.children);
        const skillTag = skillTags.find(tag => tag.textContent.includes(skill));
        if (skillTag) skillTag.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    removeProject(id) {
        this.resumeData.projects = this.resumeData.projects.filter(item => item.id !== id);
        document.querySelector(`#projectsContainer [data-id="${id}"]`)?.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    removeCertification(id) {
        this.resumeData.certifications = this.resumeData.certifications.filter(item => item.id !== id);
        document.querySelector(`#certificationsContainer [data-id="${id}"]`)?.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    removeLanguage(id) {
        this.resumeData.languages = this.resumeData.languages.filter(item => item.id !== id);
        document.querySelector(`#languagesContainer [data-id="${id}"]`)?.remove();
        this.markAsChanged();
        this.updatePreview();
    }

    updatePreview() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.previewManager.renderPreview(this.resumeData);
        }, 300);
    }

    markAsChanged() {
        this.unsavedChanges = true;
    }

    markAsSaved() {
        this.unsavedChanges = false;
    }

    hasUnsavedChanges() {
        return this.unsavedChanges;
    }

    getResumeData() {
        return this.resumeData;
    }

    loadResumeData(data) {
        this.resumeData = data;
        
        // Populate form fields
        Object.keys(data.personal).forEach(field => {
            const input = document.getElementById(field);
            if (input) input.value = data.personal[field] || '';
        });

        const summaryInput = document.getElementById('summary');
        if (summaryInput) summaryInput.value = data.summary || '';

        // Set resume type
        const typeRadio = document.querySelector(`input[name="resumeType"][value="${data.type}"]`);
        if (typeRadio) typeRadio.checked = true;

        // Load dynamic sections
        data.workExperience?.forEach(entry => this.renderWorkExperience(entry));
        data.education?.forEach(entry => this.renderEducation(entry));
        data.skills?.forEach(skill => this.renderSkill(skill));
        data.projects?.forEach(entry => this.renderProject(entry));
        data.certifications?.forEach(entry => this.renderCertification(entry));
        data.languages?.forEach(entry => this.renderLanguage(entry));

        this.updatePreview();
    }

    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
