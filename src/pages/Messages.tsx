import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, MessageCircle, Search, ArrowLeft, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  from_id: string;
  to_id: string;
  text: string;
  created_at: string;
}

const Messages = () => {
  const { user, users } = useApp();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(searchParams.get('to'));
  const [newMsg, setNewMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef<number>(0);

  // Load messages from Supabase
  const loadMessages = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`from_id.eq.${user.id},to_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    if (!error && data) {
      setMessages(data as Message[]);
    }
  };

  // Initial load
  useEffect(() => {
    loadMessages();
  }, [user]);

  // Track initial count for notifications
  useEffect(() => {
    if (user) {
      prevCountRef.current = messages.filter(m => m.to_id === user.id).length;
    }
  }, [user]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, (payload) => {
        const newMessage = payload.new as Message;
        // Only add if it's relevant to this user
        if (newMessage.from_id === user.id || newMessage.to_id === user.id) {
          setMessages(prev => {
            if (prev.some(m => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });

          // Show notification if it's an incoming message
          if (newMessage.to_id === user.id) {
            const sender = users.find(u => u.id === newMessage.from_id);
            toast({
              title: `💬 ${t('newMessageFrom')} ${sender?.full_name || ''}`,
              description: newMessage.text?.substring(0, 60) || '',
            });
            // Browser notification
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification(`${t('newMessageFrom')} ${sender?.full_name || ''}`, {
                body: newMessage.text?.substring(0, 100) || '',
                icon: '/favicon.ico',
              });
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, users, toast, t]);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser]);

  if (!user) return null;

  // Get conversations: unique users I've chatted with
  const myMessages = messages;
  const conversationUserIds = [...new Set(myMessages.map(m => m.from_id === user.id ? m.to_id : m.from_id))];

  // Show all users: anyone with existing conversation, anyone reached via ?to=, plus role-based defaults
  const toParam = searchParams.get('to');
  const contactableUsers = users.filter(u =>
    u.id !== user.id &&
    (
      u.id === toParam ||
      conversationUserIds.includes(u.id) ||
      (user.role === 'hospital' ? u.role === 'donor' : u.role === 'hospital')
    ) &&
    u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort: conversations first, then others
  const sortedUsers = [
    ...contactableUsers.filter(u => conversationUserIds.includes(u.id)),
    ...contactableUsers.filter(u => !conversationUserIds.includes(u.id)),
  ];

  const getLastMessage = (userId: string) => {
    const conv = myMessages.filter(m =>
      (m.from_id === userId && m.to_id === user.id) ||
      (m.from_id === user.id && m.to_id === userId)
    );
    return conv[conv.length - 1];
  };

  const currentConversation = selectedUser
    ? myMessages.filter(m =>
        (m.from_id === selectedUser && m.to_id === user.id) ||
        (m.from_id === user.id && m.to_id === selectedUser)
      ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  const selectedUserData = selectedUser ? users.find(u => u.id === selectedUser) : null;

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    const msgData = {
      from_id: user.id,
      to_id: selectedUser,
      text: newMsg.trim(),
    };

    const { data, error } = await supabase
      .from('messages')
      .insert(msgData)
      .select()
      .single();

    if (!error && data) {
      // Realtime will handle adding it, but add optimistically
      setMessages(prev => {
        if (prev.some(m => m.id === data.id)) return prev;
        return [...prev, data as Message];
      });
      setNewMsg('');
    } else {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Intenta de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)] flex rounded-xl border overflow-hidden bg-card">
        {/* Sidebar - User list */}
        <div className={`${selectedUser ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r`}>
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-3">
              <MessageCircle className="h-5 w-5 text-primary" />
              {t('messagesTitle')}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('searchUsers')}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {sortedUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                {t('noUsersToMessage')}
              </div>
            ) : (
              sortedUsers.map(u => {
                const lastMsg = getLastMessage(u.id);
                const isActive = selectedUser === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u.id)}
                    className={`w-full text-left p-3 flex items-center gap-3 hover:bg-accent/50 transition-colors border-b ${
                      isActive ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{u.full_name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{u.full_name}</p>
                        {lastMsg && (
                          <span className="text-[10px] text-muted-foreground">{formatTime(lastMsg.created_at)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-primary" />
                        <span className="text-xs text-muted-foreground">{u.blood_type}</span>
                        <span className="text-xs text-muted-foreground">· {u.city}</span>
                      </div>
                      {lastMsg && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.text}</p>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className={`${selectedUser ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
          {selectedUserData ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b flex items-center gap-3">
                <button onClick={() => setSelectedUser(null)} className="md:hidden p-1">
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{selectedUserData.full_name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{selectedUserData.full_name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Heart className="h-3 w-3 text-primary" /> {selectedUserData.blood_type} · {selectedUserData.city}
                    {selectedUserData.available && <span className="text-success ml-1">● {t('available')}</span>}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentConversation.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground text-sm">
                    {t('startConversation')}
                  </div>
                ) : (
                  <AnimatePresence>
                    {currentConversation.map(msg => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.from_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                          msg.from_id === user.id
                            ? 'bg-primary text-primary-foreground rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        }`}>
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-[10px] mt-1 ${
                            msg.from_id === user.id ? 'text-primary-foreground/60' : 'text-muted-foreground'
                          }`}>
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <form
                  onSubmit={e => { e.preventDefault(); sendMessage(); }}
                  className="flex gap-2"
                >
                  <Input
                    value={newMsg}
                    onChange={e => setNewMsg(e.target.value)}
                    placeholder={t('typeMessage')}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!newMsg.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm">{t('selectConversation')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
