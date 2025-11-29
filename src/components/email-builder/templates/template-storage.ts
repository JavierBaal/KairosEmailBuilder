import { SavedTemplate } from '../types';
import type { TemplateStorageCallbacks } from '../types';

export type { TemplateStorageCallbacks };

const STORAGE_KEY = 'kairos-email-builder-templates';

/**
 * Generates a unique ID for a template
 */
export function generateTemplateId(): string {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Saves a template using external callbacks or localStorage as fallback
 */
export async function saveTemplate(
    template: SavedTemplate,
    callbacks?: TemplateStorageCallbacks
): Promise<void> {
    if (callbacks?.onSaveTemplate) {
        // Use external callback
        await callbacks.onSaveTemplate(template);
    } else {
        // Fallback to localStorage
        const saved = loadTemplatesFromStorage();
        const existingIndex = saved.findIndex(t => t.id === template.id);
        
        const templateToSave: SavedTemplate = {
            ...template,
            updatedAt: new Date().toISOString(),
            createdAt: existingIndex >= 0 ? saved[existingIndex].createdAt : new Date().toISOString()
        };

        if (existingIndex >= 0) {
            saved[existingIndex] = templateToSave;
        } else {
            saved.push(templateToSave);
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    }
}

/**
 * Loads all saved templates using external callbacks or localStorage
 */
export async function loadTemplates(
    callbacks?: TemplateStorageCallbacks
): Promise<SavedTemplate[]> {
    if (callbacks?.onLoadTemplates) {
        // Use external callback
        return await callbacks.onLoadTemplates();
    } else {
        // Fallback to localStorage
        return loadTemplatesFromStorage();
    }
}

/**
 * Deletes a template using external callbacks or localStorage
 */
export async function deleteTemplate(
    templateId: string,
    callbacks?: TemplateStorageCallbacks
): Promise<void> {
    if (callbacks?.onDeleteTemplate) {
        // Use external callback
        await callbacks.onDeleteTemplate(templateId);
    } else {
        // Fallback to localStorage
        const saved = loadTemplatesFromStorage();
        const filtered = saved.filter(t => t.id !== templateId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
}

/**
 * Loads templates from localStorage (internal helper function)
 */
function loadTemplatesFromStorage(): SavedTemplate[] {
    if (typeof window === 'undefined') {
        return [];
    }

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) {
            return [];
        }
        return JSON.parse(stored) as SavedTemplate[];
    } catch (error) {
        console.error('Error loading templates from localStorage:', error);
        return [];
    }
}

/**
 * Checks if a template name already exists
 */
export async function templateNameExists(
    name: string,
    excludeId?: string,
    callbacks?: TemplateStorageCallbacks
): Promise<boolean> {
    const templates = await loadTemplates(callbacks);
    return templates.some(
        t => t.name.toLowerCase() === name.toLowerCase() && t.id !== excludeId
    );
}

