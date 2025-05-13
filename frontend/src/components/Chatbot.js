import React, { useState, useRef, useEffect } from "react";
import "../Styles/Chatbot.css";

const Chatbot = ({ isOpen, toggleChatbot }) => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm EcoBot, your EcoSwap assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);  
  // Auto-scroll to new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleInputChange = (e) => setInput(e.target.value);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    // Add user message
    setMessages([...messages, { text: input, isBot: false }]);
    
    // Process the question and generate response
    const response = generateResponse(input.toLowerCase());
    
    // Show typing indicator
    setMessages(prevMessages => [...prevMessages, { text: "...", isBot: true, isTyping: true }]);
    
    // Simulate a delay for a more natural effect
    setTimeout(() => {
      setMessages(prevMessages => {
        // Remove typing indicator and add actual response
        const filteredMessages = prevMessages.filter(msg => !msg.isTyping);
        return [...filteredMessages, { text: response, isBot: true }];
      });
    }, 1000);
    
    setInput("");
  };
    return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">EcoBot</div>
            <p className="chatbot-subtitle">Your EcoSwap Assistant</p>
            <button 
              className="chatbot-close" 
              onClick={toggleChatbot}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >            {message.isBot && (
                <div className="bot-avatar">
                  <i className="fas fa-robot"></i>
                </div>
              )}
              <div className={`message-bubble ${message.isTyping ? 'typing' : ''}`}>
                {message.isTyping ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  message.text
                )}
              </div>
              <div ref={index === messages.length - 1 ? messagesEndRef : null} />
              </div>
            ))}
          </div>
            <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="chatbot-input"
              autoFocus
            />
            <button type="submit" className="chatbot-send">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

// Funcție pentru generarea răspunsurilor
const generateResponse = (input) => {
  // Simple rules for chatbot responses
  if (input.includes("hello") || input.includes("hi") || input.includes("hey") || input.includes("greetings")) {
    return "Hello there! How can I help you with EcoSwap today?";
  }
  
  if (input.includes("account") || input.includes("profile") || input.includes("register") || input.includes("sign up")) {
    return "To create an account, click the 'Sign Up' button in the top-right corner. Fill in your information and you'll be able to start using all EcoSwap features!";
  }
  
  if (input.includes("add product") || input.includes("sell") || input.includes("listing") || input.includes("post item")) {
    return "To add a new product, go to the 'Add Product' section in the main menu. Make sure to include high-quality images and detailed descriptions to attract more potential buyers or exchange partners!";
  }
  
  if (input.includes("how to buy") || input.includes("purchase") || input.includes("buying") || input.includes("get item")) {
    return "To acquire a product, browse through categories or use the search bar. When you find an interesting item, click on it and use the 'Contact Seller' button to start a conversation.";
  }
    if (input.includes("payment") || input.includes("pay") || input.includes("money") || input.includes("transaction")) {
    return "EcoSwap is a listing platform, and payments are made directly between users, outside of the platform. We always recommend checking the product before making payment!";
  }
  
  if (input.includes("delivery") || input.includes("shipping") || input.includes("transport") || input.includes("receive")) {
    return "Delivery methods are arranged directly between the seller and buyer. You can opt for in-person meetings or courier services.";
  }
  
  if (input.includes("issue") || input.includes("problem") || input.includes("help") || input.includes("support")) {
    return "I'm sorry you're experiencing problems! For specific assistance, please contact us at support@ecoswap.com or use the contact form in the 'Help' section.";
  }
  
  if (input.includes("forgot") || input.includes("reset") || input.includes("password")) {
    return "If you've forgotten your password, click on the 'Login' button and then select 'Forgot Password'. You'll receive an email with a link to reset your password. For security reasons, the link is valid for only 30 minutes.";
  }
  
  if (input.includes("scam") || input.includes("fraud") || input.includes("fake") || input.includes("suspicious")) {
    return "At EcoSwap, we take safety seriously. Always check seller ratings and reviews, meet in safe public places for item exchanges, and avoid wire transfers or gift cards as payment. If you encounter suspicious activity, report it immediately through the 'Report' button on the listing or user profile.";
  }
  
  if (input.includes("safety") || input.includes("safe") || input.includes("secure") || input.includes("protection")) {
    return "For your safety, we recommend: 1) Communicating through our platform, 2) Meeting in public places for exchanges, 3) Checking items thoroughly before payment, 4) Being wary of deals that seem too good to be true, and 5) Never sharing personal financial information with other users.";
  }
  
  if (input.includes("about") || input.includes("what is") || input.includes("ecoswap") || input.includes("purpose")) {
    return "EcoSwap is a platform for reusable exchange and smart recycling, where users can exchange, sell, and donate reusable items. Our goal is to reduce waste and support sustainability by extending the life of items like electronics, furniture, and clothing.";
  }
  
  if (input.includes("recycling") || input.includes("recycle") || input.includes("dispose") || input.includes("waste")) {
    return "EcoSwap provides tips on proper recycling to help users make environmentally friendly choices. You can find information about nearby recycling locations and guidance on how to recycle different products in our 'Recycling Info' section.";
  }
  
  if (input.includes("sustainability") || input.includes("environment") || input.includes("eco-friendly") || input.includes("green")) {
    return "Sustainability is at the core of EcoSwap's mission. By facilitating the reuse of items, we aim to reduce waste, conserve resources, and minimize environmental impact. Every item exchanged or sold on our platform is one less item in a landfill!";
  }
  
  if (input.includes("donate") || input.includes("donation") || input.includes("give away") || input.includes("charity")) {
    return "EcoSwap allows you to donate items you no longer need. Simply list your item and mark it as 'For Donation' in the price section. This is a great way to help others and reduce waste at the same time!";
  }
  
  if (input.includes("exchange") || input.includes("swap") || input.includes("trade") || input.includes("barter")) {
    return "EcoSwap facilitates item exchanges! You can list items you're willing to trade and specify what you're looking for in return. This is a sustainable way to acquire what you need without spending money.";
  }
    if (input.includes("notification") || input.includes("alert") || input.includes("inform") || input.includes("update")) {
    return "EcoSwap sends notifications when new items matching your interests are posted. You can customize your notification preferences in the 'Settings' section of your profile.";
  }
  
  if (input.includes("search") || input.includes("find") || input.includes("looking for") || input.includes("discover")) {
    return "To find specific items, use the search bar at the top of the home page. You can filter results by category, price range, condition, and location to narrow down your options.";
  }
  
  if (input.includes("benefits") || input.includes("advantage") || input.includes("why use") || input.includes("value")) {
    return "By using EcoSwap, you're helping reduce waste, conserving resources, saving money, and connecting with like-minded individuals in your community who value sustainability. It's a win for you and for the planet!";
  }
  
  if (input.includes("report") || input.includes("inappropriate") || input.includes("violation") || input.includes("against rules")) {
    return "If you come across content that violates our community guidelines, please use the 'Report' button on the item listing or user profile. Our moderation team reviews all reports and takes appropriate action to maintain a safe environment for all users.";
  }
  
  if (input.includes("privacy") || input.includes("data") || input.includes("information") || input.includes("personal data")) {
    return "We value your privacy. EcoSwap only collects the information necessary to provide our services. Your personal data is protected and never shared with third parties without consent. You can read our complete Privacy Policy in the footer of our website.";
  }
  
  if (input.includes("delete account") || input.includes("remove account") || input.includes("cancel account")) {
    return "If you wish to delete your EcoSwap account, please go to 'My Profile', select 'Security & Privacy', and use the 'Delete Account' option. Please note that this action is permanent and will remove all your listings and history.";
  }
    if (input.includes("prohibited") || input.includes("not allowed") || input.includes("forbidden") || input.includes("banned")) {
    return "Items that are prohibited on EcoSwap include: illegal goods, weapons, controlled substances, counterfeit items, adult content, recalled products, hazardous materials, and animals. Please refer to our Terms of Service for a complete list of prohibited items.";
  }
  
  if (input.includes("rating") || input.includes("feedback") || input.includes("review") || input.includes("reputation")) {
    return "After completing a transaction, you can rate your experience with the other user. High ratings and positive feedback help build trust in the community. Be honest but fair in your reviews, as they impact other users' decisions.";
  }
  
  if (input.includes("dispute") || input.includes("conflict") || input.includes("disagreement") || input.includes("resolution")) {
    return "If you have a dispute with another user, we encourage you to first try resolving it through direct communication. If that doesn't work, you can contact our support team who will help mediate the issue according to our dispute resolution policy.";
  }
  
  if (input.includes("verify") || input.includes("verification") || input.includes("authentic") || input.includes("legitimate")) {
    return "To help ensure authenticity, always check user reviews and ratings before committing to a transaction. For higher-value items, we recommend verifying the product in person before payment. EcoSwap also has a verification badge for trusted users who have completed our identity verification process.";
  }
  
  if (input.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with regarding EcoSwap?";
  }
  
  // Default response
  return "I'm not sure I understand your question. You can ask about creating an account, adding products, buying or exchanging items, recycling information, sustainability, safety tips, or any other features of the EcoSwap platform.";
};

export default Chatbot;
