'use client';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Search,
  Loader2,
  Film,
  UploadCloud,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

interface MedFile {
  url: string;
  kind: string;
  originalName?: string | null;
  size?: number | null;
  createdAt?: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string | string[]) => void;

  kind?: 'image' | 'video' | 'any';

  insertLabel?: string;

  /**
   * Allow selecting multiple files.
   * Used by the TipTap image collage feature.
   */
  multiSelect?: boolean;

  /**
   * Minimum number of files required before insertion.
   */
  minSelect?: number;

  /**
   * Maximum number of files that can be selected.
   */
  maxSelect?: number;
}

function formatSize(bytes?: number | null) {
  if (!bytes) return '';

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryModal({
  open,
  onClose,
  onSelect,
  kind = 'any',
  insertLabel = 'Insert',
  multiSelect = false,
  minSelect = 1,
  maxSelect = 1,
}: Props) {
  const [mounted, setMounted] = useState(false);

  const [tab, setTab] = useState<'library' | 'upload'>(
    'library'
  );

  const [files, setFiles] = useState<MedFile[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState('');

  const [filter, setFilter] = useState<
    'all' | 'image' | 'video'
  >('all');

  /**
   * Multiple selection is always stored as an array.
   * For normal image mode it simply contains zero or one item.
   */
  const [selectedFiles, setSelectedFiles] = useState<
    MedFile[]
  >([]);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [copied, setCopied] = useState(false);

  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  const selected =
    selectedFiles.length > 0
      ? selectedFiles[selectedFiles.length - 1]
      : null;

  /*
   * Mount portal only after client rendering.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Load media library.
   */
  const load = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/media', {
        cache: 'no-store',
      });

      const data = await response.json();

      if (Array.isArray(data?.files)) {
        setFiles(data.files);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error(
        'Failed to load media:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * Reset modal whenever it opens.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    setTab('library');
    setSelectedFiles([]);
    setQuery('');
    setFilter('all');
    setUploadError('');
    setCopied(false);
    setDragging(false);

    dragDepth.current = 0;

    load();
  }, [open]);

  /*
   * Escape key.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown
      );
    };
  }, [open, onClose]);

  /*
   * Determine whether a file is allowed.
   */
  const allowed = (file: MedFile) => {
    if (kind === 'image') {
      return file.kind === 'image';
    }

    if (kind === 'video') {
      return file.kind === 'video';
    }

    return true;
  };

  /*
   * Filter library files.
   */
  const filtered = files.filter((file) => {
    if (!allowed(file)) {
      return false;
    }

    if (
      filter !== 'all' &&
      file.kind !== filter
    ) {
      return false;
    }

    const search = query
      .trim()
      .toLowerCase();

    if (!search) {
      return true;
    }

    const name = (
      file.originalName || ''
    ).toLowerCase();

    const url = file.url.toLowerCase();

    return (
      name.includes(search) ||
      url.includes(search)
    );
  });

  /*
   * Check whether a file is currently selected.
   */
  const isFileSelected = (file: MedFile) =>
    selectedFiles.some(
      (selectedFile) =>
        selectedFile.url === file.url
    );

  /*
   * Select / deselect media.
   */
  const handleSelect = (
    file: MedFile,
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (!multiSelect) {
      setSelectedFiles([file]);
      return;
    }

    setSelectedFiles((current) => {
      const alreadySelected = current.some(
        (item) => item.url === file.url
      );

      /*
       * Clicking a selected item deselects it.
       */
      if (alreadySelected) {
        return current.filter(
          (item) => item.url !== file.url
        );
      }

      /*
       * Don't allow more than the maximum.
       */
      if (current.length >= maxSelect) {
        return current;
      }

      return [...current, file];
    });
  };

  /*
   * Insert selected media into the editor.
   */
  const insertSelected = (
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (
      selectedFiles.length < minSelect
    ) {
      return;
    }

    if (multiSelect) {
      onSelect(
        selectedFiles.map(
          (file) => file.url
        )
      );
    } else {
      const first = selectedFiles[0];

      if (!first) {
        return;
      }

      onSelect(first.url);
    }

    onClose();
  };

  /*
   * Double-click a file.
   *
   * In single-select mode:
   * immediately inserts it.
   *
   * In multi-select mode:
   * we don't immediately insert because the
   * user may still need to select more images.
   */
  const handleDoubleClick = (
    file: MedFile,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (multiSelect) {
      return;
    }

    onSelect(file.url);
    onClose();
  };

  /*
   * Upload files.
   */
  const uploadFiles = async (
    list: FileList | File[]
  ) => {
    const filesToUpload = Array.from(list);

    if (!filesToUpload.length) {
      return;
    }

    setUploading(true);
    setUploadError('');

    let uploaded = 0;

    for (const file of filesToUpload) {
      try {
        /*
         * Respect the selected uploader type.
         * When "any" is used, detect the file type.
         */
        let uploadType = 'image';

        if (
          kind === 'video' ||
          (kind === 'any' &&
            file.type.startsWith('video/'))
        ) {
          uploadType = 'video';
        }

        if (
          kind === 'image' &&
          !file.type.startsWith('image/')
        ) {
          throw new Error(
            'Please upload an image file.'
          );
        }

        if (
          kind === 'video' &&
          !file.type.startsWith('video/')
        ) {
          throw new Error(
            'Please upload a video file.'
          );
        }

        const formData = new FormData();

        formData.append('file', file);
        formData.append(
          'type',
          uploadType
        );

        const response = await fetch(
          '/api/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.error ||
              'Upload failed'
          );
        }

        uploaded++;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Upload failed';

        setUploadError(message);
      }
    }

    setUploading(false);

    if (uploaded > 0) {
      await load();
      setTab('library');
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  /*
   * Drag and drop.
   */
  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    dragDepth.current = 0;
    setDragging(false);

    uploadFiles(
      event.dataTransfer.files
    );
  };

  /*
   * Copy URL.
   */
  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        'Failed to copy URL:',
        error
      );
    }
  };

  /*
   * Close only when clicking the backdrop.
   */
  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  };

  if (!open || !mounted) {
    return null;
  }

  const canInsert =
    selectedFiles.length >= minSelect &&
    selectedFiles.length <= maxSelect;

  const selectionText = multiSelect
    ? `${selectedFiles.length} / ${maxSelect} selected`
    : selectedFiles.length === 1
      ? '1 selected'
      : 'No item selected';

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4"
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white rounded-2xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl px-5 lg:px-20"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        {/* HEADER */}

        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <div>
            <h3 className="font-black text-[#112233] uppercase tracking-wide">
              Add Media
            </h3>

            {multiSelect && (
              <p className="text-sm text-gray-500 mt-1">
                Select between{' '}
                {minSelect} and{' '}
                {maxSelect} images.
              </p>
            )}
          </div>

          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}

        <div className="px-5 py-2 border-b border-gray-200 flex items-center gap-1 shrink-0">
          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setTab('library');
            }}
            className={`px-4 py-1.5 rounded text-lg font-bold uppercase tracking-wide transition-colors ${
              tab === 'library'
                ? 'bg-[#24a0ed] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Media Library
          </button>

          <button
            type="button"
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setTab('upload');
            }}
            className={`px-4 py-1.5 rounded text-lg font-bold uppercase tracking-wide transition-colors ${
              tab === 'upload'
                ? 'bg-[#24a0ed] text-white'
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            Upload Files
          </button>
        </div>

        {/* CONTENT */}

        <div className="flex-1 min-h-0 flex flex-col md:flex-row">
          {/* MAIN PANEL */}

          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            {tab === 'library' ? (
              <>
                {/* SEARCH */}

                <div className="px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row gap-3 shrink-0">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />

                    <input
                      type="text"
                      value={query}
                      onChange={(event) => {
                        event.stopPropagation();
                        setQuery(
                          event.target.value
                        );
                      }}
                      onPointerDown={(event) => {
                        event.stopPropagation();
                      }}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                      placeholder="Search media..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#24a0ed] text-lg"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFilter('all')
                      }
                      className={`px-3 py-1.5 rounded text-lg font-bold transition-colors ${
                        filter === 'all'
                          ? 'bg-white text-[#112233] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFilter('image')
                      }
                      className={`px-3 py-1.5 rounded text-lg font-bold transition-colors ${
                        filter === 'image'
                          ? 'bg-white text-[#112233] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Images
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFilter('video')
                      }
                      className={`px-3 py-1.5 rounded text-lg font-bold transition-colors ${
                        filter === 'video'
                          ? 'bg-white text-[#112233] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Videos
                    </button>
                  </div>
                </div>

                {/* LIBRARY */}

                <div className="flex-1 overflow-y-auto p-5">
                  {loading ? (
                    <div className="flex items-center justify-center py-16 text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading media...
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      No files found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {filtered.map((file) => {
                        const isSelected =
                          isFileSelected(file);

                        const selectionIndex =
                          selectedFiles.findIndex(
                            (item) =>
                              item.url ===
                              file.url
                          );

                        return (
                          <div
                            key={file.url}
                            role="button"
                            tabIndex={0}
                            onPointerDown={(
                              event
                            ) => {
                              event.stopPropagation();
                            }}
                            onMouseDown={(
                              event
                            ) => {
                              event.stopPropagation();
                            }}
                            onClick={(
                              event
                            ) => {
                              handleSelect(
                                file,
                                event
                              );
                            }}
                            onDoubleClick={(
                              event
                            ) => {
                              handleDoubleClick(
                                file,
                                event
                              );
                            }}
                            onKeyDown={(
                              event
                            ) => {
                              if (
                                event.key ===
                                  'Enter' ||
                                event.key ===
                                  ' '
                              ) {
                                handleSelect(
                                  file,
                                  event
                                );
                              }
                            }}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all bg-gray-50 ${
                              isSelected
                                ? 'border-[#24a0ed] ring-2 ring-[#24a0ed]/30'
                                : 'border-transparent hover:border-gray-200'
                            }`}
                            title={
                              file.originalName ||
                              file.url
                            }
                          >
                            {file.kind ===
                            'video' ? (
                              <div className="w-full h-full bg-black flex items-center justify-center">
                                <video
                                  src={file.url}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                  muted
                                  playsInline
                                />

                                <Film className="absolute text-white/80 w-6 h-6" />
                              </div>
                            ) : (
                              <img
                                src={file.url}
                                alt={
                                  file.originalName ||
                                  'Media'
                                }
                                draggable={false}
                                className="w-full h-full object-cover select-none"
                              />
                            )}

                            {/* Selection badge */}

                            {isSelected && (
                              <span className="absolute top-2 right-2 min-w-5 h-5 px-1 rounded-full bg-[#24a0ed] text-white flex items-center justify-center text-[10px] font-black shadow">
                                {multiSelect
                                  ? selectionIndex +
                                    1
                                  : (
                                      <Check className="w-3 h-3" />
                                    )}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* UPLOAD */

              <div className="flex-1 overflow-y-auto p-6">
                <div
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                  onDragEnter={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    dragDepth.current += 1;
                    setDragging(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    dragDepth.current =
                      Math.max(
                        0,
                        dragDepth.current - 1
                      );

                    if (
                      dragDepth.current === 0
                    ) {
                      setDragging(false);
                    }
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                  }}
                  onDrop={handleDrop}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (!uploading) {
                      inputRef.current?.click();
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
                    dragging
                      ? 'border-[#24a0ed] bg-blue-50'
                      : 'border-gray-300 hover:border-[#24a0ed] hover:bg-blue-50/40'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-10 h-10 animate-spin text-[#24a0ed] mx-auto mb-3" />

                      <p className="font-bold text-gray-700">
                        Uploading files...
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-3" />

                      <p className="font-bold text-gray-700">
                        Drop files here to upload
                      </p>

                      <p className="text-gray-400 text-lg mt-1">
                        or click to browse your computer
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2">
                        {kind === 'video'
                          ? 'Videos up to 500 MB'
                          : kind === 'any'
                            ? 'Images or videos'
                            : 'Images up to 15 MB'}
                      </p>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="text-rose-600 text-lg font-bold mt-3">
                    {uploadError}
                  </p>
                )}

                <input
                  ref={inputRef}
                  type="file"
                  multiple
                  accept={
                    kind === 'video'
                      ? 'video/*'
                      : kind === 'image'
                        ? 'image/*'
                        : 'image/*,video/*'
                  }
                  onChange={(event) => {
                    const selectedFiles =
                      event.target.files;

                    if (selectedFiles) {
                      uploadFiles(
                        selectedFiles
                      );
                    }
                  }}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* DETAILS PANEL */}

          <div className="w-full md:w-80 shrink-0 border-t md:border-t-0 md:border-l border-gray-200 bg-gray-50 flex flex-col min-h-0">
            {selected ? (
              <>
                {/* PREVIEW */}

                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                    {selected.kind ===
                    'video' ? (
                      <video
                        src={selected.url}
                        controls
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <img
                        src={selected.url}
                        alt={
                          selected.originalName ||
                          'Selected media'
                        }
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                {/* DETAILS */}

                <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                  {multiSelect && (
                    <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                      <p className="text-sm font-bold text-[#24a0ed]">
                        {selectionText}
                      </p>
                    </div>
                  )}

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      File name
                    </span>

                    <p className="text-lg font-bold text-gray-800 break-all">
                      {selected.originalName ||
                        selected.url
                          .split('/')
                          .pop()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-md text-gray-500">
                    <span>
                      {selected.kind ===
                      'video'
                        ? 'Video'
                        : 'Image'}
                    </span>

                    {formatSize(
                      selected.size
                    ) && (
                      <span>
                        {formatSize(
                          selected.size
                        )}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      File URL
                    </span>

                    <div className="flex items-center gap-1.5">
                      <input
                        readOnly
                        value={selected.url}
                        className="w-full min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-md text-gray-600"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          copyUrl(
                            selected.url
                          )
                        }
                        className="shrink-0 p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-600"
                        title="Copy URL"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* INSERT */}

                <div className="p-4 border-t border-gray-200 bg-white">
                  <button
                    type="button"
                    onClick={insertSelected}
                    disabled={!canInsert}
                    className={`w-full font-bold py-2.5 rounded-lg text-lg transition-colors ${
                      canInsert
                        ? 'bg-[#24a0ed] hover:bg-[#1a85c6] text-white'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {multiSelect
                      ? `Insert ${selectedFiles.length} image${
                          selectedFiles.length ===
                          1
                            ? ''
                            : 's'
                        } into ${insertLabel}`
                      : `Insert into ${insertLabel}`}
                  </button>

                  {multiSelect &&
                    selectedFiles.length <
                      minSelect && (
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Select at least{' '}
                        {minSelect} images.
                      </p>
                    )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 p-6">
                <FileText className="w-8 h-8" />

                <p className="text-lg font-medium text-center">
                  {multiSelect
                    ? `Select ${minSelect} to ${maxSelect} images from the library`
                    : 'Select an item from the library'}
                  <br />
                  to see its details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(
    modal,
    document.body
  );
}