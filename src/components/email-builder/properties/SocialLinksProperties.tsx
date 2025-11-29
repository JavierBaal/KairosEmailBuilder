import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { SocialLinksBlockProps } from '../types';

interface SocialLinksPropertiesProps {
    props: SocialLinksBlockProps;
    onChange: (props: Partial<SocialLinksBlockProps>) => void;
}

export function SocialLinksProperties({ props, onChange }: SocialLinksPropertiesProps) {
    const links = props.links || [];

    const handleAddLink = () => {
        const newLinks = [...links, { platform: 'facebook' as const, url: '' }];
        onChange({ links: newLinks });
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = links.filter((_, i) => i !== index);
        onChange({ links: newLinks });
    };

    const handleLinkChange = (index: number, field: 'platform' | 'url' | 'iconUrl', value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        onChange({ links: newLinks });
    };

    // Validate URL
    const isValidUrl = (url: string): boolean => {
        try {
            const urlObj = new URL(url, window.location.href);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'mailto:';
        } catch {
            return false;
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label>Social Links</Label>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddLink}
                        className="h-8"
                    >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Link
                    </Button>
                </div>
                
                {links.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No social links added yet.</p>
                ) : (
                    <div className="space-y-3">
                        {links.map((link, index) => (
                            <div key={index} className="border rounded-lg p-3 space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-xs">Link {index + 1}</Label>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveLink(index)}
                                        className="h-6 w-6 p-0 text-destructive"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Platform</Label>
                                        <Select
                                            value={link.platform}
                                            onValueChange={(value) => handleLinkChange(index, 'platform', value)}
                                        >
                                            <SelectTrigger className="h-8">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="facebook">Facebook</SelectItem>
                                                <SelectItem value="x">X (Twitter)</SelectItem>
                                                <SelectItem value="instagram">Instagram</SelectItem>
                                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                                <SelectItem value="youtube">YouTube</SelectItem>
                                                <SelectItem value="custom">Custom</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <Label className="text-xs">URL</Label>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            placeholder="https://..."
                                            className="h-8"
                                        />
                                        {link.url && !isValidUrl(link.url) && (
                                            <p className="text-xs text-red-500">Invalid URL</p>
                                        )}
                                    </div>

                                    {link.platform === 'custom' && (
                                        <div className="space-y-1">
                                            <Label className="text-xs">Icon URL</Label>
                                            <Input
                                                value={link.iconUrl || ''}
                                                onChange={(e) => handleLinkChange(index, 'iconUrl', e.target.value)}
                                                placeholder="https://..."
                                                className="h-8"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Icon Size</Label>
                    <Input
                        value={props.iconSize || '24px'}
                        onChange={(e) => onChange({ iconSize: e.target.value })}
                        placeholder="24px"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Spacing</Label>
                    <Input
                        value={props.spacing || '12px'}
                        onChange={(e) => onChange({ spacing: e.target.value })}
                        placeholder="12px"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Icon Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        value={props.iconColor || '#333333'}
                        onChange={(e) => onChange({ iconColor: e.target.value })}
                        className="w-10 p-1 h-9"
                    />
                    <Input
                        value={props.iconColor || '#333333'}
                        onChange={(e) => onChange({ iconColor: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Alignment</Label>
                    <Select
                        value={props.align || 'center'}
                        onValueChange={(value) => onChange({ align: value as 'left' | 'center' | 'right' })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Padding</Label>
                    <Input
                        value={props.padding || '20px'}
                        onChange={(e) => onChange({ padding: e.target.value })}
                        placeholder="20px"
                    />
                </div>
            </div>
        </div>
    );
}

