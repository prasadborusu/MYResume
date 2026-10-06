import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExportOptions {
  fileName?: string;
  fullName?: string;
  elementId: string;
}

export async function exportResumeToPdf({ elementId, fileName, fullName }: PdfExportOptions): Promise<boolean> {
  const sourceElement = document.getElementById(elementId);
  if (!sourceElement) {
    console.error(`Element with id ${elementId} not found`);
    return false;
  }

  try {
    // Ensure all web fonts are loaded prior to capture
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Render high quality canvas with isolated unscaled clone
    const canvas = await html2canvas(sourceElement, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      scrollX: 0,
      scrollY: 0,
      onclone: (_clonedDoc, clonedElement) => {
        // Reset transform scale and layout from all parent elements in the clone
        let parent: HTMLElement | null = clonedElement;
        while (parent) {
          parent.style.transform = 'none';
          parent.style.webkitTransform = 'none';
          parent.style.zoom = '1';
          parent.style.filter = 'none';
          parent.style.margin = '0';
          parent.style.padding = '0';
          parent = parent.parentElement;
        }

        // Standardize the cloned resume container to exact A4 794px width
        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'static';
        clonedElement.style.width = '794px'; // Exact 210mm at 96 DPI
        clonedElement.style.maxWidth = '794px';
        clonedElement.style.minWidth = '794px';
        clonedElement.style.boxSizing = 'border-box';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.border = 'none';
        clonedElement.style.margin = '0';
        clonedElement.style.padding = '0';

        // Normalize text rendering to eliminate character overlap
        const allTextNodes = clonedElement.querySelectorAll<HTMLElement>('*');
        allTextNodes.forEach((el) => {
          el.style.letterSpacing = 'normal';
          el.style.wordSpacing = 'normal';
          el.style.fontVariantLigatures = 'none';
          el.style.fontFeatureSettings = 'normal';
          if (el.classList.contains('text-justify')) {
            el.style.textAlign = 'left';
          }
        });
      },
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.98);

    // Standard A4 dimensions in millimeters
    const pdfWidth = 210;
    const pdfHeight = 297;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const imgProps = pdf.getImageProperties(imgData);
    const renderedImgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = renderedImgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedImgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Multi-page handling if content exceeds 1 page
    while (heightLeft > 5) {
      position = heightLeft - renderedImgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderedImgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    // Clean filename
    const cleanName = (fullName || fileName || 'Resume')
      .trim()
      .replace(/[^a-zA-Z0-9_-]/g, '-');
    const finalFileName = `My-Resume-${cleanName}.pdf`;

    pdf.save(finalFileName);
    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  }
}

export function printResume(): void {
  window.print();
}
