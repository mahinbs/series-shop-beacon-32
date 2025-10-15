import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Edit3, Trash2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { ReviewService, ComicReview } from '@/services/reviewService';
import { useToast } from '@/hooks/use-toast';

interface ReviewSectionProps {
  comicId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ comicId }) => {
  const { user, isAuthenticated } = useSupabaseAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<ComicReview[]>([]);
  const [userReview, setUserReview] = useState<ComicReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [comment, setComment] = useState('');
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    loadReviews();
  }, [comicId, user?.id]);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const [reviewsData, count] = await Promise.all([
        ReviewService.getComicReviews(comicId, user?.id),
        ReviewService.getComicReviewCount(comicId)
      ]);
      
      setReviews(reviewsData);
      setReviewCount(count);
      
      // Find user's review
      const userRev = reviewsData.find(r => r.user_id === user?.id);
      setUserReview(userRev || null);
      
      if (userRev) {
        setComment(userRev.comment);
      }
    } catch (error) {
      console.error('Failed to load reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to write a review',
        variant: 'destructive'
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: 'Comment Required',
        description: 'Please write a comment',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await ReviewService.upsertReview({
        comic_id: comicId,
        comment: comment.trim()
      }, user.id);
      
      toast({
        title: 'Success',
        description: userReview ? 'Review updated successfully' : 'Review submitted successfully'
      });
      
      setIsEditing(false);
      await loadReviews();
    } catch (error) {
      console.error('Failed to submit review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!user || !userReview) return;

    try {
      await ReviewService.deleteReview(comicId, user.id);
      toast({
        title: 'Success',
        description: 'Review deleted successfully'
      });
      
      setUserReview(null);
      setComment('');
      setIsEditing(false);
      await loadReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive'
      });
    }
  };

  const handleReaction = async (reviewId: string, reactionType: 'like' | 'dislike') => {
    if (!isAuthenticated || !user) {
      toast({
        title: 'Login Required',
        description: 'Please sign in to react to reviews',
        variant: 'destructive'
      });
      return;
    }

    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;

      // If user already has the same reaction, remove it
      if (review.user_reaction === reactionType) {
        await ReviewService.removeReaction(reviewId, user.id);
      } else {
        // Otherwise, set the new reaction
        await ReviewService.reactToReview(reviewId, user.id, reactionType);
      }
      
      await loadReviews();
    } catch (error) {
      console.error('Failed to react to review:', error);
      toast({
        title: 'Error',
        description: 'Failed to react to review',
        variant: 'destructive'
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="flex items-center gap-4 text-gray-300">
        <span className="text-lg font-semibold">{reviewCount} reviews</span>
      </div>

      {/* Write Review Section */}
      {isAuthenticated && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {userReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              {userReview && !isEditing && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeleteReview}
                    className="border-red-600 text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            {(isEditing || !userReview) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Comment
                  </label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts about this comic..."
                    className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting || !comment.trim()}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Submitting...' : (userReview ? 'Update Review' : 'Submit Review')}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setComment(userReview?.comment || '');
                      }}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            )}

            {userReview && !isEditing && (
              <div className="mt-4 p-4 bg-gray-900 rounded-lg">
                <p className="text-gray-300">{userReview.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Updated {formatDate(userReview.updated_at)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Reviews</h3>
        
        {reviews.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      {review.reviewer_avatar ? (
                        <img
                          src={review.reviewer_avatar}
                          alt={review.reviewer_name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium text-gray-300">
                          {review.reviewer_name?.charAt(0) || 'U'}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">{review.reviewer_name || 'Anonymous'}</p>
                      <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{review.comment}</p>

                {/* Reaction Buttons */}
                <div className="flex items-center gap-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReaction(review.id, 'like')}
                    className={`border-gray-600 hover:bg-gray-700 ${
                      review.user_reaction === 'like' 
                        ? 'bg-green-600 border-green-600 text-white' 
                        : 'text-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {review.likes_count}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReaction(review.id, 'dislike')}
                    className={`border-gray-600 hover:bg-gray-700 ${
                      review.user_reaction === 'dislike' 
                        ? 'bg-red-600 border-red-600 text-white' 
                        : 'text-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4 mr-1" />
                    {review.dislikes_count}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};