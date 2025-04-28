import { jsPDF } from 'jspdf';
import { marked } from 'marked';
import TurndownService from 'turndown';
async function convertSvgToBase64(svgElement: SVGSVGElement): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const data = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.src =
      'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(data)));
  });
}

export async function generatePdf(
  content: string,
  isMarkdown: boolean = false
): Promise<void> {
  let htmlContent = isMarkdown ? await marked(content) : content;

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  document.body.appendChild(tempDiv);

  const svgElements = tempDiv.querySelectorAll('svg');
  for (const svg of Array.from(svgElements)) {
    try {
      const base64 = await convertSvgToBase64(svg as SVGSVGElement);
      const img = document.createElement('img');
      img.src = base64;
      img.style.maxWidth = '100%';
      svg.parentNode?.replaceChild(img, svg);
    } catch (error) {
      console.warn('Échec de la conversion SVG:', error);
      svg.remove();
    }
  }

  const styledContent = `
    <div style="
      color: black !important;
      background: white !important;
      font-family: Arial, sans-serif !important;
      padding: 15mm;
      line-height: 1.5;
    ">
      ${tempDiv.innerHTML}
    </div>
  `;

  tempDiv.innerHTML = styledContent;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      hotfixes: ['px_scaling'],
    });

    await doc.html(tempDiv, {
      callback: (pdf) => {
        pdf.save('document.pdf');
      },
      margin: [0, 0, 15, 0],
      width: 220,
      windowWidth: 824,
      x: 0,
      y: 15,
      fontFaces: [
        {
          family: 'Arial',
          style: 'normal',
          weight: 'normal',
          src: [
            {
              url: '',
              format: 'truetype',
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    throw new Error('Échec de la génération du PDF');
  } finally {
    document.body.removeChild(tempDiv);
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}

const turndownService = new TurndownService();

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}
