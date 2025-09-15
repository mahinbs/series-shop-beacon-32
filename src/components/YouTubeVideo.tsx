import { extractYouTubeId, getYouTubeEmbedUrl } from '@/utils/youtube';

interface YouTubeVideoProps {
  url: string;
  className?: string;
}

export const YouTubeVideo = ({ url, className }: YouTubeVideoProps) => {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return null;
  }

  const embedUrl = getYouTubeEmbedUrl(videoId);

  return (
    <div className={`relative aspect-video ${className || ''}`}>
      <iframe
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};