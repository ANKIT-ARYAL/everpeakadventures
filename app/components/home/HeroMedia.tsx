"use client";

import { useEffect, useRef } from "react";
import { markVideoReady } from "@/app/lib/home-boot";

type MediaType = "youtube" | "video" | "image";

interface HeroMediaProps {
  mediaType: MediaType;
  // YouTube: the video id (the IFrame API builds the player, which lets us be
  // told reliably when playback actually starts).
  videoId?: string;
  // Uploaded file (video or image) web path, e.g. /uploads/videos/abc.mp4
  mediaUrl?: string;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        id: string,
        options: {
          videoId: string;
          playerVars?: Record<string, string | number | boolean>;
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
          };
        }
      ) => unknown;
      PlayerState?: { PLAYING: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Load the official YouTube IFrame Player API once, then resolve.
const loadYouTubeApi = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof window !== "undefined" && window.YT?.Player) return resolve();
    const prior = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prior?.();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.async = true;
    document.head.appendChild(tag);
  });

export default function HeroMedia({ mediaType, videoId, mediaUrl }: HeroMediaProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const imgLoaded = useRef(false);
  const videoPlayed = useRef(false);

  const afterPlay = () => {
    if (videoPlayed.current) return;
    videoPlayed.current = true;
    markVideoReady();
  };

  const afterImage = () => {
    if (imgLoaded.current) return;
    imgLoaded.current = true;
    markVideoReady();
  };

  // YouTube: build the player through the official API and fire markVideoReady
  // when the media is REALLY playing (state 1). This is the signal the loader
  // waits on, so the black screen only lifts once the video is actually running.
  useEffect(() => {
    if (mediaType !== "youtube" || !videoId || !hostRef.current) return;

    let disposed = false;
    loadYouTubeApi().then(() => {
      if (disposed || !hostRef.current) return;
      if (!hostRef.current.id) hostRef.current.id = "hero-yt-player";
      const YT = window.YT;
      if (!YT?.Player) return;
      playerRef.current = new YT.Player(hostRef.current.id, {
        videoId,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            try {
              playerRef.current?.playVideo?.();
            } catch {
              /* ignore */
            }
          },
          onStateChange: (event: { data: number }) => {
            if (event.data === 1) afterPlay();
          },
        },
      });
    });

    return () => {
      disposed = true;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
    };
  }, [mediaType, videoId]);

  useEffect(() => {
    // preconnect warm-up hints
    import("react-dom")
      .then((ReactDOM) => {
        ReactDOM.preconnect("https://www.youtube.com", { crossOrigin: "anonymous" });
        ReactDOM.preconnect("https://i.ytimg.com", { crossOrigin: "anonymous" });
      })
      .catch(() => {});
  }, []);

  if (mediaType === "youtube" && videoId) {
    return (
      <div
        ref={hostRef}
        className="
          absolute top-1/2 left-1/2
          w-[177.77vh] h-[56.25vw]
          min-h-screen min-w-full
          -translate-x-1/2 -translate-y-1/2
          pointer-events-none
        "
      />
    );
  }

  if (mediaType === "video" && mediaUrl) {
    return (
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        onPlaying={afterPlay}
      />
    );
  }

  if (mediaType === "image" && mediaUrl) {
    return (
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={mediaUrl}
        alt=""
        onLoad={afterImage}
      />
    );
  }

  return null;
}