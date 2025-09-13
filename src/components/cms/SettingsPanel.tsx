import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  CreditCard, 
  Truck, 
  Shield, 
  Palette,
  Database,
  Bell,
  Key,
  Upload,
  Download,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SettingsService, type SiteSettings, type EmailSettings, type PaymentSettings, type ShippingSettings, type SecuritySettings, type BackupSettings } from '@/services/settingsService';

// SiteSettings interface imported from settingsService

// EmailSettings interface imported from settingsService

// PaymentSettings interface imported from settingsService

// ShippingSettings interface imported from settingsService

export const SettingsPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
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
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: 'tls',
    from_name: 'Series Shop',
    from_email: 'noreply@series-shop.com',
    order_confirmation_template: 'Thank you for your order!',
    welcome_email_template: 'Welcome to Series Shop!'
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    stripe_public_key: '',
    stripe_secret_key: '',
    paypal_client_id: '',
    paypal_client_secret: '',
    payment_methods: ['credit_card', 'paypal'],
    default_currency: 'USD',
    tax_rate: 8.25,
    shipping_cost: 2.99,
    free_shipping_threshold: 50.00
  });

  // Shipping Settings
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shipping_methods: ['standard', 'express', 'overnight'],
    default_shipping_cost: 2.99,
    free_shipping_threshold: 50.00,
    processing_time: 1,
    tracking_enabled: true
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    two_factor_enabled: false,
    session_timeout: 24,
    password_min_length: 8,
    require_strong_passwords: true,
    login_attempts_limit: 5,
    lockout_duration: 15
  });

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState<BackupSettings>({
    auto_backup_enabled: false,
    backup_frequency: 'daily',
    backup_retention_days: 30,
    backup_location: 'local'
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
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
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.saveSiteSettings(siteSettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Site settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save site settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.saveEmailSettings(emailSettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Email settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePaymentSettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.savePaymentSettings(paymentSettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Payment settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveShippingSettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.saveShippingSettings(shippingSettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Shipping settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shipping settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.saveSecuritySettings(securitySettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Security settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save security settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveBackupSettings = async () => {
    setIsSaving(true);
    try {
      await SettingsService.saveBackupSettings(backupSettings);
      setLastSaved(new Date());
      toast({
        title: "Success",
        description: "Backup settings saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save backup settings",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    try {
      await SettingsService.backupDatabase();
      toast({
        title: "Success",
        description: "Database backup completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to backup database",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Configure your site settings and preferences</p>
          {lastSaved && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <RefreshCw className="h-3 w-3" />
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading settings...
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={siteSettings.site_name}
                    onChange={(e) => setSiteSettings({...siteSettings, site_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="site_url">Site URL</Label>
                  <Input
                    id="site_url"
                    value={siteSettings.site_url}
                    onChange={(e) => setSiteSettings({...siteSettings, site_url: e.target.value})}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="site_description">Site Description</Label>
                <Textarea
                  id="site_description"
                  value={siteSettings.site_description}
                  onChange={(e) => setSiteSettings({...siteSettings, site_description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admin_email">Admin Email</Label>
                  <Input
                    id="admin_email"
                    type="email"
                    value={siteSettings.admin_email}
                    onChange={(e) => setSiteSettings({...siteSettings, admin_email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="support_email">Support Email</Label>
                  <Input
                    id="support_email"
                    type="email"
                    value={siteSettings.support_email}
                    onChange={(e) => setSiteSettings({...siteSettings, support_email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={siteSettings.currency} onValueChange={(value) => setSiteSettings({...siteSettings, currency: value})}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={siteSettings.timezone} onValueChange={(value) => setSiteSettings({...siteSettings, timezone: value})}>
                    <SelectTrigger id="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select value={siteSettings.language} onValueChange={(value) => setSiteSettings({...siteSettings, language: value})}>
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Enable maintenance mode to temporarily disable the site</p>
                  </div>
                  <Switch
                    id="maintenance_mode"
                    checked={siteSettings.maintenance_mode}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, maintenance_mode: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration_enabled">User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register</p>
                  </div>
                  <Switch
                    id="registration_enabled"
                    checked={siteSettings.registration_enabled}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, registration_enabled: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_verification">Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Require email verification for new accounts</p>
                  </div>
                  <Switch
                    id="email_verification"
                    checked={siteSettings.email_verification_required}
                    onCheckedChange={(checked) => setSiteSettings({...siteSettings, email_verification_required: checked})}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSiteSettings} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_host">SMTP Host</Label>
                  <Input
                    id="smtp_host"
                    value={emailSettings.smtp_host}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_port">SMTP Port</Label>
                  <Input
                    id="smtp_port"
                    type="number"
                    value={emailSettings.smtp_port}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smtp_username">SMTP Username</Label>
                  <Input
                    id="smtp_username"
                    value={emailSettings.smtp_username}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="smtp_password">SMTP Password</Label>
                  <Input
                    id="smtp_password"
                    type="password"
                    value={emailSettings.smtp_password}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_password: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="from_name">From Name</Label>
                  <Input
                    id="from_name"
                    value={emailSettings.from_name}
                    onChange={(e) => setEmailSettings({...emailSettings, from_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="from_email">From Email</Label>
                  <Input
                    id="from_email"
                    type="email"
                    value={emailSettings.from_email}
                    onChange={(e) => setEmailSettings({...emailSettings, from_email: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="smtp_encryption">SMTP Encryption</Label>
                <Select value={emailSettings.smtp_encryption} onValueChange={(value: any) => setEmailSettings({...emailSettings, smtp_encryption: value})}>
                  <SelectTrigger id="smtp_encryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="tls">TLS</SelectItem>
                    <SelectItem value="ssl">SSL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveEmailSettings} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Email Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stripe_public_key">Stripe Public Key</Label>
                  <Input
                    id="stripe_public_key"
                    value={paymentSettings.stripe_public_key}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripe_public_key: e.target.value})}
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <Label htmlFor="stripe_secret_key">Stripe Secret Key</Label>
                  <Input
                    id="stripe_secret_key"
                    type="password"
                    value={paymentSettings.stripe_secret_key}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripe_secret_key: e.target.value})}
                    placeholder="sk_test_..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="paypal_client_id">PayPal Client ID</Label>
                  <Input
                    id="paypal_client_id"
                    value={paymentSettings.paypal_client_id}
                    onChange={(e) => setPaymentSettings({...paymentSettings, paypal_client_id: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="paypal_client_secret">PayPal Client Secret</Label>
                  <Input
                    id="paypal_client_secret"
                    type="password"
                    value={paymentSettings.paypal_client_secret}
                    onChange={(e) => setPaymentSettings({...paymentSettings, paypal_client_secret: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_methods">Payment Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {['credit_card', 'paypal', 'bank_transfer', 'crypto'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`payment_${method}`}
                        checked={paymentSettings.payment_methods.includes(method)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...paymentSettings.payment_methods, method]
                            : paymentSettings.payment_methods.filter(m => m !== method);
                          setPaymentSettings({...paymentSettings, payment_methods: methods});
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`payment_${method}`} className="text-sm capitalize">
                        {method.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="default_currency">Default Currency</Label>
                <Select value={paymentSettings.default_currency} onValueChange={(value) => setPaymentSettings({...paymentSettings, default_currency: value})}>
                  <SelectTrigger id="default_currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                  <Input
                    id="tax_rate"
                    type="number"
                    step="0.01"
                    value={paymentSettings.tax_rate}
                    onChange={(e) => setPaymentSettings({...paymentSettings, tax_rate: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_cost">Shipping Cost</Label>
                  <Input
                    id="shipping_cost"
                    type="number"
                    step="0.01"
                    value={paymentSettings.shipping_cost}
                    onChange={(e) => setPaymentSettings({...paymentSettings, shipping_cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    step="0.01"
                    value={paymentSettings.free_shipping_threshold}
                    onChange={(e) => setPaymentSettings({...paymentSettings, free_shipping_threshold: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <Button onClick={handleSavePaymentSettings} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Payment Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="shipping_methods">Shipping Methods</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                  {['standard', 'express', 'overnight'].map((method) => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`shipping_${method}`}
                        checked={shippingSettings.shipping_methods.includes(method)}
                        onChange={(e) => {
                          const methods = e.target.checked
                            ? [...shippingSettings.shipping_methods, method]
                            : shippingSettings.shipping_methods.filter(m => m !== method);
                          setShippingSettings({...shippingSettings, shipping_methods: methods});
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`shipping_${method}`} className="text-sm capitalize">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default_shipping_cost">Default Shipping Cost</Label>
                  <Input
                    id="default_shipping_cost"
                    type="number"
                    step="0.01"
                    value={shippingSettings.default_shipping_cost}
                    onChange={(e) => setShippingSettings({...shippingSettings, default_shipping_cost: parseFloat(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="free_shipping_threshold">Free Shipping Threshold</Label>
                  <Input
                    id="free_shipping_threshold"
                    type="number"
                    step="0.01"
                    value={shippingSettings.free_shipping_threshold}
                    onChange={(e) => setShippingSettings({...shippingSettings, free_shipping_threshold: parseFloat(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="processing_time">Processing Time (days)</Label>
                <Input
                  id="processing_time"
                  type="number"
                  value={shippingSettings.processing_time}
                  onChange={(e) => setShippingSettings({...shippingSettings, processing_time: parseInt(e.target.value)})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="tracking_enabled">Tracking Enabled</Label>
                  <p className="text-sm text-muted-foreground">Enable order tracking for customers</p>
                </div>
                <Switch
                  id="tracking_enabled"
                  checked={shippingSettings.tracking_enabled}
                  onCheckedChange={(checked) => setShippingSettings({...shippingSettings, tracking_enabled: checked})}
                />
              </div>

              <Button onClick={handleSaveShippingSettings} disabled={isSaving} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Shipping Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="two_factor_enabled">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts</p>
                  </div>
                  <Switch
                    id="two_factor_enabled"
                    checked={securitySettings.two_factor_enabled}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, two_factor_enabled: checked})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="session_timeout">Session Timeout (hours)</Label>
                    <Input
                      id="session_timeout"
                      type="number"
                      value={securitySettings.session_timeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password_min_length">Minimum Password Length</Label>
                    <Input
                      id="password_min_length"
                      type="number"
                      value={securitySettings.password_min_length}
                      onChange={(e) => setSecuritySettings({...securitySettings, password_min_length: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require_strong_passwords">Require Strong Passwords</Label>
                    <p className="text-sm text-muted-foreground">Enforce complex password requirements</p>
                  </div>
                  <Switch
                    id="require_strong_passwords"
                    checked={securitySettings.require_strong_passwords}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, require_strong_passwords: checked})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="login_attempts_limit">Login Attempts Limit</Label>
                    <Input
                      id="login_attempts_limit"
                      type="number"
                      value={securitySettings.login_attempts_limit}
                      onChange={(e) => setSecuritySettings({...securitySettings, login_attempts_limit: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                    <Input
                      id="lockout_duration"
                      type="number"
                      value={securitySettings.lockout_duration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockout_duration: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveSecuritySettings} disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Security Settings'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Restore
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto_backup_enabled">Auto Backup</Label>
                    <p className="text-sm text-muted-foreground">Automatically backup database</p>
                  </div>
                  <Switch
                    id="auto_backup_enabled"
                    checked={backupSettings.auto_backup_enabled}
                    onCheckedChange={(checked) => setBackupSettings({...backupSettings, auto_backup_enabled: checked})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="backup_frequency">Backup Frequency</Label>
                    <Select value={backupSettings.backup_frequency} onValueChange={(value) => setBackupSettings({...backupSettings, backup_frequency: value})}>
                      <SelectTrigger id="backup_frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="backup_retention_days">Retention Days</Label>
                    <Input
                      id="backup_retention_days"
                      type="number"
                      value={backupSettings.backup_retention_days}
                      onChange={(e) => setBackupSettings({...backupSettings, backup_retention_days: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backup_location">Backup Location</Label>
                  <Select value={backupSettings.backup_location} onValueChange={(value) => setBackupSettings({...backupSettings, backup_location: value})}>
                    <SelectTrigger id="backup_location">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                      <SelectItem value="external">External Drive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSaveBackupSettings} disabled={isSaving} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save Backup Settings'}
                  </Button>
                  
                  <Button 
                    onClick={handleBackupDatabase} 
                    disabled={isLoading}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isLoading ? 'Creating Backup...' : 'Create Backup Now'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
