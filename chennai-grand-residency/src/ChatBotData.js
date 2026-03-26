// ─── Room Data ───────────────────────────────────────────────────────────────
export const ROOMS = {
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
export const FLOW = [
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
        message: "We have **3 beautiful room categories** at Chennai Grand Residency:\n\n🛏️ **Standard Room** – Great value, queen bed, views, up to 5 rooms\n👑 **Deluxe Room** – King bed, panoramic village views, most popular, up to 2 rooms\n✨ **Luxury Suite** – Private balcony, separate living area, concierge, up to 3 rooms\n\nAll rooms come with free WiFi, daily housekeeping & premium toiletries!\n\nNow let's find out which one suits YOU best!",
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
            { label: "💜 The absolute best experience!", next: "room_recommend", data: { budget: "luxury" } },
        ],
    },
    {
        id: "view",
        message: "How important is the view to you? 🌄",
        options: [
            { label: "🙂 A nice view would be good", next: "room_recommend", data: { view: "basic" } },
            { label: "😍 I want a stunning panoramic view!", next: "room_recommend", data: { view: "panoramic" } },
            { label: "🏡 Private balcony with a full village view", next: "room_recommend", data: { view: "balcony" } },
        ],
    },
    {
        id: "room_recommend",
        message: null,
        options: [],
    },
];

export const LANDING_FLOW = [
    {
        id: "welcome",
        message: "Hello there! 👋 Welcome to **Chennai Grand Residency Group**!\n\nI'm **Aria**, your personal AI travel advisor. We have two distinctive luxury properties in Kodaikanal. Shall I help you discover which one is perfect for your stay?",
        options: [
            { label: "🏔️ Hill & Mountain View Retreat", next: "hill_info" },
            { label: "🌆 Roshan's City View Residency", next: "city_info" },
            { label: "🎯 Help me decide between the two!", next: "decision_intro" },
        ],
    },
    {
        id: "hill_info",
        message: "🏔️ **Chennai Grand Residency (Hill & Mountain View)**\n\nLocated near Pachamarathu Odai, this serene retreat is nested in the misty hills, offering **peaceful escapes** and stunning mountain vistas. It features 10 premium rooms and is ideal for nature lovers and those seeking quietude.\n\nWould you like to explore this property or see our City View residency?",
        options: [
            { label: "✨ Visit Mountain View Property", next: "go_hill" },
            { label: "🌆 Tell me about City View", next: "city_info" },
            { label: "🏠 Back to Start", next: "welcome" },
        ],
    },
    {
        id: "city_info",
        message: "🌆 **Roshan's Chennai Grand Residency (City View)**\n\nLocated on Vilpatti Road, Naidupuram, this property offers a **contemporary luxury experience** with stunning views of the Kodaikanal cityscape. It features 15 premium rooms and puts you in the heart of the action while maintaining a sense of peace.\n\nWould you like to explore this property or see our Mountain View retreat?",
        options: [
            { label: "✨ Visit City View Property", next: "go_city" },
            { label: "🏔️ Tell me about Mountain View", next: "hill_info" },
            { label: "🏠 Back to Start", next: "welcome" },
        ],
    },
    {
        id: "decision_intro",
        message: "I'd love to help you decide! 🎯 To give you the best suggestion, tell me: what's your **primary vibe** for this trip?",
        options: [
            { label: "🌲 Total peace, quiet & nature", next: "property_recommend", data: { preference: "nature" } },
            { label: "🛍️ Convenience, city lights & modern luxury", next: "property_recommend", data: { preference: "city" } },
            { label: "🌄 Just the best possible views!", next: "property_recommend", data: { preference: "views" } },
        ],
    },
    {
        id: "property_recommend",
        message: null,
        options: [],
    },
    {
        id: "go_hill",
        message: "Excellent choice! Redirecting you to our **Hill & Mountain View** property... 🏔️",
        options: [],
    },
    {
        id: "go_city",
        message: "Excellent choice! Redirecting you to our **City View** residency... 🌆",
        options: [],
    },
];
