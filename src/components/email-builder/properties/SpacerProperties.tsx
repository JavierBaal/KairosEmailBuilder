import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface SpacerBlockProps {
    height?: string;
}

interface SpacerPropertiesProps {
    props: SpacerBlockProps;
    onChange: (props: Partial<SpacerBlockProps>) => void;
}

export function SpacerProperties({ props, onChange }: SpacerPropertiesProps) {
    // Validar y parsear height de forma segura
    const heightStr = props.height || '20px';
    const heightMatch = heightStr.match(/^(\d+)px$/);
    const heightValue = heightMatch ? parseInt(heightMatch[1], 10) : 20;

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Height: {props.height || '20px'}</Label>
                <Slider
                    value={[isNaN(heightValue) ? 20 : heightValue]}
                    min={5}
                    max={100}
                    step={5}
                    onValueChange={(value) => onChange({ height: `${value[0]}px` })}
                />
            </div>
        </div>
    );
}
