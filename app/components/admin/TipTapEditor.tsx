'use client';

import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import { Extension } from '@tiptap/core';
import MediaLibraryModal from './MediaLibraryModal';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Link2, Link2Off, Undo2, Redo2, RemoveFormatting, Quote, Code2,
  AlignLeft, AlignCenter, AlignRight, Minus, Image as AddMediaIcon,
} from 'lucide-react';

// --- Custom Font Size extension (uses TextStyle mark) ---
export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return { types: ['textStyle'] as string[] };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            renderHTML: (attributes: Record<string, any>) =>
              attributes.fontSize ? { style: `font-size: ${attributes.fontSize}` } : {},
            parseHTML: (element: HTMLElement) => element.style.fontSize || null,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: any) =>
          chain().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: any) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '42px', '48px'];

const emptySubscribe = () => () => {};

export default function TipTapEditor({ value, onChange, placeholder = '', minHeight = '120px' }: Props) {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [uploading, setUploading] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);

  const uploadAndInsert = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'image');
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
    return data.url as string;
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({ placeholder }),
      Image.extend({
        addOptions() {
          return { ...this.parent?.(), allowBase64: true };
        },
      }),
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose-admin',
      },
      handlePaste(view, event) {
        const hasImage = Array.from(event.clipboardData?.items || []).some((i) => i.type.startsWith('image/'));
        if (!hasImage) return false;
        for (const item of event.clipboardData?.items || []) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              event.preventDefault();
              setUploading(true);
              uploadAndInsert(file)
                .then((url) => editor.chain().focus().setImage({ src: url }).run())
                .catch(() => {})
                .finally(() => setUploading(false));
              return true;
            }
          }
        }
        return false;
      },
      handleDrop(_view, event) {
        const files = event.dataTransfer?.files;
        if (!files || files.length === 0 || !files[0].type.startsWith('image/')) return false;
        event.preventDefault();
        setUploading(true);
        uploadAndInsert(files[0])
          .then((url) => editor.chain().focus().setImage({ src: url }).run())
          .catch(() => {})
          .finally(() => setUploading(false));
        return true;
      },
    },
  });

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

  const handleMediaSelect = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    setMediaModalOpen(false);
  };

  const currentFontSize = (() => {
    const attr = editor?.getAttributes('textStyle').fontSize as string | undefined;
    return attr || '';
  })();

  const toolBtn = (active?: boolean) =>
    `p-1.5 rounded hover:bg-gray-100 transition-colors ${active ? 'text-[#24a0ed] bg-blue-50' : 'text-gray-600'}`;

  if (!mounted) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#24a0ed]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 flex-wrap bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        {/* Block styles */}
        <button type="button" className={toolBtn(editor?.isActive('paragraph'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().setParagraph().run()} title="Paragraph">
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('heading', { level: 1 }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('heading', { level: 2 }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('heading', { level: 3 }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Text formatting */}
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
        <button type="button" className={toolBtn(editor?.isActive('highlight'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleHighlight({ color: '#fde047' }).run()} title="Highlight">
          <span className="inline-block w-3.5 h-3.5 rounded-sm bg-yellow-300 border border-yellow-400" />
        </button>

        {/* Text color */}
        <label className="relative p-1.5 rounded hover:bg-gray-100 cursor-pointer" title="Text color">
          <span className="block text-[9px] font-bold text-gray-600 leading-none">A</span>
          <input type="color" value={editor ? (editor.getAttributes('textStyle').color as string) || '#1f2937' : '#1f2937'} onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()} className="w-3 h-1.5 absolute bottom-1 left-1.5 opacity-0 cursor-pointer" />
        </label>

        {/* Font size */}
        <div className="relative ml-1">
          <select
            value={currentFontSize}
            onChange={(e) => {
              const size = e.target.value;
              if (size) editor?.chain().focus().setFontSize(size).run();
              else editor?.chain().focus().unsetFontSize().run();
            }}
            className="text-xs px-1.5 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none"
            title="Font size"
          >
            <option value="">Size</option>
            {FONT_SIZES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Lists */}
        <button type="button" className={toolBtn(editor?.isActive('bulletList'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="Bullet List">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('orderedList'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="Numbered List">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('blockquote'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleBlockquote().run()} title="Quote">
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive('codeBlock'))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} title="Code Block">
          <Code2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Alignment */}
        <button type="button" className={toolBtn(editor?.isActive({ textAlign: 'left' }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().setTextAlign('left').run()} title="Align Left">
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive({ textAlign: 'center' }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().setTextAlign('center').run()} title="Align Center">
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn(editor?.isActive({ textAlign: 'right' }))} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().setTextAlign('right').run()} title="Align Right">
          <AlignRight className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Add Media from Library */}
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => setMediaModalOpen(true)} title="Add Media" disabled={uploading}>
          <AddMediaIcon className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Links */}
        <button type="button" className={toolBtn(editor?.isActive('link'))} onMouseDown={(e) => e.preventDefault()} onClick={setLink} title="Link">
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={toolBtn()} onMouseDown={(e) => e.preventDefault()} onClick={() => editor?.chain().focus().unsetLink().run()} title="Unlink">
          <Link2Off className="w-3.5 h-3.5" />
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
      <style>{`div:has(> .ProseMirror) .ProseMirror { min-height: ${minHeight}; padding: 0.75rem 0.875rem; font-size: 1rem; color: #1f2937; outline: none; } .ProseMirror p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #9ca3af; float: left; height: 0; pointer-events: none; } .ProseMirror img { max-width: 100%; height: auto; border-radius: 0.5rem; } .ProseMirror blockquote { border-left: 3px solid #24a0ed; padding-left: 0.75rem; color: #4b5563; margin: 0.5rem 0; } .ProseMirror pre { background: #112233; color: #f8fafc; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; }`}</style>
      <MediaLibraryModal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelect={handleMediaSelect}
        kind="image"
        insertLabel="editor"
      />
    </div>
  );
}
