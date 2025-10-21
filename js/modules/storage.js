// Storage Manager Module - IndexedDB operations
export class StorageManager {
    constructor() {
        this.dbName = 'ResumeGeniusDB';
        this.dbVersion = 1;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Error opening database:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create resumes store
                if (!db.objectStoreNames.contains('resumes')) {
                    const resumesStore = db.createObjectStore('resumes', { keyPath: 'id' });
                    resumesStore.createIndex('name', 'name', { unique: false });
                    resumesStore.createIndex('lastModified', 'lastModified', { unique: false });
                    resumesStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Create preferences store
                if (!db.objectStoreNames.contains('preferences')) {
                    db.createObjectStore('preferences', { keyPath: 'key' });
                }

                console.log('Database schema created/updated');
            };
        });
    }

    /**
     * Save resume to IndexedDB
     * @param {Object} resumeData - Resume data object
     * @returns {Promise<string>} - Resume ID
     */
    async saveResume(resumeData) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        const timestamp = new Date().toISOString();
        const resume = {
            id: resumeData.id || this.generateId(),
            name: this.generateResumeName(resumeData),
            content: resumeData,
            createdAt: resumeData.createdAt || timestamp,
            lastModified: timestamp
        };

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['resumes'], 'readwrite');
            const store = transaction.objectStore('resumes');
            const request = store.put(resume);

            request.onsuccess = () => {
                console.log('Resume saved:', resume.id);
                resolve(resume.id);
            };

            request.onerror = () => {
                console.error('Error saving resume:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get resume by ID
     * @param {string} id - Resume ID
     * @returns {Promise<Object>} - Resume object
     */
    async getResume(id) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['resumes'], 'readonly');
            const store = transaction.objectStore('resumes');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Error getting resume:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get all resumes
     * @returns {Promise<Array>} - Array of resume objects
     */
    async getAllResumes() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['resumes'], 'readonly');
            const store = transaction.objectStore('resumes');
            const index = store.index('lastModified');
            const request = index.openCursor(null, 'prev'); // Get most recent first

            const resumes = [];

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    resumes.push(cursor.value);
                    cursor.continue();
                } else {
                    resolve(resumes);
                }
            };

            request.onerror = () => {
                console.error('Error getting resumes:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Delete resume by ID
     * @param {string} id - Resume ID
     * @returns {Promise<void>}
     */
    async deleteResume(id) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['resumes'], 'readwrite');
            const store = transaction.objectStore('resumes');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('Resume deleted:', id);
                resolve();
            };

            request.onerror = () => {
                console.error('Error deleting resume:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Save user preferences
     * @param {string} key - Preference key
     * @param {*} value - Preference value
     * @returns {Promise<void>}
     */
    async savePreference(key, value) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['preferences'], 'readwrite');
            const store = transaction.objectStore('preferences');
            const request = store.put({ key, value });

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                console.error('Error saving preference:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Get user preference
     * @param {string} key - Preference key
     * @returns {Promise<*>} - Preference value
     */
    async getPreference(key) {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['preferences'], 'readonly');
            const store = transaction.objectStore('preferences');
            const request = store.get(key);

            request.onsuccess = () => {
                resolve(request.result?.value);
            };

            request.onerror = () => {
                console.error('Error getting preference:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * Clear all data
     * @returns {Promise<void>}
     */
    async clearAll() {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['resumes', 'preferences'], 'readwrite');
            
            const resumesStore = transaction.objectStore('resumes');
            const preferencesStore = transaction.objectStore('preferences');
            
            const resumesClear = resumesStore.clear();
            const preferencesClear = preferencesStore.clear();

            transaction.oncomplete = () => {
                console.log('All data cleared');
                resolve();
            };

            transaction.onerror = () => {
                console.error('Error clearing data:', transaction.error);
                reject(transaction.error);
            };
        });
    }

    generateResumeName(resumeData) {
        const name = resumeData.personal?.fullName || 'Untitled';
        const type = resumeData.type || 'Resume';
        const date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return `${name}_${type}_${date}`;
    }

    generateId() {
        return `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
