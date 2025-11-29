'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TemplatePreview } from './TemplatePreview';
import { SaveTemplateModal } from './SaveTemplateModal';
import { predefinedTemplates } from './predefined-templates';
import { loadTemplates, deleteTemplate, generateTemplateId, saveTemplate } from './template-storage';
import { SavedTemplate, EmailTemplate, TemplateStorageCallbacks } from '../types';
import { Trash2, FileText, Plus } from 'lucide-react';

interface TemplateSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectTemplate: (template: EmailTemplate) => void;
    currentTemplate: EmailTemplate;
    storageCallbacks?: TemplateStorageCallbacks;
}

export function TemplateSelector({
    open,
    onOpenChange,
    onSelectTemplate,
    currentTemplate,
    storageCallbacks
}: TemplateSelectorProps) {
    const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [saveModalOpen, setSaveModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Load saved templates when modal opens
    useEffect(() => {
        if (open) {
            loadSavedTemplates();
        }
    }, [open, storageCallbacks]);

    const loadSavedTemplates = async () => {
        setLoading(true);
        try {
            const templates = await loadTemplates(storageCallbacks);
            setSavedTemplates(templates);
        } catch (error) {
            console.error('Error loading templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTemplate = (template: EmailTemplate) => {
        onSelectTemplate(template);
        onOpenChange(false);
    };

    const handleDeleteTemplate = async (templateId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!confirm('Are you sure you want to delete this template?')) {
            return;
        }

        setDeletingId(templateId);
        try {
            await deleteTemplate(templateId, storageCallbacks);
            await loadSavedTemplates();
        } catch (error) {
            console.error('Error deleting template:', error);
            alert('Error deleting template');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSaveCurrentTemplate = async (name: string, description: string) => {
        const newTemplate: SavedTemplate = {
            id: generateTemplateId(),
            name,
            description,
            category: 'user',
            template: currentTemplate,
            createdAt: new Date().toISOString()
        };

        await saveTemplate(newTemplate, storageCallbacks);
        await loadSavedTemplates();
    };

    const hasContent = currentTemplate.root.children.length > 0;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select Template</DialogTitle>
                    <DialogDescription>
                        Choose a predefined template or one of your saved templates to get started.
                    </DialogDescription>
                </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Action buttons */}
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => handleSelectTemplate({
                                    version: '1.0',
                                    root: {
                                        backgroundColor: '#ffffff',
                                        fontFamily: 'Arial, sans-serif',
                                        children: []
                                    }
                                })}
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                New Blank Template
                            </Button>
                            {hasContent && (
                                <Button
                                    variant="default"
                                    onClick={() => setSaveModalOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Save Current Template
                                </Button>
                            )}
                        </div>

                        {/* Predefined Templates */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Predefined Templates</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {predefinedTemplates.map((template) => (
                                    <div
                                        key={template.id}
                                        className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer"
                                        onClick={() => handleSelectTemplate(template.template)}
                                    >
                                        <div className="mb-3">
                                            <TemplatePreview template={template.template} />
                                        </div>
                                        <h4 className="font-semibold text-sm mb-1">{template.name}</h4>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            {template.description}
                                        </p>
                                        <Button
                                            size="sm"
                                            className="w-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectTemplate(template.template);
                                            }}
                                        >
                                            Use Template
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* My Templates */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">My Templates</h3>
                            {loading ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    Loading templates...
                                </div>
                            ) : savedTemplates.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground border rounded-lg">
                                    <p>You don't have any saved templates yet.</p>
                                    <p className="text-sm mt-2">
                                        Create a design and save it as a template to reuse it.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {savedTemplates.map((template) => (
                                        <div
                                            key={template.id}
                                            className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer relative"
                                            onClick={() => handleSelectTemplate(template.template)}
                                        >
                                            <div className="mb-3">
                                                <TemplatePreview template={template.template} />
                                            </div>
                                            <h4 className="font-semibold text-sm mb-1">
                                                {template.name}
                                            </h4>
                                            {template.description && (
                                                <p className="text-xs text-muted-foreground mb-3">
                                                    {template.description}
                                                </p>
                                            )}
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSelectTemplate(template.template);
                                                    }}
                                                >
                                                    Use Template
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={(e) => handleDeleteTemplate(template.id, e)}
                                                    disabled={deletingId === template.id}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <SaveTemplateModal
                open={saveModalOpen}
                onOpenChange={setSaveModalOpen}
                template={currentTemplate}
                onSave={handleSaveCurrentTemplate}
                storageCallbacks={storageCallbacks}
            />
        </>
    );
}

