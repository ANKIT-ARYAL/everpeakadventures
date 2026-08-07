'use client';

import React, { useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered, Heading1, Link2, RemoveFormatting,
} from 'lucide-react';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = '', minHeight = '120px' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const lastHtml = useRef(value);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value;
    }
  }, [value]);

  const exec = (cmd: string, arg?: string) => {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    emit();
  };

  const emit = () => {
    if (ref.current) {
      lastHtml.current = ref.current.innerHTML;
      onChange(ref.current.innerHTML);
    }
  };

  const createLink = () => {
    const url = window.prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  const btn = 'p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#24a0ed]">
      <div className="flex items-center gap-0.5 flex-wrap bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('bold')} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('italic')} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('underline')} title="Underline">
          <Underline className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('formatBlock', 'H3')} title="Heading">
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertUnorderedList')} title="Bullet List">
          <List className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('insertOrderedList')} title="Numbered List">
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <span className="w-px h-4 bg-gray-300 mx-1" />
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={createLink} title="Link">
          <Link2 className="w-3.5 h-3.5" />
        </button>
        <button type="button" className={btn} onMouseDown={(e) => e.preventDefault()} onClick={() => exec('removeFormat')} title="Clear Formatting">
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        ref={ref}
        contentEditable
        className="px-3 py-2.5 text-sm text-gray-800 outline-none min-h-[var(--rte-min)]"
        style={{ ['--rte-min' as any]: minHeight }}
        data-placeholder={placeholder}
        onInput={emit}
        onBlur={emit}
      />
    </div>
  );
}