
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: '',
    agreeToPolicy: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToPolicy) {
      toast({
        title: "Privacy Policy Agreement Required",
        description: "Please agree to the Privacy Policy before sending your message.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitted(true);
    
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      agreeToPolicy: false
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-gray-800 p-8 lg:p-12 min-h-[600px] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Thank You!</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Thank you for filling the form. Our representative will be with you shortly.
            </p>
            <Button
              onClick={resetForm}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 lg:p-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Send us a <span className="text-red-500">Message</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName" className="text-gray-300 mb-2 block">
              First Name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-gray-300 mb-2 block">
              Last Name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-300 mb-2 block">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
            placeholder="Enter your email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="subject" className="text-gray-300 mb-2 block">
            Select a subject
          </Label>
          <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500">
              <SelectValue placeholder="What is this about?" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600 z-50">
              <SelectItem value="general" className="text-white hover:bg-gray-600">General Inquiry</SelectItem>
              <SelectItem value="support" className="text-white hover:bg-gray-600">Technical Support</SelectItem>
              <SelectItem value="partnership" className="text-white hover:bg-gray-600">Partnership</SelectItem>
              <SelectItem value="press" className="text-white hover:bg-gray-600">Press & Media</SelectItem>
              <SelectItem value="other" className="text-white hover:bg-gray-600">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="message" className="text-gray-300 mb-2 block">
            Message
          </Label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 min-h-[120px]"
            placeholder="Tell us more about your inquiry..."
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="agreeToPolicy"
            checked={formData.agreeToPolicy}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, agreeToPolicy: checked as boolean }))
            }
            className="border-gray-600 data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
          />
          <Label htmlFor="agreeToPolicy" className="text-gray-300 text-sm">
            I agree to the{' '}
            <a href="#" className="text-red-400 hover:text-red-300 underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition-colors"
        >
          Send Message
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
