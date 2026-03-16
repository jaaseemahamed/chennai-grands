import React, { useState, useEffect, useRef } from "react";

// ─── Room Data ───────────────────────────────────────────────────────────────
const ROOMS = {
    standard: {
        name: "Standard Room",
        emoji: "🛏️",
        price: "Best Value",
        desc: "Comfortable queen bed, mountain views, premium WiFi & modern amenities. Perfect for solo travellers or budget-conscious couples.",
        features: ["Queen Bed", "Mountain View", "Free WiFi", "Daily Housekeeping", "Up to 5 rooms available"],
        ideal: "Solo travellers, budget-friendly stays, short weekend trips",
        color: "#4a90d9",
        gradient: "linear-gradient(135deg, #4a90d9, #6ab0f5)",
    },
    deluxe: {
        name: "Deluxe Room",
        emoji: "👑",
        price: "Most Popular",
        desc: "Spacious king-size bed, panoramic Kodaikanal village views, premium WiFi, and upscale furnishings for a truly elevated stay.",
        features: ["King-Size Bed", "Panoramic Village View", "Premium WiFi", "In-Room Dining", "Up to 2 rooms available"],
        ideal: "Couples, anniversary trips, business travellers",
        color: "#d4af37",
        gradient: "linear-gradient(135deg, #d4af37, #f4d03f)",
    },
    luxury: {
        name: "Luxury Suite",
        emoji: "✨",
        price: "Ultimate Experience",
        desc: "Elegant suite with separate living area, private balcony overlooking the full village, and dedicated concierge service.",
        features: ["Separate Living Room", "Private Balcony", "Full Village View", "Concierge Service", "Up to 3 rooms available"],
        ideal: "Families, special occasions, honeymoon, extended stays",
        color: "#8b5cf6",
        gradient: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
    },
};

// ─── Conversation Flow ────────────────────────────────────────────────────────
const FLOW = [
    {
        id: "welcome",
        message: "Hello there! 👋 Welcome to **Chennai Grand Residency**, your luxury mountain retreat in Kodaikanal!\n\nI'm **Aria**, your personal AI room advisor. I'll help you find the **perfect room** for your stay. Ready to begin?",
        options: [
            { label: "🌟 Yes, help me find the perfect room!", next: "purpose" },
            { label: "📋 Tell me about your rooms first", next: "all_rooms" },
            { label: "📍 Where are you located?", next: "location" },
        ],
    },
    {
        id: "all_rooms",
        message: "We have **3 beautiful room categories** at Chennai Grand Residency:\n\n🛏️ **Standard Room** – Great value, queen bed, mountain views, up to 5 rooms\n👑 **Deluxe Room** – King bed, panoramic village views, most popular, up to 2 rooms\n✨ **Luxury Suite** – Private balcony, separate living area, concierge, up to 3 rooms\n\nAll rooms come with free WiFi, daily housekeeping & premium toiletries!\n\nNow let's find out which one suits YOU best!",
        options: [{ label: "🎯 Help me choose the right one", next: "purpose" }],
    },
    {
        id: "location",
        message: "📍 We are located at:\n\n**Near Manorama Building, Pachamarathu Odai, Naidupuram, Kodaikanal**\n\nYou can find us easily on Google Maps. We're nestled in a scenic area with breathtaking mountain views all around!\n\nShall I help you find the perfect room for your stay? 😊",
        options: [{ label: "🛏️ Yes, help me find a room!", next: "purpose" }],
    },
    {
        id: "purpose",
        message: "What brings you to Kodaikanal? 🏔️",
        options: [
            { label: "🧳 Solo travel / Work trip", next: "duration", data: { purpose: "solo" } },
            { label: "💑 Romantic getaway / Couple", next: "budget", data: { purpose: "couple" } },
            { label: "👨‍👩‍👧 Family vacation", next: "family_size", data: { purpose: "family" } },
            { label: "🎉 Special occasion (honeymoon / anniversary)", next: "budget", data: { purpose: "special" } },
            { label: "💼 Business / Conference", next: "budget", data: { purpose: "business" } },
        ],
    },
    {
        id: "family_size",
        message: "How many people will be staying? 👥",
        options: [
            { label: "2–3 people", next: "budget", data: { size: "small" } },
            { label: "4–5 people", next: "budget", data: { size: "medium" } },
            { label: "6+ people (need multiple rooms)", next: "budget", data: { size: "large" } },
        ],
    },
    {
        id: "duration",
        message: "How long is your stay? 📅",
        options: [
            { label: "1–2 nights", next: "budget", data: { duration: "short" } },
            { label: "3–5 nights", next: "budget", data: { duration: "medium" } },
            { label: "A week or more", next: "budget", data: { duration: "long" } },
        ],
    },
    {
        id: "budget",
        message: "What's your priority when choosing a room? 💰",
        options: [
            { label: "💚 Best value for money", next: "view", data: { budget: "economy" } },
            { label: "💛 Comfort & amenities", next: "view", data: { budget: "mid" } },
            { label: "💜 The absolute best experience!", next: "recommend", data: { budget: "luxury" } },
        ],
    },
    {
        id: "view",
        message: "How important is the view to you? 🌄",
        options: [
            { label: "🙂 A nice view would be good", next: "recommend", data: { view: "basic" } },
            { label: "😍 I want a stunning panoramic view!", next: "recommend", data: { view: "panoramic" } },
            { label: "🏡 Private balcony with a full village view", next: "recommend", data: { view: "balcony" } },
        ],
    },
    {
        id: "recommend",
        message: null,
        options: [],
    },
];

// ─── AI Text Response Engine ──────────────────────────────────────────────────
function getAIResponse(input) {
    const text = input.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|good\s*(morning|evening|afternoon)|namaste|vanakkam)/i.test(text)) {
        return "Hello! 😊 Welcome to Chennai Grand Residency! I'm Aria, your AI room advisor. How can I help you today? You can ask me about our rooms, amenities, location, pricing, or anything else!";
    }

    // Room types
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

    // Pricing
    if (/price|cost|rate|tariff|charge|how much|rupee|₹|inr|expensive|cheap/i.test(text)) {
        return "💰 For the latest pricing and special offers, please contact us:\n\n📞 **+91 93421 06671** | **+91 97890 58023**\n\nPrices vary based on season and availability. Our rooms range from budget-friendly Standard Rooms to luxurious Suites. We offer the best value for mountain retreats in Kodaikanal! 🏔️";
    }

    // WiFi
    if (/wifi|wi-fi|internet|network|connectivity/i.test(text)) {
        return "📶 **Yes! Free High-Speed WiFi** is available in all our rooms.\n\nWhether you're working remotely or streaming your favourite shows after a day of sightseeing, we've got you covered with reliable connectivity throughout the property!";
    }

    // Parking
    if (/park|vehicle|car|bike|two-wheeler|motorcycle/i.test(text)) {
        return "🅿️ **Yes! Free Secure Parking** is available for all guests.\n\nWe have ample parking space for cars, bikes, and other vehicles. The parking area is well-lit and safe throughout the day and night.";
    }

    // Food / Dining
    if (/food|eat|dining|restaurant|breakfast|lunch|dinner|meal|kitchen|room service/i.test(text)) {
        return "🍽️ **In-Room Dining is available 24/7!**\n\nWe offer a variety of delicious meals that can be served right to your room. Wake up to a fresh breakfast or enjoy a late-night meal without leaving the comfort of your room!\n\nFor specific menu inquiries, please contact us directly. 😊";
    }

    // Check-in / Check-out
    if (/check.?in|check.?out|arrival|departure|time|early|late/i.test(text)) {
        return "⏰ **Check-in & Check-out Times:**\n\n🟢 **Check-in:** 12:00 PM (Noon)\n🔴 **Check-out:** 11:00 AM\n\nNeed an early check-in or late check-out? Please contact us in advance and we'll do our best to accommodate you!\n\n📞 +91 93421 06671 | +91 97890 58023";
    }

    // Amenities
    if (/amenities|facilities|feature|include|provide|offer|service/i.test(text)) {
        return "🏨 **Our Amenities Include:**\n\n🏔️ Mountain Views\n📶 High-Speed WiFi\n🍽️ In-Room Dining (24/7)\n🅿️ Free Parking\n🧹 Daily Housekeeping\n🛁 Premium Toiletries\n❄️ Air Conditioning\n📺 Smart TV\n\nAll rooms come with these amenities as standard. Our Luxury Suite also includes exclusive concierge service & a private balcony! ✨";
    }

    // Location
    if (/location|address|where|direction|map|find you|how to reach|reach/i.test(text)) {
        return "📍 **Chennai Grand Residency**\nNear Manorama Building, Pachamarathu Odai, Naidupuram, Kodaikanal\n\n🗺️ [View on Google Maps](https://maps.app.goo.gl/y2HpCeBNegftkiMfA)\n\n🏔️ We're nestled in a scenic area of Kodaikanal with breathtaking mountain views. Easy to reach and close to major attractions!";
    }

    // Contact / Phone
    if (/contact|phone|call|number|reach|whatsapp|email|message/i.test(text)) {
        return "📞 **Contact Chennai Grand Residency:**\n\n📱 +91 93421 06671\n📱 +91 97890 58023\n\n🌐 You can also book directly on [Booking.com](https://www.booking.com/hotel/in/chennai-grand-residency-kodaikanal.en-gb.html)\n\nOur team is available to assist you anytime! 😊";
    }

    // Booking
    if (/book|reserve|reservation|available|availability|stay/i.test(text)) {
        return "🏨 **Ready to Book?**\n\nYou can:\n1️⃣ Use the **'Book Now'** button on any room card above\n2️⃣ Book on [Booking.com](https://www.booking.com/hotel/in/chennai-grand-residency-kodaikanal.en-gb.html)\n3️⃣ Call us directly: **+91 93421 06671**\n\nOr I can guide you to the perfect room! Just tell me more about your trip 😊";
    }

    // Kodaikanal / attractions
    if (/kodaikanal|kodai|places|attractions|sightseeing|visit|things to do|tourist/i.test(text)) {
        return "🏔️ **Kodaikanal Top Attractions:**\n\n🌊 Kodaikanal Lake – Boating & cycling\n🌿 Coaker's Walk – Stunning valley views\n🌺 Bryant Park – Beautiful garden\n💧 Silver Cascade Falls\n🚶 Pillar Rocks – Iconic landmark\n🌁 Dolphin's Nose Viewpoint\n\nAll attractions are easily accessible from our hotel. We can also arrange tours for our guests! 🗺️";
    }

    // View
    if (/view|scene|scenery|landscape|mountain|hill|nature|beauty|outside/i.test(text)) {
        return "🌄 **Breathtaking Views at CGR!**\n\n🛏️ Standard Room – Mountain views\n👑 Deluxe Room – Panoramic Kodaikanal village views\n✨ Luxury Suite – Full village view with **private balcony**\n\nWake up every morning to misty hills and the fresh mountain air! 🏔️ It's truly an unforgettable experience.";
    }

    // Recommendation start
    if (/recommend|suggest|which room|best room|what room|help me choose|guide me/i.test(text)) {
        return "🌟 I'd love to help you find the perfect room! Let me ask you a few quick questions.\n\nWhat's the purpose of your visit? (Solo travel, Couple, Family, or Special occasion?)";
    }

    // Thank you
    if (/thank|thanks|thx|ty|appreciate|helpful/i.test(text)) {
        return "You're most welcome! 😊 It's my pleasure to assist you. If you have any more questions about Chennai Grand Residency or need help choosing the perfect room, I'm always here!\n\nHave a wonderful stay in Kodaikanal! 🏔️🌸";
    }

    // Goodbye
    if (/bye|goodbye|see you|later|take care|cya/i.test(text)) {
        return "Goodbye! 👋 We look forward to welcoming you to Chennai Grand Residency soon! If you need any help before your visit, don't hesitate to reach out. Have a wonderful day! 🌟";
    }

    // Fallback
    return "I'm here to help you find the perfect room at Chennai Grand Residency! 😊\n\nYou can ask me about:\n🛏️ Room types & features\n💰 Pricing information\n📍 Location & directions\n📞 Contact details\n🍽️ Dining & amenities\n📅 Check-in/out times\n\nOr I can guide you through our interactive room finder!";
}

// ─── Recommendation Engine ────────────────────────────────────────────────────
function getRecommendation(userData) {
    const { purpose, budget, view, size, duration } = userData;

    if (
        budget === "luxury" ||
        view === "balcony" ||
        purpose === "special" ||
        purpose === "family" ||
        size === "large" ||
        size === "medium"
    ) return "luxury";

    if (
        purpose === "couple" ||
        purpose === "business" ||
        budget === "mid" ||
        view === "panoramic" ||
        duration === "long"
    ) return "deluxe";

    return "standard";
}

// ─── Format Text Component ────────────────────────────────────────────────────
function FormatText({ text }) {
    if (!text) return null;
    return text.split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        // Handle links [text](url)
        const renderPart = (part, j) => {
            const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
            const segments = [];
            let lastIndex = 0;
            let match;
            while ((match = linkRegex.exec(part)) !== null) {
                if (match.index > lastIndex) segments.push(part.slice(lastIndex, match.index));
                segments.push(<a key={j + match.index} href={match[2]} target="_blank" rel="noreferrer" className="chat-link">{match[1]}</a>);
                lastIndex = match.index + match[0].length;
            }
            if (lastIndex < part.length) segments.push(part.slice(lastIndex));
            return segments.length > 1 ? segments : part;
        };

        return (
            <span key={i}>
                {parts.map((part, j) =>
                    j % 2 === 1
                        ? <strong key={j}>{part}</strong>
                        : <span key={j}>{renderPart(part, j)}</span>
                )}
                {i < text.split("\n").length - 1 && <br />}
            </span>
        );
    });
}

// ─── Chat Message Component ──────────────────────────────────────────────────
function ChatMessage({ msg }) {
    const isBot = msg.role === "bot";
    return (
        <div className={`chat-message ${isBot ? "bot" : "user"}`}>
            {isBot && (
                <div className="bot-avatar">
                    <span>AI</span>
                </div>
            )}
            <div className={`message-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
                <FormatText text={msg.text} />
            </div>
        </div>
    );
}

// ─── Room Recommendation Card ─────────────────────────────────────────────────
function RoomRecommendationCard({ roomKey, onBookNow }) {
    const room = ROOMS[roomKey];
    return (
        <div className="recommendation-card" style={{ borderColor: room.color }}>
            <div className="rec-header" style={{ background: `${room.color}18` }}>
                <span className="rec-emoji">{room.emoji}</span>
                <div>
                    <div className="rec-badge" style={{ background: room.gradient }}>
                        ⭐ {room.price}
                    </div>
                    <h3 className="rec-name">{room.name}</h3>
                </div>
            </div>
            <p className="rec-desc">{room.desc}</p>
            <ul className="rec-features">
                {room.features.map((f, i) => (
                    <li key={i}>✅ {f}</li>
                ))}
            </ul>
            <p className="rec-ideal">
                <strong>Ideal for:</strong> {room.ideal}
            </p>
            <button
                className="rec-book-btn"
                style={{ background: room.gradient }}
                onClick={() => onBookNow(room.name)}
            >
                🏨 Book This Room
            </button>
        </div>
    );
}

// ─── All Rooms Mini Cards ─────────────────────────────────────────────────────
function AllRoomsCards({ onBookNow }) {
    return (
        <div className="all-rooms-cards">
            {Object.entries(ROOMS).map(([key, room]) => (
                <div key={key} className="mini-room-card" style={{ borderColor: room.color + "55" }}>
                    <div className="mini-card-top" style={{ background: room.color + "18" }}>
                        <span className="mini-emoji">{room.emoji}</span>
                        <span className="mini-badge" style={{ background: room.gradient }}>{room.price}</span>
                    </div>
                    <div className="mini-card-name">{room.name}</div>
                    <button
                        className="mini-book-btn"
                        style={{ background: room.gradient }}
                        onClick={() => onBookNow(room.name)}
                    >
                        Book Now
                    </button>
                </div>
            ))}
        </div>
    );
}

// ─── Main ChatBot Component ──────────────────────────────────────────────────
export default function ChatBot({ onBookNow }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState("welcome");
    const [userData, setUserData] = useState({});
    const [recommendation, setRecommendation] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const [hasNewMsg, setHasNewMsg] = useState(false);
    const [started, setStarted] = useState(false);
    const [inputText, setInputText] = useState("");
    const [mode, setMode] = useState("guided"); // "guided" | "freetext"
    const [showAllRooms, setShowAllRooms] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Initialize chat on open
    useEffect(() => {
        if (isOpen && !started) {
            setStarted(true);
            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages([{ role: "bot", text: FLOW[0].message, step: "welcome" }]);
            }, 900);
        }
    }, [isOpen, started]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Pulse badge when closed
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setHasNewMsg(true), 3000);
            return () => clearTimeout(timer);
        } else {
            setHasNewMsg(false);
        }
    }, [isOpen]);

    const getCurrentFlow = () => FLOW.find((f) => f.id === currentStep);

    const addBotMessage = (text, extra = {}) => {
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { role: "bot", text, ...extra }]);
        }, 800 + Math.random() * 400);
    };

    const handleOptionClick = (option) => {
        setMessages(prev => [...prev, { role: "user", text: option.label }]);
        const newData = { ...userData, ...(option.data || {}) };
        setUserData(newData);
        const nextStep = option.next;
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            if (nextStep === "recommend") {
                const recKey = getRecommendation(newData);
                setRecommendation(recKey);
                setCurrentStep("recommend");
                const room = ROOMS[recKey];
                setMessages(prev => [
                    ...prev,
                    {
                        role: "bot",
                        text: `Based on your preferences, I have the **perfect recommendation** for you! 🎉\n\nI recommend the **${room.name}** ${room.emoji} – ${room.desc}\n\nHere are the full details:`,
                        step: "recommend",
                        roomKey: recKey,
                    },
                ]);
            } else {
                const nextFlow = FLOW.find((f) => f.id === nextStep);
                setCurrentStep(nextStep);
                setMessages(prev => [...prev, { role: "bot", text: nextFlow.message, step: nextStep }]);
            }
        }, 900);
    };

    const handleSendMessage = (e) => {
        e?.preventDefault();
        const trimmed = inputText.trim();
        if (!trimmed || isTyping) return;

        setMessages(prev => [...prev, { role: "user", text: trimmed }]);
        setInputText("");

        // Check for room name booking triggers
        const lcm = trimmed.toLowerCase();
        if (/book.*standard|standard.*book/i.test(lcm)) {
            addBotMessage("Great choice! Let me open the booking form for the **Standard Room** for you! 🛏️");
            setTimeout(() => onBookNow("Standard Room"), 1200);
            return;
        }
        if (/book.*deluxe|deluxe.*book/i.test(lcm)) {
            addBotMessage("Excellent choice! Opening the booking form for the **Deluxe Room**! 👑");
            setTimeout(() => onBookNow("Deluxe Room"), 1200);
            return;
        }
        if (/book.*luxury|luxury.*book|book.*suite|suite.*book/i.test(lcm)) {
            addBotMessage("Outstanding choice! Opening the booking form for the **Luxury Suite**! ✨");
            setTimeout(() => onBookNow("Luxury Suite"), 1200);
            return;
        }
        if (/all rooms|show rooms|see rooms|view rooms|compare rooms/i.test(lcm)) {
            addBotMessage("Here's a quick overview of all our rooms! Click **Book Now** on any to proceed. 🏨");
            setTimeout(() => {
                setMessages(prev => [...prev, { role: "bot", text: "_allrooms_", step: "allrooms" }]);
            }, 900);
            return;
        }

        const response = getAIResponse(trimmed);
        addBotMessage(response);
    };

    const handleRestart = () => {
        setMessages([]);
        setCurrentStep("welcome");
        setUserData({});
        setRecommendation(null);
        setMode("guided");
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            setMessages([{ role: "bot", text: FLOW[0].message, step: "welcome" }]);
        }, 600);
    };

    const switchToFreeText = () => {
        setMode("freetext");
        addBotMessage("Switched to **free chat mode**! 💬 You can now type any question about our rooms, amenities, location, pricing, or anything else. I'm here to help!");
        setTimeout(() => inputRef.current?.focus(), 1000);
    };

    const currentFlow = getCurrentFlow();
    const showOptions = !isTyping && currentStep !== "recommend" && mode === "guided";
    const showRestart = !isTyping && currentStep === "recommend" && recommendation;

    return (
        <>
            {/* ── Floating Button ── */}
            <button
                id="chatbot-fab-btn"
                className="chatbot-fab"
                onClick={() => setIsOpen(v => !v)}
                aria-label="Open AI Room Advisor"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                ) : (
                    <>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="9" cy="10" r="1" fill="white" />
                            <circle cx="12" cy="10" r="1" fill="white" />
                            <circle cx="15" cy="10" r="1" fill="white" />
                        </svg>
                        {hasNewMsg && <span className="fab-badge" />}
                    </>
                )}
            </button>

            {/* ── Chat Window ── */}
            {isOpen && (
                <div className="chatbot-window" id="chatbot-window">
                    {/* Header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-avatar">
                            <span>AI</span>
                            <span className="online-dot" />
                        </div>
                        <div className="chatbot-header-info">
                            <div className="chatbot-title">Aria · AI Room Advisor</div>
                            <div className="chatbot-subtitle">CGR Assistant · Online</div>
                        </div>
                        <div className="header-actions">
                            <button
                                className="header-action-btn"
                                onClick={handleRestart}
                                title="Restart conversation"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M1 4v6h6M23 20v-6h-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20.49 9A9 9 0 1 0 21.5 13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                            <button className="chatbot-close-btn" onClick={() => setIsOpen(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="mode-toggle-bar">
                        <button
                            className={`mode-btn ${mode === "guided" ? "active" : ""}`}
                            onClick={() => { setMode("guided"); }}
                        >
                            🎯 Guided
                        </button>
                        <button
                            className={`mode-btn ${mode === "freetext" ? "active" : ""}`}
                            onClick={switchToFreeText}
                        >
                            💬 Free Chat
                        </button>
                    </div>

                    {/* Body */}
                    <div className="chatbot-body" id="chatbot-body">
                        {messages.map((msg, i) => (
                            <React.Fragment key={i}>
                                {msg.step === "allrooms" ? (
                                    <div className="rec-card-wrapper">
                                        <AllRoomsCards onBookNow={onBookNow} />
                                    </div>
                                ) : (
                                    <ChatMessage msg={msg} />
                                )}
                                {msg.step === "recommend" && msg.roomKey && (
                                    <div className="rec-card-wrapper">
                                        <RoomRecommendationCard roomKey={msg.roomKey} onBookNow={onBookNow} />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="chat-message bot">
                                <div className="bot-avatar"><span>AI</span></div>
                                <div className="message-bubble bot-bubble typing-indicator">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}

                        {/* Guided Options */}
                        {showOptions && currentFlow?.options?.length > 0 && (
                            <div className="chat-options">
                                {currentFlow.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        className="chat-option-btn"
                                        onClick={() => handleOptionClick(opt)}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                                <button className="chat-option-btn switch-btn" onClick={switchToFreeText}>
                                    💬 I'd rather type my question
                                </button>
                            </div>
                        )}

                        {/* After recommendation */}
                        {showRestart && (
                            <div className="chat-options">
                                <button className="chat-option-btn restart-btn" onClick={handleRestart}>
                                    🔄 Start Over / Explore Other Rooms
                                </button>
                                <button
                                    className="chat-option-btn view-all-btn"
                                    onClick={() => {
                                        setIsOpen(false);
                                        document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    🏨 View All Rooms on Page
                                </button>
                                <button className="chat-option-btn switch-btn" onClick={switchToFreeText}>
                                    💬 I have more questions
                                </button>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Free Text Input */}
                    {mode === "freetext" && (
                        <form className="chatbot-input-area" onSubmit={handleSendMessage}>
                            <input
                                ref={inputRef}
                                id="chatbot-text-input"
                                className="chatbot-input"
                                type="text"
                                placeholder="Ask me anything about CGR..."
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                autoComplete="off"
                                maxLength={300}
                            />
                            <button
                                id="chatbot-send-btn"
                                className="chatbot-send-btn"
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                aria-label="Send message"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </form>
                    )}

                    {/* Guided Quick Actions (in free text mode) */}
                    {mode === "freetext" && (
                        <div className="quick-chips-bar">
                            {["Rooms", "Pricing", "Location", "Amenities", "Book Now"].map((chip, i) => (
                                <button
                                    key={i}
                                    className="quick-chip"
                                    onClick={() => {
                                        const fakeInput = chip === "Book Now" ? "show all rooms" : chip;
                                        setMessages(prev => [...prev, { role: "user", text: chip }]);
                                        const response = getAIResponse(fakeInput);
                                        if (chip === "Book Now") {
                                            addBotMessage("Here's a quick overview of all our rooms! Click **Book Now** on any room to proceed. 🏨");
                                            setTimeout(() => {
                                                setMessages(prev => [...prev, { role: "bot", text: "_allrooms_", step: "allrooms" }]);
                                            }, 900);
                                        } else {
                                            addBotMessage(response);
                                        }
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="chatbot-footer">
                        <span>🤖 Powered by CGR AI Advisor • Aria</span>
                    </div>
                </div>
            )}

            {/* ── Styles ── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        /* FAB */
        .chatbot-fab {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.55), 0 2px 8px rgba(0,0,0,0.15);
          z-index: 9999;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fabPulse 3s ease-in-out infinite;
        }

        @keyframes fabPulse {
          0%, 100% { box-shadow: 0 8px 32px rgba(212,175,55,0.5), 0 2px 8px rgba(0,0,0,0.15); }
          50% { box-shadow: 0 8px 48px rgba(212,175,55,0.8), 0 2px 8px rgba(0,0,0,0.2); }
        }

        .chatbot-fab:hover {
          transform: scale(1.12) translateY(-3px);
          box-shadow: 0 16px 48px rgba(212,175,55,0.7);
          animation: none;
        }

        .fab-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 14px;
          height: 14px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
          animation: badgePop 0.4s ease-out;
        }

        @keyframes badgePop {
          0% { transform: scale(0); }
          70% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }

        /* Window */
        .chatbot-window {
          position: fixed;
          bottom: 110px;
          right: 32px;
          width: 400px;
          height: 600px;
          background: #ffffff;
          border-radius: 24px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.1);
          z-index: 9998;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: windowSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        @keyframes windowSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Header */
        .chatbot-header {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          position: relative;
        }

        .chatbot-header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent);
        }

        .chatbot-header-avatar {
          position: relative;
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          color: #1a1a1a;
          font-size: 11px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(212,175,55,0.4);
        }

        .online-dot {
          position: absolute;
          bottom: 1px;
          right: 1px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #1a1a1a;
          animation: dotPulse 2s ease-in-out infinite;
        }

        @keyframes dotPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .chatbot-header-info { flex: 1; }

        .chatbot-title {
          color: white;
          font-weight: 700;
          font-size: 14px;
          line-height: 1.2;
        }

        .chatbot-subtitle {
          color: rgba(255,255,255,0.45);
          font-size: 11px;
          margin-top: 2px;
        }

        .header-actions {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .header-action-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }

        .header-action-btn:hover { background: rgba(255,255,255,0.2); }

        .chatbot-close-btn {
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .chatbot-close-btn:hover { background: rgba(239,68,68,0.3); }

        /* Mode Toggle */
        .mode-toggle-bar {
          display: flex;
          padding: 8px 12px;
          gap: 6px;
          background: #f8f8f8;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          flex-shrink: 0;
        }

        .mode-btn {
          flex: 1;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1.5px solid rgba(212,175,55,0.2);
          background: white;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .mode-btn:hover {
          border-color: #d4af37;
          color: #1a1a1a;
        }

        .mode-btn.active {
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          color: #1a1a1a;
          border-color: transparent;
          box-shadow: 0 2px 8px rgba(212,175,55,0.3);
        }

        /* Body */
        .chatbot-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          background: #f5f5f5;
          scroll-behavior: smooth;
        }

        .chatbot-body::-webkit-scrollbar { width: 3px; }
        .chatbot-body::-webkit-scrollbar-track { background: transparent; }
        .chatbot-body::-webkit-scrollbar-thumb {
          background: linear-gradient(#d4af37, #f4d03f);
          border-radius: 4px;
        }

        /* Messages */
        .chat-message {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          animation: msgFadeIn 0.3s ease-out;
        }

        @keyframes msgFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .chat-message.user { flex-direction: row-reverse; }

        .bot-avatar {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          font-weight: 800;
          color: #1a1a1a;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(212,175,55,0.3);
        }

        .message-bubble {
          max-width: 78%;
          padding: 11px 14px;
          border-radius: 18px;
          font-size: 13.5px;
          line-height: 1.65;
        }

        .bot-bubble {
          background: white;
          color: #1a1a1a;
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
        }

        .user-bubble {
          background: linear-gradient(135deg, #d4af37, #f0c842);
          color: #1a1a1a;
          border-bottom-right-radius: 4px;
          font-weight: 500;
          box-shadow: 0 2px 12px rgba(212,175,55,0.3);
        }

        .chat-link {
          color: #4a90d9;
          text-decoration: underline;
          font-weight: 500;
        }

        /* Typing indicator */
        .typing-indicator {
          display: flex;
          gap: 5px;
          align-items: center;
          padding: 14px 18px;
        }

        .typing-indicator span {
          width: 7px;
          height: 7px;
          background: #d4af37;
          border-radius: 50%;
          animation: typingBounce 1.2s ease-in-out infinite;
        }

        .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.7; }
          30% { transform: translateY(-8px); opacity: 1; }
        }

        /* Options */
        .chat-options {
          display: flex;
          flex-direction: column;
          gap: 7px;
          padding: 4px 0;
          animation: msgFadeIn 0.4s ease-out;
        }

        .chat-option-btn {
          background: white;
          border: 1.5px solid rgba(212,175,55,0.25);
          border-radius: 12px;
          padding: 10px 14px;
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          cursor: pointer;
          text-align: left;
          transition: all 0.22s ease;
          font-family: inherit;
          line-height: 1.4;
        }

        .chat-option-btn:hover {
          background: linear-gradient(135deg, rgba(212,175,55,0.07), rgba(244,208,63,0.07));
          border-color: #d4af37;
          transform: translateX(4px);
          box-shadow: 0 3px 14px rgba(212,175,55,0.15);
        }

        .restart-btn { border-color: rgba(107,114,128,0.3); color: #666; }
        .restart-btn:hover { background: rgba(107,114,128,0.05); border-color: #9ca3af; transform: translateX(4px); box-shadow: none; }

        .switch-btn { border-color: rgba(74,144,217,0.3); color: #4a90d9; font-style: italic; }
        .switch-btn:hover { background: rgba(74,144,217,0.05); border-color: #4a90d9; transform: translateX(4px); box-shadow: none; }

        /* Recommendation Card */
        .rec-card-wrapper { animation: msgFadeIn 0.5s ease-out; }

        .recommendation-card {
          background: white;
          border-radius: 16px;
          border: 2px solid;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(0,0,0,0.1);
          margin: 4px 0;
        }

        .rec-header {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .rec-emoji { font-size: 34px; line-height: 1; }

        .rec-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          color: white;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .rec-name { font-size: 17px; font-weight: 700; color: #1a1a1a; margin: 0; }

        .rec-desc { padding: 0 16px 10px; font-size: 12.5px; color: #555; line-height: 1.6; }

        .rec-features {
          list-style: none;
          padding: 0 16px 10px;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .rec-features li { font-size: 12px; color: #444; }

        .rec-ideal { padding: 0 16px 12px; font-size: 11.5px; color: #777; font-style: italic; }

        .rec-book-btn {
          width: 100%;
          padding: 13px;
          border: none;
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s;
          font-family: inherit;
          letter-spacing: 0.3px;
        }

        .rec-book-btn:hover { filter: brightness(1.08); transform: translateY(-1px); }

        /* All Rooms Cards */
        .all-rooms-cards {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mini-room-card {
          background: white;
          border-radius: 14px;
          border: 1.5px solid;
          overflow: hidden;
          box-shadow: 0 3px 16px rgba(0,0,0,0.07);
          display: flex;
          align-items: center;
          gap: 12px;
          padding-right: 12px;
        }

        .mini-card-top {
          padding: 14px 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          min-width: 70px;
        }

        .mini-emoji { font-size: 24px; }

        .mini-badge {
          font-size: 9px;
          font-weight: 700;
          color: white;
          padding: 2px 7px;
          border-radius: 10px;
          white-space: nowrap;
          text-align: center;
        }

        .mini-card-name {
          flex: 1;
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
        }

        .mini-book-btn {
          padding: 7px 14px;
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .mini-book-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }

        /* Input Area */
        .chatbot-input-area {
          display: flex;
          padding: 10px 12px;
          gap: 8px;
          background: white;
          border-top: 1px solid rgba(0,0,0,0.06);
          flex-shrink: 0;
          align-items: center;
        }

        .chatbot-input {
          flex: 1;
          padding: 10px 14px;
          border: 1.5px solid rgba(212,175,55,0.3);
          border-radius: 12px;
          font-size: 13.5px;
          font-family: inherit;
          color: #1a1a1a;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chatbot-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.12);
          background: white;
        }

        .chatbot-input::placeholder { color: #aaa; }

        .chatbot-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #d4af37, #f4d03f);
          border: none;
          color: #1a1a1a;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s;
          box-shadow: 0 3px 10px rgba(212,175,55,0.35);
        }

        .chatbot-send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(212,175,55,0.45);
          filter: brightness(1.05);
        }

        .chatbot-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

        /* Quick Chips */
        .quick-chips-bar {
          display: flex;
          gap: 6px;
          padding: 8px 12px;
          overflow-x: auto;
          background: #fafafa;
          border-top: 1px solid rgba(0,0,0,0.04);
          flex-shrink: 0;
          scrollbar-width: none;
        }

        .quick-chips-bar::-webkit-scrollbar { display: none; }

        .quick-chip {
          padding: 5px 12px;
          border-radius: 20px;
          border: 1.5px solid rgba(212,175,55,0.3);
          background: white;
          font-size: 11.5px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
          font-family: inherit;
          flex-shrink: 0;
        }

        .quick-chip:hover {
          background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(244,208,63,0.1));
          border-color: #d4af37;
          color: #1a1a1a;
          transform: translateY(-1px);
        }

        /* Footer */
        .chatbot-footer {
          padding: 8px 14px;
          background: white;
          border-top: 1px solid rgba(0,0,0,0.05);
          text-align: center;
          font-size: 10.5px;
          color: #bbb;
          flex-shrink: 0;
          font-family: inherit;
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chatbot-window {
            right: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 85vh;
            border-radius: 24px 24px 0 0;
          }

          .chatbot-fab {
            right: 20px;
            bottom: 20px;
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
        </>
    );
}
