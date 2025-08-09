import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageScrollAnimation } from '@/hooks/usePageScrollAnimation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ReturnExchange = () => {
  usePageScrollAnimation();

  const faqs = [
    {
      question: "Do you accept returns or exchanges?",
      answer: "We currently do not accept returns or exchanges, except in exceptional circumstances (e.g., damaged, defective, or wrong item received)."
    },
    {
      question: "What should I do if my order arrives damaged or incorrect?",
      answer: "Contact our support team via live chat or email within 48 hours of delivery, along with clear photos of the product and packaging. We'll review your case and arrange a replacement if approved."
    },
    {
      question: "Can I exchange an item for a different size or product?",
      answer: "Unfortunately, exchanges are not available at this time. You can place a new order for the desired product once your case is resolved."
    },
    {
      question: "Who covers the shipping cost for replacements?",
      answer: "If your claim is approved, we will cover the cost of shipping your replacement item."
    },
    {
      question: "How long does it take to process a replacement?",
      answer: "Once approved, replacements are shipped within 3–5 business days."
    },
    {
      question: "Are sale or discounted items eligible for return or replacement?",
      answer: "Only if the item arrives damaged, defective, or incorrect—otherwise, sale and clearance items are final sale."
    },
    {
      question: "Do you accept returns for e-books or digital products?",
      answer: "No, all digital purchases are non-refundable and non-exchangeable."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold text-foreground mb-8">Return & Exchange</h1>
            
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

export default ReturnExchange;