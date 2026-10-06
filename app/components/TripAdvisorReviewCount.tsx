import React from "react";

export default async function TripAdvisorReviewCount() {
  let count: string | null = null;

  try {
    const res = await fetch(
      "https://www.tripadvisor.com/WidgetEmbed-cdsratingsonlynarrow?locationId=34231219&lang=en_US",
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );
    if (res.ok) {
      const html = await res.text();
      const match = html.match(/([\d,]+)\s+reviews/i) || html.match(/([\d,]+)\s+review/i);
      if (match) {
        count = match[1];
      }
    }
  } catch (error) {
    console.error("Failed to fetch TripAdvisor review count:", error);
  }

  return <span>{count ? `${count} Reviews` : "Reviews"}</span>;
}
