import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DividerPropertiesProps {
    props: Record<string, any>;
    onChange: (props: Record<string, any>) => void;
}

export function DividerProperties({ props, onChange }: DividerPropertiesProps) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                    <Input
                        type="color"
                        value={props.color || '#cccccc'}
                        onChange={(e) => onChange({ color: e.target.value })}
                        className="w-10 p-1 h-9"
                    />
                    <Input
                        value={props.color || '#cccccc'}
                        onChange={(e) => onChange({ color: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input
                    value={props.height || '1px'}
                    onChange={(e) => onChange({ height: e.target.value })}
                />
            </div>

            <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                    value={props.padding || '10px 0'}
                    onChange={(e) => onChange({ padding: e.target.value })}
                />
            </div>
        </div>
    );
}
