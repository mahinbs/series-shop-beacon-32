import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const CustomerSupport = () => {
  usePageScrollAnimation();

  const faqs = [
    {
      question: "How can I contact Crossed Hearts support?",
      answer: "You can reach us via live chat (Mon–Fri, 10 AM–7 PM IST) or email. Our email team replies within 48 hours."
    },
    {
      question: "What should I include when contacting support?",
      answer: "Include your order number, full name, and a clear description of the issue. If relevant, attach photos or screenshots so we can help faster."
    },
    {
      question: "Do you offer phone support?",
      answer: "Currently, we provide support only via live chat and email—no phone calls at this time."
    },
    {
      question: "What if I don't receive a reply within 48 hours?",
      answer: "Check your Spam/Junk folder first. If there's no response, follow up on your original message to ensure it reached us."
    },
    {
      question: "Can I get help outside business hours?",
      answer: "Messages sent outside support hours will be answered in the order they're received once we're back online."
    },
    {
      question: "How do I track an open support ticket?",
      answer: "You'll receive updates directly to your email. Please reply to the same thread to avoid delays."
    },
    {
      question: "Do you provide priority support for VIP members?",
      answer: "Yes—Collector Circle members receive priority handling for all inquiries."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Customer Support</h1>
            
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

export default CustomerSupport;