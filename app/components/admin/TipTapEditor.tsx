'use client';

import React, {
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react';

import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';

import {
  Extension,
  Node,
  mergeAttributes,
} from '@tiptap/core';

import type {
  CommandProps,
  NodeViewProps,
} from '@tiptap/core';

import MediaLibraryModal from './MediaLibraryModal';

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
  Link2,
  Link2Off,
  Undo2,
  Redo2,
  RemoveFormatting,
  Quote,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Image as AddMediaIcon,
  Images,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*                             FONT SIZE EXTENSION                            */
/* -------------------------------------------------------------------------- */

export const FontSize = Extension.create({
  name: 'fontSize',

  addOptions() {
    return {
      types: ['textStyle'] as string[],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,

        attributes: {
          fontSize: {
            default: null,

            renderHTML: (
              attributes: Record<string, unknown>
            ) =>
              attributes.fontSize
                ? {
                    style: `font-size: ${attributes.fontSize}`,
                  }
                : {},

            parseHTML: (element: HTMLElement) =>
              element.style.fontSize || null,
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', {
              fontSize: size,
            })
            .run(),

      unsetFontSize:
        () =>
        ({ chain }: CommandProps) =>
          chain()
            .setMark('textStyle', {
              fontSize: null,
            })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

/* -------------------------------------------------------------------------- */
/*                         IMAGE COLLAGE NODE VIEW                            */
/* -------------------------------------------------------------------------- */

function ImageCollageNodeView({
  node,
}: NodeViewProps) {
  const images = Array.isArray(node.attrs.images)
    ? (node.attrs.images as string[])
    : [];

  if (!images.length) {
    return (
      <NodeViewWrapper
        className="image-collage"
        data-type="image-collage"
      >
        <div className="image-collage-empty">
          No images selected
        </div>
      </NodeViewWrapper>
    );
  }

  const count = Math.max(
    2,
    Math.min(images.length, 4)
  );

  return (
    <NodeViewWrapper
      className="image-collage"
      data-type="image-collage"
    >
      <div
        className={`image-collage-grid image-collage-${count}`}
      >
        {images.slice(0, 4).map((src, index) => (
          <div
            className="image-collage-item"
            key={`${src}-${index}`}
          >
            <img
              src={src}
              alt={`Collage image ${index + 1}`}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </NodeViewWrapper>
  );
}

/* -------------------------------------------------------------------------- */
/*                            IMAGE COLLAGE EXTENSION                         */
/* -------------------------------------------------------------------------- */

const ImageCollage = Node.create({
  name: 'imageCollage',

  group: 'block',

  atom: true,

  selectable: true,

  draggable: true,

  addAttributes() {
    return {
      images: {
        default: [],

        parseHTML: (element: HTMLElement) => {
          const value = element.getAttribute('data-images');

          try {
            const parsed = value ? JSON.parse(value) : [];

            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        },

        renderHTML: (attributes: { images?: string[] }) => ({
          'data-images': JSON.stringify(
            attributes.images || []
          ),
        }),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="image-collage"]',
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const images: string[] = Array.isArray(node.attrs.images)
      ? node.attrs.images.slice(0, 4)
      : [];

    const count = images.length;

    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'image-collage',
        class: 'image-collage',
      }),
      [
        'div',
        {
          class: `image-collage-grid image-collage-${count}`,
        },
        ...images.map((src) => [
          'div',
          {
            class: 'image-collage-item',
          },
          [
            'img',
            {
              src,
              alt: 'Collage image',
            },
          ],
        ]),
      ],
    ];
  },
});

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

type MediaMode = 'single' | 'collage';

const FONT_SIZES = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '42px',
  '48px',
];

const emptySubscribe = () => () => {};

/* -------------------------------------------------------------------------- */
/*                              TIPTAP EDITOR                                 */
/* -------------------------------------------------------------------------- */

export default function TipTapEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = '120px',
}: Props) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [uploading, setUploading] =
    useState(false);

  const [mediaModalOpen, setMediaModalOpen] =
    useState(false);

  const [mediaMode, setMediaMode] =
    useState<MediaMode>('single');

  /* ------------------------------------------------------------------------ */
  /*                              IMAGE UPLOAD                                */
  /* ------------------------------------------------------------------------ */

  const uploadAndInsert = async (
    file: File
  ): Promise<string> => {
    const fd = new FormData();

    fd.append('file', file);
    fd.append('type', 'image');

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: fd,
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(
        data.error || 'Upload failed'
      );
    }

    return data.url as string;
  };

  /* ------------------------------------------------------------------------ */
  /*                                  EDITOR                                  */
  /* ------------------------------------------------------------------------ */

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        link: false,
        underline: false,
      }),

      Underline,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Placeholder.configure({
        placeholder,
      }),

      Image.configure({
        allowBase64: true,
      }),

      TextStyle,

      FontSize,

      Color,

      Highlight.configure({
        multicolor: true,
      }),

      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: [
          'left',
          'center',
          'right',
          'justify',
        ],
      }),

      ImageCollage,
    ],

    content: value || '',

    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },

    editorProps: {
      attributes: {
        class: 'prose-admin',
      },

      handlePaste(_view, event) {
        const items = Array.from(
          event.clipboardData?.items || []
        );

        const imageItem = items.find((item) =>
          item.type.startsWith('image/')
        );

        if (!imageItem) {
          return false;
        }

        const file = imageItem.getAsFile();

        if (!file) {
          return false;
        }

        event.preventDefault();

        setUploading(true);

        uploadAndInsert(file)
          .then((url) => {
            editor
              ?.chain()
              .focus()
              .setImage({
                src: url,
              })
              .run();
          })
          .catch((error) => {
            console.error(
              'Failed to upload pasted image:',
              error
            );
          })
          .finally(() => {
            setUploading(false);
          });

        return true;
      },

      handleDrop(_view, event) {
        const files = event.dataTransfer?.files;

        if (
          !files ||
          files.length === 0
        ) {
          return false;
        }

        const imageFiles = Array.from(
          files
        ).filter((file) =>
          file.type.startsWith('image/')
        );

        if (!imageFiles.length) {
          return false;
        }

        event.preventDefault();

        setUploading(true);

        uploadAndInsert(imageFiles[0])
          .then((url) => {
            editor
              ?.chain()
              .focus()
              .setImage({
                src: url,
              })
              .run();
          })
          .catch((error) => {
            console.error(
              'Failed to upload dropped image:',
              error
            );
          })
          .finally(() => {
            setUploading(false);
          });

        return true;
      },
    },
  });

  /* ------------------------------------------------------------------------ */
  /*                              SYNC CONTENT                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      editor &&
      editor.getHTML() !== (value || '')
    ) {
      editor.commands.setContent(
        value || '',
        {
          emitUpdate: false,
        }
      );
    }
  }, [value, editor]);

  /* ------------------------------------------------------------------------ */
  /*                                   LINKS                                  */
  /* ------------------------------------------------------------------------ */

  const setLink = () => {
    if (!editor) {
      return;
    }

    const prev =
      editor.getAttributes('link')
        .href as string | undefined;

    const url = window.prompt(
      'Enter URL',
      prev || 'https://'
    );

    if (url === null) {
      return;
    }

    if (url === '') {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: url,
      })
      .run();
  };

  /* ------------------------------------------------------------------------ */
  /*                              MEDIA HANDLING                              */
  /* ------------------------------------------------------------------------ */

  const openSingleImageLibrary = () => {
    setMediaMode('single');
    setMediaModalOpen(true);
  };

  const openCollageLibrary = () => {
    setMediaMode('collage');
    setMediaModalOpen(true);
  };

  const handleMediaSelect = (
    selected: string | string[]
  ) => {
    if (!editor) {
      return;
    }

    const images = Array.isArray(selected)
      ? selected
      : [selected];

    if (mediaMode === 'collage') {
      const validImages = images
        .filter(
          (image): image is string =>
            typeof image === 'string' &&
            image.length > 0
        )
        .slice(0, 4);

      if (validImages.length < 2) {
        window.alert(
          'Please select at least 2 images for a collage.'
        );

        return;
      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: 'imageCollage',
          attrs: {
            images: validImages,
          },
        })
        .run();
    } else if (images[0]) {
      editor
        .chain()
        .focus()
        .setImage({
          src: images[0],
        })
        .run();
    }

    setMediaModalOpen(false);
    setMediaMode('single');
  };

  /* ------------------------------------------------------------------------ */
  /*                               FONT SIZE                                  */
  /* ------------------------------------------------------------------------ */

  const currentFontSize =
    ((editor?.getAttributes('textStyle')
      .fontSize as string | undefined) || '');

  const toolBtn = (active?: boolean) =>
    `p-1.5 rounded hover:bg-gray-100 transition-colors ${
      active
        ? 'text-[#24a0ed] bg-blue-50'
        : 'text-gray-600'
    }`;

  if (!mounted) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /*                                    JSX                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:border-[#24a0ed]">
      {/* =============================== TOOLBAR =============================== */}

      <div className="flex items-center gap-0.5 flex-wrap bg-gray-50 border-b border-gray-200 px-2 py-1.5">
        {/* Block styles */}

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('paragraph')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setParagraph()
              .run()
          }
          title="Paragraph"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('heading', {
              level: 1,
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
          title="Heading 1"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('heading', {
              level: 2,
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          title="Heading 2"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('heading', {
              level: 3,
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
          title="Heading 3"
        >
          <Heading3 className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Text formatting */}

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('bold')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleBold()
              .run()
          }
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('italic')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleItalic()
              .run()
          }
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('underline')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleUnderline()
              .run()
          }
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('strike')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleStrike()
              .run()
          }
          title="Strikethrough"
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('highlight')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHighlight({
                color: '#fde047',
              })
              .run()
          }
          title="Highlight"
        >
          <span className="inline-block w-3.5 h-3.5 rounded-sm bg-yellow-300 border border-yellow-400" />
        </button>

        {/* Text color */}

        <label
          className="relative p-1.5 rounded hover:bg-gray-100 cursor-pointer"
          title="Text color"
        >
          <span className="block text-[9px] font-bold text-gray-600 leading-none">
            A
          </span>

          <input
            type="color"
            value={
              editor
                ? (editor.getAttributes(
                    'textStyle'
                  ).color as string) ||
                  '#1f2937'
                : '#1f2937'
            }
            onChange={(event) =>
              editor
                ?.chain()
                .focus()
                .setColor(event.target.value)
                .run()
            }
            className="w-3 h-1.5 absolute bottom-1 left-1.5 opacity-0 cursor-pointer"
          />
        </label>

        {/* Font size */}

        <div className="relative ml-1">
          <select
            value={currentFontSize}
            onChange={(event) => {
              const size =
                event.target.value;

              if (size) {
                editor
                  ?.chain()
                  .focus()
                  .setFontSize(size)
                  .run();
              } else {
                editor
                  ?.chain()
                  .focus()
                  .unsetFontSize()
                  .run();
              }
            }}
            className="text-md px-1.5 py-1 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none"
            title="Font size"
          >
            <option value="">
              Size
            </option>

            {FONT_SIZES.map((size) => (
              <option
                key={size}
                value={size}
              >
                {size}
              </option>
            ))}
          </select>
        </div>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Lists */}

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('bulletList')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          title="Bullet List"
        >
          <List className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('orderedList')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          title="Numbered List"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('blockquote')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          title="Quote"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('codeBlock')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          title="Code Block"
        >
          <Code2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setHorizontalRule()
              .run()
          }
          title="Horizontal Rule"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Alignment */}

        <button
          type="button"
          className={toolBtn(
            editor?.isActive({
              textAlign: 'left',
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setTextAlign('left')
              .run()
          }
          title="Align Left"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive({
              textAlign: 'center',
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setTextAlign('center')
              .run()
          }
          title="Align Center"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive({
              textAlign: 'right',
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setTextAlign('right')
              .run()
          }
          title="Align Right"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn(
            editor?.isActive({
              textAlign: 'justify',
            })
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setTextAlign('justify')
              .run()
          }
          title="Justify Text"
        >
          <AlignJustify className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Single image */}

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={openSingleImageLibrary}
          title="Add Media"
          disabled={uploading}
        >
          <AddMediaIcon className="w-3.5 h-3.5" />
        </button>

        {/* Image collage */}

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={openCollageLibrary}
          title="Add Image Collage"
          disabled={uploading}
        >
          <Images className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Links */}

        <button
          type="button"
          className={toolBtn(
            editor?.isActive('link')
          )}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={setLink}
          title="Link"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .unsetLink()
              .run()
          }
          title="Unlink"
        >
          <Link2Off className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run()
          }
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-3.5 h-3.5" />
        </button>

        <span className="w-px h-4 bg-gray-300 mx-1" />

        {/* Undo / Redo */}

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .undo()
              .run()
          }
          title="Undo"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          className={toolBtn()}
          onMouseDown={(event) =>
            event.preventDefault()
          }
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .redo()
              .run()
          }
          title="Redo"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ============================ EDITOR CONTENT =========================== */}

      <EditorContent
        editor={editor}
        className="rte-content"
      />

      {/* ================================ STYLES =============================== */}

      <style>{`
        div:has(> .ProseMirror) .ProseMirror {
          min-height: ${minHeight};
          padding: 0.75rem 0.875rem;
          font-size: 1rem;
          color: #000000 !important;
          outline: none;
        }

        .ProseMirror * {
          color: #000000 !important;
        }

        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: #9ca3af !important;
          float: left;
          height: 0;
          pointer-events: none;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
        }

        .ProseMirror blockquote {
          border-left: 3px solid #24a0ed;
          padding-left: 0.75rem;
          color: #4b5563 !important;
          margin: 0.5rem 0;
        }

        .ProseMirror pre,
        .ProseMirror pre * {
          background: #112233 !important;
          color: #f8fafc !important;
        }

        .ProseMirror pre {
          padding: 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
        }

        /* ========================== IMAGE COLLAGE ========================== */

        .ProseMirror .image-collage {
          display: block;
          width: 100%;
          margin: 1rem 0;
          cursor: pointer;
        }

        .ProseMirror .image-collage-grid {
          display: grid;
          gap: 0.5rem;
          width: 100%;
          overflow: hidden;
          border-radius: 0.75rem;
        }

        .ProseMirror .image-collage-2 {
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
        }

        .ProseMirror .image-collage-3 {
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
        }

        .ProseMirror .image-collage-4 {
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
        }

        .ProseMirror .image-collage-item {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 0.5rem;
          background: #f3f4f6;
        }

        .ProseMirror .image-collage-item img {
          width: 100%;
          height: 100%;
          max-width: none;
          object-fit: cover;
          display: block;
          border-radius: 0;
          pointer-events: none;
        }

        .ProseMirror .image-collage-empty {
          padding: 2rem;
          text-align: center;
          color: #6b7280 !important;
          border: 2px dashed #d1d5db;
          border-radius: 0.75rem;
        }

        .ProseMirror
          .ProseMirror-selectednode.image-collage {
          outline: 2px solid #24a0ed;
          outline-offset: 3px;
          border-radius: 0.75rem;
        }

        @media (max-width: 640px) {
          .ProseMirror .image-collage-3 {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }
      `}</style>

      {/* ============================ MEDIA LIBRARY ============================ */}

      <MediaLibraryModal
        open={mediaModalOpen}
        onClose={() => {
          setMediaModalOpen(false);
          setMediaMode('single');
        }}
        onSelect={handleMediaSelect}
        kind="image"
        insertLabel={
          mediaMode === 'collage'
            ? 'collage'
            : 'editor'
        }
        multiSelect={
          mediaMode === 'collage'
        }
        minSelect={
          mediaMode === 'collage' ? 2 : 1
        }
        maxSelect={
          mediaMode === 'collage' ? 4 : 1
        }
      />
    </div>
  );
}