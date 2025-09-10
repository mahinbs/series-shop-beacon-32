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

interface SiteSettings {
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

interface EmailSettings {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  smtp_encryption: 'none' | 'tls' | 'ssl';
  from_name: string;
  from_email: string;
  order_confirmation_template: string;
  welcome_email_template: string;
}

interface PaymentSettings {
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

interface ShippingSettings {
  shipping_zones: Array<{
    name: string;
    countries: string[];
    cost: number;
    free_threshold: number;
  }>;
  default_shipping_cost: number;
  free_shipping_threshold: number;
  processing_time: number;
  tracking_enabled: boolean;
}

export const SettingsPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    shipping_zones: [
      {
        name: 'United States',
        countries: ['US'],
        cost: 2.99,
        free_threshold: 50.00
      },
      {
        name: 'International',
        countries: ['CA', 'MX', 'GB', 'DE', 'FR', 'JP'],
        cost: 9.99,
        free_threshold: 100.00
      }
    ],
    default_shipping_cost: 2.99,
    free_shipping_threshold: 50.00,
    processing_time: 1,
    tracking_enabled: true
  });

  const handleSaveSiteSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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

  const handleBackupDatabase = async () => {
    setIsLoading(true);
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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
        </div>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                    <SelectTrigger>
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
                  <SelectTrigger>
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
                  <Label htmlFor="processing_time">Processing Time (days)</Label>
                  <Input
                    id="processing_time"
                    type="number"
                    value={shippingSettings.processing_time}
                    onChange={(e) => setShippingSettings({...shippingSettings, processing_time: parseInt(e.target.value)})}
                  />
                </div>
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
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Password Requirements</h4>
                  <p className="text-sm text-muted-foreground">Configure password strength requirements for user accounts.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Configure
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Enable 2FA for admin accounts.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Enable 2FA
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">API Keys</h4>
                  <p className="text-sm text-muted-foreground">Manage API keys for third-party integrations.</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Manage Keys
                  </Button>
                </div>
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
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Database Backup</h4>
                  <p className="text-sm text-muted-foreground">Create a backup of your database.</p>
                  <Button 
                    onClick={handleBackupDatabase} 
                    disabled={isLoading}
                    className="mt-2 flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    {isLoading ? 'Creating Backup...' : 'Create Backup'}
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Restore Database</h4>
                  <p className="text-sm text-muted-foreground">Restore from a previous backup.</p>
                  <Button variant="outline" size="sm" className="mt-2 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Restore
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Export all data to CSV files.</p>
                  <Button variant="outline" size="sm" className="mt-2 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export All Data
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
