
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    // If user is already logged in, redirect to appropriate dashboard
    if (user) {
      navigate(user.role === 'doctor' ? '/doctor/dashboard' : '/lab/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center items-center p-4">
      <div className="text-center max-w-3xl">
        <div className="flex items-center justify-center mb-4">
          <Heart className="h-16 w-16 text-primary-500" />
          <h1 className="text-5xl font-bold text-primary-800 ml-3">MedLab</h1>
        </div>
        
        <h2 className="text-2xl text-gray-700 mb-8">ระบบจัดการแล็บทางการแพทย์</h2>
        
        <p className="text-lg text-gray-600 mb-12">
          ยินดีต้อนรับสู่ MedLab ระบบที่ช่วยให้แพทย์และห้องปฏิบัติการทำงานร่วมกันได้อย่างมีประสิทธิภาพ 
          ด้วยการจัดการการสั่งตรวจและผลการตรวจทางห้องปฏิบัติการอย่างครบวงจร
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 max-w-md mx-auto">
          <Button 
            size="lg" 
            className="text-lg py-6 bg-primary-500 hover:bg-primary-600 shadow-lg" 
            onClick={() => navigate('/login')}
          >
            เข้าสู่ระบบ
          </Button>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-primary-700">สำหรับแพทย์</h3>
            <ul className="mt-2 text-gray-600 text-left list-disc pl-5">
              <li>ดูแดชบอร์ดสรุปการสั่งแล็บทั้งหมด</li>
              <li>สั่งแล็บใหม่ได้อย่างรวดเร็ว</li>
              <li>ดูผลแล็บที่เสร็จสมบูรณ์แล้ว</li>
            </ul>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold text-secondary-600">สำหรับห้องปฏิบัติการ</h3>
            <ul className="mt-2 text-gray-600 text-left list-disc pl-5">
              <li>จัดการรายการตรวจที่รอดำเนินการ</li>
              <li>บันทึกผลการตรวจได้อย่างสะดวก</li>
              <li>ดูประวัติรายการที่เสร็จสิ้นแล้ว</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
