import { supabase } from '@/integrations/supabase/client';

export interface ComicReview {
  id: string;
  user_id: string;
  comic_id: string;
  comment: string;
  likes_count: number;
  dislikes_count: number;
  created_at: string;
  updated_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  user_reaction?: 'like' | 'dislike' | null; // Current user's reaction
}

export interface CreateReviewData {
  comic_id: string;
  comment: string;
}

export interface ReviewReaction {
  id: string;
  review_id: string;
  user_id: string;
  reaction_type: 'like' | 'dislike';
  created_at: string;
}

export class ReviewService {
  // Get all reviews for a comic with user reactions
  static async getComicReviews(comicId: string, currentUserId?: string): Promise<ComicReview[]> {
    const { data, error } = await (supabase as any)
      .from('comic_reviews_with_profiles')
      .select(`
        *,
        review_reactions!left(reaction_type)
      `)
      .eq('comic_id', comicId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process the data to include user reactions
    const reviews = (data || []).map((review: any) => {
      const userReaction = currentUserId 
        ? review.review_reactions?.find((r: any) => r.user_id === currentUserId)?.reaction_type || null
        : null;

      return {
        ...review,
        user_reaction: userReaction
      };
    });

    return reviews;
  }

  // Get user's review for a specific comic
  static async getUserReview(comicId: string, userId: string): Promise<ComicReview | null> {
    const { data, error } = await (supabase as any)
      .from('comic_reviews')
      .select('*')
      .eq('comic_id', comicId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
    return data;
  }

  // Create or update a review
  static async upsertReview(reviewData: CreateReviewData, userId: string): Promise<ComicReview> {
    const { data, error } = await (supabase as any)
      .from('comic_reviews')
      .upsert({
        user_id: userId,
        comic_id: reviewData.comic_id,
        comment: reviewData.comment,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,comic_id'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Delete a review
  static async deleteReview(comicId: string, userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('comic_reviews')
      .delete()
      .eq('comic_id', comicId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // React to a review (like or dislike)
  static async reactToReview(reviewId: string, userId: string, reactionType: 'like' | 'dislike'): Promise<void> {
    const { error } = await (supabase as any)
      .from('review_reactions')
      .upsert({
        review_id: reviewId,
        user_id: userId,
        reaction_type: reactionType
      }, {
        onConflict: 'review_id,user_id'
      });

    if (error) throw error;
  }

  // Remove reaction from a review
  static async removeReaction(reviewId: string, userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('review_reactions')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Get review count for a comic
  static async getComicReviewCount(comicId: string): Promise<number> {
    const { count, error } = await (supabase as any)
      .from('comic_reviews')
      .select('*', { count: 'exact', head: true })
      .eq('comic_id', comicId);

    if (error) throw error;
    return count || 0;
  }
}