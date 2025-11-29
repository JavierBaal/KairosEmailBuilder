import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextPropertiesProps {
    props: Record<string, any>;
    onChange: (props: Record<string, any>) => void;
}

export function TextProperties({ props, onChange }: TextPropertiesProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Content</Label>
                <Textarea
                    value={props.text || ''}
                    onChange={(e) => onChange({ text: e.target.value })}
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label>Alignment</Label>
                <Select
                    value={props.align || 'left'}
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

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Color</Label>
                    <div className="flex gap-2">
                        <Input
                            type="color"
                            value={props.color || '#000000'}
                            onChange={(e) => onChange({ color: e.target.value })}
                            className="w-10 p-1 h-9"
                        />
                        <Input
                            type="text"
                            value={props.color || '#000000'}
                            onChange={(e) => onChange({ color: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Font Size</Label>
                    <Input
                        value={props.fontSize || '16px'}
                        onChange={(e) => onChange({ fontSize: e.target.value })}
                    />
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
