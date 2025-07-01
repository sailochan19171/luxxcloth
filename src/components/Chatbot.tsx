
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { ChatMessage } from '../types/index';

// Static constants for Groq API
const _groqApiKey = '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';
const _groqBaseUrl = 'https://api.groq.com/openai/v1/chat/completions';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your LUXE fashion assistant. Ask me about our luxury products, including clothing, footwear, jewelry, and accessories, or get styling advice. What\'s on your mind?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string, retryCount = 0): Promise<string> => {
    const maxRetries = 2;
    if (!userMessage.trim()) {
      return 'Please enter a valid message.';
    }

    const requestBody = {
      model: 'mixtral-8x7b-32768', // Fallback: 'llama3-8b-8192' if mixtral fails
      messages: [
        {
          role: 'system',
          content: `You are a fashion assistant for LUXE, a premium luxury brand with 25 products. Key items:
- Clothing: Luxury Silk Dress ($299.99, S-L, Black/Red), Leather Jacket ($249.99, M-XL, Black/Brown), Denim Jeans ($79.99, 30-34, Navy/Black)
- Footwear: Chelsea Boots ($129.99, 8-10, Black/Brown), High-Heel Pumps ($109.99, 7-9, Black/Red)
- Jewelry: Gold Necklace ($499.99, Gold), Diamond Earrings ($799.99, Silver)
- Accessories: Sunglasses ($99.99, Black/Brown), Leather Wallet ($49.99, Black/Brown)
Brand: 20+ years, timeless designs, high-quality materials, worldwide shipping, 30-day returns, styling services.
Instructions: Provide specific product details. Redirect unavailable items to our collection. Offer styling advice (e.g., Silk Dress with Gold Necklace). Be professional, concise, enthusiastic. If unsure, suggest contacting support.`
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 300,
      temperature: 0.7,
    };

    try {
      console.log('Sending Groq API request:', JSON.stringify(requestBody, null, 2));
      const response = await fetch(_groqBaseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${_groqApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API request failed: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Groq API response:', data);
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid response format: No content found');
      }
      return content;
    } catch (error) {
      console.error(`Error calling Groq API (attempt ${retryCount}/${maxRetries}):`, error);
      if (retryCount < maxRetries) {
        console.log(`Retrying API call (${retryCount + 1}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return generateResponse(userMessage, retryCount + 1);
      }
      return `I'm sorry, I couldn't connect to provide a detailed response. LUXE offers luxury items like the Silk Dress ($299.99), Chelsea Boots ($129.99), and Gold Necklace ($499.99). How else can I assist you?`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
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
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error('handleSendMessage error:', error);
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Sorry, I encountered an error. Please try again or ask about our collections!',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
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
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
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
          <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
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
                    <time className="text-xs text-gray-400 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
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
                aria-label="Type your message"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
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
