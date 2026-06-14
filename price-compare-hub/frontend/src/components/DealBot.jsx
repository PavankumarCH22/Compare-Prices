import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { MessageSquare, X, Send, Mic, MicOff, Bot, Sparkles } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const DealBot = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am DealBot AI 🤖. How can I help you save money today?', isGreeting: true }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Voice Search setup using Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = null;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      handleSend(transcript); // auto send voice command
    };
    
    recognition.onerror = () => {
      setIsListening(false);
    };
  }

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      if (recognition) {
        recognition.start();
        setIsListening(true);
      } else {
        alert("Your browser does not support Voice Search.");
      }
    }
  };

  const handleSend = async (messageText = input) => {
    if (!messageText.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: messageText }];
    setMessages(newMessages);
    setInput('');

    // Add loading indicator
    setMessages([...newMessages, { sender: 'bot', text: '...', isLoading: true }]);

    try {
      const { data } = await axios.post('/api/ai/chat', { 
        message: messageText,
        userId: user ? user._id : null
      });
      
      setMessages([...newMessages, { 
        sender: 'bot', 
        text: data.reply,
        suggestedProducts: data.suggestedProducts,
        action: data.action,
        payload: data.payload
      }]);
    } catch (error) {
      setMessages([...newMessages, { sender: 'bot', text: 'Oops! I am having network issues.' }]);
    }
  };

  const handleCreateAlert = async (payload) => {
    if (!user) return alert("Please login first");
    try {
      await axios.post('/api/alerts', {
        productId: payload.productId,
        targetPrice: payload.targetPrice,
        email: user.email
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(prev => [...prev, { sender: 'bot', text: `✅ Alert created successfully for ₹${payload.targetPrice}!` }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: `❌ Failed to create alert: ${error.response?.data?.message || error.message}` }]);
    }
  };

  const suggestedQuestions = [
    "Best phone under ₹20000",
    "Where is iPhone 15 cheapest?",
    "Is Sony WH-1000XM5 worth buying?"
  ];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-2xl hover:bg-primary-700 transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden animate-fade-in" style={{ height: '500px', maxHeight: '80vh' }}>
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-6 h-6" />
              <span className="font-bold text-lg">DealBot AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                }`}>
                  {msg.isLoading ? (
                    <div className="flex space-x-1 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                  )}
                </div>
                
                {/* Product Suggestions */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="mt-2 flex gap-2 overflow-x-auto w-full pb-2">
                    {msg.suggestedProducts.map(p => (
                      <Link key={p.id} to={`/product/${p.id}`} onClick={() => setIsOpen(false)} className="flex-shrink-0 w-32 bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-primary-500 transition-colors">
                        <div className="h-20 bg-gray-100 flex items-center justify-center p-2">
                          <img src={p.image} alt={p.name} className="max-h-full w-full object-cover" />
                        </div>
                        <div className="p-2">
                          <p className="text-[10px] font-medium text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs font-bold text-green-600">₹{p.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* AI Action Buttons */}
                {msg.action === 'CREATE_ALERT' && (
                  <button 
                    onClick={() => handleCreateAlert(msg.payload)}
                    className="mt-2 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors"
                  >
                    Confirm Alert
                  </button>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions (if no messages or just greeting) */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto bg-gray-50 hide-scrollbar">
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleSend(q)}
                  className="flex-shrink-0 bg-white border border-blue-100 text-primary-700 text-xs px-3 py-1.5 rounded-full hover:bg-primary-50 whitespace-nowrap transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <button 
              onClick={toggleListen}
              className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask DealBot..."}
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent rounded-full px-4 py-2 text-sm transition-all"
            />
            <button 
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DealBot;
