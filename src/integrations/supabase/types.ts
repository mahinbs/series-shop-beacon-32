export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          content: string
          created_at: string
          display_order: number
          id: string
          image_url: string | null
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      backup_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      book_characters: {
        Row: {
          book_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          book_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          book_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "book_characters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
        ]
      }
      books: {
        Row: {
          author: string | null
          can_unlock_with_coins: boolean
          category: string
          coins: string | null
          cover_page_url: string | null
          created_at: string
          description: string | null
          dimensions: string | null
          display_order: number | null
          hover_image_url: string | null
          id: string
          image_url: string
          is_active: boolean
          is_new: boolean | null
          is_on_sale: boolean | null
          label: string | null
          original_price: number | null
          price: number
          product_type: string | null
          section_type: string
          sku: string | null
          stock_quantity: number | null
          tags: string[] | null
          title: string
          updated_at: string
          video_url: string | null
          weight: number | null
        }
        Insert: {
          author?: string | null
          can_unlock_with_coins?: boolean
          category: string
          coins?: string | null
          cover_page_url?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          display_order?: number | null
          hover_image_url?: string | null
          id?: string
          image_url: string
          is_active?: boolean
          is_new?: boolean | null
          is_on_sale?: boolean | null
          label?: string | null
          original_price?: number | null
          price: number
          product_type?: string | null
          section_type: string
          sku?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          video_url?: string | null
          weight?: number | null
        }
        Update: {
          author?: string | null
          can_unlock_with_coins?: boolean
          category?: string
          coins?: string | null
          cover_page_url?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          display_order?: number | null
          hover_image_url?: string | null
          id?: string
          image_url?: string
          is_active?: boolean
          is_new?: boolean | null
          is_on_sale?: boolean | null
          label?: string | null
          original_price?: number | null
          price?: number
          product_type?: string | null
          section_type?: string
          sku?: string | null
          stock_quantity?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          video_url?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coin_packages: {
        Row: {
          active: boolean | null
          best_value: boolean | null
          bonus: number | null
          coins: number
          created_at: string | null
          id: string
          name: string
          popular: boolean | null
          price: number
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          best_value?: boolean | null
          bonus?: number | null
          coins: number
          created_at?: string | null
          id?: string
          name: string
          popular?: boolean | null
          price: number
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          best_value?: boolean | null
          bonus?: number | null
          coins?: number
          created_at?: string | null
          id?: string
          name?: string
          popular?: boolean | null
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      coin_purchases: {
        Row: {
          coins: number
          created_at: string | null
          id: string
          package_id: string
          payment_method: string | null
          price: number
          status: string
          timestamp: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coins: number
          created_at?: string | null
          id?: string
          package_id: string
          payment_method?: string | null
          price: number
          status?: string
          timestamp?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coins?: number
          created_at?: string | null
          id?: string
          package_id?: string
          payment_method?: string | null
          price?: number
          status?: string
          timestamp?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "coin_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_transactions: {
        Row: {
          amount: number
          balance: number
          created_at: string | null
          description: string
          id: string
          reference: string | null
          timestamp: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          balance: number
          created_at?: string | null
          description: string
          id?: string
          reference?: string | null
          timestamp?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          balance?: number
          created_at?: string | null
          description?: string
          id?: string
          reference?: string | null
          timestamp?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      comic_episodes: {
        Row: {
          coin_price: number | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          episode_number: number
          id: string
          is_active: boolean | null
          is_free: boolean | null
          is_published: boolean | null
          series_id: string
          title: string
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          coin_price?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          episode_number: number
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          series_id: string
          title: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          coin_price?: number | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          episode_number?: number
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          is_published?: boolean | null
          series_id?: string
          title?: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comic_episodes_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "comic_series"
            referencedColumns: ["id"]
          },
        ]
      }
      comic_files: {
        Row: {
          created_at: string | null
          episode_id: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_active: boolean | null
          original_filename: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          episode_id: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_active?: boolean | null
          original_filename?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          episode_id?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          original_filename?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comic_files_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "comic_episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      comic_pages: {
        Row: {
          alt_text: string | null
          created_at: string | null
          episode_id: string
          id: string
          image_url: string
          is_active: boolean | null
          page_number: number
          updated_at: string | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          episode_id: string
          id?: string
          image_url: string
          is_active?: boolean | null
          page_number: number
          updated_at?: string | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          episode_id?: string
          id?: string
          image_url?: string
          is_active?: boolean | null
          page_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comic_pages_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "comic_episodes"
            referencedColumns: ["id"]
          },
        ]
      }
      comic_series: {
        Row: {
          age_rating: string | null
          banner_image_url: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          genre: string[] | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          slug: string
          status: string | null
          tags: string[] | null
          title: string
          total_episodes: number | null
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          age_rating?: string | null
          banner_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          genre?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title: string
          total_episodes?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          age_rating?: string | null
          banner_image_url?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          genre?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          total_episodes?: number | null
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creators: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          social_links: Json | null
          specialties: string[] | null
          updated_at: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          social_links?: Json | null
          specialties?: string[] | null
          updated_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      digital_reader_specs: {
        Row: {
          age_rating: string | null
          artist: string
          artist_image_url: string | null
          banner_image_url: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          creator: string
          creator_bio: string | null
          creator_image_url: string | null
          description: string | null
          display_order: number | null
          genre: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          length: number | null
          release_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          age_rating?: string | null
          artist: string
          artist_image_url?: string | null
          banner_image_url?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator: string
          creator_bio?: string | null
          creator_image_url?: string | null
          description?: string | null
          display_order?: number | null
          genre?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          length?: number | null
          release_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          age_rating?: string | null
          artist?: string
          artist_image_url?: string | null
          banner_image_url?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          creator?: string
          creator_bio?: string | null
          creator_image_url?: string | null
          description?: string | null
          display_order?: number | null
          genre?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          length?: number | null
          release_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      featured_series_badges: {
        Row: {
          color: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_series_configs: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          primary_button_link: string | null
          primary_button_text: string | null
          secondary_button_link: string | null
          secondary_button_text: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_series_template_history: {
        Row: {
          action: string
          applied_at: string | null
          applied_by: string | null
          id: string
          new_data: Json | null
          previous_data: Json | null
          template_id: string | null
        }
        Insert: {
          action: string
          applied_at?: string | null
          applied_by?: string | null
          id?: string
          new_data?: Json | null
          previous_data?: Json | null
          template_id?: string | null
        }
        Update: {
          action?: string
          applied_at?: string | null
          applied_by?: string | null
          id?: string
          new_data?: Json | null
          previous_data?: Json | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_series_template_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "featured_series_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_series_templates: {
        Row: {
          badge_data: Json | null
          config_data: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          template_type: string | null
          updated_at: string | null
        }
        Insert: {
          badge_data?: Json | null
          config_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          template_type?: string | null
          updated_at?: string | null
        }
        Update: {
          badge_data?: Json | null
          config_data?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          template_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hero_banners: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          subtitle: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          subtitle: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          subtitle?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_order_items_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json | null
          created_at: string
          id: string
          order_number: string
          payment_status: string | null
          shipping_address: Json | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_address?: Json | null
          created_at?: string
          id?: string
          order_number: string
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_address?: Json | null
          created_at?: string
          id?: string
          order_number?: string
          payment_status?: string | null
          shipping_address?: Json | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_sections: {
        Row: {
          content: Json
          created_at: string
          id: string
          page_name: string
          section_name: string
          updated_at: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          page_name: string
          section_name: string
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          page_name?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      series_creators: {
        Row: {
          created_at: string | null
          creator_id: string
          id: string
          is_primary: boolean | null
          role: string
          series_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          id?: string
          is_primary?: boolean | null
          role: string
          series_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          id?: string
          is_primary?: boolean | null
          role?: string
          series_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "series_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "series_creators_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "comic_series"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      shop_all_filters: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          options: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          options?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          options?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_all_heroes: {
        Row: {
          background_image_url: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          primary_button_link: string | null
          primary_button_text: string | null
          secondary_button_link: string | null
          secondary_button_text: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          primary_button_link?: string | null
          primary_button_text?: string | null
          secondary_button_link?: string | null
          secondary_button_text?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shop_all_sorts: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      unlocked_content: {
        Row: {
          coins_spent: number
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          coins_spent: number
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          coins_spent?: number
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_coins: {
        Row: {
          balance: number
          created_at: string | null
          id: string
          last_updated: string | null
          total_earned: number
          total_spent: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string | null
          id?: string
          last_updated?: string | null
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string | null
          id?: string
          last_updated?: string | null
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          id: string
          session_data: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_data?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_data?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_coins: {
        Args: { amount: number; description: string; user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      initialize_user_coins: {
        Args: { user_id: string }
        Returns: undefined
      }
      setup_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
