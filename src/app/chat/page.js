'use client';

import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { Send, MessageSquare, User as UserIcon, ShieldAlert } from 'lucide-react';

export default function ChatPage() {
  const { user, socket } = useApp();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to bottom of message thread
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load inbox conversations
  const loadConversations = async () => {
    if (!user) return;
    try {
      const response = await api.get('/chats/conversations');
      setConversations(response.data || []);
    } catch (err) {
      console.warn('Backend chat API unavailable, loading mock threads.', err.message);
      // Fallback mocks
      const mockThreads = [
        {
          _id: 'conv1',
          participants: [
            { _id: user._id, name: user.name, role: user.role },
            { _id: 'sitter1', name: 'Jannat ul Ferdous', role: 'BABYSITTER' }
          ],
          lastMessage: {
            message: 'Hello, I would love to look after your child!',
            sender: { _id: 'sitter1', name: 'Jannat' }
          },
          updatedAt: new Date()
        }
      ];
      setConversations(mockThreads);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  // Load message thread when active conversation changes
  useEffect(() => {
    if (!activeConv) return;
    
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/chats/messages/${activeConv._id}`);
        setMessages(res.data || []);
      } catch (err) {
        console.warn('Backend messages API unavailable, using mock thread history.', err.message);
        setMessages([
          { _id: 'm1', sender: { _id: 'sitter1', name: 'Jannat' }, message: 'Hello! I noticed your job posting for a weekend babysitter.' },
          { _id: 'm2', sender: { _id: user._id, name: user.name }, message: 'Hi Jannat! Yes, looking for someone certified in CPR.' },
          { _id: 'm3', sender: { _id: 'sitter1', name: 'Jannat' }, message: 'Hello, I would love to look after your child! I am fully certified.' }
        ]);
      }
    };

    fetchMessages();

    // Socket: Join conversation room
    if (socket) {
      socket.emit('join_room', activeConv._id);
    }
  }, [activeConv, socket]);

  // Socket: Listen to incoming messages
  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (msg) => {
      // Check if message belongs to current active conversation
      if (activeConv && msg.conversation === activeConv._id) {
        setMessages((prev) => {
          // Prevent duplicates
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }

      // Refresh threads list to update lastMessage text preview
      loadConversations();
    };

    socket.on('message_received', handleMessageReceived);

    return () => {
      socket.off('message_received', handleMessageReceived);
    };
  }, [socket, activeConv]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    // Retrieve recipient details
    const recipient = activeConv.participants.find((p) => p._id !== user._id) || {};
    
    setSending(true);
    try {
      const payload = {
        recipientId: recipient._id,
        message: inputText.trim()
      };

      const newMessage = await api.post('/chats', payload);
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
      
      // Update thread lastMessage preview
      loadConversations();
    } catch (err) {
      console.warn('Could not post message to API, simulating sent bubble in sandbox mode.', err.message);
      // Simulate locally
      const mockMsg = {
        _id: 'temp-' + Date.now(),
        sender: { _id: user._id, name: user.name },
        message: inputText.trim(),
        createdAt: new Date()
      };
      setMessages((prev) => [...prev, mockMsg]);
      setInputText('');

      // Auto reply simulation after 2 seconds
      setTimeout(() => {
        const replyMsg = {
          _id: 'temp-reply-' + Date.now(),
          sender: { _id: recipient._id || 'sitter1', name: recipient.name || 'Jannat' },
          message: 'Got your message! I will confirm my availability details shortly.',
          createdAt: new Date()
        };
        setMessages((prev) => [...prev, replyMsg]);
      }, 2000);
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div className="container flex-center" style={{ flex: 1, flexDirection: 'column', gap: '16px' }}>
          <ShieldAlert size={48} color="var(--color-danger)" />
          <h3>Log In Required</h3>
          <p>Please log in to check your messages.</p>
          <button onClick={() => router.push('/auth')} className="btn btn-primary">Log In</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />

      <main style={{ flex: 1, background: 'var(--color-bg-light)' }}>
        <div className="container">
          
          <div className="chat-container">
            
            {/* Conversations threads sidebar */}
            <div className="chat-threads">
              <div className="chat-threads-header">
                <h3 style={{ fontSize: '18px' }}>Inbox Messages</h3>
              </div>
              
              <div className="chat-thread-list">
                {loading ? (
                  <p style={{ padding: '20px', color: 'var(--color-body)', fontSize: '13px' }}>Loading inbox...</p>
                ) : conversations.length === 0 ? (
                  <p style={{ padding: '20px', color: 'var(--color-body)', fontSize: '13px', textAlign: 'center' }}>No message threads yet.</p>
                ) : (
                  conversations.map((conv) => {
                    const recipient = conv.participants.find((p) => p._id !== user._id) || {};
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
                          fontWeight: 'bold',
                          flexShrink: 0
                        }}>
                          {recipient.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{recipient.name}</span>
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

            {/* Conversation Window */}
            <div className="chat-window">
              {activeConv ? (
                <>
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
                      fontWeight: 'bold'
                    }}>
                      {activeConv.participants.find((p) => p._id !== user._id)?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px' }}>{activeConv.participants.find((p) => p._id !== user._id)?.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-body)', fontWeight: '600', textTransform: 'uppercase' }}>
                        {activeConv.participants.find((p) => p._id !== user._id)?.role}
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
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--color-body)' }}>
                  <MessageSquare size={48} style={{ color: 'var(--color-gray-border)' }} />
                  <p>Select a contact conversation from the sidebar inbox list to start chatting.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
