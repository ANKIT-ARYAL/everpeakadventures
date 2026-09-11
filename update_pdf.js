const fs = require('fs');

const path = '/Users/ankitaryal/everpeakadventures/app/components/pdf/PdfDownloadButton.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Update html2canvas to include windowWidth: 794
code = code.replace(
  'useCORS: true,\n        logging: false,\n        onclone: (clonedDoc)',
  'useCORS: true,\n        logging: false,\n        windowWidth: 794,\n        onclone: (clonedDoc)'
);

// 2. Update jsPDF to split into multiple pages
const oldPdfGen = `      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, 'JPEG', 0, 0, canvas.width / 2, canvas.height / 2);`;

const newPdfGen = `      const pdf = new jsPDF('p', 'pt', 'a4');
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
      }`;

code = code.replace(oldPdfGen, newPdfGen);

fs.writeFileSync(path, code);
