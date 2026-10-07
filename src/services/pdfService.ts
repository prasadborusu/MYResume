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

  let stagingContainer: HTMLDivElement | null = null;
  const originalScrollX = window.scrollX;
  const originalScrollY = window.scrollY;

  try {
    // 1. Ensure all custom web fonts are fully ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 2. Create an isolated staging container directly attached to document.body.
    // Critical: width MUST be physical A4 210mm.
    stagingContainer = document.createElement('div');
    stagingContainer.id = 'pdf-isolated-staging-root';
    stagingContainer.style.position = 'fixed';
    stagingContainer.style.left = '0';
    stagingContainer.style.top = '0';
    stagingContainer.style.width = '210mm';
    stagingContainer.style.minHeight = '297mm';
    stagingContainer.style.zIndex = '99999';
    stagingContainer.style.overflow = 'visible';
    stagingContainer.style.backgroundColor = '#ffffff';
    stagingContainer.style.transform = 'none';
    stagingContainer.style.margin = '0';
    stagingContainer.style.padding = '0';
    stagingContainer.style.boxSizing = 'border-box';
    stagingContainer.style.pointerEvents = 'none';

    // 3. Deep-clone the source resume element without any modifications to text or padding
    const clone = sourceElement.cloneNode(true) as HTMLElement;
    clone.id = 'pdf-isolated-staging-clone';
    clone.style.width = '210mm';
    clone.style.minHeight = '297mm';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.borderRadius = '0';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = '#ffffff';
    clone.style.overflow = 'visible';

    stagingContainer.appendChild(clone);
    document.body.appendChild(stagingContainer);

    // Wait for layout and font rendering
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Get exact rendered dimensions
    const rect = clone.getBoundingClientRect();
    const exactWidth = rect.width;
    const exactHeight = Math.max(rect.height, clone.scrollHeight, clone.offsetHeight);

    // Temporarily reset scroll to eliminate coordinate offsets in html2canvas
    window.scrollTo(0, 0);

    // 4. Capture at 300 DPI (scale: 3) preserving exact dimensions and aspect ratio
    const canvas = await html2canvas(clone, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: exactWidth,
      height: exactHeight,
      windowWidth: exactWidth,
      windowHeight: exactHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    // Restore scroll position
    window.scrollTo(originalScrollX, originalScrollY);

    // 5. Clean up staging container immediately
    if (stagingContainer && document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
      stagingContainer = null;
    }

    // Use lossless PNG for crystal clear rendering
    const imgData = canvas.toDataURL('image/png');

    // Standard physical A4 dimensions in millimeters
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

    // Render Page 1 edge-to-edge
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedImgHeight, undefined, 'FAST');

    // Multi-page handling: add subsequent page only if content overflows by > 3mm
    let remainingHeight = renderedImgHeight - pdfHeight;
    let pageNum = 1;

    while (remainingHeight > 3) {
      pdf.addPage('a4', 'portrait');
      const pageOffset = -(pageNum * pdfHeight);
      pdf.addImage(imgData, 'PNG', 0, pageOffset, pdfWidth, renderedImgHeight, undefined, 'FAST');
      remainingHeight -= pdfHeight;
      pageNum++;
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
  } finally {
    window.scrollTo(originalScrollX, originalScrollY);
    if (stagingContainer && document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
  }
}

export function printResume(): void {
  window.print();
}
