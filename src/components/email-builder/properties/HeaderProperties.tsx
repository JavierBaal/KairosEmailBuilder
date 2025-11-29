import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { HeaderBlockProps } from '../types';

interface HeaderPropertiesProps {
    props: HeaderBlockProps;
    onChange: (props: Partial<HeaderBlockProps>) => void;
}

export function HeaderProperties({ props, onChange }: HeaderPropertiesProps) {
    const menuItems = props.menuItems || [];

    const handleAddMenuItem = () => {
        const newItems = [...menuItems, { label: '', url: '' }];
        onChange({ menuItems: newItems });
    };

    const handleRemoveMenuItem = (index: number) => {
        const newItems = menuItems.filter((_, i) => i !== index);
        onChange({ menuItems: newItems });
    };

    const handleMenuItemChange = (index: number, field: 'label' | 'url', value: string) => {
        const newItems = [...menuItems];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange({ menuItems: newItems });
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
                <Label>Logo URL</Label>
                <Input
                    value={props.logoUrl || ''}
                    onChange={(e) => onChange({ logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Logo Alt Text</Label>
                    <Input
                        value={props.logoAlt || 'Logo'}
                        onChange={(e) => onChange({ logoAlt: e.target.value })}
                        placeholder="Logo"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Logo Width</Label>
                    <Input
                        value={props.logoWidth || '150px'}
                        onChange={(e) => onChange({ logoWidth: e.target.value })}
                        placeholder="150px"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Logo Height</Label>
                <Input
                    value={props.logoHeight || 'auto'}
                    onChange={(e) => onChange({ logoHeight: e.target.value })}
                    placeholder="auto"
                />
            </div>

            <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                    <Label>Show Navigation Menu</Label>
                    <Switch
                        checked={props.showMenu || false}
                        onCheckedChange={(checked) => onChange({ showMenu: checked })}
                    />
                </div>

                {props.showMenu && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Menu Items</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddMenuItem}
                                className="h-8"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Item
                            </Button>
                        </div>
                        
                        {menuItems.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No menu items added yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {menuItems.map((item, index) => (
                                    <div key={index} className="border rounded-lg p-3 space-y-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-xs">Item {index + 1}</Label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveMenuItem(index)}
                                                className="h-6 w-6 p-0 text-destructive"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Label</Label>
                                                <Input
                                                    value={item.label}
                                                    onChange={(e) => handleMenuItemChange(index, 'label', e.target.value)}
                                                    placeholder="Home"
                                                    className="h-8"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">URL</Label>
                                                <Input
                                                    value={item.url}
                                                    onChange={(e) => handleMenuItemChange(index, 'url', e.target.value)}
                                                    placeholder="https://example.com"
                                                    className="h-8"
                                                />
                                                {item.url && !isValidUrl(item.url) && (
                                                    <p className="text-xs text-red-500">Invalid URL</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="pt-4 border-t space-y-4">
                <h3 className="text-sm font-semibold">Styling</h3>
                
                <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.backgroundColor || '#ffffff'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            value={props.backgroundColor || '#ffffff'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Alignment</Label>
                        <Select
                            value={props.align || 'left'}
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
        </div>
    );
}

