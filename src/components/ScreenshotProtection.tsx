import { useEffect, useRef, useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ScreenshotProtectionProps {
  children: React.ReactNode;
  isProtected?: boolean;
}

export function ScreenshotProtection({ children, isProtected = true }: ScreenshotProtectionProps) {
  const [isBlurred, setIsBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProtected) return;

    let isDetecting = false;

    // Detect screenshot attempts (keyboard shortcuts)
    const handleKeyDown = (e: KeyboardEvent) => {
      // Common screenshot shortcuts
      const screenshotCombos = [
        // Windows/Linux: Print Screen, Alt+Print Screen, Windows+Print Screen
        e.key === 'PrintScreen',
        e.code === 'PrintScreen',
        // macOS: Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)),
        (e.metaKey && e.shiftKey && ['Digit3', 'Digit4', 'Digit5'].includes(e.code)),
        // Windows key + Print Screen
        (e.metaKey && e.key === 'PrintScreen'),
        (e.metaKey && e.code === 'PrintScreen'),
        // Some apps: Ctrl+Shift+S
        (e.ctrlKey && e.shiftKey && e.key === 'S'),
        (e.ctrlKey && e.shiftKey && e.code === 'KeyS'),
        // Additional shortcuts
        (e.ctrlKey && e.key === 'p'), // Print
        (e.metaKey && e.key === 'p'), // Print on Mac
        (e.ctrlKey && e.code === 'KeyP'),
        (e.metaKey && e.code === 'KeyP'),
        // Alt + Print Screen
        (e.altKey && e.key === 'PrintScreen'),
        (e.altKey && e.code === 'PrintScreen'),
        // Snipping tool shortcuts
        (e.metaKey && e.shiftKey && e.key === 's'),
        (e.metaKey && e.shiftKey && e.code === 'KeyS'),
      ];

      if (screenshotCombos.some(combo => combo)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        handleScreenshotAttempt();
        // Clear clipboard
        if (navigator.clipboard) {
          navigator.clipboard.writeText('Screenshot disabled for protected content').catch(() => {});
        }
        return false;
      }
    };

    // Detect when window loses focus (potential screenshot)
    const handleVisibilityChange = () => {
      if (document.hidden && !isDetecting) {
        isDetecting = true;
        setTimeout(() => {
          isDetecting = false;
        }, 100);
        handleScreenshotAttempt();
      }
    };

    // Detect right-click (context menu for save image)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    };

    // Detect dev tools (F12, Ctrl+Shift+I, etc.)
    const handleDevTools = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        handleScreenshotAttempt();
      }
    };

    const handleScreenshotAttempt = () => {
      setIsBlurred(true);
      setShowWarning(true);
      
      // Hide content temporarily
      setTimeout(() => {
        setIsBlurred(false);
      }, 2000);
      
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    };

    // Disable image dragging globally
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Additional keyboard protection
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        handleScreenshotAttempt();
        return false;
      }
    };

    // Detect window focus changes (potential screenshot tools)
    const handleWindowBlur = () => {
      if (!isDetecting) {
        isDetecting = true;
        setTimeout(() => {
          isDetecting = false;
        }, 200);
        handleScreenshotAttempt();
      }
    };

    // Add event listeners with capture phase
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('keydown', handleDevTools, true);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    window.addEventListener('blur', handleWindowBlur);

    // Disable text selection and drag
    if (contentRef.current) {
      const element = contentRef.current as any;
      element.style.userSelect = 'none';
      element.style.webkitUserSelect = 'none';
      element.style.mozUserSelect = 'none';
      element.style.msUserSelect = 'none';
      element.style.webkitTouchCallout = 'none';
      element.style.webkitUserDrag = 'none';
      element.style.pointerEvents = 'auto';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('keydown', handleDevTools, true);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isProtected]);

  if (!isProtected) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {showWarning && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <Alert className="bg-red-900/90 border-red-500 text-white">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Content Protected</AlertTitle>
            <AlertDescription>
              Screenshots and copying are disabled for this protected content.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <div
        ref={contentRef}
        className={`relative transition-all duration-300 ${
          isBlurred ? 'blur-lg select-none' : ''
        }`}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        } as React.CSSProperties}
        onDragStart={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
      >
        {children}
        
        {/* Overlay when blurred */}
        {isBlurred && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center text-white">
              <Shield className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <p className="text-lg font-semibold">Content Protection Active</p>
              <p className="text-sm text-gray-300">Screenshots are not allowed</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Multiple watermark overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Main centered watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 opacity-8">
          <div className="text-4xl font-bold text-white/30 whitespace-nowrap">
            CROSS HEARTS • PROTECTED CONTENT
          </div>
        </div>
        {/* Corner watermarks */}
        <div className="absolute top-4 left-4 opacity-20">
          <div className="text-xs font-medium text-white/40">
            © Cross Hearts Comics
          </div>
        </div>
        <div className="absolute top-4 right-4 opacity-20">
          <div className="text-xs font-medium text-white/40">
            {new Date().toLocaleString()}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <div className="text-xs font-medium text-white/40">
            Protected Content
          </div>
        </div>
        <div className="absolute bottom-4 right-4 opacity-20">
          <div className="text-xs font-medium text-white/40">
            No Screenshots
          </div>
        </div>
        {/* Diagonal pattern watermarks */}
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            className="absolute transform rotate-45 opacity-5"
            style={{
              top: `${(i % 3) * 33.33}%`,
              left: `${Math.floor(i / 3) * 33.33}%`,
            }}
          >
            <div className="text-lg font-medium text-white/20 whitespace-nowrap">
              PROTECTED
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}