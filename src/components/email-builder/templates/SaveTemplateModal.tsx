'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { EmailTemplate } from '../types';
import { generateTemplateId, templateNameExists, TemplateStorageCallbacks } from './template-storage';

interface SaveTemplateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    template: EmailTemplate;
    onSave: (name: string, description: string) => Promise<void>;
    storageCallbacks?: TemplateStorageCallbacks;
    existingTemplateId?: string; // If editing an existing template
}

export function SaveTemplateModal({
    open,
    onOpenChange,
    template,
    onSave,
    storageCallbacks,
    existingTemplateId
}: SaveTemplateModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [nameError, setNameError] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (open) {
            setName('');
            setDescription('');
            setNameError('');
        }
    }, [open]);

    const handleSave = async () => {
        // Validate name
        if (!name.trim()) {
            setNameError('Name is required');
            return;
        }

        // Check if name already exists
        const exists = await templateNameExists(name.trim(), existingTemplateId, storageCallbacks);
        if (exists) {
            setNameError('A template with this name already exists');
            return;
        }

        setIsSaving(true);
        setNameError('');

        try {
            await onSave(name.trim(), description.trim());
            onOpenChange(false);
        } catch (error) {
            console.error('Error saving template:', error);
            setNameError('Error saving template');
        } finally {
            setIsSaving(false);
        }
    };

    // Check if template is empty
    const isEmpty = template.root.children.length === 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {existingTemplateId ? 'Edit Template' : 'Save Template'}
                    </DialogTitle>
                    <DialogDescription>
                        {existingTemplateId
                            ? 'Update your template name and description.'
                            : 'Save your current design as a reusable template.'}
                    </DialogDescription>
                </DialogHeader>

                {isEmpty && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
                        <p className="text-sm text-yellow-800">
                            The template is empty. Add some blocks before saving.
                        </p>
                    </div>
                )}

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="template-name">
                            Template Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="template-name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameError('');
                            }}
                            placeholder="e.g., Monthly Newsletter"
                            disabled={isSaving || isEmpty}
                        />
                        {nameError && (
                            <p className="text-sm text-red-500">{nameError}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="template-description">Description (optional)</Label>
                        <Textarea
                            id="template-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what you'll use this template for..."
                            rows={3}
                            disabled={isSaving || isEmpty}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || isEmpty || !name.trim()}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

