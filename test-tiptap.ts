import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { Node, mergeAttributes } from '@tiptap/core';

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
          'data-images': JSON.stringify(attributes.images || []),
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-type="image-collage"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    let images: string[] = [];
    try {
      const dataImages = HTMLAttributes['data-images'];
      images = dataImages ? JSON.parse(dataImages as string) : [];
    } catch {
      images = [];
    }
    images = Array.isArray(images) ? images.slice(0, 4) : [];
    const count = images.length;
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'image-collage',
        class: 'image-collage',
      }),
      [
        'div',
        { class: `image-collage-grid image-collage-${count}` },
        ...images.map((src) => [
          'div',
          { class: 'image-collage-item' },
          ['img', { src, alt: 'Collage image' }],
        ]),
      ],
    ];
  },
});

const json = {
  type: 'doc',
  content: [
    {
      type: 'imageCollage',
      attrs: { images: ['a.jpg', 'b.jpg'] },
    }
  ]
};

console.log(generateHTML(json, [StarterKit, ImageCollage]));
