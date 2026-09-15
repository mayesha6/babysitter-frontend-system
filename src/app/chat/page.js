'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { ShieldAlert } from 'lucide-react';

import ChatThreadsSidebar from '../../components/chat/ChatThreadsSidebar';
import ChatWindow from '../../components/chat/ChatWindow';

export default function ChatPage() {
  const { user, socket } = useApp();
  const router = useRouter();
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
      if (activeConv && msg.conversation === activeConv._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }

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
      
      loadConversations();
    } catch (err) {
      console.warn('Could not post message to API, simulating sent bubble in sandbox mode.', err.message);
      const mockMsg = {
        _id: 'temp-' + Date.now(),
        sender: { _id: user._id, name: user.name },
        message: inputText.trim(),
        createdAt: new Date()
      };
      setMessages((prev) => [...prev, mockMsg]);
      setInputText('');

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
          <h3 style={{ fontWeight: '600' }}>Log In Required</h3>
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
            <ChatThreadsSidebar 
              loading={loading} 
              conversations={conversations} 
              activeConv={activeConv} 
              setActiveConv={setActiveConv} 
              user={user} 
            />

            {/* Conversation Window */}
            <ChatWindow 
              activeConv={activeConv} 
              user={user} 
              messages={messages} 
              chatEndRef={chatEndRef} 
              handleSendMessage={handleSendMessage} 
              inputText={inputText} 
              setInputText={setInputText} 
            />

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
