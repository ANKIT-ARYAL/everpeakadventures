'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading2, Heading3,
  List, ListOrdered, Link2, Undo2, Redo2, RemoveFormatting,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function TipTapEditor({ value, onChange, placeholder = '', minHeight = '120px' }: Props) {
  const [mounted, setMounted] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter URL', prev || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const toolBtn = (active?: boolean) =>
    `p-1.5 rounded hover:bg-gray-100 transition-colors ${active ? 'text-[#24a0ed] bg-blue-50' : 'text-gray-600'}`;

  if (!mounted) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#24a0ed]">
      <div className="flex items-center gap-0.5 flex-wrap bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        <button type="button" className={toolBtn(editor?.isActive('bold'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBold().run()} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('italic'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleItalic().run()} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('underline'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="Underline">
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('strike'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleStrike().run()} title="Strikethrough">
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={toolBtn(editor?.isActive('heading', { level: 2 }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('heading', { level: 3 }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={toolBtn(editor?.isActive('bulletList'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('orderedList'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered List">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={toolBtn(editor?.isActive('link'))} onMouseDown={(e) => e.preventDefault()} onClick={setLink} title="Link">
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().undo().run()} title="Undo">
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().redo().run()} title="Redo">
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <EditorContent editor={editor} className="rte-content" />
      <style>{`div:has(> .ProseMirror) .ProseMirror { min-height: ${minHeight}; padding: 0.625rem 0.75rem; font-size: 0.875rem; color: #1f2937; outline: none; } .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; float: left; height: 0; pointer-events: none; }`}</style>
    </div>
  );
}