import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your fashion assistant. I can help you with information about our clothing collections, pricing, sizes, and styling advice. What would you like to know?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const GROQ_API_KEY = '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';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a knowledgeable fashion assistant for LUXE, a luxury clothing brand. You help customers with:

AVAILABLE PRODUCTS & PRICING:
- Cashmere Blend Coat: $899 (Outerwear, sizes XS-XL, colors: Black, Camel, Navy)
- Silk Midi Dress: $459 (Dresses, sizes XS-XL, colors: Ivory, Black, Burgundy)
- Tailored Blazer: $329 (Blazers, sizes XS-XL, colors: Black, Navy, Charcoal)
- Leather Handbag: $189 (Accessories, colors: Black, Brown, Tan)
- Wool Turtleneck: $149 (Knitwear, sizes XS-XL, colors: Cream, Black, Gray)
- Designer Sunglasses: $299 (Accessories, UV protection, various styles)

BRAND INFO:
- Premium luxury fashion brand established 20+ years
- Focus on timeless, elegant designs
- High-quality materials and craftsmanship
- Worldwide shipping available
- 30-day return policy
- Size guide available
- Personal styling services offered

Always be helpful, professional, and enthusiastic about fashion. Provide specific product details when asked. If asked about items not in our collection, politely redirect to what we do offer.`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'I apologize, but I\'m having trouble responding right now. Please try again or contact our customer service team.';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return 'I apologize, but I\'m having technical difficulties. Here are some quick facts: We offer luxury clothing including coats ($899), dresses ($459), blazers ($329), and accessories. All items come with a 30-day return policy and worldwide shipping. How else can I help you?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const botResponse = await generateResponse(inputMessage);
      
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponse,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'bg-gray-700 hover:bg-gray-800' 
            : 'bg-amber-600 hover:bg-amber-700 animate-pulse'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <MessageCircle size={24} className="text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">LUXE Assistant</h3>
                <p className="text-amber-100 text-sm">Fashion & Style Expert</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isUser ? 'bg-amber-600' : 'bg-gray-200'
                  }`}>
                    {message.isUser ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-2xl ${
                    message.isUser 
                      ? 'bg-amber-600 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-2 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Bot size={16} className="text-gray-600" />
                  </div>
                  <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-md">
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

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about our collections, prices, or styling..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;