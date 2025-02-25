/**
 * LogoUploader component for handling logo upload and size adjustment
 */
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { QROptions } from '../../../../types/qr';
import { storage, auth } from '../../../../lib/firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { extractDominantColors } from '../../../../utils/colorExtractor';
import { hexToRgb, lightenColor } from '../../../../utils/colorUtils';
import LogoAuthModal from './LogoAuthModal';
import { onAuthStateChanged } from 'firebase/auth';

interface LogoUploaderProps {
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  setBorderColor: (color: string) => void;
  setBannerColor?: (color: string) => void;
  setBannerTextColor?: (color: string) => void;
  options: QROptions;
  setOptions: (options: QROptions | ((prev: QROptions) => QROptions)) => void;
}

export default function LogoUploader({
  logoUrl,
  setLogoUrl,
  setBorderColor,
  setBannerColor,
  setBannerTextColor,
  options,
  setOptions
}: LogoUploaderProps) {
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        setShowAuthModal(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate a unique filename
      const timestamp = Date.now();
      const uniqueId = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const uniqueFilename = `${timestamp}-${uniqueId}.${extension}`;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          // Upload to Firebase Storage
          const logoRef = ref(storage, `logos/${auth.currentUser.uid}/${uniqueFilename}`);
          await uploadString(logoRef, dataUrl, 'data_url');
          
          // Get the download URL
          const downloadUrl = await getDownloadURL(logoRef);
          setLogoUrl(downloadUrl);

          // Extract and process colors
          const dominantColors = await extractDominantColors(dataUrl, 3);
          
          if (dominantColors.length > 0) {
            // Filter out white or very light colors
            const nonWhiteColors = dominantColors.filter(color => {
              const { r, g, b } = hexToRgb(color);
              return (r + g + b) / 3 < 240; // Threshold for considering a color too light
            });

            if (nonWhiteColors.length === 0) {
              // If all colors are too light, use black for dots
              nonWhiteColors.push('#000000');
            }

            // Sort colors by darkness (for dots)
            const sortedColors = nonWhiteColors.sort((a, b) => {
              const { r: r1, g: g1, b: b1 } = hexToRgb(a);
              const { r: r2, g: g2, b: b2 } = hexToRgb(b);
              return (r1 + g1 + b1) - (r2 + g2 + b2);
            });

            // Get contrasting color for corner dots
            const mainColor = sortedColors[0];
            const { r, g, b } = hexToRgb(mainColor);
            const cornerColor = sortedColors[1] || 
              ((r + g + b) / 3 < 128 ? '#4338CA' : '#DC2626');
            
            // Set border color to match the main color from the logo
            setBorderColor(mainColor);

            // Set banner colors based on the logo colors if the setters are provided
            if (setBannerColor) {
              setBannerColor(mainColor);
            }
            if (setBannerTextColor) {
              setBannerTextColor((r + g + b) / 3 < 128 ? '#FFFFFF' : '#000000');
            }

            // Generate a very light background color from the main color
            const backgroundColor = lightenColor(mainColor, 0.95);

            // Update color presets with logo colors
            window.dispatchEvent(new CustomEvent('updateColorPresets', {
              detail: {
                dotColors: sortedColors,
                backgroundColors: [backgroundColor, '#FFFFFF']
              }
            }));

            // Set initial colors
            setOptions(prev => ({
              ...prev,
              dotsOptions: {
                ...prev.dotsOptions,
                color: mainColor
              },
              cornersDotOptions: {
                ...prev.cornersDotOptions,
                color: cornerColor
              },
              backgroundOptions: {
                ...prev.backgroundOptions,
                color: '#FFFFFF'
              }
            }));
          }
        } catch (error) {
          console.error('Failed to extract colors:', error);
          alert('Failed to process logo. Please try again.');
        }
      };
      
      reader.onerror = () => {
        console.error('Error reading file');
        alert('Failed to read logo file. Please try again.');
      };

      try {
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error starting file read:', error);
        alert('Failed to process logo file. Please try again.');
      }
    }
  };

  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Logo Settings
      </label>
      <div className="space-y-4 relative">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              <ImageIcon size={20} />
              Upload PNG Logo
              <input
                type="file"
                accept="image/png"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
            {logoUrl && (
              <button
                onClick={() => setLogoUrl('')}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ImageIcon size={20} />
            Sign in to Upload Logo
          </button>
        )}
        {logoUrl && (
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600 min-w-[80px]">Logo Size:</label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={options.imageOptions.imageSize}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                imageOptions: {
                  ...prev.imageOptions,
                  imageSize: Number(e.target.value)
                }
              }))}
              className="flex-1"
            />
            <span className="text-sm text-gray-600 min-w-[60px]">
              {Math.round(options.imageOptions.imageSize * 100)}%
            </span>
          </div>
        )}
        {logoUrl && (
          <p className="text-xs text-gray-500">
            Adjust the logo size between 10% and 50% of the QR code
          </p>
        )}
        <LogoAuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  );
}