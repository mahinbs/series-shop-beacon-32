import { supabase } from '@/integrations/supabase/client';

export interface Circle {
  id: string;
  name: string;
  description?: string;
  comic_id: string;
  created_at: string;
  updated_at: string;
}

export interface CircleMembership {
  id: string;
  circle_id: string;
  email: string;
  user_id?: string;
  joined_at: string;
  circle_name?: string;
  comic_id?: string;
  user_full_name?: string;
  user_avatar_url?: string;
}

export class CircleService {
  // Global circle methods
  static async createGlobalCircle(): Promise<Circle> {
    const { data, error } = await (supabase as any)
      .from('circles')
      .insert({ 
        name: 'Crossed Hearts Collector\'s Circle', 
        description: 'Global collector\'s circle for all Crossed Hearts content',
        comic_id: null // Global circle has no specific comic
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async getGlobalCircle(): Promise<Circle | null> {
    const { data, error } = await (supabase as any)
      .from('circles')
      .select('*')
      .is('comic_id', null)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Check if user is member of global circle
  static async isUserMemberOfGlobalCircle(userId: string): Promise<boolean> {
    const globalCircle = await this.getGlobalCircle();
    if (!globalCircle) return false;
    
    return this.isUserMemberOfCircle(globalCircle.id, userId);
  }

  // Check if email is member of global circle
  static async isEmailMemberOfGlobalCircle(email: string): Promise<boolean> {
    const globalCircle = await this.getGlobalCircle();
    if (!globalCircle) return false;
    
    return this.isEmailMemberOfCircle(globalCircle.id, email);
  }

  // Get circle for a comic
  static async getCircleForComic(comicId: string): Promise<Circle | null> {
    const { data, error } = await (supabase as any)
      .from('circles')
      .select('*')
      .eq('comic_id', comicId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return data;
  }

  // Create circle for a comic
  static async createCircleForComic(comicId: string, name: string, description?: string): Promise<Circle> {
    const { data, error } = await (supabase as any)
      .from('circles')
      .insert({
        comic_id: comicId,
        name,
        description
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Join circle with email
  static async joinCircleWithEmail(circleId: string, email: string): Promise<CircleMembership> {
    const { data, error } = await (supabase as any)
      .from('circle_memberships')
      .upsert({
        circle_id: circleId,
        email: email.trim().toLowerCase()
      }, {
        onConflict: 'circle_id,email'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Check if user is member of circle
  static async isUserMemberOfCircle(circleId: string, userId: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('circle_memberships')
      .select('id')
      .eq('circle_id', circleId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return !!data;
  }

  // Check if email is member of circle
  static async isEmailMemberOfCircle(circleId: string, email: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('circle_memberships')
      .select('id')
      .eq('circle_id', circleId)
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
    return !!data;
  }

  // Get circle members (for admin)
  static async getCircleMembers(circleId: string): Promise<CircleMembership[]> {
    const { data, error } = await (supabase as any)
      .from('circle_members_with_profiles')
      .select('*')
      .eq('circle_id', circleId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  // Auto-join user to circles when they sign up
  static async autoJoinUserToCircles(userId: string, email: string): Promise<void> {
    // Find all circle memberships for this email that don't have a user_id yet
    const { data: memberships, error } = await (supabase as any)
      .from('circle_memberships')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .is('user_id', null);

    if (error) throw error;

    if (memberships && memberships.length > 0) {
      // Update all memberships to link to this user
      const { error: updateError } = await (supabase as any)
        .from('circle_memberships')
        .update({ user_id: userId })
        .eq('email', email.trim().toLowerCase())
        .is('user_id', null);

      if (updateError) throw updateError;
    }
  }

  // Leave circle
  static async leaveCircle(circleId: string, userId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('circle_memberships')
      .delete()
      .eq('circle_id', circleId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  // Get user's circle memberships
  static async getUserCircleMemberships(userId: string): Promise<CircleMembership[]> {
    const { data, error } = await (supabase as any)
      .from('circle_members_with_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
