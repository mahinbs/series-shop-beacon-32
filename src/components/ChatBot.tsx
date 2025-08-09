import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, User, Bot, Phone, Mail, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI assistant. I can help you with questions about our manga, orders, shipping, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const predefinedResponses = {
    greeting: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'
    ],
    shipping: [
      'shipping', 'delivery', 'when will my order arrive', 'tracking', 'shipping time'
    ],
    orders: [
      'order', 'my order', 'order status', 'cancel order', 'modify order'
    ],
    payment: [
      'payment', 'pay', 'credit card', 'refund', 'billing', 'coins'
    ],
    products: [
      'manga', 'book', 'series', 'volume', 'merchandise', 'figures'
    ],
    account: [
      'account', 'profile', 'login', 'password', 'register', 'sign up'
    ]
  };

  const responses = {
    greeting: "Hello! I'm here to help you with any questions about our manga collection, orders, or services. What would you like to know?",
    shipping: "We offer several shipping options:\n• Standard shipping: 5-7 business days\n• Express shipping: 2-3 business days\n• Premium shipping: 1-2 business days\n\nYou can track your order using the tracking number sent to your email. Need help with a specific order?",
    orders: "I can help you with order-related questions:\n• Check order status\n• Modify orders (within 2 hours)\n• Cancel orders (if not shipped)\n• Reorder previous purchases\n\nPlease provide your order number for specific assistance, or would you like me to connect you with customer care?",
    payment: "We accept:\n• Credit/Debit cards (Visa, MasterCard, AmEx)\n• Digital coins (our reward system)\n• PayPal\n• Apple Pay & Google Pay\n\nFor refunds or billing issues, I can connect you with our customer care team.",
    products: "Our collection includes:\n• Digital manga volumes\n• Physical manga series\n• Light novels\n• Exclusive merchandise\n• Limited edition figures\n\nYou can browse by genre, author, or series. Looking for something specific?",
    account: "For account assistance:\n• Create account: Click 'Sign Up' in the top menu\n• Login issues: Use 'Forgot Password'\n• Profile settings: Access through your profile icon\n• Wishlist management: Available in your account\n\nNeed help with a specific account issue?",
    default: "I understand you're looking for help, but I'm not sure about that specific question. Let me connect you with our customer care team who can provide more detailed assistance.",
    escalation: "I'll connect you with our customer care team for personalized assistance. You can:\n• Call us: +1-800-MANGA-01\n• Email: support@crosshearts.com\n• Live chat with a human agent\n\nWould you like me to start a live chat session with our team?"
  };

  const quickReplies = [
    "Order Status",
    "Shipping Info",
    "Payment Help",
    "Browse Manga",
    "Contact Support"
  ];

  const getResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase().trim();
    
    for (const [category, keywords] of Object.entries(predefinedResponses)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        return responses[category as keyof typeof responses];
      }
    }
    
    if (message.includes('help') || message.includes('support') || message.includes('customer care')) {
      return responses.escalation;
    }
    
    return responses.default;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(text),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const ContactOptions = () => (
    <div className="p-4 bg-gray-800 rounded-lg mt-4">
      <h4 className="text-white font-semibold mb-3">Contact Customer Care</h4>
      <div className="space-y-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-white border-gray-600 hover:bg-gray-700"
          onClick={() => window.open('tel:+1-800-MANGA-01')}
        >
          <Phone className="w-4 h-4 mr-2" />
          Call: +1-800-MANGA-01
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-start text-white border-gray-600 hover:bg-gray-700"
          onClick={() => window.open('mailto:support@crosshearts.com')}
        >
          <Mail className="w-4 h-4 mr-2" />
          Email: support@crosshearts.com
        </Button>
      </div>
    </div>
  );

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-2 z-50">
        {/* Text with waving hand */}
        <div className="mb-2 mr-4 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-lg relative animate-bounce">
          <div className="flex items-center space-x-1">
            <Hand className="w-4 h-4 animate-[wave_0.5s_ease-in-out_infinite_alternate]" />
            <span className="text-sm font-medium">Let's chat!</span>
          </div>
          <div className="absolute bottom-0 right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white transform translate-y-full"></div>
        </div>
        
        {/* Chat button */}
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-full shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-110 animate-[pop_2s_ease-in-out_infinite]"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-[90vw] h-[600px] max-h-[80vh] bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Crossed Hearts AI Support</h3>
            <p className="text-xs opacity-90">Online now</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-red-700 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.sender === 'bot' && (
                  <Bot className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                )}
                {message.sender === 'user' && (
                  <User className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                )}
                <div className="text-sm whitespace-pre-line">{message.text}</div>
              </div>
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-red-400" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 2 && (
        <div className="p-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact Options */}
      {messages.some(msg => msg.text.includes('customer care') || msg.text.includes('live chat')) && (
        <div className="p-4 border-t border-gray-700">
          <ContactOptions />
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
          />
          <Button
            onClick={() => sendMessage(inputValue)}
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;