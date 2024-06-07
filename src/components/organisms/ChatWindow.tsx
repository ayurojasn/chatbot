import React, { useState, useEffect, useRef } from 'react';
import Bubble from '../atoms/Bubble';
import ChatInput from '../molecules/ChatInput';
import TypingIndicator from '../atoms/TypingIndicator';
import ProductCarousel from '../molecules/ProductCarousel';
import '../../assets/styles/ChatWindow.css';

interface Message {
  text: string;
  isUser: boolean;
  isProductRecommendation?: boolean;
  products?: Product[];
  timestamp: string;
}

interface Product {
  id: string;
  displayTitle: string;
  imageUrl: string;
  price: string;
  url: string;
}

const ChatWindow: React.FC = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const month = now.toLocaleString('default', { month: 'long' });
  const day = now.getDate();
  const timestamp = `${timeString} | ${month} ${day}`;
  const [messages, setMessages] = useState<Message[]>([{ text: "Hello there! Do you need any help?", isUser: false, timestamp }]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch('https://api.wizybot.com/products/demo-product-list');
    const data = await response.json();
    const shuffledProducts = data.sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, 3);
    return selectedProducts;
  };

  const handleSend = async () => {
    if (currentMessage.trim()) {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const month = now.toLocaleString('default', { month: 'long' });
      const day = now.getDate();
      const timestamp = `${timeString} | ${month} ${day}`;

      setMessages([...messages, { text: currentMessage, isUser: true, timestamp }]);
      setCurrentMessage('');
      setIsTyping(true);

      if (currentMessage.toLowerCase() === 'I want product recommendations') {
        const products = await fetchProducts();
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prevMessages) => [...prevMessages, { text: '', isUser: false, isProductRecommendation: true, products, timestamp }]);
        }, 4000);
      } else {
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prevMessages) => [...prevMessages, { text: "Lorem ipsum dolor sit amet...", isUser: false, timestamp}]);
        }, 4000);
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-window" id="chat-window">
      <div className="messages">
        {messages.map((message, index) => (
          message.isProductRecommendation ? (
            <ProductCarousel key={index} products={message.products || []} />
          ) : (
            <Bubble key={index} message={message.text} isUser={message.isUser} timestamp={message.timestamp}/>
          )
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput message={currentMessage} setMessage={setCurrentMessage} handleSend={handleSend} />
    </div>
  );
};

export default ChatWindow;