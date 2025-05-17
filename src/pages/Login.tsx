
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { Heart } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('doctor');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password, role);
    if (success) {
      navigate(role === 'doctor' ? '/doctor/dashboard' : '/lab/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Heart className="h-10 w-10 text-primary-500" />
            <h1 className="ml-2 text-3xl font-bold text-primary-800">MedLab</h1>
          </div>
          <p className="mt-2 text-gray-600">ระบบจัดการแล็บทางการแพทย์</p>
        </div>
        
        <Card className="shadow-lg border-t-4 border-t-primary-500">
          <CardHeader>
            <CardTitle className="text-xl">เข้าสู่ระบบ</CardTitle>
            <CardDescription>
              กรุณาใส่ชื่อผู้ใช้และรหัสผ่านเพื่อเข้าสู่ระบบ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="doctor" onValueChange={(value) => setRole(value as UserRole)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="doctor">แพทย์</TabsTrigger>
                <TabsTrigger value="lab">เจ้าหน้าที่แล็บ</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">ชื่อผู้ใช้</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={role === 'doctor' ? 'ตัวอย่าง: dr_somchai' : 'ตัวอย่าง: lab_tech1'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="รหัสผ่านของคุณ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </CardFooter>
        </Card>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>สำหรับทดสอบ:</p>
          <p>แพทย์: ชื่อผู้ใช้ dr_somchai, รหัสผ่าน 1234</p>
          <p>เจ้าหน้าที่แล็บ: ชื่อผู้ใช้ lab_tech1, รหัสผ่าน 1234</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
