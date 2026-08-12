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
  onSelect: (url: string) => void;
  kind?: 'image' | 'video' | 'any';
  insertLabel?: string;
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

  const [selected, setSelected] =
    useState<MedFile | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const [copied, setCopied] = useState(false);

  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);

  /*
   * Mount portal only after the client has rendered.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Load media.
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
    setSelected(null);
    setQuery('');
    setFilter('all');
    setUploadError('');
    setCopied(false);
    setDragging(false);

    load();
  }, [open]);

  /*
   * Escape key.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
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

  if (!open || !mounted) {
    return null;
  }

  /*
   * Determine whether a file is allowed
   * for the current uploader.
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
   * Filter library.
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

    const search = query.trim().toLowerCase();

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
   * Upload files.
   */
  const uploadFiles = async (
    list: FileList | File[]
  ) => {
    const selectedFiles = Array.from(list);

    if (!selectedFiles.length) {
      return;
    }

    setUploading(true);
    setUploadError('');

    let uploaded = 0;

    for (const file of selectedFiles) {
      try {
        const formData = new FormData();

        formData.append('file', file);

        formData.append(
          'type',
          kind === 'video'
            ? 'video'
            : 'image'
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
   * Select media.
   *
   * IMPORTANT:
   * This does NOT close the modal.
   *
   * It only selects the media and shows
   * the details panel.
   */
  const handleSelect = (
    file: MedFile,
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    setSelected(file);
  };

  /*
   * Insert selected media.
   *
   * This is the ONLY place where selecting
   * media closes the library.
   */
  const insert = (
    file: MedFile,
    event?: React.SyntheticEvent
  ) => {
    event?.preventDefault();
    event?.stopPropagation();

    onSelect(file.url);
    onClose();
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
   * Close only when clicking the actual
   * dark backdrop.
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

  /*
   * The modal is rendered through a portal.
   *
   * The event isolation here is intentional.
   * Your editor/page underneath should NEVER
   * receive clicks from this modal.
   */
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
        className="relative bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
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
          <h3 className="font-black text-[#112233] uppercase tracking-wide">
            Add Media
          </h3>

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
            className={`px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wide transition-colors ${
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
            className={`px-4 py-1.5 rounded text-sm font-bold uppercase tracking-wide transition-colors ${
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
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#24a0ed] text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
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
                        setFilter('all');
                      }}
                      className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
                        filter === 'all'
                          ? 'bg-white text-[#112233] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All
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
                        setFilter('image');
                      }}
                      className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
                        filter === 'image'
                          ? 'bg-white text-[#112233] shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Images
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
                        setFilter('video');
                      }}
                      className={`px-3 py-1.5 rounded text-sm font-bold transition-colors ${
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
                          selected?.url ===
                          file.url;

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
                              event.preventDefault();
                              event.stopPropagation();

                              handleSelect(
                                file
                              );
                            }}
                            onDoubleClick={(
                              event
                            ) => {
                              event.preventDefault();
                              event.stopPropagation();

                              insert(file);
                            }}
                            onKeyDown={(
                              event
                            ) => {
                              event.stopPropagation();

                              if (
                                event.key ===
                                  'Enter' ||
                                event.key ===
                                  ' '
                              ) {
                                event.preventDefault();

                                handleSelect(
                                  file
                                );
                              }
                            }}
                            className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors bg-gray-50 ${
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

                            {isSelected && (
                              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#24a0ed] text-white flex items-center justify-center text-[10px] font-black">
                                <Check className="w-3 h-3" />
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

                      <p className="text-gray-400 text-sm mt-1">
                        or click to browse your computer
                      </p>

                      <p className="text-[11px] text-gray-400 mt-2">
                        {kind ===
                        'video'
                          ? 'Videos up to 500 MB'
                          : 'Images up to 15 MB'}
                      </p>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="text-rose-600 text-sm font-bold mt-3">
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
                  onPointerDown={(event) => {
                    event.stopPropagation();
                  }}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                  }}
                  onChange={(event) => {
                    event.stopPropagation();

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
                  <div className="min-w-0">
                    <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      File name
                    </span>

                    <p className="text-sm font-bold text-gray-800 break-all">
                      {selected.originalName ||
                        selected.url
                          .split('/')
                          .pop()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
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
                        className="w-full min-w-0 px-2.5 py-1.5 border border-gray-200 rounded-lg bg-white text-xs text-gray-600"
                      />

                      <button
                        type="button"
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
                          event.preventDefault();
                          event.stopPropagation();

                          copyUrl(
                            selected.url
                          );
                        }}
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
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();

                      insert(selected);
                    }}
                    className="w-full bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold py-2.5 rounded-lg text-sm"
                  >
                    Insert into{' '}
                    {insertLabel}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-gray-400 p-6">
                <FileText className="w-8 h-8" />

                <p className="text-sm font-medium text-center">
                  Select an item from the
                  library
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