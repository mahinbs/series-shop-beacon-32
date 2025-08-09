
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Paperclip } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreatorApplicationFormProps {
  onClose: () => void;
}

const CreatorApplicationForm = ({ onClose }: CreatorApplicationFormProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    socialMedia: '',
    portfolio: '',
    genre: '',
    seriesLength: '',
    synopsis: '',
    timeline: '',
    additionalInfo: '',
    queryLetter: null as File | null,
    firstChapters: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    
    toast({
      title: "Application Submitted!",
      description: "Thank you for wanting to debut with Crossed Hearts. One of our representative will reach out to you shortly.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (name: 'queryLetter' | 'firstChapters') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      socialMedia: '',
      portfolio: '',
      genre: '',
      seriesLength: '',
      synopsis: '',
      timeline: '',
      additionalInfo: '',
      queryLetter: null,
      firstChapters: null
    });
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Application Submitted!</h3>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Thank you for wanting to debut with Crossed Hearts. One of our representative will reach out to you shortly.
            </p>
            <Button
              onClick={resetForm}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-md transition-colors mr-4"
            >
              Submit Another Application
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">
            Creator <span className="text-red-500">Application</span>
          </h2>
          <p className="text-gray-300">Join the Crossed Hearts family of creators</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName" className="text-gray-300 mb-2 block">
                Full Name *
              </Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300 mb-2 block">
                Email Address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-gray-300 mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <Label htmlFor="country" className="text-gray-300 mb-2 block">
                Country *
              </Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                placeholder="Enter your country"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="socialMedia" className="text-gray-300 mb-2 block">
              Social Media Links
            </Label>
            <Input
              id="socialMedia"
              name="socialMedia"
              value={formData.socialMedia}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              placeholder="Instagram, Twitter, etc."
            />
          </div>

          <div>
            <Label htmlFor="portfolio" className="text-gray-300 mb-2 block">
              Portfolio/Website URL
            </Label>
            <Input
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              placeholder="Link to your portfolio or website"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="genre" className="text-gray-300 mb-2 block">
                Genre *
              </Label>
              <Select value={formData.genre} onValueChange={handleSelectChange('genre')}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 z-50">
                  <SelectItem value="romance" className="text-white hover:bg-gray-600">Romance</SelectItem>
                  <SelectItem value="fantasy" className="text-white hover:bg-gray-600">Fantasy</SelectItem>
                  <SelectItem value="mystery" className="text-white hover:bg-gray-600">Mystery</SelectItem>
                  <SelectItem value="thriller" className="text-white hover:bg-gray-600">Thriller</SelectItem>
                  <SelectItem value="drama" className="text-white hover:bg-gray-600">Drama</SelectItem>
                  <SelectItem value="comedy" className="text-white hover:bg-gray-600">Comedy</SelectItem>
                  <SelectItem value="action" className="text-white hover:bg-gray-600">Action</SelectItem>
                  <SelectItem value="sci-fi" className="text-white hover:bg-gray-600">Science Fiction</SelectItem>
                  <SelectItem value="horror" className="text-white hover:bg-gray-600">Horror</SelectItem>
                  <SelectItem value="historical" className="text-white hover:bg-gray-600">Historical Fiction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="seriesLength" className="text-gray-300 mb-2 block">
                Series Length *
              </Label>
              <Select value={formData.seriesLength} onValueChange={handleSelectChange('seriesLength')}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white focus:border-red-500">
                  <SelectValue placeholder="Select series length" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 z-50">
                  <SelectItem value="novella" className="text-white hover:bg-gray-600">Novella (20,000-50,000 words)</SelectItem>
                  <SelectItem value="novel" className="text-white hover:bg-gray-600">Novel (50,000-100,000 words)</SelectItem>
                  <SelectItem value="series-3" className="text-white hover:bg-gray-600">Trilogy (3 books)</SelectItem>
                  <SelectItem value="series-5" className="text-white hover:bg-gray-600">Pentalogy (5 books)</SelectItem>
                  <SelectItem value="series-ongoing" className="text-white hover:bg-gray-600">Ongoing Series (6+ books)</SelectItem>
                  <SelectItem value="anthology" className="text-white hover:bg-gray-600">Anthology Collection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="synopsis" className="text-gray-300 mb-2 block">
              Book Synopsis *
            </Label>
            <Textarea
              id="synopsis"
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 min-h-[120px]"
              placeholder="Provide a compelling synopsis of your book, including main characters, central conflict, and what makes your story unique..."
              required
            />
          </div>

          <div>
            <Label htmlFor="timeline" className="text-gray-300 mb-2 block">
              Manuscript Completion Timeline
            </Label>
            <Input
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
              placeholder="When do you plan to complete your manuscript?"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo" className="text-gray-300 mb-2 block">
              Author Bio & Additional Information
            </Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 min-h-[80px]"
              placeholder="Tell us about yourself as an author, your writing style, target audience, and any previous publications..."
            />
          </div>

          {/* File Upload Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="queryLetter" className="text-gray-300 mb-2 block">
                Query Letter *
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="queryLetter"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange('queryLetter')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 flex items-center justify-between cursor-pointer hover:border-red-500 transition-colors">
                  <span className="text-white">
                    {formData.queryLetter ? formData.queryLetter.name : 'Attach your query letter'}
                  </span>
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">PDFs, Word docs, PPT are preferable</p>
            </div>

            <div>
              <Label htmlFor="firstChapters" className="text-gray-300 mb-2 block">
                First Three Chapters *
              </Label>
              <div className="relative">
                <input
                  type="file"
                  id="firstChapters"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileChange('firstChapters')}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 flex items-center justify-between cursor-pointer hover:border-red-500 transition-colors">
                  <span className="text-white">
                    {formData.firstChapters ? formData.firstChapters.name : 'Attach your first three chapters'}
                  </span>
                  <Paperclip className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">PDFs, Word docs, PPT are preferable</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-md transition-colors"
            >
              Submit Application
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorApplicationForm;
