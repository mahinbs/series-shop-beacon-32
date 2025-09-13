import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  site_name: string;
  site_description: string;
  site_url: string;
  admin_email: string;
  support_email: string;
  currency: string;
  timezone: string;
  language: string;
  maintenance_mode: boolean;
  registration_enabled: boolean;
  email_verification_required: boolean;
}

export interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: string;
  from_name: string;
  from_email: string;
  order_confirmation_template: string;
  welcome_email_template: string;
}

export interface PaymentSettings {
  stripe_public_key: string;
  stripe_secret_key: string;
  paypal_client_id: string;
  paypal_client_secret: string;
  payment_methods: string[];
  default_currency: string;
  tax_rate: number;
  shipping_cost: number;
  free_shipping_threshold: number;
}

export interface ShippingSettings {
  shipping_methods: string[];
  default_shipping_cost: number;
  free_shipping_threshold: number;
  processing_time: number;
  tracking_enabled: boolean;
}

export interface SecuritySettings {
  two_factor_enabled: boolean;
  session_timeout: number;
  password_min_length: number;
  require_strong_passwords: boolean;
  login_attempts_limit: number;
  lockout_duration: number;
}

export interface BackupSettings {
  auto_backup_enabled: boolean;
  backup_frequency: string;
  backup_retention_days: number;
  backup_location: string;
}

// Check if we should use local storage
const shouldUseLocalStorage = () => {
  const localUser = localStorage.getItem('user');
  if (localUser) {
    const user = JSON.parse(localUser);
    return user.id && user.id.startsWith('local-');
  }
  return false;
};

export class SettingsService {
  // Site Settings
  static async getSiteSettings(): Promise<SiteSettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('site_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        // Return default settings
        return {
          site_name: 'Series Shop Beacon 32',
          site_description: 'A comprehensive e-commerce platform for manga, webtoons, comics, and related merchandise.',
          site_url: 'http://localhost:8080',
          admin_email: 'admin@series-shop.com',
          support_email: 'support@series-shop.com',
          currency: 'USD',
          timezone: 'America/New_York',
          language: 'en',
          maintenance_mode: false,
          registration_enabled: true,
          email_verification_required: false
        };
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultSiteSettings();
    } catch (error) {
      console.error('Error fetching site settings:', error);
      return this.getDefaultSiteSettings();
    }
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('site_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('site_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving site settings:', error);
      throw error;
    }
  }

  // Email Settings
  static async getEmailSettings(): Promise<EmailSettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('email_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        return this.getDefaultEmailSettings();
      }

      const { data, error } = await supabase
        .from('email_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultEmailSettings();
    } catch (error) {
      console.error('Error fetching email settings:', error);
      return this.getDefaultEmailSettings();
    }
  }

  static async saveEmailSettings(settings: EmailSettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('email_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('email_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving email settings:', error);
      throw error;
    }
  }

  // Payment Settings
  static async getPaymentSettings(): Promise<PaymentSettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('payment_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        return this.getDefaultPaymentSettings();
      }

      const { data, error } = await supabase
        .from('payment_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultPaymentSettings();
    } catch (error) {
      console.error('Error fetching payment settings:', error);
      return this.getDefaultPaymentSettings();
    }
  }

  static async savePaymentSettings(settings: PaymentSettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('payment_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('payment_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving payment settings:', error);
      throw error;
    }
  }

  // Shipping Settings
  static async getShippingSettings(): Promise<ShippingSettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('shipping_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        return this.getDefaultShippingSettings();
      }

      const { data, error } = await supabase
        .from('shipping_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultShippingSettings();
    } catch (error) {
      console.error('Error fetching shipping settings:', error);
      return this.getDefaultShippingSettings();
    }
  }

  static async saveShippingSettings(settings: ShippingSettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('shipping_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('shipping_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving shipping settings:', error);
      throw error;
    }
  }

  // Security Settings
  static async getSecuritySettings(): Promise<SecuritySettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('security_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        return this.getDefaultSecuritySettings();
      }

      const { data, error } = await supabase
        .from('security_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultSecuritySettings();
    } catch (error) {
      console.error('Error fetching security settings:', error);
      return this.getDefaultSecuritySettings();
    }
  }

  static async saveSecuritySettings(settings: SecuritySettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('security_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('security_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving security settings:', error);
      throw error;
    }
  }

  // Backup Settings
  static async getBackupSettings(): Promise<BackupSettings> {
    try {
      if (shouldUseLocalStorage()) {
        const stored = localStorage.getItem('backup_settings');
        if (stored) {
          return JSON.parse(stored);
        }
        return this.getDefaultBackupSettings();
      }

      const { data, error } = await supabase
        .from('backup_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data || this.getDefaultBackupSettings();
    } catch (error) {
      console.error('Error fetching backup settings:', error);
      return this.getDefaultBackupSettings();
    }
  }

  static async saveBackupSettings(settings: BackupSettings): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        localStorage.setItem('backup_settings', JSON.stringify(settings));
        return;
      }

      const { error } = await supabase
        .from('backup_settings')
        .upsert(settings);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving backup settings:', error);
      throw error;
    }
  }

  // Backup Database
  static async backupDatabase(): Promise<void> {
    try {
      if (shouldUseLocalStorage()) {
        // For local storage, create a backup of all localStorage data
        const backup = {
          timestamp: new Date().toISOString(),
          site_settings: localStorage.getItem('site_settings'),
          email_settings: localStorage.getItem('email_settings'),
          payment_settings: localStorage.getItem('payment_settings'),
          shipping_settings: localStorage.getItem('shipping_settings'),
          security_settings: localStorage.getItem('security_settings'),
          backup_settings: localStorage.getItem('backup_settings'),
          admin_users: localStorage.getItem('admin_users'),
          tempHeroBanners: localStorage.getItem('tempHeroBanners'),
          user: localStorage.getItem('user'),
          isAuthenticated: localStorage.getItem('isAuthenticated'),
          admin_session: localStorage.getItem('admin_session')
        };
        
        const backupData = JSON.stringify(backup, null, 2);
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }

      // For Supabase, this would typically be handled by the backend
      // For now, we'll simulate a backup
      throw new Error('Database backup not implemented for Supabase yet');
    } catch (error) {
      console.error('Error backing up database:', error);
      throw error;
    }
  }

  // Default Settings
  private static getDefaultSiteSettings(): SiteSettings {
    return {
      site_name: 'Series Shop Beacon 32',
      site_description: 'A comprehensive e-commerce platform for manga, webtoons, comics, and related merchandise.',
      site_url: 'http://localhost:8080',
      admin_email: 'admin@series-shop.com',
      support_email: 'support@series-shop.com',
      currency: 'USD',
      timezone: 'America/New_York',
      language: 'en',
      maintenance_mode: false,
      registration_enabled: true,
      email_verification_required: false
    };
  }

  private static getDefaultEmailSettings(): EmailSettings {
    return {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      smtp_encryption: 'tls',
      from_name: 'Series Shop',
      from_email: 'noreply@series-shop.com',
      order_confirmation_template: 'Thank you for your order!',
      welcome_email_template: 'Welcome to Series Shop!'
    };
  }

  private static getDefaultPaymentSettings(): PaymentSettings {
    return {
      stripe_public_key: '',
      stripe_secret_key: '',
      paypal_client_id: '',
      paypal_client_secret: '',
      payment_methods: ['credit_card', 'paypal'],
      default_currency: 'USD',
      tax_rate: 8.25,
      shipping_cost: 2.99,
      free_shipping_threshold: 50.00
    };
  }

  private static getDefaultShippingSettings(): ShippingSettings {
    return {
      shipping_methods: ['standard', 'express', 'overnight'],
      default_shipping_cost: 2.99,
      free_shipping_threshold: 50.00,
      processing_time: 1,
      tracking_enabled: true
    };
  }

  private static getDefaultSecuritySettings(): SecuritySettings {
    return {
      two_factor_enabled: false,
      session_timeout: 24,
      password_min_length: 8,
      require_strong_passwords: true,
      login_attempts_limit: 5,
      lockout_duration: 15
    };
  }

  private static getDefaultBackupSettings(): BackupSettings {
    return {
      auto_backup_enabled: false,
      backup_frequency: 'daily',
      backup_retention_days: 30,
      backup_location: 'local'
    };
  }
}
