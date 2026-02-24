import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { BLOOD_COMPATIBILITY, type User, type EmergencyRequest, type DonationHistory, type Notification, type BloodType } from '@/types';

interface AppContextType {
  user: User | null;
  users: User[];
  emergencies: EmergencyRequest[];
  donations: DonationHistory[];
  notifications: Notification[];
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'created_at' | 'available'>, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleAvailability: () => void;
  createEmergency: (data: Omit<EmergencyRequest, 'id' | 'created_at' | 'status' | 'created_by'>) => void;
  updateEmergencyStatus: (id: string, status: EmergencyRequest['status']) => void;
  contactDonor: (donorId: string, emergencyId: string) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// localStorage keys as fallback
const LS_USERS = 'lifedrop_users';
const LS_PASSWORDS = 'lifedrop_passwords';
const LS_CURRENT = 'lifedrop_current_user';
const LS_EMERGENCIES = 'lifedrop_emergencies';
const LS_DONATIONS = 'lifedrop_donations';
const LS_NOTIFICATIONS = 'lifedrop_notifications';

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Try Supabase first, fall back to localStorage
async function trySupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [useSupabase, setUseSupabase] = useState(false);
  const [users, setUsers] = useState<User[]>(() => loadJSON(LS_USERS, []));
  const [passwords, setPasswords] = useState<Record<string, string>>(() => loadJSON(LS_PASSWORDS, {}));
  const [user, setUser] = useState<User | null>(() => loadJSON(LS_CURRENT, null));
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() => loadJSON(LS_EMERGENCIES, []));
  const [donations, setDonations] = useState<DonationHistory[]>(() => loadJSON(LS_DONATIONS, []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadJSON(LS_NOTIFICATIONS, []));
  const [loading, setLoading] = useState(true);

  // Check if Supabase is available
  useEffect(() => {
    trySupabase().then(available => {
      setUseSupabase(available);
      if (available) {
        // Load data from Supabase
        loadFromSupabase();
      } else {
        setLoading(false);
      }
    });
  }, []);

  const loadFromSupabase = async () => {
    try {
      // Check auth session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) setUser(profile as User);
      }

      // Load all data
      const [profilesRes, emergenciesRes, donationsRes, notificationsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('emergency_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('donations_history').select('*'),
        supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      ]);

      if (profilesRes.data) setUsers(profilesRes.data as User[]);
      if (emergenciesRes.data) setEmergencies(emergenciesRes.data as EmergencyRequest[]);
      if (donationsRes.data) setDonations(donationsRes.data as DonationHistory[]);
      if (notificationsRes.data) setNotifications(notificationsRes.data as Notification[]);
    } catch (err) {
      console.error('Supabase load error, using localStorage fallback:', err);
      setUseSupabase(false);
    }
    setLoading(false);
  };

  // Listen for auth changes when using Supabase
  useEffect(() => {
    if (!useSupabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) setUser(profile as User);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    return () => subscription.unsubscribe();
  }, [useSupabase]);

  // Supabase Realtime subscriptions
  useEffect(() => {
    if (!useSupabase) return;

    // Listen for new emergencies in real-time
    const emergencyChannel = supabase
      .channel('realtime-emergencies')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'emergency_requests' }, (payload) => {
        const newEmergency = payload.new as EmergencyRequest;
        setEmergencies(prev => {
          if (prev.some(e => e.id === newEmergency.id)) return prev;
          return [newEmergency, ...prev];
        });
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'emergency_requests' }, (payload) => {
        const updated = payload.new as EmergencyRequest;
        setEmergencies(prev => prev.map(e => e.id === updated.id ? updated : e));
      })
      .subscribe();

    // Listen for new notifications in real-time
    const notifChannel = supabase
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        const newNotif = payload.new as Notification;
        setNotifications(prev => {
          if (prev.some(n => n.id === newNotif.id)) return prev;
          return [newNotif, ...prev];
        });
      })
      .subscribe();

    // Listen for new donations
    const donationChannel = supabase
      .channel('realtime-donations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'donations_history' }, (payload) => {
        const newDonation = payload.new as DonationHistory;
        setDonations(prev => {
          if (prev.some(d => d.id === newDonation.id)) return prev;
          return [...prev, newDonation];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(emergencyChannel);
      supabase.removeChannel(notifChannel);
      supabase.removeChannel(donationChannel);
    };
  }, [useSupabase]);

  // localStorage sync (fallback mode)
  useEffect(() => { if (!useSupabase) saveJSON(LS_USERS, users); }, [users, useSupabase]);
  useEffect(() => { if (!useSupabase) saveJSON(LS_PASSWORDS, passwords); }, [passwords, useSupabase]);
  useEffect(() => { if (!useSupabase) saveJSON(LS_CURRENT, user); }, [user, useSupabase]);
  useEffect(() => { if (!useSupabase) saveJSON(LS_EMERGENCIES, emergencies); }, [emergencies, useSupabase]);
  useEffect(() => { if (!useSupabase) saveJSON(LS_DONATIONS, donations); }, [donations, useSupabase]);
  useEffect(() => { if (!useSupabase) saveJSON(LS_NOTIFICATIONS, notifications); }, [notifications, useSupabase]);

  const login = useCallback(async (email: string, password: string) => {
    if (useSupabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return false;
      // User will be set via onAuthStateChange
      return true;
    }
    // localStorage fallback
    await new Promise(r => setTimeout(r, 800));
    const found = users.find(u => u.email === email);
    if (found && passwords[found.id] === password) {
      setUser(found);
      return true;
    }
    return false;
  }, [useSupabase, users, passwords]);

  const register = useCallback(async (userData: Omit<User, 'id' | 'created_at' | 'available'>, password: string): Promise<{ success: boolean; error?: string }> => {
    if (useSupabase) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password,
      });
      if (authError) {
        if (authError.message?.toLowerCase().includes('already registered')) {
          return { success: false, error: 'already_exists' };
        }
        return { success: false, error: authError.message };
      }
      if (!authData.user) return { success: false, error: 'Registration failed' };
      
      // Try to create profile - may fail if RLS requires verified user
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        full_name: userData.full_name,
        email: userData.email,
        blood_type: userData.blood_type,
        country: userData.country,
        city: userData.city,
        phone: userData.phone,
        role: userData.role,
        available: false,
      });
      if (profileError) {
        console.warn('Profile creation deferred:', profileError.message);
        // Store profile data for later creation after email verification
        localStorage.setItem('pending_profile', JSON.stringify({
          id: authData.user.id,
          ...userData,
          available: false,
        }));
      }
      return { success: true };
    }
    // localStorage fallback
    await new Promise(r => setTimeout(r, 800));
    if (users.some(u => u.email === userData.email)) return { success: false, error: 'already_exists' };
    const newUser: User = {
      ...userData,
      id: generateId(),
      available: false,
      created_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [newUser.id]: password }));
    setUser(newUser);
    return { success: true };
  }, [useSupabase, users]);

  const logout = useCallback(async () => {
    if (useSupabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  }, [useSupabase]);

  const toggleAvailability = useCallback(async () => {
    if (!user) return;
    const updated = { ...user, available: !user.available };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
    if (useSupabase) {
      await supabase.from('profiles').update({ available: updated.available }).eq('id', user.id);
    }
  }, [user, useSupabase]);

  const createEmergency = useCallback(async (data: Omit<EmergencyRequest, 'id' | 'created_at' | 'status' | 'created_by'>) => {
    if (!user) return;

    if (useSupabase) {
      const { data: emergency, error } = await supabase.from('emergency_requests').insert({
        ...data,
        status: 'open',
        created_by: user.id,
      }).select().single();
      
      if (error || !emergency) return;
      setEmergencies(prev => [emergency as EmergencyRequest, ...prev]);

      // Notify compatible donors
      const compatibleTypes = BLOOD_COMPATIBILITY[data.blood_type_needed] || [];
      const compatibleDonors = users.filter(u =>
        u.role === 'donor' && u.available &&
        u.city.toLowerCase() === data.city.toLowerCase() &&
        compatibleTypes.includes(u.blood_type)
      );
      const newNotifs = compatibleDonors.map(donor => ({
        user_id: donor.id,
        message: `Emergency! ${data.hospital} needs ${data.blood_type_needed} blood (${data.urgency_level})`,
        read: false,
        emergency_id: emergency.id,
      }));
      if (newNotifs.length > 0) {
        const { data: insertedNotifs } = await supabase.from('notifications').insert(newNotifs).select();
        if (insertedNotifs) setNotifications(prev => [...insertedNotifs as Notification[], ...prev]);
      }
      return;
    }

    // localStorage fallback
    const emergency: EmergencyRequest = {
      ...data,
      id: generateId(),
      status: 'open',
      created_by: user.id,
      created_at: new Date().toISOString(),
    };
    setEmergencies(prev => [...prev, emergency]);
    const compatibleTypes = BLOOD_COMPATIBILITY[data.blood_type_needed] || [];
    const compatibleDonors = users.filter(u =>
      u.role === 'donor' && u.available &&
      u.city.toLowerCase() === data.city.toLowerCase() &&
      compatibleTypes.includes(u.blood_type)
    );
    const newNotifications = compatibleDonors.map(donor => ({
      id: generateId(),
      user_id: donor.id,
      message: `Emergency! ${data.hospital} needs ${data.blood_type_needed} blood (${data.urgency_level})`,
      read: false,
      created_at: new Date().toISOString(),
      emergency_id: emergency.id,
    }));
    setNotifications(prev => [...prev, ...newNotifications]);
  }, [user, users, useSupabase]);

  const updateEmergencyStatus = useCallback(async (id: string, status: EmergencyRequest['status']) => {
    setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    if (useSupabase) {
      await supabase.from('emergency_requests').update({ status }).eq('id', id);
    }
    if (status === 'completed') {
      const emergency = emergencies.find(e => e.id === id);
      if (emergency) {
        const relatedDonors = donations.filter(d => d.emergency_id === id);
        const newNotifs = relatedDonors.map(d => ({
          id: useSupabase ? undefined : generateId(),
          user_id: d.donor_id,
          message: `Emergency request at ${emergency.hospital} has been completed. Thank you!`,
          read: false,
          created_at: new Date().toISOString(),
        }));
        if (useSupabase && newNotifs.length > 0) {
          const { data: inserted } = await supabase.from('notifications').insert(newNotifs).select();
          if (inserted) setNotifications(prev => [...inserted as Notification[], ...prev]);
        } else {
          setNotifications(prev => [...prev, ...newNotifs as Notification[]]);
        }
      }
    }
  }, [emergencies, donations, useSupabase]);

  const contactDonor = useCallback(async (donorId: string, emergencyId: string) => {
    const donationData = {
      donor_id: donorId,
      emergency_id: emergencyId,
      status: 'pending' as const,
      date: new Date().toISOString(),
    };

    if (useSupabase) {
      const { data: donation } = await supabase.from('donations_history').insert(donationData).select().single();
      if (donation) setDonations(prev => [...prev, donation as DonationHistory]);
      await supabase.from('emergency_requests').update({ status: 'in_progress' }).eq('id', emergencyId);
      const { data: notif } = await supabase.from('notifications').insert({
        user_id: donorId,
        message: 'You have been contacted for a blood donation emergency!',
        read: false,
        emergency_id: emergencyId,
      }).select().single();
      if (notif) setNotifications(prev => [notif as Notification, ...prev]);
    } else {
      const donation: DonationHistory = { ...donationData, id: generateId() };
      setDonations(prev => [...prev, donation]);
      setNotifications(prev => [...prev, {
        id: generateId(),
        user_id: donorId,
        message: 'You have been contacted for a blood donation emergency!',
        read: false,
        created_at: new Date().toISOString(),
        emergency_id: emergencyId,
      }]);
    }
    setEmergencies(prev => prev.map(e => e.id === emergencyId ? { ...e, status: 'in_progress' } : e));
  }, [useSupabase]);

  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (useSupabase) {
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    }
  }, [useSupabase]);

  const unreadCount = user ? notifications.filter(n => n.user_id === user.id && !n.read).length : 0;

  return (
    <AppContext.Provider value={{
      user, users, emergencies, donations, notifications, loading,
      login, register, logout, toggleAvailability,
      createEmergency, updateEmergencyStatus, contactDonor,
      markNotificationRead, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
