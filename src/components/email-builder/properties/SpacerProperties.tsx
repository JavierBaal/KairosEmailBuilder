import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

interface SpacerPropertiesProps {
    props: Record<string, any>;
    onChange: (props: Record<string, any>) => void;
}

export function SpacerProperties({ props, onChange }: SpacerPropertiesProps) {
    const heightValue = parseInt((props.height || '20px').replace('px', ''), 10);

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
