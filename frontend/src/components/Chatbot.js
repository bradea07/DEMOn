import React, { useState, useRef, useEffect } from "react";
import "../Styles/Chatbot.css";

const Chatbot = ({ isOpen, toggleChatbot }) => {
  const [messages, setMessages] = useState([
    { text: "Salut! Sunt EcoBot, asistentul EcoSwap. Cu ce te pot ajuta?", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  
  // Scroll automat la mesajele noi
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  const handleInputChange = (e) => setInput(e.target.value);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === "") return;
    
    // Adaugă mesajul utilizatorului
    setMessages([...messages, { text: input, isBot: false }]);
    
    // Procesează întrebarea și generează răspunsul
    const response = generateResponse(input.toLowerCase());
    
    // Simulează un delay pentru un efect mai natural
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { text: response, isBot: true }]);
    }, 600);
    
    setInput("");
  };
  
  return (
    <div className="chatbot-container">
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">EcoBot</div>
            <p className="chatbot-subtitle">Asistentul tău pentru EcoSwap</p>
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
              >
                {message.isBot && <div className="bot-avatar"><i className="fas fa-robot"></i></div>}
                <div className="message-bubble">{message.text}</div>
                <div ref={index === messages.length - 1 ? messagesEndRef : null} />
              </div>
            ))}
          </div>
          
          <form className="chatbot-input-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Scrie un mesaj..."
              className="chatbot-input"
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
  // Reguli simple pentru chatbot
  if (input.includes("salut") || input.includes("buna") || input.includes("hey") || input.includes("hello") || input.includes("hi")) {
    return "Salut! Cu ce te pot ajuta astăzi pe EcoSwap?";
  }
  
  if (input.includes("cont") || input.includes("profil") || input.includes("inregistrare")) {
    return "Pentru a-ți crea un cont, apasă pe butonul 'Înregistrare' din colțul din dreapta sus. Completează informațiile cerute și vei putea începe să folosești toate funcționalitățile EcoSwap!";
  }
  
  if (input.includes("adauga") || input.includes("produs nou") || input.includes("vinde") || input.includes("add product")) {
    return "Pentru a adăuga un produs nou, accesează secțiunea 'Adaugă Produs' din meniul principal. Asigură-te că ai imagini de calitate și o descriere detaliată pentru a atrage mai mulți cumpărători!";
  }
  
  if (input.includes("cum cumpăr") || input.includes("cumpărare") || input.includes("achiziție") || input.includes("buy")) {
    return "Pentru a cumpăra un produs, navighează prin categorii sau folosește bara de căutare. Când găsești un produs interesant, apasă pe el și folosește butonul 'Contactează vânzătorul' pentru a iniția o conversație.";
  }
  
  if (input.includes("plata") || input.includes("plăti") || input.includes("bani") || input.includes("payment")) {
    return "EcoSwap este o platformă de anunțuri, iar plățile se fac direct între utilizatori, în afara platformei. Recomandăm întotdeauna să verifici produsul înainte de a face plata!";
  }
  
  if (input.includes("livrare") || input.includes("transport") || input.includes("primire") || input.includes("delivery")) {
    return "Modalitatea de livrare se stabilește direct între vânzător și cumpărător. Poți opta pentru întâlnire personală sau pentru servicii de curierat.";
  }
  
  if (input.includes("problema") || input.includes("ajutor") || input.includes("asistenta") || input.includes("help")) {
    return "Îmi pare rău că întâmpini probleme! Pentru asistență specifică, te rugăm să ne contactezi la support@ecoswap.ro sau să folosești formularul de contact din secțiunea 'Ajutor'.";
  }
  
  // Răspuns default
  return "Îmi pare rău, nu am înțeles întrebarea. Poți să reformulezi sau să întrebi despre: crearea unui cont, adăugarea unui produs, cum să cumperi, plăți, livrare sau probleme pe platformă.";
};

export default Chatbot;
