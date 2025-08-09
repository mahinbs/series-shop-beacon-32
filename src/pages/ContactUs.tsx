
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactHero from '@/components/ContactHero';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';
import ContactFAQ from '@/components/ContactFAQ';
import Newsletter from '@/components/Newsletter';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactUs = () => {
  const { elementRef: contactInfoRef, isVisible: contactInfoVisible } = useScrollAnimation(0.2);
  const { elementRef: faqRef, isVisible: faqVisible } = useScrollAnimation(0.2);

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <ContactHero />
      <div 
        ref={contactInfoRef as any}
        className={`grid lg:grid-cols-2 gap-0 px-4 sm:px-0 transition-all duration-1000 transform ${
          contactInfoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <ContactInfo />
        <ContactForm />
      </div>
      <div
        ref={faqRef as any}
        className={`px-4 sm:px-0 transition-all duration-1000 transform ${
          faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <ContactFAQ />
      </div>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ContactUs;
