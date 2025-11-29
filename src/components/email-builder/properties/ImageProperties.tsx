import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ImagePropertiesProps {
    props: Record<string, any>;
    onChange: (props: Record<string, any>) => void;
}

export function ImageProperties({ props, onChange }: ImagePropertiesProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                    value={props.src || ''}
                    onChange={(e) => onChange({ src: e.target.value })}
                    placeholder="https://..."
                />
            </div>

            <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                    value={props.alt || ''}
                    onChange={(e) => onChange({ alt: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Width</Label>
                    <Input
                        value={props.width || '100%'}
                        onChange={(e) => onChange({ width: e.target.value })}
                    />
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
                <Label>Padding</Label>
                <Input
                    value={props.padding || '10px'}
                    onChange={(e) => onChange({ padding: e.target.value })}
                />
            </div>
        </div>
    );
}
