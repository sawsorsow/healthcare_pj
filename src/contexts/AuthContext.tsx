
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const DEMO_USERS = [
  { id: 'd1', name: 'พญ.สมศรี ใจดี', role: 'doctor' as UserRole },
  { id: 'd2', name: 'นพ.มานะ รักษ์ดี', role: 'doctor' as UserRole },
  { id: 'l1', name: 'คุณวิเชียร ตรวจเร็ว', role: 'lab' as UserRole },
  { id: 'l2', name: 'คุณนงนุช แม่นยำ', role: 'lab' as UserRole },
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('medlabUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const foundUser = DEMO_USERS.find(u => 
          (u.role === role) && 
          (role === 'doctor' ? username.startsWith('dr') : username.startsWith('lab'))
        );
        
        if (foundUser && password === '1234') {
          setUser(foundUser);
          localStorage.setItem('medlabUser', JSON.stringify(foundUser));
          toast({
            title: "เข้าสู่ระบบสำเร็จ",
            description: `ยินดีต้อนรับ ${foundUser.name}`,
          });
          resolve(true);
        } else {
          toast({
            variant: "destructive",
            title: "เข้าสู่ระบบไม่สำเร็จ",
            description: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          });
          resolve(false);
        }
        setLoading(false);
      }, 1000);
    });
  };

  const logout = () => {
    localStorage.removeItem('medlabUser');
    setUser(null);
    toast({
      title: "ออกจากระบบสำเร็จ",
      description: "ขอบคุณที่ใช้บริการ",
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
