
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactFAQ = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const { elementRef, isVisible } = useScrollAnimation(0.2);

  const faqs = [
    {
      question: "How do I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can also check your order status in your account dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, PayPal, and our own Crossed Hearts Coins system for all purchases."
    },
    {
      question: "How do I become a creator?",
      answer: "Visit our Creator Portal to submit your application. We review all submissions and respond within 5-7 business days."
    },
    {
      question: "What are Crossed Hearts Coins?",
      answer: "Coins are our virtual currency that can be used to purchase digital content. 1 coin equals approximately $0.01 USD."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section 
      ref={elementRef}
      className={`py-16 px-4 bg-gray-900 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto max-w-4xl">
        <div className={`text-center mb-12 transition-all duration-700 transform ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Frequently Asked <span className="text-red-500">Questions</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Find quick answers to common questions about our services and platform.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-lg border border-gray-700 overflow-hidden transition-all duration-700 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="w-5 h-5 text-red-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQ;
