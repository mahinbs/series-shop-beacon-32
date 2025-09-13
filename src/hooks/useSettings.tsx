import { useState, useEffect } from 'react';
import { SettingsService, type SiteSettings, type EmailSettings, type PaymentSettings, type ShippingSettings, type SecuritySettings, type BackupSettings } from '@/services/settingsService';

export const useSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings | null>(null);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [backupSettings, setBackupSettings] = useState<BackupSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [site, email, payment, shipping, security, backup] = await Promise.all([
          SettingsService.getSiteSettings(),
          SettingsService.getEmailSettings(),
          SettingsService.getPaymentSettings(),
          SettingsService.getShippingSettings(),
          SettingsService.getSecuritySettings(),
          SettingsService.getBackupSettings()
        ]);
        
        setSiteSettings(site);
        setEmailSettings(email);
        setPaymentSettings(payment);
        setShippingSettings(shipping);
        setSecuritySettings(security);
        setBackupSettings(backup);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load settings');
        console.error('Error loading settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [site, email, payment, shipping, security, backup] = await Promise.all([
        SettingsService.getSiteSettings(),
        SettingsService.getEmailSettings(),
        SettingsService.getPaymentSettings(),
        SettingsService.getShippingSettings(),
        SettingsService.getSecuritySettings(),
        SettingsService.getBackupSettings()
      ]);
      
      setSiteSettings(site);
      setEmailSettings(email);
      setPaymentSettings(payment);
      setShippingSettings(shipping);
      setSecuritySettings(security);
      setBackupSettings(backup);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh settings');
      console.error('Error refreshing settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    siteSettings,
    emailSettings,
    paymentSettings,
    shippingSettings,
    securitySettings,
    backupSettings,
    isLoading,
    error,
    refreshSettings
  };
};

// Hook for just site settings (most commonly used)
export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const settings = await SettingsService.getSiteSettings();
        setSiteSettings(settings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load site settings');
        console.error('Error loading site settings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSiteSettings();
  }, []);

  return {
    siteSettings,
    isLoading,
    error
  };
};
