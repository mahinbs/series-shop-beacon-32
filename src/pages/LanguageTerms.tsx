import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';

const LanguageTerms = () => {
  usePageScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Language Terms</h1>
            
            <div className="bg-card p-6 rounded-lg border space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                Crossed Hearts conducts all official business operations, customer communications, product descriptions, policies, and support services primarily in English. This includes—but is not limited to—our website content, order confirmations, invoices, marketing materials, and help documentation. While we welcome a global community of customers, it's important to note that some content may not be available in other languages, and certain product-specific details or legal terms may exist only in English.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                For your convenience, you may choose to use automated translation tools or third-party services to view our content in another language; however, Crossed Hearts does not guarantee the accuracy or reliability of any translations not officially provided by us. In the event of a discrepancy, misunderstanding, or conflict between a translated version and the original English text, the English version will prevail and be considered the final, binding reference.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                We also acknowledge that English has regional variations (such as UK vs. US spelling), and while our primary format follows standard US English, certain marketing or creative content may occasionally use alternative spellings. This does not affect the meaning or intent of the content.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                If you need clarification on any policy, product description, or instruction due to a language barrier, we strongly encourage you to contact our customer support team directly in English for the fastest and most accurate resolution. Our team will make every reasonable effort to assist customers who may have limited English proficiency, but please note that responding in languages other than English may result in longer processing times.
              </p>

              <p className="text-muted-foreground leading-relaxed">
                By using our services, you acknowledge and agree that all official agreements, terms, and communications are bound by the English version, and Crossed Hearts shall not be held liable for any misunderstandings resulting from unofficial or automated translations.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LanguageTerms;