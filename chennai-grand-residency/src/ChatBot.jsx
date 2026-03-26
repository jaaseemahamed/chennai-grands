import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ROOMS, FLOW, LANDING_FLOW } from "./ChatBotData";
import { ChatMessage, RoomRecommendationCard, AllRoomsCards } from "./ChatBotComponents";
import "./ChatBot.css";

// ─── Main ChatBot Component ──────────────────────────────────────────────────
export default function ChatBot({ 
    onBookNow, 
    propertyName = "Chennai Grand Residency", 
    propertyLocation = "Near Manorama Building, Pachamarathu Odai, Naidupuram, Kodaikanal", 
    googleMapsLink = "https://maps.app.goo.gl/y2HpCeBNegftkiMfA",
    mode: appMode,
    onSelectProperty 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState("welcome");
    const [userData, setUserData] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);
    const [started, setStarted] = useState(false);
    const [inputText, setInputText] = useState("");
    const [mode, setChatMode] = useState("guided"); // local chat mode: "guided" | "freetext"
    
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // ─── Optimizations ────────────────────────────────────────────────────────
    
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    const flowData = useMemo(() => {
        if (appMode === "landing") return LANDING_FLOW;
        return [
            {
                id: "welcome",
                message: `Hello there! 👋 Welcome to **${propertyName}**, your luxury retreat in Kodaikanal!\n\nI'm **Aria**, your personal AI room advisor. I'll help you find the **perfect room** for your stay. Ready to begin?`,
                options: [
                    { label: "🌟 Yes, help me find the perfect room!", next: "purpose" },
                    { label: "📋 Tell me about your rooms first", next: "all_rooms" },
                    { label: "📍 Where are you located?", next: "location" },
                ],
            },
            {
                id: "all_rooms",
                message: `We have **3 beautiful room categories** at ${propertyName}:\n\n🛏️ **Standard Room** – Great value, queen bed, views, up to 5 rooms\n👑 **Deluxe Room** – King bed, panoramic village views, most popular, up to 2 rooms\n✨ **Luxury Suite** – Private balcony, separate living area, concierge, up to 3 rooms\n\nAll rooms come with free WiFi, daily housekeeping & premium toiletries!\n\nNow let's find out which one suits YOU best!`,
                options: [{ label: "🎯 Help me choose the right one", next: "purpose" }],
            },
            {
                id: "location",
                message: `📍 We are located at:\n\n**${propertyLocation}**\n\nYou can find us easily on Google Maps. We're nestled in a scenic area with breathtaking views all around!\n\nShall I help you find the perfect room for your stay? 😊`,
                options: [{ label: "🛏️ Yes, help me find a room!", next: "purpose" }],
            },
            ...FLOW.slice(3)
        ];
    }, [appMode, propertyName, propertyLocation]);

    const getAIResponse = useCallback((input) => {
        const text = input.toLowerCase().trim();
        if (/^(hi|hello|hey|good\s*(morning|evening|afternoon)|namaste|vanakkam)/i.test(text)) {
            return `Hello! 😊 Welcome to ${propertyName}! I'm Aria, your AI room advisor. How can I help you today? You can ask me about our rooms, amenities, location, pricing, or anything else!`;
        }
        if (/standard|cheap|budget|affordable|economy|value/i.test(text)) {
            const r = ROOMS.standard;
            return `🛏️ **Standard Room** – ${r.desc}\n\n✅ Features: ${r.features.join(", ")}\n\n🎯 Ideal for: ${r.ideal}\n\nWould you like to book this room or explore other options?`;
        }
        if (/deluxe|king|popular|mid|middle|panoramic/i.test(text)) {
            const r = ROOMS.deluxe;
            return `👑 **Deluxe Room** – ${r.desc}\n\n✅ Features: ${r.features.join(", ")}\n\n🎯 Ideal for: ${r.ideal}\n\nWould you like to book this room or explore other options?`;
        }
        if (/luxury|suite|best|premium|balcony|concierge|family|honeymoon|anniversary|special/i.test(text)) {
            const r = ROOMS.luxury;
            return `✨ **Luxury Suite** – ${r.desc}\n\n✅ Features: ${r.features.join(", ")}\n\n🎯 Ideal for: ${r.ideal}\n\nWould you like to book this room or explore other options?`;
        }
        if (/price|cost|rate|tariff|charge|how much/i.test(text)) {
            return "💰 For the latest pricing and special offers, please contact us:\n\n📞 **+91 93421 06671** | **+91 97890 58023**\n\nPrices vary based on season and availability. We offer the best value for mountain retreats in Kodaikanal! 🏔️";
        }
        if (/wifi|internet|network/i.test(text)) {
            return "📶 **Yes! Free High-Speed WiFi** is available in all our rooms.";
        }
        if (/park|vehicle|car|bike/i.test(text)) {
            return "🅿️ **Yes! Free Secure Parking** is available for all guests.";
        }
        if (/food|eat|dining|restaurant|breakfast/i.test(text)) {
            return "🍽️ **In-Room Dining is available 24/7!**\n\nWe offer a variety of delicious meals that can be served right to your room.";
        }
        if (/check.?in|check.?out|time/i.test(text)) {
            return "⏰ **Check-in & Check-out Times:**\n\n🟢 **Check-in:** 12:00 PM\n🔴 **Check-out:** 11:00 AM";
        }
        if (/amenities|facilities|feature/i.test(text)) {
            return "🏨 **Our Amenities Include:**\n\n🏔️ Mountain Views\n📶 High-Speed WiFi\n🍽️ In-Room Dining (24/7)\n🅿️ Free Parking\n🧹 Daily Housekeeping\n🛁 Premium Toiletries\n❄️ Air Conditioning\n📺 Smart TV";
        }
        if (/location|address|where|direction|map/i.test(text)) {
            return `📍 **${propertyName}**\n${propertyLocation}\n\n🗺️ [View on Google Maps](${googleMapsLink})`;
        }
        if (/contact|phone|call|number/i.test(text)) {
            return `📞 **Contact ${propertyName}:**\n\n📱 +91 93421 06671\n📱 +91 97890 58023`;
        }
        if (/book|reserve|reservation/i.test(text)) {
            return `🏨 **Ready to Book?**\n\nYou can call us directly: **+91 93421 06671**\n\nOr I can guide you to the perfect room!`;
        }
        if (/kodaikanal|kodai|attractions|visit/i.test(text)) {
            return "🏔️ **Kodaikanal Top Attractions:**\n\n🌊 Kodaikanal Lake\n🌿 Coaker's Walk\n🌺 Bryant Park\n🚶 Pillar Rocks\n🌁 Dolphin's Nose Viewpoint";
        }
        if (/view|scene|nature|mountain/i.test(text)) {
            return `🌄 **Breathtaking Views at ${propertyName}!** Wake up every morning to misty hills and fresh mountain air! 🏔️`;
        }
        if (/thank|thanks|helpful/i.test(text)) {
            return `You're most welcome! 😊 If you have any more questions about ${propertyName}, I'm always here!`;
        }
        if (/bye|goodbye|cya/i.test(text)) {
            return `Goodbye! 👋 We look forward to welcoming you to ${propertyName} soon!`;
        }
        return `I'm here to help you find the perfect room at ${propertyName}! 😊\n\nYou can ask about room types, pricing, location, or our interactive room finder!`;
    }, [propertyName, propertyLocation, googleMapsLink]);

    const getRecommendationKey = useCallback((data) => {
        const { purpose, budget, view, size, duration } = data;
        if (budget === "luxury" || view === "balcony" || purpose === "special" || purpose === "family" || size === "large" || size === "medium") return "luxury";
        if (purpose === "couple" || purpose === "business" || budget === "mid" || view === "panoramic" || duration === "long") return "deluxe";
        return "standard";
    }, []);

    // ─── Effects ─────────────────────────────────────────────────────────────
    
    useEffect(() => {
        if (isOpen && !started) {
            setStarted(true);
            const initialMsg = flowData?.[0]?.message || "Hello! How can I help you today? 😊";
            setMessages([{ role: "bot", text: initialMsg, step: "welcome" }]);
        }
    }, [isOpen, started, flowData]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, scrollToBottom]);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setHasNewMsg(true), 15000); // Reduced frequency
            return () => clearTimeout(timer);
        } else {
            setHasNewMsg(false);
        }
    }, [isOpen]);

    // ─── Handlers ────────────────────────────────────────────────────────────

    const addBotMessage = useCallback((text, extra = {}) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: "bot", text, ...extra }]);
        }, 300 + Math.random() * 200);
    }, []);

    const handleOptionClick = useCallback((option) => {
        const userText = option.label;
        const nextStep = option.next;
        const oData = option.data || {};
        
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setUserData(prev => {
            const newData = { ...prev, ...oData };
            
            // Handle logical routing after state update
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                if (appMode === "landing" && nextStep === "go_hill") {
                    onSelectProperty?.("hill");
                    return;
                }
                if (appMode === "landing" && nextStep === "go_city") {
                    onSelectProperty?.("city");
                    return;
                }

                if (nextStep === "property_recommend") {
                    const pref = newData.preference;
                    const resortKey = pref === "city" ? "city" : "hill";
                    const propertyTitle = pref === "nature" ? "**Chennai Grand Residency (Hill & Mountain View)**" : 
                                       pref === "city" ? "**Roshan's Chennai Grand Residency (City View)**" :
                                       "either of our stunning properties!";
                    
                    setMessages(prevMsgs => [...prevMsgs, {
                        role: "bot",
                        text: `I recommend our ${propertyTitle}! 🎉 It matches your preference perfectly.\n\nWould you like to head over to that property page?`,
                        step: "prop_recommend",
                        resortKey: resortKey,
                    }]);
                } else if (nextStep === "room_recommend") {
                    const recKey = getRecommendationKey(newData);
                    setRecommendation(recKey);
                    setCurrentStep("room_recommend");
                    const room = ROOMS[recKey];
                    setMessages(prevMsgs => [...prevMsgs, {
                        role: "bot",
                        text: `Based on your preferences, I recommend the **${room.name}** ${room.emoji}!\n\nHere are the details:`,
                        step: "room_recommend",
                        roomKey: recKey,
                    }]);
                } else {
                    const nextFlow = flowData.find(f => f.id === nextStep);
                    if (nextFlow) {
                        setCurrentStep(nextStep);
                        setMessages(prevMsgs => [...prevMsgs, { role: "bot", text: nextFlow.message, step: nextStep }]);
                    }
                }
            }, 250);
            
            return newData;
        });
    }, [appMode, flowData, getRecommendationKey, onSelectProperty]);

    const handleSendMessage = useCallback((e) => {
        e?.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed || isTyping) return;

        setMessages(prev => [...prev, { role: "user", text: trimmed }]);
        setInputText("");

        const lcm = trimmed.toLowerCase();
        
        // Quick short-circuits for specific booking requests
        if (/book.*standard|standard.*book/i.test(lcm)) {
            addBotMessage("Opening booking for **Standard Room**! 🛏️");
            setTimeout(() => onBookNow?.("Standard Room"), 800);
            return;
        }
        if (/book.*deluxe|deluxe.*book/i.test(lcm)) {
            addBotMessage("Opening booking for **Deluxe Room**! 👑");
            setTimeout(() => onBookNow?.("Deluxe Room"), 800);
            return;
        }
        if (/book.*luxury|luxury.*book|book.*suite|suite.*book/i.test(lcm)) {
            addBotMessage("Opening booking for **Luxury Suite**! ✨");
            setTimeout(() => onBookNow?.("Luxury Suite"), 800);
            return;
        }
        if (/all rooms|show rooms|see rooms|view rooms/i.test(lcm)) {
            addBotMessage("Here's a quick overview of all our rooms! 🏨");
            setTimeout(() => setMessages(prev => [...prev, { role: "bot", text: "_allrooms_", step: "allrooms" }]), 600);
            return;
        }

        addBotMessage(getAIResponse(trimmed));
    }, [inputText, isTyping, addBotMessage, getAIResponse, onBookNow]);

    const handleRestart = useCallback(() => {
        const initialMsg = flowData?.[0]?.message || "Hello! How can I help you today? 😊";
        setMessages([{ role: "bot", text: initialMsg, step: "welcome" }]);
        setCurrentStep("welcome");
        setUserData({});
        setRecommendation(null);
        setChatMode("guided");
        setIsTyping(false);
    }, [flowData]);

    const switchToFreeText = useCallback(() => {
        setChatMode("freetext");
        addBotMessage("Switched to **free chat mode**! 💬 Ask me anything!");
        setTimeout(() => inputRef.current?.focus(), 800);
    }, [addBotMessage]);

    const currentFlow = useMemo(() => flowData.find(f => f.id === currentStep), [flowData, currentStep]);
    const showOptions = !isTyping && currentStep !== "room_recommend" && mode === "guided";
    const showRestart = !isTyping && currentStep === "room_recommend" && recommendation;

    return (
        <div className="chatbot-container">
            {/* FAB */}
            <button
                className={`chatbot-fab ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(v => !v)}
                aria-label="Toggle Chat"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" /></svg>
                ) : (
                    <>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="10" r="1" fill="white" /><circle cx="12" cy="10" r="1" fill="white" /><circle cx="15" cy="10" r="1" fill="white" /></svg>
                        {hasNewMsg && <span className="fab-badge" />}
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">
                        <div className="chatbot-header-avatar"><span>AI</span><span className="online-dot" /></div>
                        <div className="chatbot-header-info">
                            <div className="chatbot-title">Aria · AI Advisor</div>
                            <div className="chatbot-subtitle">Online for you</div>
                        </div>
                        <div className="header-actions">
                            <button className="header-action-btn" onClick={handleRestart} title="Restart"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 4v6h6M23 20v-6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M20.49 9A9 9 0 1 0 21.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg></button>
                            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg></button>
                        </div>
                    </div>

                    <div className="mode-toggle-bar">
                        <button className={`mode-btn ${mode === "guided" ? "active" : ""}`} onClick={() => setChatMode("guided")}>🎯 Guided</button>
                        <button className={`mode-btn ${mode === "freetext" ? "active" : ""}`} onClick={switchToFreeText}>💬 Free Chat</button>
                    </div>

                    <div className="chatbot-body">
                        {messages.map((msg, i) => (
                            <React.Fragment key={i}>
                                {msg.step === "allrooms" ? (
                                    <div className="rec-card-wrapper"><AllRoomsCards onBookNow={onBookNow} /></div>
                                ) : (
                                    <ChatMessage msg={msg} />
                                )}
                                {msg.step === "room_recommend" && msg.roomKey && (
                                    <div className="rec-card-wrapper"><RoomRecommendationCard roomKey={msg.roomKey} onBookNow={onBookNow} /></div>
                                )}
                            </React.Fragment>
                        ))}

                        {isTyping && (
                            <div className="chat-message bot">
                                <div className="bot-avatar"><span>AI</span></div>
                                <div className="message-bubble bot-bubble typing-indicator"><span /><span /><span /></div>
                            </div>
                        )}

                        {appMode === "landing" && messages[messages.length-1]?.step === "prop_recommend" && (
                            <div className="chat-options">
                                <button className="chat-option-btn start-over-btn" onClick={() => onSelectProperty?.(messages[messages.length-1].resortKey)}>✨ Take me there now!</button>
                                <button className="chat-option-btn restart-btn" onClick={handleRestart}>🔄 Explore other options</button>
                            </div>
                        )}

                        {showOptions && currentFlow?.options?.map((opt, i) => (
                            <div key={i} className="chat-options">
                                <button className="chat-option-btn" onClick={() => handleOptionClick(opt)}>{opt.label}</button>
                            </div>
                        ))}
                        
                        {showOptions && mode === "guided" && (
                            <div className="chat-options">
                                <button className="chat-option-btn switch-btn" onClick={switchToFreeText}>💬 I'd rather type my question</button>
                            </div>
                        )}

                        {showRestart && (
                            <div className="chat-options">
                                <button className="chat-option-btn restart-btn" onClick={handleRestart}>🔄 Start Over</button>
                                <button className="chat-option-btn switch-btn" onClick={switchToFreeText}>💬 I have more questions</button>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {mode === "freetext" && (
                        <>
                            <div className="quick-chips-bar">
                                {["Rooms", "Pricing", "Location", "Amenities"].map((chip, i) => (
                                    <button key={i} className="quick-chip" onClick={() => {
                                        setMessages(prev => [...prev, { role: "user", text: chip }]);
                                        addBotMessage(getAIResponse(chip));
                                    }}>{chip}</button>
                                ))}
                            </div>
                            <form className="chatbot-input-area" onSubmit={handleSendMessage}>
                                <input ref={inputRef} className="chatbot-input" type="text" placeholder="Ask me anything..." value={inputText} onChange={e => setInputText(e.target.value)} autoComplete="off" maxLength={300} />
                                <button className="chatbot-send-btn" type="submit" disabled={!inputText.trim() || isTyping} aria-label="Send">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </button>
                            </form>
                        </>
                    )}
                    <div className="chatbot-footer">🤖 Powered by CGR AI Advisor • Aria</div>
                </div>
            )}
        </div>
    );
}
