import { cn } from '@/lib/utils';

interface AnnouncementImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: '4/3' | '16/9' | 'square';
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
}

export function AnnouncementImage({
  src,
  alt,
  className = '',
  aspectRatio = '4/3',
  showOverlay = false,
  overlayContent
}: AnnouncementImageProps) {
  const aspectClasses = {
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-[16/9]',
    'square': 'aspect-square'
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      aspectClasses[aspectRatio],
      className
    )}>
      <img 
        src={src} 
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
      />
      
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          {overlayContent}
        </div>
      )}
    </div>
  );
}

// Predefined announcement image components for different use cases
export function AnnouncementCardImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <AnnouncementImage 
      src={src} 
      alt={alt} 
      aspectRatio="4/3"
      className={cn('rounded-t-lg', className)}
    />
  );
}

export function AnnouncementHeroImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <AnnouncementImage 
      src={src} 
      alt={alt} 
      aspectRatio="16/9"
      className={cn('rounded-lg', className)}
    />
  );
}

export function AnnouncementThumbnailImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <AnnouncementImage 
      src={src} 
      alt={alt} 
      aspectRatio="4/3"
      className={cn('rounded-lg', className)}
    />
  );
}
