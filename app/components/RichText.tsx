import React from 'react';

interface RichTextProps {
  html?: string | null;
  className?: string;
}

export default function RichText({ html, className }: RichTextProps) {
  if (!html) return null;
  return (
    <div
      className={`rich-text ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
