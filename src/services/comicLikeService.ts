import { supabase } from '@/integrations/supabase/client';

export interface ComicLike {
  id: string;
  comic_id: string;
  user_id: string;
  created_at: string;
}

export interface ComicLikeCount {
  comic_id: string;
  like_count: number;
}

export class ComicLikeService {
  // Get like count for a comic
  static async getComicLikeCount(comicId: string): Promise<number> {
    const { count, error } = await (supabase as any)
      .from('comic_likes')
      .select('*', { count: 'exact', head: true })
      .eq('comic_id', comicId);

    if (error) throw error;
    return count || 0;
  }

  // Check if user has liked a comic
  static async hasUserLikedComic(comicId: string, userId: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('comic_likes')
      .select('id')
      .eq('comic_id', comicId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return !!data;
  }

  // Like a comic
  static async likeComic(comicId: string, userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('comic_likes')
      .insert({
        comic_id: comicId,
        user_id: userId
      });

    if (error) throw error;
  }

  // Unlike a comic
  static async unlikeComic(comicId: string, userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('comic_likes')
      .delete()
      .eq('comic_id', comicId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Toggle like (like if not liked, unlike if liked)
  static async toggleComicLike(comicId: string, userId: string): Promise<boolean> {
    const hasLiked = await this.hasUserLikedComic(comicId, userId);
    
    if (hasLiked) {
      await this.unlikeComic(comicId, userId);
      return false; // Now unliked
    } else {
      await this.likeComic(comicId, userId);
      return true; // Now liked
    }
  }
}
