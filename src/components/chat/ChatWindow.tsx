'use client';

import React from 'react';
import { Send, MessageSquare } from 'lucide-react';

interface ChatWindowProps {
  activeConv: any;
  user: any;
  messages: any[];
  chatEndRef: React.RefObject<HTMLDivElement | null>;
  handleSendMessage: (e: React.FormEvent) => void;
  inputText: string;
  setInputText: (val: string) => void;
}

export default function ChatWindow({ activeConv, user, messages, chatEndRef, handleSendMessage, inputText, setInputText }: ChatWindowProps) {
  if (!activeConv) {
    return (
      <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--color-body)' }}>
        <MessageSquare size={48} style={{ color: 'var(--color-gray-border)' }} />
        <p style={{ fontWeight: '600' }}>Select a contact conversation from the sidebar inbox list to start chatting.</p>
      </div>
    );
  }

  const recipient = activeConv.participants?.find((p: any) => p._id !== user._id) || {};

  return (
    <div className="chat-window">
      {/* Chat header */}
      <div className="chat-window-header">
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'var(--color-secondary)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '600'
        }}>
          {recipient.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: '600' }}>{recipient.name}</h4>
          <span style={{ fontSize: '11px', color: 'var(--color-body)', fontWeight: '600', textTransform: 'uppercase' }}>
            {recipient.role}
          </span>
        </div>
      </div>

      {/* Chat Messages scroll area */}
      <div className="chat-messages">
        {messages.map((msg) => {
          const isSent = msg.sender === user._id || msg.sender?._id === user._id;
          return (
            <div key={msg._id} className={`chat-bubble-wrapper ${isSent ? 'sent' : 'received'}`}>
              <div className="chat-bubble">
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Message write area */}
      <form onSubmit={handleSendMessage} className="chat-input-area">
        <input 
          type="text" 
          placeholder="Type a message..." 
          className="form-control"
          style={{ flex: 1 }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary" style={{ padding: '12px 18px', boxShadow: 'none' }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
