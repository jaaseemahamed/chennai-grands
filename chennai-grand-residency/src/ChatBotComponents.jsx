import React from "react";
import { ROOMS } from "./ChatBotData";

const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

// ─── Format Text Component ────────────────────────────────────────────────────
export const FormatText = React.memo(({ text }) => {
    if (!text) return null;
    
    // Internal helper for link rendering to avoid closure overhead
    const renderPartWithLinks = (part, baseKey) => {
        const segments = [];
        let lastIndex = 0;
        let match;
        
        // Reset regex state for global search
        linkRegex.lastIndex = 0;
        
        while ((match = linkRegex.exec(part)) !== null) {
            if (match.index > lastIndex) {
                segments.push(part.slice(lastIndex, match.index));
            }
            segments.push(
                <a key={`${baseKey}-link-${match.index}`} href={match[2]} target="_blank" rel="noreferrer" className="chat-link">
                    {match[1]}
                </a>
            );
            lastIndex = match.index + match[0].length;
        }
        
        if (lastIndex < part.length) {
            segments.push(part.slice(lastIndex));
        }
        
        return segments.length > 0 ? segments : part;
    };

    return text.split("\n").map((line, i) => {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
            <span key={`line-${i}`}>
                {parts.map((part, j) =>
                    j % 2 === 1
                        ? <strong key={`bold-${j}`}>{part}</strong>
                        : <span key={`text-${j}`}>{renderPartWithLinks(part, `l${i}s${j}`)}</span>
                )}
                {i < text.split("\n").length - 1 && <br />}
            </span>
        );
    });
});

// ─── Chat Message Component ──────────────────────────────────────────────────
export const ChatMessage = React.memo(({ msg }) => {
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
});

// ─── Room Recommendation Card ─────────────────────────────────────────────────
export const RoomRecommendationCard = React.memo(({ roomKey, onBookNow }) => {
    const room = ROOMS[roomKey];
    if (!room) return null;
    
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
                    <li key={`feat-${i}`}>✅ {f}</li>
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
});

// ─── All Rooms Mini Cards ─────────────────────────────────────────────────────
export const AllRoomsCards = React.memo(({ onBookNow }) => {
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
});
