import html2canvas from 'html2canvas';

export async function exportToImage(elementId, fileName) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Element not found');
  }

  try {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = image;
    link.click();
  } catch (error) {
    console.error('Error exporting to image:', error);
    throw error;
  }
}