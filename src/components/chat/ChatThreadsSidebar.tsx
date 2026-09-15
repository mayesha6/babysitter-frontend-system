'use client';

import React from 'react';

interface ChatThreadsSidebarProps {
  loading: boolean;
  conversations: any[];
  activeConv: any;
  setActiveConv: (conv: any) => void;
  user: any;
}

export default function ChatThreadsSidebar({ loading, conversations, activeConv, setActiveConv, user }: ChatThreadsSidebarProps) {
  return (
    <div className="chat-threads">
      <div className="chat-threads-header">
        <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Inbox Messages</h3>
      </div>
      
      <div className="chat-thread-list">
        {loading ? (
          <p style={{ padding: '20px', color: 'var(--color-body)', fontSize: '13px' }}>Loading inbox...</p>
        ) : conversations.length === 0 ? (
          <p style={{ padding: '20px', color: 'var(--color-body)', fontSize: '13px', textAlign: 'center' }}>No message threads yet.</p>
        ) : (
          conversations.map((conv) => {
            const recipient = conv.participants?.find((p: any) => p._id !== user._id) || {};
            const lastMsg = conv.lastMessage?.message || 'No messages yet';
            
            return (
              <div 
                key={conv._id}
                onClick={() => setActiveConv(conv)}
                className={`chat-thread-item ${activeConv?._id === conv._id ? 'active' : ''}`}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--color-secondary)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {recipient.name?.charAt(0) || 'U'}
                </div>
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recipient.name}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-body)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    {lastMsg}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
