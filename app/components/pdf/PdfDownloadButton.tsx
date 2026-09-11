"use client";

import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";

export default function PdfDownloadButton({ pdfElementId, title }: { pdfElementId: string, title: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('trek-pdf-content');
      if (!element) throw new Error("PDF content not found");
      
      // Route all designated images through our proxy to completely bypass CORS blocks
      const proxyImages = element.querySelectorAll('img[data-proxy="true"]') as NodeListOf<HTMLImageElement>;
      const originalSrcs = new Map<HTMLImageElement, string>();
      
      for (const img of Array.from(proxyImages)) {
        if (img.src && !img.src.startsWith('data:') && !img.src.includes('/api/proxy-image')) {
          originalSrcs.set(img, img.src);
          // Rewrite the src to use our server-side proxy
          img.src = `/api/proxy-image?url=${encodeURIComponent(img.src)}`;
        }
      }
      
      // Wait just a tiny bit for the browser to start loading the proxied images
      if (proxyImages.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const { default: html2canvas } = await import('html2canvas-pro');
      const { jsPDF } = await import('jspdf');
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        windowWidth: 794,
        onclone: (clonedDoc) => {
          // Un-hide the wrapper in the cloned document so the content is visible
          const wrapper = clonedDoc.getElementById(pdfElementId);
          if (wrapper) {
            wrapper.style.position = "static";
            wrapper.style.left = "0";
            wrapper.style.top = "0";
            wrapper.style.opacity = "1";
            wrapper.style.display = "block";
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'pt', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let heightLeft = pdfHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      const finalFilename = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-itinerary.pdf`;
      pdf.save(finalFilename);
      
      // Restore original src if we changed them
      for (const [img, original] of Array.from(originalSrcs.entries())) {
        img.src = original;
      }
    } catch (error: any) {
      console.error("PDF generation failed:", error);
      alert(`Failed to generate PDF: ${error.message || "Unknown error"}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-white border border-[#24a0ed] text-[#24a0ed] shadow-sm font-bold text-sm uppercase tracking-wider py-4 rounded-xl text-center transition-all flex justify-center items-center gap-2 hover:bg-[#24a0ed] hover:text-white disabled:opacity-50"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      )}
      {isDownloading ? "Generating..." : "Download PDF"}
    </button>
  );
}
