import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BLOOD_COMPATIBILITY, type User, type EmergencyRequest, type DonationHistory, type Notification, type BloodType } from '@/types';

interface AppContextType {
  user: User | null;
  users: User[];
  emergencies: EmergencyRequest[];
  donations: DonationHistory[];
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'created_at' | 'available'>, password: string) => Promise<boolean>;
  logout: () => void;
  toggleAvailability: () => void;
  createEmergency: (data: Omit<EmergencyRequest, 'id' | 'created_at' | 'status' | 'created_by'>) => void;
  updateEmergencyStatus: (id: string, status: EmergencyRequest['status']) => void;
  contactDonor: (donorId: string, emergencyId: string) => void;
  markNotificationRead: (id: string) => void;
  unreadCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => loadJSON(LS_USERS, []));
  const [passwords, setPasswords] = useState<Record<string, string>>(() => loadJSON(LS_PASSWORDS, {}));
  const [user, setUser] = useState<User | null>(() => loadJSON(LS_CURRENT, null));
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(() => loadJSON(LS_EMERGENCIES, []));
  const [donations, setDonations] = useState<DonationHistory[]>(() => loadJSON(LS_DONATIONS, []));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadJSON(LS_NOTIFICATIONS, []));

  useEffect(() => { saveJSON(LS_USERS, users); }, [users]);
  useEffect(() => { saveJSON(LS_PASSWORDS, passwords); }, [passwords]);
  useEffect(() => { saveJSON(LS_CURRENT, user); }, [user]);
  useEffect(() => { saveJSON(LS_EMERGENCIES, emergencies); }, [emergencies]);
  useEffect(() => { saveJSON(LS_DONATIONS, donations); }, [donations]);
  useEffect(() => { saveJSON(LS_NOTIFICATIONS, notifications); }, [notifications]);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    const found = users.find(u => u.email === email);
    if (found && passwords[found.id] === password) {
      setUser(found);
      return true;
    }
    return false;
  }, [users, passwords]);

  const register = useCallback(async (userData: Omit<User, 'id' | 'created_at' | 'available'>, password: string) => {
    await new Promise(r => setTimeout(r, 800));
    if (users.some(u => u.email === userData.email)) return false;
    const newUser: User = {
      ...userData,
      id: generateId(),
      available: false,
      created_at: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    setPasswords(prev => ({ ...prev, [newUser.id]: password }));
    setUser(newUser);
    return true;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const toggleAvailability = useCallback(() => {
    if (!user) return;
    const updated = { ...user, available: !user.available };
    setUser(updated);
    setUsers(prev => prev.map(u => u.id === user.id ? updated : u));
  }, [user]);

  const createEmergency = useCallback((data: Omit<EmergencyRequest, 'id' | 'created_at' | 'status' | 'created_by'>) => {
    if (!user) return;
    const emergency: EmergencyRequest = {
      ...data,
      id: generateId(),
      status: 'open',
      created_by: user.id,
      created_at: new Date().toISOString(),
    };
    setEmergencies(prev => [...prev, emergency]);

    // Notify compatible donors in same city
    const compatibleTypes = BLOOD_COMPATIBILITY[data.blood_type_needed] || [];
    const compatibleDonors = users.filter(u =>
      u.role === 'donor' &&
      u.available &&
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
  }, [user, users]);

  const updateEmergencyStatus = useCallback((id: string, status: EmergencyRequest['status']) => {
    setEmergencies(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    if (status === 'completed') {
      const emergency = emergencies.find(e => e.id === id);
      if (emergency) {
        const relatedDonors = donations.filter(d => d.emergency_id === id);
        const newNotifs = relatedDonors.map(d => ({
          id: generateId(),
          user_id: d.donor_id,
          message: `Emergency request at ${emergency.hospital} has been completed. Thank you!`,
          read: false,
          created_at: new Date().toISOString(),
        }));
        setNotifications(prev => [...prev, ...newNotifs]);
      }
    }
  }, [emergencies, donations]);

  const contactDonor = useCallback((donorId: string, emergencyId: string) => {
    const donation: DonationHistory = {
      id: generateId(),
      donor_id: donorId,
      emergency_id: emergencyId,
      status: 'pending',
      date: new Date().toISOString(),
    };
    setDonations(prev => [...prev, donation]);
    setEmergencies(prev => prev.map(e => e.id === emergencyId ? { ...e, status: 'in_progress' } : e));
    setNotifications(prev => [...prev, {
      id: generateId(),
      user_id: donorId,
      message: 'You have been contacted for a blood donation emergency!',
      read: false,
      created_at: new Date().toISOString(),
      emergency_id: emergencyId,
    }]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const unreadCount = user ? notifications.filter(n => n.user_id === user.id && !n.read).length : 0;

  return (
    <AppContext.Provider value={{
      user, users, emergencies, donations, notifications,
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
