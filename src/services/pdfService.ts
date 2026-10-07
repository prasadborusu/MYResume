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

  try {
    // 1. Ensure all custom web fonts are fully ready
    if (document.fonts) {
      await document.fonts.ready;
    }

    // 2. Create an isolated staging container directly attached to document.body.
    // Critical: width MUST be exactly 794px (standard 210mm at 96 DPI).
    // Staging container is placed on top of everything (z-index 99999) during capture
    // so html2canvas renders it without any stacking-context or dark background interference.
    stagingContainer = document.createElement('div');
    stagingContainer.id = 'pdf-isolated-staging-root';
    stagingContainer.style.position = 'fixed';
    stagingContainer.style.left = '0';
    stagingContainer.style.top = '0';
    stagingContainer.style.width = '794px';
    stagingContainer.style.zIndex = '99999';
    stagingContainer.style.overflow = 'visible';
    stagingContainer.style.backgroundColor = '#ffffff';
    stagingContainer.style.transform = 'none';
    stagingContainer.style.margin = '0';
    stagingContainer.style.padding = '0';

    // 3. Deep-clone the source resume element
    const clone = sourceElement.cloneNode(true) as HTMLElement;
    clone.id = 'pdf-isolated-staging-clone';
    clone.style.width = '794px';
    clone.style.minWidth = '794px';
    clone.style.maxWidth = '794px';
    clone.style.transform = 'none';
    clone.style.margin = '0';
    clone.style.padding = '0';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.borderRadius = '0';
    clone.style.boxSizing = 'border-box';
    clone.style.backgroundColor = '#ffffff';
    clone.style.overflow = 'visible';

    // Normalize text rendering & disable ligatures to avoid font rendering glitches
    const allTextNodes = clone.querySelectorAll<HTMLElement>('*');
    allTextNodes.forEach((el) => {
      el.style.letterSpacing = 'normal';
      el.style.wordSpacing = 'normal';
      el.style.fontVariantLigatures = 'none';
      el.style.fontFeatureSettings = 'normal';
      if (el.classList.contains('text-justify')) {
        el.style.textAlign = 'left';
      }
    });

    stagingContainer.appendChild(clone);
    document.body.appendChild(stagingContainer);

    // Wait 80ms for complete DOM paint and font layout recalculation
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Calculate actual rendered content height
    const elementHeight = Math.max(clone.scrollHeight, clone.offsetHeight, 1123);

    // 4. Capture at 1:1 windowWidth to prevent downscaling / margins bug
    // scale: 3 gives true 300 DPI print quality (2382 x 3369 px)
    const canvas = await html2canvas(clone, {
      scale: 3, // Ultra-sharp 300 DPI print quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794, // MUST MATCH width (794px) to guarantee 1.0x scale (NO SHRINKAGE)
      height: elementHeight,
      windowHeight: elementHeight,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    });

    // 5. Clean up staging container immediately
    if (stagingContainer && document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
      stagingContainer = null;
    }

    // Use lossless PNG for crystal clear text (NO JPEG compression fuzziness)
    const imgData = canvas.toDataURL('image/png');

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

    // Render Page 1 edge-to-edge
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, renderedImgHeight, undefined, 'FAST');

    // Multi-page handling: only add subsequent page if remaining overflow is > 8mm
    let remainingHeight = renderedImgHeight - pdfHeight;
    let pageNum = 1;

    while (remainingHeight > 8) {
      pdf.addPage();
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
    if (stagingContainer && document.body.contains(stagingContainer)) {
      document.body.removeChild(stagingContainer);
    }
  }
}

export function printResume(): void {
  window.print();
}
