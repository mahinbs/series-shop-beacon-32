import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Lock
} from 'lucide-react';
import { ChapterService, BookChapter } from '@/services/chapterService';

interface ChapterPreviewProps {
  bookId: string;
  variant?: 'default' | 'compact';
}

const ChapterPreview = ({ bookId, variant = 'default' }: ChapterPreviewProps) => {
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormat, setSelectedFormat] = useState<'digital' | 'paperback' | 'hardcover'>('digital');

  useEffect(() => {
    loadChapters();
  }, [bookId]);

  const loadChapters = async () => {
    try {
      setIsLoading(true);
      const data = await ChapterService.getBookChapters(bookId);
      setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (chapter: BookChapter) => {
    if (chapter.is_preview) {
      // Navigate to chapter reader
      window.location.href = `/chapter/${chapter.id}`;
    } else {
      // Show join/login prompt
      console.log('Chapter requires subscription');
    }
  };


  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading chapters...</p>
      </div>
    );
  }

  if (chapters.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No chapters available yet.
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {chapters.map((chapter, index) => (
          <div key={chapter.id} className="flex items-center justify-between py-2 border-b border-gray-200">
            <div className="flex-1">
              <div className="text-gray-500 text-xs">
                CH. {chapter.chapter_number}
              </div>
              <div className="text-black font-bold text-sm mt-1">
                {chapter.chapter_title}
              </div>
            </div>
            <button 
              onClick={() => handleChapterClick(chapter)}
              className={`px-4 py-1 rounded text-sm font-bold ${
                chapter.is_preview
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-800 hover:bg-gray-900 text-white'
              }`}
              disabled={!chapter.is_preview}
            >
              {chapter.is_preview ? '📖 READ NOW' : '🔒 JOIN TO CONTINUE'}
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chapter Preview Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">PREVIEW</h3>
        <p className="text-gray-400">Explore the chapters below</p>
      </div>

      {/* Chapters List */}
      <div className="space-y-3">
        {chapters.map((chapter, index) => (
          <Card key={chapter.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-gray-700 text-white border-gray-600">
                      CH. {chapter.chapter_number}
                    </Badge>
                    {chapter.is_preview && (
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        READ NOW
                      </Badge>
                    )}
                    {!chapter.is_preview && (
                      <Badge variant="destructive" className="bg-blue-600 text-white">
                        JOIN TO CONTINUE
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="font-semibold text-white text-lg mb-1">
                    {chapter.chapter_title}
                  </h4>
                  
                  {chapter.chapter_description && (
                    <p className="text-gray-400 text-sm mb-2">
                      {chapter.chapter_description}
                    </p>
                  )}

                </div>

                <div className="ml-4">
                  <Button
                    onClick={() => handleChapterClick(chapter)}
                    className={`${
                      chapter.is_preview
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    disabled={!chapter.is_preview}
                  >
                    {chapter.is_preview ? (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        READ NOW
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        JOIN TO CONTINUE
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show more indicator */}
      {chapters.length > 7 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
            <span className="text-sm">More chapters available</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterPreview;
