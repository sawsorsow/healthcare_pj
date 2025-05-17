
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LabOrderCard from '@/components/LabOrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LabOrder } from '@/types';
import { Search } from 'lucide-react';

// Mock data for demonstration
const mockOrders: LabOrder[] = [
  {
    id: 'LAB-2023-001',
    patientId: 'P001',
    patientName: 'นายสมชาย ใจดี',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'pending',
    priority: 'normal',
    createdAt: new Date(2023, 5, 15, 9, 30),
    tests: [
      { testId: 't1', testName: 'Complete Blood Count (CBC)' },
      { testId: 't2', testName: 'Blood Glucose' }
    ]
  },
  {
    id: 'LAB-2023-002',
    patientId: 'P002',
    patientName: 'นางสาวสมหญิง รักดี',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'completed',
    priority: 'normal',
    createdAt: new Date(2023, 5, 14, 11, 15),
    tests: [
      { 
        testId: 't1', 
        testName: 'Complete Blood Count (CBC)',
        result: 'ปกติ' 
      },
      { 
        testId: 't3', 
        testName: 'Liver Function Test', 
        result: 'ค่า ALT สูงกว่าปกติ',
        isAbnormal: true 
      }
    ],
    completedAt: new Date(2023, 5, 16, 10, 0)
  },
  {
    id: 'LAB-2023-003',
    patientId: 'P003',
    patientName: 'นางนารี สุขสบาย',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'pending',
    priority: 'urgent',
    createdAt: new Date(2023, 5, 16, 8, 0),
    tests: [
      { testId: 't4', testName: 'Urine Analysis' },
      { testId: 't5', testName: 'Kidney Function Test' }
    ]
  }
];

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter orders based on search term and active tab
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && order.status === 'pending';
    if (activeTab === 'completed') return matchesSearch && order.status === 'completed';
    
    return matchesSearch;
  });
  
  const handleViewOrder = (order: LabOrder) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              แดชบอร์ด
            </h1>
            <p className="mt-1 text-gray-500">
              สวัสดี {user.name}, นี่คือรายการสั่งตรวจทั้งหมดของคุณ
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button as="a" href="/doctor/create-order">
              สั่งแล็บใหม่
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="text"
                placeholder="ค้นหาตามชื่อผู้ป่วยหรือรหัสแล็บ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
              <TabsList>
                <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
                <TabsTrigger value="completed">เสร็จสิ้น</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map(order => (
              <LabOrderCard 
                key={order.id} 
                order={order} 
                onViewClick={handleViewOrder}
              />
            ))}
            
            {filteredOrders.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">ไม่พบรายการที่ตรงกับคำค้นหา</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* View Order Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>รายละเอียดการสั่งแล็บ</DialogTitle>
            <DialogDescription>
              รหัสการสั่ง: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">ข้อมูลผู้ป่วย</h4>
                <p className="text-sm">{selectedOrder.patientName}</p>
                <p className="text-sm">รหัสผู้ป่วย: {selectedOrder.patientId}</p>
              </div>
              
              <div>
                <h4 className="font-medium">รายการตรวจ</h4>
                <ul className="mt-2 space-y-2">
                  {selectedOrder.tests.map(test => (
                    <li key={test.testId} className="text-sm flex justify-between">
                      <span>{test.testName}</span>
                      {test.result && (
                        <span className={`font-medium ${test.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                          {test.result}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h4 className="font-medium">หมายเหตุจากแพทย์</h4>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              
              {selectedOrder.resultNotes && (
                <div>
                  <h4 className="font-medium">หมายเหตุจากห้องแล็บ</h4>
                  <p className="text-sm">{selectedOrder.resultNotes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
