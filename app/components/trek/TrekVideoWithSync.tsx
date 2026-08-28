'use client';

import React from 'react';
import { Reveal } from '@/app/components/animations/Motion';
import VideoSyncedElevationProfile, { ElevationPoint } from '@/app/components/trek/VideoSyncedElevationProfile';

interface TrekVideoWithSyncProps {
  videoUrl: string;
  videoType: 'youtube' | 'upload';
  title: string;
  elevationData: ElevationPoint[];
  embedded?: boolean;
}

export default function TrekVideoWithSync({ videoUrl, videoType, title, elevationData, embedded = false }: TrekVideoWithSyncProps) {
  return (
    <>
      <section className={embedded ? "scroll-mt-[118px]" : "site-container mt-10"}>
        <Reveal className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-lg md:text-xl font-bold oswald uppercase text-[#112233] border-b pb-3 mb-6">
            Trek Video
          </h2>

          {videoType === 'youtube' ? (
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-100 bg-black">
              <iframe
                src={videoUrl
                  .replace('watch?v=', 'embed/')
                  .replace('youtu.be/', 'youtube.com/embed/')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={`${title} video`}
              />
            </div>
          ) : (
            <video
              src={videoUrl}
              controls
              className="w-full aspect-video rounded-xl border border-gray-100 bg-black object-contain"
            />
          )}

          {elevationData.length > 0 && (
            <div className="mt-8">
              <VideoSyncedElevationProfile
                elevationData={elevationData}
                chartTitle={title}
              />
            </div>
          )}
        </Reveal>
      </section>
    </>
  );
}
