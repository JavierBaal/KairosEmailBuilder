import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ColumnsBlockProps, EmailBlock } from '../types';
import { useEditorStore } from '../store/editor-store';

interface ColumnsPropertiesProps {
    props: ColumnsBlockProps;
    onChange: (props: Partial<ColumnsBlockProps>) => void;
    blockId: string;
}

export function ColumnsProperties({ props, onChange, blockId }: ColumnsPropertiesProps) {
    const { template } = useEditorStore();

    // Find the columns block to access its children
    const findBlock = (blocks: EmailBlock[], id: string): EmailBlock | null => {
        for (const block of blocks) {
            if (block.id === id) return block;
            if (block.children) {
                const found = findBlock(block.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const columnsBlock = findBlock(template.root.children, blockId);

    const handleColumnCountChange = (newCount: '2' | '3' | '4') => {
        const newColumnCount = parseInt(newCount, 10) as 2 | 3 | 4;
        
        // Update the column count
        onChange({ columnCount: newColumnCount });

        // If increasing columns, children will be redistributed automatically
        // If decreasing columns, we preserve all children (they'll be redistributed)
        // The ColumnsBlock component handles the redistribution logic
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Number of Columns</Label>
                <Select
                    value={String(props.columnCount || 2)}
                    onValueChange={(value) => handleColumnCountChange(value as '2' | '3' | '4')}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2">2 Columns</SelectItem>
                        <SelectItem value="3">3 Columns</SelectItem>
                        <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Gap Between Columns</Label>
                <Input
                    value={props.gap || '10px'}
                    onChange={(e) => onChange({ gap: e.target.value })}
                    placeholder="10px"
                />
                <p className="text-xs text-muted-foreground">
                    Space between columns (e.g., 10px, 20px)
                </p>
            </div>

            <div className="space-y-2">
                <Label>Padding</Label>
                <Input
                    value={props.padding || '10px'}
                    onChange={(e) => onChange({ padding: e.target.value })}
                    placeholder="10px"
                />
                <p className="text-xs text-muted-foreground">
                    Padding around the columns container
                </p>
            </div>

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

            {columnsBlock && columnsBlock.children && (
                <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                        Total blocks in columns: {columnsBlock.children.length}
                    </p>
                </div>
            )}
        </div>
    );
}

