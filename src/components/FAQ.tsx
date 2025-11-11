import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { announcementSectionsService, type FAQItem } from '@/services/announcementSectionsService';
import { useEffect } from 'react';

interface FAQProps {
  limit?: number;
}

export const FAQ = ({ limit }: FAQProps) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        const faqsData = await announcementSectionsService.getFAQs();
        setFaqs(limit ? faqsData.slice(0, limit) : faqsData);
      } catch (error) {
        console.error('Error loading FAQs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFAQs();
  }, [limit]);

  const toggleExpanded = (faqId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
        <div className="text-gray-400">Loading FAQs...</div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-8">
        <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No FAQs available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isExpanded = expandedItems.has(faq.id);
        
        return (
          <Card key={faq.id} className="bg-gray-800 border-gray-700 hover:border-red-500/50 transition-all duration-300">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full p-4 text-left justify-between hover:bg-gray-700/50"
                onClick={() => toggleExpanded(faq.id)}
              >
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-600 text-xs">
                    {faq.category}
                  </Badge>
                  <span className="text-white font-medium">{faq.question}</span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-300 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
