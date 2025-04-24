/**
 * Preview component that displays the generated QR code
 */
import React from 'react';
import { Download, ChevronDown, Eye, X } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import html2canvas from 'html2canvas';
import Banner from './Banner';
import QRDisplay from './QRDisplay';

// Simple debounce function to prevent too many updates
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(this, args);
    }, wait);
  };
}

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
  const previewSectionRef = React.useRef<HTMLDivElement>(null);
  const miniQrRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [showFormats, setShowFormats] = React.useState(false);
  const [showFloatingButton, setShowFloatingButton] = React.useState(false);
  const [showMiniPreview, setShowMiniPreview] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const miniPreviewRef = React.useRef<HTMLDivElement>(null);
  const [miniQrCode, setMiniQrCode] = React.useState<QRCodeStyling | null>(null);
  const [lastScrollPosition, setLastScrollPosition] = React.useState(0);
  
  // Create a debounced update function to avoid too many updates
  const debouncedUpdateMiniQR = React.useMemo(() => 
    debounce(() => {
      if (showMiniPreview && miniQrRef.current && qrCode) {
        forceUpdateMiniQR();
      }
    }, 150), [showMiniPreview]);

  // Direct update function that can be called whenever qrCode changes
  const forceUpdateMiniQR = React.useCallback(() => {
    if (!qrCode || !qrCode._options) return;
    
    // Always attempt to update the mini preview even if not yet visible
    // This ensures it's ready when it becomes visible
    
    // Clear the mini QR ref container if it exists
    if (miniQrRef.current) {
      miniQrRef.current.innerHTML = '';
    }
    
    // Always update the mini QR code data first
    if (miniQrCode) {
      try {
        miniQrCode.update({
          ...qrCode._options,
          width: 128,
          height: 128,
        });
      } catch (error) {
        console.error('Error updating mini QR code data:', error);
      }
    } else if (qrCode._options) {
      // Create new mini QR if it doesn't exist
      try {
        const newMiniQrCode = new QRCodeStyling({
          ...qrCode._options,
          width: 128,
          height: 128,
        });
        setMiniQrCode(newMiniQrCode);
        
        // Store the newly created QR code in a ref so we can use it immediately
        // without waiting for state update
        if (showMiniPreview && miniQrRef.current) {
          newMiniQrCode.append(miniQrRef.current);
        }
      } catch (error) {
        console.error('Error creating new mini QR code:', error);
      }
    }
    
    // Then immediately render if the preview is visible
    if (showMiniPreview && miniQrRef.current) {
      // Try to render with existing mini QR code
      if (miniQrCode) {
        try {
          miniQrCode.append(miniQrRef.current);
        } catch (error) {
          console.error('Error rendering mini QR code:', error);
          
          // Fallback: create and render a new QR code instance
          try {
            const tempQr = new QRCodeStyling({
              ...qrCode._options,
              width: 128,
              height: 128,
            });
            tempQr.append(miniQrRef.current);
          } catch (fallbackError) {
            console.error('Fallback QR render failed:', fallbackError);
          }
        }
      } else if (qrCode && qrCode._options) {
        // Fallback: create and render a temporary QR code
        try {
          const tempQr = new QRCodeStyling({
            ...qrCode._options,
            width: 128,
            height: 128,
          });
          tempQr.append(miniQrRef.current);
        } catch (error) {
          console.error('Error with fallback QR render:', error);
        }
      }
    }
  }, [qrCode, miniQrCode, showMiniPreview]);

  // Watch for ANY change in the QR code options and update immediately
  React.useEffect(() => {
    // Skip the update if the QR code hasn't been created yet
    if (!qrCode || !qrCode._options) return;
    
    // Immediate update without debouncing
    if (showMiniPreview) {
      // Use RAF to ensure we're updating in the next paint cycle
      requestAnimationFrame(() => {
        forceUpdateMiniQR();
      });
    }
    
    // Also schedule a debounced update for smoother UI experience
    debouncedUpdateMiniQR();
  }, [
    forceUpdateMiniQR,
    debouncedUpdateMiniQR,
    showMiniPreview,
    qrCode,
    borderWidth, 
    borderStyle, 
    borderColor, 
    borderRadius, 
    bannerPosition,
    bannerText,
    bannerColor,
    bannerTextColor,
    bannerWidth,
    bannerFontSize,
    bannerFontFamily,
    bannerBold,
    bannerItalic
  ]);

  // Special effect to update the mini QR when its visibility changes
  React.useEffect(() => {
    if (showMiniPreview && qrCode && qrCode._options) {
      // Double-render technique to ensure it updates properly
      // First render
      requestAnimationFrame(() => {
        if (miniQrRef.current) {
          miniQrRef.current.innerHTML = '';
        }
        
        // Second render after a short delay
        setTimeout(() => {
          forceUpdateMiniQR();
          
          // Third render as a safety measure
          setTimeout(() => {
            forceUpdateMiniQR();
          }, 100);
        }, 50);
      });
    }
  }, [showMiniPreview, forceUpdateMiniQR, qrCode]);
  
  // Watch for mini preview visibility changes
  React.useEffect(() => {
    if (showMiniPreview) {
      // When preview becomes visible, immediately render the QR code
      forceUpdateMiniQR();
    }
  }, [showMiniPreview, forceUpdateMiniQR]);

  // Override main QR code render function to also update mini QR
  React.useEffect(() => {
    if (!qrCode) return;
    
    // Track if the main QR code was updated
    let mainQrUpdated = false;
    
    // Create a mutation observer to detect when the main QR is updated
    const observer = new MutationObserver(() => {
      mainQrUpdated = true;
      // If mini preview is visible, update it immediately
      if (showMiniPreview) {
        requestAnimationFrame(() => {
          forceUpdateMiniQR();
        });
      }
    });
    
    if (qrRef.current) {
      // Start observing the main QR container for changes
      observer.observe(qrRef.current, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      // Clear and re-append the QR code
      qrRef.current.innerHTML = '';
      qrCode.append(qrRef.current);
      
      // Also update the mini QR preview
      forceUpdateMiniQR();
    }
    
    return () => {
      observer.disconnect();
    };
  }, [qrCode, forceUpdateMiniQR, showMiniPreview]);

  // Initialize mini QR code as soon as the main QR code is available
  React.useEffect(() => {
    if (qrCode && qrCode._options && !miniQrCode) {
      try {
        const newMiniQrCode = new QRCodeStyling({
          ...qrCode._options,
          width: 128,
          height: 128,
        });
        setMiniQrCode(newMiniQrCode);
      } catch (error) {
        console.error('Error initializing mini QR code:', error);
      }
    }
  }, [qrCode, miniQrCode]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFormats(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Modify how we handle scroll to make the mini preview more stable
  React.useEffect(() => {
    const handleScroll = () => {
      if (qrRef.current && qrCode) {
        const rect = qrRef.current.getBoundingClientRect();
        const isQrOutOfView = rect.bottom < 0;
        
        // Check if floating button state has changed
        const wasFloatingButtonVisible = showFloatingButton;
        setShowFloatingButton(isQrOutOfView);
        
        // Auto show mini preview when QR code is out of view
        if (isQrOutOfView) {
          // Only set if not already showing to avoid unnecessary re-renders
          if (!showMiniPreview) {
            setShowMiniPreview(true);
            
            // When mini preview first becomes visible, ensure it renders correctly
            requestAnimationFrame(() => {
              setTimeout(() => forceUpdateMiniQR(), 100);
            });
          }
        } else if (showMiniPreview) {
          // Hide mini preview when scrolling back to the QR code
          setShowMiniPreview(false);
        }
        
        // If floating button just became visible, make sure mini QR is ready
        if (!wasFloatingButtonVisible && isQrOutOfView) {
          // Force an update of the mini QR code
          requestAnimationFrame(() => {
            setTimeout(() => forceUpdateMiniQR(), 100);
          });
        }
        
        setLastScrollPosition(window.scrollY);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [qrCode, showMiniPreview, showFloatingButton, forceUpdateMiniQR]);

  // Create intersection observer to detect when elements are visible/hidden
  React.useEffect(() => {
    // Create an observer instance to monitor when the QR code is visible
    const qrIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the main QR is visible and mini preview is showing, update mini QR
        if (entry.isIntersecting && showMiniPreview) {
          requestAnimationFrame(() => {
            forceUpdateMiniQR();
          });
        }
      });
    }, { threshold: 0.1 });
    
    // Create another observer for the mini QR preview
    const miniQrIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If mini QR becomes visible, force an update
        if (entry.isIntersecting && miniQrRef.current) {
          requestAnimationFrame(() => {
            forceUpdateMiniQR();
          });
        }
      });
    }, { threshold: 0.1 });
    
    // Observe both elements if they exist
    if (qrRef.current) {
      qrIntersectionObserver.observe(qrRef.current);
    }
    
    if (miniQrRef.current) {
      miniQrIntersectionObserver.observe(miniQrRef.current);
    }
    
    return () => {
      qrIntersectionObserver.disconnect();
      miniQrIntersectionObserver.disconnect();
    };
  }, [showMiniPreview, forceUpdateMiniQR]);

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

  // Toggle mini preview when clicking the floating button
  const toggleMiniPreview = () => {
    const newState = !showMiniPreview;
    setShowMiniPreview(newState);
    
    // If turning on the mini preview, make sure QR code is rendered immediately
    if (newState) {
      // Use requestAnimationFrame to ensure the preview is shown and then update
      requestAnimationFrame(() => {
        // Wait a tiny bit for the state to update and DOM to render
        setTimeout(() => {
          forceUpdateMiniQR();
        }, 50);
      });
    }
  };

  // Function to force an update of the mini QR preview
  const updateMiniQRPreview = React.useCallback(() => {
    if (showMiniPreview && miniQrRef.current && miniQrCode) {
      miniQrRef.current.innerHTML = '';
      miniQrCode.append(miniQrRef.current);
    }
  }, [showMiniPreview, miniQrCode]);

  // Add listener for visibility changes to ensure updates when tab becomes visible
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateMiniQRPreview();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updateMiniQRPreview]);
  
  // Make sure the mini QR container is always visible and has proper dimensions
  React.useEffect(() => {
    if (miniQrRef.current && showMiniPreview) {
      // Force a layout recalculation by triggering a reflow
      miniQrRef.current.style.display = 'flex';
      miniQrRef.current.getBoundingClientRect();
      
      // After layout calculation, make sure to update the QR code
      forceUpdateMiniQR();
    }
  }, [showMiniPreview, forceUpdateMiniQR]);
  
  // Resize observer to handle container size changes
  React.useEffect(() => {
    if (!miniQrRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (showMiniPreview) {
        forceUpdateMiniQR();
      }
    });
    
    resizeObserver.observe(miniQrRef.current);
    return () => resizeObserver.disconnect();
  }, [showMiniPreview, forceUpdateMiniQR]);

  // Ensure miniQR updates instantly when properties change, using RAF for optimal timing
  const syncMiniQRProperties = React.useCallback(() => {
    if (!showMiniPreview || !miniQrCode || !qrCode || !qrCode._options) return;
    
    // Schedule the update during the next animation frame
    requestAnimationFrame(() => {
      if (miniQrRef.current) {
        // Clear previous content
        miniQrRef.current.innerHTML = '';
        
        try {
          // Apply the latest options
          miniQrCode.update({
            ...qrCode._options,
            width: 128,
            height: 128,
          });
          
          // Append the updated mini QR code
          miniQrCode.append(miniQrRef.current);
        } catch (error) {
          console.error('Error syncing mini QR properties:', error);
          
          // Fallback to recreating the QR code
          try {
            const tempQr = new QRCodeStyling({
              ...qrCode._options,
              width: 128,
              height: 128,
            });
            tempQr.append(miniQrRef.current);
          } catch (fallbackError) {
            console.error('Fallback QR sync failed:', fallbackError);
          }
        }
      }
    });
  }, [miniQrCode, qrCode, showMiniPreview]);
  
  // Directly track property changes
  React.useEffect(() => {
    if (showMiniPreview) {
      syncMiniQRProperties();
    }
  }, [
    showMiniPreview,
    syncMiniQRProperties,
    borderWidth,
    borderStyle,
    borderColor,
    borderRadius,
    bannerPosition,
    bannerText,
    bannerColor,
    bannerTextColor,
    bannerWidth,
    bannerFontSize,
    bannerFontFamily,
    bannerBold,
    bannerItalic
  ]);

  return (
    <div ref={previewSectionRef} className="lg:col-span-8 bg-white p-8 rounded-2xl shadow-lg">
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
          <div className="qr-display-wrapper" style={{ minHeight: '300px', minWidth: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <QRDisplay
              qrRef={qrRef}
              borderWidth={borderWidth}
              borderStyle={borderStyle}
              borderColor={borderColor}
              borderRadius={borderRadius}
            />
          </div>
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
              disabled={downloading || !qrCode}
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

      {/* Floating Preview Button */}
      {showFloatingButton && qrCode && (
        <div 
          className="fixed top-4 right-4 z-50"
          ref={miniPreviewRef}
        >
          <button
            onClick={toggleMiniPreview}
            className="flex items-center justify-center w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all"
            aria-label="Show QR preview"
          >
            {showMiniPreview ? <X size={20} /> : <Eye size={20} />}
          </button>
          
          {showMiniPreview && (
            <div 
              className="absolute right-0 mt-2 bg-white rounded-lg shadow-xl p-4 w-64 transform origin-top-right transition-all duration-300 ease-in-out"
              style={{
                opacity: showMiniPreview ? 1 : 0,
                transform: showMiniPreview ? 'scale(1)' : 'scale(0.95)',
              }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-2 text-sm font-medium text-gray-700">QR Code Preview</div>
                <div className="w-full flex flex-col items-center gap-2">
                  {bannerPosition === 'top' && (
                    <div 
                      className="w-full text-center py-1 px-2 text-xs"
                      style={{
                        backgroundColor: bannerColor,
                        color: bannerTextColor,
                        fontFamily: bannerFontFamily,
                        fontSize: `${bannerFontSize * 0.5}px`,
                        fontWeight: bannerBold ? 'bold' : 'normal',
                        fontStyle: bannerItalic ? 'italic' : 'normal',
                        width: `${bannerWidth * 0.5}px`,
                        maxWidth: '100%',
                      }}
                    >
                      {bannerText}
                    </div>
                  )}
                  <div
                    style={{
                      border: `${borderWidth * 0.5}px ${borderStyle} ${borderColor}`,
                      borderRadius: `${borderRadius * 0.5}px`,
                      padding: '8px',
                      width: 'fit-content',
                    }}
                  >
                    <div 
                      ref={miniQrRef}
                      className="w-32 h-32 flex items-center justify-center"
                      style={{
                        backgroundColor: 'white',
                        minWidth: '128px',
                        minHeight: '128px',
                        display: 'flex',
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {!qrCode && <div className="text-xs text-gray-500">QR Preview</div>}
                    </div>
                  </div>
                  {bannerPosition === 'bottom' && (
                    <div 
                      className="w-full text-center py-1 px-2 text-xs"
                      style={{
                        backgroundColor: bannerColor,
                        color: bannerTextColor,
                        fontFamily: bannerFontFamily,
                        fontSize: `${bannerFontSize * 0.5}px`,
                        fontWeight: bannerBold ? 'bold' : 'normal',
                        fontStyle: bannerItalic ? 'italic' : 'normal',
                        width: `${bannerWidth * 0.5}px`,
                        maxWidth: '100%',
                      }}
                    >
                      {bannerText}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowMiniPreview(false);
                    // Scroll back to preview section
                    qrRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-3 text-xs text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Back to full preview
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}