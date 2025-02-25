/**
 * Preview component that displays the generated QR code
 */
import React from 'react';
import { Download, ChevronDown } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import Banner from './Banner';
import QRDisplay from './QRDisplay';

interface PreviewProps {
  qrRef: React.RefObject<HTMLDivElement>;
  borderWidth: number;
  borderStyle: string;
  borderColor: string;
  borderRadius: number;
  qrCode?: QRCodeStyling;
  bannerPosition: 'none' | 'top' | 'bottom';
  bannerText: string;
  bannerColor: string;
  bannerTextColor: string;
  bannerWidth: number;
  bannerFontSize: number;
  bannerFontFamily: string;
  bannerBold: boolean;
  bannerItalic: boolean;
}

type FileFormat = 'png' | 'jpeg' | 'webp';

export default function Preview({
  qrRef,
  borderWidth,
  borderStyle,
  borderColor,
  borderRadius,
  qrCode,
  bannerPosition,
  bannerText,
  bannerColor,
  bannerTextColor,
  bannerWidth,
  bannerFontSize,
  bannerFontFamily,
  bannerBold,
  bannerItalic
}: PreviewProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [showFormats, setShowFormats] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFormats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDownload = async (format: FileFormat = 'png') => {
    if (!containerRef.current || !qrCode) return;
    
    try {
      setDownloading(true);
      setShowFormats(false);

      // Use html2canvas to capture the entire container
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#FFFFFF',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true,
        allowTaint: true
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          `image/${format}`,
          1.0
        );
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${Date.now()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);
      if (error instanceof Error) {
        alert(`Failed to download QR code: ${error.message}`);
      } else {
        alert('Failed to download QR code. Please try again.');
      }
    } finally {
      setDownloading(false);
    }
  };
  return (
    <div className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Live Preview</h2>
      <div className="flex flex-col justify-center items-center min-h-[600px] mb-8 gap-4">
        <div 
          className="flex flex-col items-center gap-4 p-4 bg-white qr-preview-container"
          ref={containerRef}
          style={{ 
            maxWidth: '100%',
            minWidth: '300px',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            padding: '20px'
          }}
        >
          {bannerPosition === 'top' && (
            <Banner
              text={bannerText}
              color={bannerColor}
              textColor={bannerTextColor}
              width={bannerWidth}
              fontSize={bannerFontSize}
              fontFamily={bannerFontFamily}
              bold={bannerBold}
              italic={bannerItalic}
            />
          )}
          <QRDisplay
            qrRef={qrRef}
            borderWidth={borderWidth}
            borderStyle={borderStyle}
            borderColor={borderColor}
            borderRadius={borderRadius}
          />
          {bannerPosition === 'bottom' && (
            <Banner
              text={bannerText}
              color={bannerColor}
              textColor={bannerTextColor}
              width={bannerWidth}
              fontSize={bannerFontSize}
              fontFamily={bannerFontFamily}
              bold={bannerBold}
              italic={bannerItalic}
            />
          )}
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <div className="flex">
            <button
              onClick={() => handleDownload()}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-l-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Download size={20} />
              {downloading ? 'Downloading...' : 'Download PNG'}
            </button>
            <button
              onClick={() => setShowFormats(!showFormats)}
              className="flex items-center px-2 py-2 bg-indigo-700 text-white rounded-r-lg hover:bg-indigo-800 transition-colors border-l border-indigo-500"
            >
              <ChevronDown size={20} />
            </button>
          </div>
          
          {showFormats && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1">
                {(['jpeg', 'webp'] as FileFormat[]).map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format)}
                    disabled={downloading}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    Download {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}