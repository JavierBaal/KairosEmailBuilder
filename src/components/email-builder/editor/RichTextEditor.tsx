'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { Button } from '@/components/ui/button';
import { 
    Bold, 
    Italic, 
    Underline as UnderlineIcon, 
    Strikethrough,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Undo,
    Redo
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = 'Type here...' }: RichTextEditorProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            TextStyle,
            Color,
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline',
                },
            }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[150px] p-4',
                'data-placeholder': placeholder,
            },
        },
        immediatelyRender: false,
    });

    // Don't render until mounted to avoid SSR issues
    if (!mounted || !editor) {
        return (
            <div className="border rounded-md overflow-hidden">
                <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="bg-white min-h-[150px] p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="border rounded-md overflow-hidden">
            {/* Toolbar */}
            <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r pr-2 mr-2">
                    <Button
                        type="button"
                        variant={editor.isActive('bold') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className="h-8 w-8 p-0"
                    >
                        <Bold size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('italic') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="h-8 w-8 p-0"
                    >
                        <Italic size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('underline') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className="h-8 w-8 p-0"
                    >
                        <UnderlineIcon size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('strike') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className="h-8 w-8 p-0"
                    >
                        <Strikethrough size={16} />
                    </Button>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r pr-2 mr-2">
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading1 size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading2 size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className="h-8 w-8 p-0"
                    >
                        <Heading3 size={16} />
                    </Button>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r pr-2 mr-2">
                    <Button
                        type="button"
                        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="h-8 w-8 p-0"
                    >
                        <List size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className="h-8 w-8 p-0"
                    >
                        <ListOrdered size={16} />
                    </Button>
                </div>

                {/* Alignment */}
                <div className="flex gap-1 border-r pr-2 mr-2">
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignLeft size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignCenter size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className="h-8 w-8 p-0"
                    >
                        <AlignRight size={16} />
                    </Button>
                </div>

                {/* Link */}
                <div className="flex gap-1 border-r pr-2 mr-2">
                    <Button
                        type="button"
                        variant={editor.isActive('link') ? 'default' : 'ghost'}
                        size="sm"
                        onClick={setLink}
                        className="h-8 w-8 p-0"
                    >
                        <LinkIcon size={16} />
                    </Button>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        className="h-8 w-8 p-0"
                    >
                        <Undo size={16} />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        className="h-8 w-8 p-0"
                    >
                        <Redo size={16} />
                    </Button>
                </div>

                {/* Color Picker */}
                <div className="flex gap-1 border-l pl-2 ml-2">
                    <input
                        type="color"
                        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        className="h-8 w-8 cursor-pointer border rounded"
                        title="Text Color"
                    />
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-white min-h-[150px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

