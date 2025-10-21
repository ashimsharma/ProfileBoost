// Template Manager Module
export class TemplateManager {
    constructor() {
        this.templates = this.initializeTemplates();
    }

    initializeTemplates() {
        return {
            minimalist: {
                name: 'Minimalist',
                render: (data) => this.renderMinimalist(data)
            },
            modern: {
                name: 'Modern',
                render: (data) => this.renderModern(data)
            },
            classic: {
                name: 'Classic',
                render: (data) => this.renderClassic(data)
            },
            executive: {
                name: 'Executive',
                render: (data) => this.renderExecutive(data)
            }
        };
    }

    getTemplate(name) {
        return this.templates[name] || this.templates.minimalist;
    }

    getAllTemplates() {
        return Object.keys(this.templates).map(key => ({
            id: key,
            ...this.templates[key]
        }));
    }

    renderMinimalist(data) {
        return `
            ${this.renderHeader(data)}
            ${data.summary ? this.renderSummary(data.summary) : ''}
            ${data.workExperience?.length ? this.renderWorkExperience(data.workExperience) : ''}
            ${data.education?.length ? this.renderEducation(data.education) : ''}
            ${data.skills?.length ? this.renderSkills(data.skills) : ''}
            ${data.projects?.length ? this.renderProjects(data.projects) : ''}
            ${data.certifications?.length ? this.renderCertifications(data.certifications) : ''}
            ${data.languages?.length ? this.renderLanguages(data.languages) : ''}
        `;
    }

    renderModern(data) {
        return this.renderMinimalist(data);
    }

    renderClassic(data) {
        return this.renderMinimalist(data);
    }

    renderExecutive(data) {
        return this.renderMinimalist(data);
    }

    renderHeader(data) {
        const { personal } = data;
        const contactInfo = [
            personal.email,
            personal.phone,
            personal.linkedin,
            personal.portfolio
        ].filter(Boolean);

        return `
            <div class="mb-6">
                <h1 class="text-center">${personal.fullName || 'Your Name'}</h1>
                ${contactInfo.length ? `
                    <div class="contact-info justify-center">
                        ${personal.email ? `<span>${personal.email}</span>` : ''}
                        ${personal.phone ? `<span>${personal.phone}</span>` : ''}
                        ${personal.linkedin ? `<span>${personal.linkedin}</span>` : ''}
                        ${personal.portfolio ? `<span>${personal.portfolio}</span>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    }

    renderSummary(summary) {
        return `
            <div class="mb-6">
                <h2>Professional Summary</h2>
                <p>${summary}</p>
            </div>
        `;
    }

    renderWorkExperience(experiences) {
        if (!experiences || experiences.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Work Experience</h2>
                ${experiences.map(exp => `
                    <div class="job-entry">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="job-title">${exp.title || 'Job Title'}</h3>
                                <p class="company">${exp.company || 'Company Name'}${exp.location ? ` - ${exp.location}` : ''}</p>
                            </div>
                            <p class="dates">${this.formatDate(exp.startDate)} - ${exp.current ? 'Present' : this.formatDate(exp.endDate)}</p>
                        </div>
                        ${exp.achievements?.filter(a => a.trim()).length ? `
                            <ul>
                                ${exp.achievements.filter(a => a.trim()).map(achievement => `
                                    <li>${achievement}</li>
                                `).join('')}
                            </ul>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEducation(education) {
        if (!education || education.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Education</h2>
                ${education.map(edu => `
                    <div class="education-entry">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="degree">${edu.degree || 'Degree'}${edu.major ? ` in ${edu.major}` : ''}</h3>
                                <p class="institution">${edu.institution || 'Institution'}${edu.location ? ` - ${edu.location}` : ''}</p>
                            </div>
                            <p class="dates">${this.formatDate(edu.graduationDate)}</p>
                        </div>
                        ${edu.gpa ? `<p class="text-sm text-gray-600">GPA: ${edu.gpa}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSkills(skills) {
        if (!skills || skills.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Skills</h2>
                <div class="skills-list">
                    ${skills.map(skill => `
                        <span class="skill-item">${skill}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderProjects(projects) {
        if (!projects || projects.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Projects</h2>
                ${projects.map(project => `
                    <div class="project-entry">
                        <h3>${project.title || 'Project Title'}</h3>
                        ${project.description ? `<p>${project.description}</p>` : ''}
                        ${project.technologies ? `<p class="text-sm text-gray-600"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                        <div class="flex gap-4 text-sm">
                            ${project.githubUrl ? `<a href="${project.githubUrl}" class="text-blue-600 hover:underline">GitHub</a>` : ''}
                            ${project.demoUrl ? `<a href="${project.demoUrl}" class="text-blue-600 hover:underline">Live Demo</a>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCertifications(certifications) {
        if (!certifications || certifications.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Certifications & Awards</h2>
                ${certifications.map(cert => `
                    <div class="mb-2">
                        <div class="flex justify-between items-start">
                            <div>
                                <strong>${cert.name || 'Certification Name'}</strong>
                                ${cert.issuer ? ` - ${cert.issuer}` : ''}
                            </div>
                            ${cert.date ? `<span class="dates">${this.formatDate(cert.date)}</span>` : ''}
                        </div>
                        ${cert.url ? `<a href="${cert.url}" class="text-sm text-blue-600 hover:underline">View Credential</a>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderLanguages(languages) {
        if (!languages || languages.length === 0) return '';
        
        return `
            <div class="mb-6">
                <h2>Languages</h2>
                <div class="grid grid-cols-2 gap-2">
                    ${languages.map(lang => `
                        <div>
                            <strong>${lang.language || 'Language'}</strong>: ${this.formatProficiency(lang.proficiency)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString + '-01');
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    formatProficiency(level) {
        const proficiencyMap = {
            native: 'Native',
            fluent: 'Fluent',
            advanced: 'Advanced',
            intermediate: 'Intermediate',
            basic: 'Basic'
        };
        return proficiencyMap[level] || level;
    }
}
