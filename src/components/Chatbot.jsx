import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, User, Bot, Settings, BarChart3, Trash2,Expand,Shrink,PanelBottomOpen ,PanelTopOpen } from 'lucide-react';
import { convertMarkdownToHTML } from '../utils/MarkdownToHtml';

// Stateful data store (persists across component re-renders)
const chatState = {
  messages: [
    {
      id: 1,
      text: "Hello! I'm your DSA Study Bot. Ask me anything about Data Structures and Algorithms!",
      sender: 'bot',
      timestamp: new Date()
    }
  ],
  sessionStartTime: new Date(),
  totalQuestions: 0,
  favoriteTopics: [],
  userName: null,
  chatSettings: {
    theme: 'light',
    soundEnabled: true,
    showTimestamps: false
  }
};

const prompt=`You are a DSA Tutor Bot. Only help with Data Structures and Algorithms.
If the question is not related to DSA, respond with:
if user greets you, respond greeting back in a friendly manner.
"I'm here to help only with DSA-related topics. Please ask a relevant question."`

const DSAStudyBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(chatState.messages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    questionsAsked: chatState.totalQuestions,
    sessionDuration: 0,
    favoriteTopics: chatState.favoriteTopics
  });
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Update session duration periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const duration = Math.floor((new Date() - chatState.sessionStartTime) / 1000);
      setSessionStats(prev => ({ ...prev, sessionDuration: duration }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Persist messages to stateful store whenever messages change
  useEffect(() => {
    chatState.messages = messages;
  }, [messages]);

  // Analyze topic preferences
  const analyzeTopicPreference = (userMessage) => {
    const topics = {
      'arrays': ['array', 'sorting', 'searching'],
      'linkedlist': ['linked list', 'node', 'pointer'],
      'trees': ['tree', 'binary tree', 'bst', 'traversal'],
      'graphs': ['graph', 'dfs', 'bfs', 'dijkstra'],
      'dp': ['dynamic programming', 'dp', 'knapsack', 'fibonacci'],
      'strings': ['string', 'pattern', 'substring']
    };

    const lowerMessage = userMessage.toLowerCase();
    Object.entries(topics).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        if (!chatState.favoriteTopics.includes(topic)) {
          chatState.favoriteTopics.push(topic);
        }
      }
    });
  };

  // Simulate Gemini API call (replace with actual API integration)
  const callGeminiAPI = async (userMessage) => {
    // Note: Replace this with your actual Gemini API key and endpoint
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = import.meta.env.VITE_GEMINI_API_URL;

    try {
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${prompt} ${userMessage}`
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      // Fallback response for demo purposes
      return `Api call failed: ${error.message}`;
    }
  };


  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    // Update stateful data
    chatState.totalQuestions += 1;
    analyzeTopicPreference(inputText);
    setSessionStats(prev => ({ 
      ...prev, 
      questionsAsked: chatState.totalQuestions,
      favoriteTopics: [...chatState.favoriteTopics]
    }));

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const botResponse = await callGeminiAPI(currentInput);
      
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting right now. Please try again later!",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

    const formatMessage = (text) => {
    if (showMarkdown) {
      return convertMarkdownToHTML(text);
    }else{
        return text.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>')
                     .replace(/(\*|_)(.*?)\1/g, '<em>$2</em>')
                     .replace(/`(.*?)`/g, '<code>$1</code>')
                     .replace(/\n/g, '<br />');
    }
  };

  const clearChatHistory = () => {
    const welcomeMessage = {
      id: 1,
      text: "Hello! I'm your DSA Study Bot. Ask me anything about Data Structures and Algorithms!",
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    chatState.messages = [welcomeMessage];
    chatState.totalQuestions = 0;
    chatState.favoriteTopics = [];
    setSessionStats({
      questionsAsked: 0,
      sessionDuration: 0,
      favoriteTopics: []
    });
  };

  const [fullScreen, setFullScreen] = useState(false);
    const toggleFullScreen = () => {
        setFullScreen(!fullScreen);
    };

    // Render the chatbot UI


  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Chat Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 pointer-events-auto flex items-center justify-center group"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform"/>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && ( 
        <div className={`fixed bottom-16 right-6 w-110 h-120 bg-white shadow-lg rounded-xl flex flex-col pointer-events-auto ${fullScreen ? 'inset-0 h-full w-full' : ''}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">DSA Study Bot</h3>

                <div className="text-xs flex space-x-2 text-blue-100 ">
                  <span>{sessionStats.questionsAsked} questions asked</span>
                  <span
                    onClick={clearChatHistory}
                    className=" text-blue-100 hover:text-red-600 text-xs flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Chat</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
            {/* show in markdown */}
            <button onClick={() => setShowMarkdown(!showMarkdown)} className="text-white hover:text-blue-200 transition-colors" title="Toggle Markdown">
              {showMarkdown ? <PanelTopOpen className='w-4 h-4' /> : <PanelBottomOpen className='w-4 h-4' />}
            </button>
              <button
                className="text-white hover:text-blue-200 transition-colors"
                title="Toggle Full Screen"
                onClick={toggleFullScreen}
              >
                {fullScreen ? <Shrink className='w-4 h-4' /> : <Expand className='w-4 h-4' />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close Chat"
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>


          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2  ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse max-w-lg' : ' max-w-4xl'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg px-3 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}>
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: formatMessage(message.text) 
                      }} 
                    />
                      
                    {chatState.chatSettings.showTimestamps && (
                      <div className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                    <div className="flex justify-between text-xs mt-1 pt-2 text-gray-500">
                        {message.sender==='user' ? (
                          <>
                            <span className="text-blue-100">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button onClick={() => navigator.clipboard.writeText(message.text)} className="ml-1 text-blue-100 hover:underline">Copy</button>
                          </>
                        ):<>
                            <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <button onClick={() => navigator.clipboard.writeText(message.text)} className="ml-1 text-blue-500 hover:underline">Copy</button>
                        </>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-xs">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-300 text-gray-600">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-3 py-2 text-sm">
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

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about DSA concepts..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DSAStudyBot;