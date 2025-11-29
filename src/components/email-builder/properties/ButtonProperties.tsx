import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ButtonPropertiesProps {
    props: Record<string, any>;
    onChange: (props: Record<string, any>) => void;
}

export function ButtonProperties({ props, onChange }: ButtonPropertiesProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                    value={props.text || 'Click Me'}
                    onChange={(e) => onChange({ text: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>URL</Label>
                <Input
                    value={props.url || '#'}
                    onChange={(e) => onChange({ url: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Background</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.backgroundColor || '#007bff'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            value={props.backgroundColor || '#007bff'}
                            onChange={(e) => onChange({ backgroundColor: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Text Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.color || '#ffffff'}
                            onChange={(e) => onChange({ color: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            value={props.color || '#ffffff'}
                            onChange={(e) => onChange({ color: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Width</Label>
                    <Select
                        value={props.width || 'auto'}
                        onValueChange={(value) => onChange({ width: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="auto">Auto</SelectItem>
                            <SelectItem value="full">Full Width</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Alignment</Label>
                    <Select
                        value={props.align || 'center'}
                        onValueChange={(value) => onChange({ align: value })}
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
            </div>

            <div className="space-y-2">
                <Label>Border Radius</Label>
                <Input
                    value={props.borderRadius || '4px'}
                    onChange={(e) => onChange({ borderRadius: e.target.value })}
                />
            </div>
        </div>
    );
}
