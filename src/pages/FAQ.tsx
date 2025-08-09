import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQ = () => {
  usePageScrollAnimation();

  const faqs = [
    {
      question: "What is Crossed Hearts' customer service policy?",
      answer: "Our prime concern is to deliver quick, friendly support. Customers can reach us via live chat (Mon-Fri, 10 AM–7 PM IST). Here our email team responds within 48 hours."
    },
    {
      question: "How do I track my order?",
      answer: "Customers first Log into your account or use the tracking link that we have sent in your confirmation mail."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept Credit/debit cards, PayPal, and Crossed Hearts Coins."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the login page and you'll get a reset link."
    },
    {
      question: "How do I become a Crossed Hearts affiliate?",
      answer: "We curated program for Creators with 20k followers."
    },
    {
      question: "How do I become a creator?",
      answer: "Creator can submit your work through our Creator portal link."
    },
    {
      question: "What are Crossed Hearts Coins?",
      answer: "Membership points earned via purchases-redeem for discounts. (Can't be transferred or sold)."
    },
    {
      question: "How do I confirm my order was accepted?",
      answer: "You'll get an instant confirmation email about your purchase. (Check Spam Folder)."
    },
    {
      question: "Are there hidden fees (duties/taxes)?",
      answer: "All costs are shown at checkout-no surprises."
    },
    {
      question: "Are the books readable offline?",
      answer: "Here we have publisher restriction, all licensed titles can't be downloaded or readable offline mode."
    },
    {
      question: "Is my card data safe?",
      answer: "We use SSL encryption and that will never store your details. We have primary concern on your card safety."
    },
    {
      question: "When will my order arrive?",
      answer: "Standard shipping takes 3 -7 business days (USA)."
    },
    {
      question: "Why isn't shipping available to my area?",
      answer: "We are looking into it. We are currently unable to ship to certain regions due to local restrictions, carrier limitations, or legal requirements beyond our control. We are constantly working to expand our delivery coverage and hope to include your area in the future."
    },
    {
      question: "How do I cancel my order?",
      answer: "Customer can cancel their order through their account within one hour ordering. Once shipped, you cannot cancel the order."
    },
    {
      question: "How long do refunds take?",
      answer: "We don't accept returns & refunds, unless there's exceptional circumstances."
    },
    {
      question: "What is a Collector Circle?",
      answer: "Our VIP club with early access and exclusive merchandise."
    },
    {
      question: "Do I need an account to shop?",
      answer: "Accounts are required for pre-orders. Accounts earn rewards."
    },
    {
      question: "Is COD available?",
      answer: "Currently, there's no COD Option for Payment."
    },
    {
      question: "Is there a fee for creating an account?",
      answer: "No, it's free and unlocks rewards."
    },
    {
      question: "How do I know if an item will restock?",
      answer: "Customers can click 'Notify Me' on the product page to receive a restock update mail."
    },
    {
      question: "How do I access my e-book after purchase?",
      answer: "After the purchase, customers can instantly read it from 'My Library' in your account. (Can't be downloaded)"
    },
    {
      question: "The website won't accept my payment-what should I do?",
      answer: "Customers can try a different browser or payment method, it usually helps. Or try again after an hour."
    },
    {
      question: "Why can't I log into my account?",
      answer: "Click 'Forgot Password' or try clearing your browser cache and login again."
    },
    {
      question: "How do I submit my manuscript?",
      answer: "See our (Submissions page) for guidelines, we accept queries year-round."
    },
    {
      question: "What's your privacy policy?",
      answer: "We never sell data-read our full policy here (privacy policy link)."
    },
    {
      question: "Can I download my e-book?",
      answer: "E-books are not downloadable."
    },
    {
      question: "Why was my account suspended?",
      answer: "Check your email, we send explanations with next steps."
    },
    {
      question: "Why isn't my discount code working?",
      answer: "A. Check the code's terms-some exclude sale items. B. Expired codes can't be reinstated."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Frequently Asked Questions</h1>
            
            <div className="bg-card p-6 rounded-lg border">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;