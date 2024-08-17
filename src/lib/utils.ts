import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import html2canvas from "html2canvas";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
export function getCurrentDayOfYear(): number {
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day;
}


export const downloadImage = async () => {
    const preview = document.getElementById('FiveYearChart');
    if (!preview) return;

    // Ensure all images within the preview element are fully loaded
    const images = Array.from(preview.getElementsByTagName('img'));
    await Promise.all(images.map(img => new Promise<void>((resolve, reject) => {
        if (img.complete) {
            resolve();
        } else {
            img.onload = () => resolve();
            img.onerror = () => reject();
        }
        // Set crossOrigin attribute if needed
        if (!img.crossOrigin) {
            img.crossOrigin = 'anonymous';
        }
    })));

    // Capture the canvas and download the image
    html2canvas(preview, { useCORS: true }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'pastelog.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
    });
};