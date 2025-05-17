
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import LabOrderCard from '@/components/LabOrderCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LabOrder } from '@/types';
import { Search, FileDown } from 'lucide-react';

// Mock data for demonstration - completed lab orders only
const mockCompletedOrders: LabOrder[] = [
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
        result: 'ปกติ',
        normalRange: 'N/A',
        unit: '',
        isAbnormal: false
      },
      { 
        testId: 't3', 
        testName: 'Liver Function Test - ALT',
        result: '65',
        normalRange: '7-55',
        unit: 'U/L',
        isAbnormal: true
      },
      { 
        testId: 't3_2', 
        testName: 'Liver Function Test - AST',
        result: '45',
        normalRange: '8-48',
        unit: 'U/L',
        isAbnormal: false
      }
    ],
    completedAt: new Date(2023, 5, 16, 10, 0),
    resultNotes: 'ค่า ALT สูงเล็กน้อย แนะนำติดตามผลอีก 1 เดือน'
  },
  {
    id: 'LAB-2023-004',
    patientId: 'P004',
    patientName: 'นายวิชัย สุขภาพดี',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'completed',
    priority: 'normal',
    createdAt: new Date(2023, 5, 13, 14, 30),
    tests: [
      { 
        testId: 't6', 
        testName: 'Lipid Profile - Total Cholesterol',
        result: '210',
        normalRange: '<200',
        unit: 'mg/dL',
        isAbnormal: true
      },
      { 
        testId: 't6_2', 
        testName: 'Lipid Profile - HDL',
        result: '45',
        normalRange: '>40',
        unit: 'mg/dL',
        isAbnormal: false
      },
      { 
        testId: 't6_3', 
        testName: 'Lipid Profile - LDL',
        result: '130',
        normalRange: '<130',
        unit: 'mg/dL',
        isAbnormal: false
      },
      { 
        testId: 't6_4', 
        testName: 'Lipid Profile - Triglycerides',
        result: '180',
        normalRange: '<150',
        unit: 'mg/dL',
        isAbnormal: true
      }
    ],
    completedAt: new Date(2023, 5, 14, 9, 0),
    resultNotes: 'Cholesterol และ Triglycerides สูงกว่าเกณฑ์'
  },
  {
    id: 'LAB-2023-005',
    patientId: 'P005',
    patientName: 'นางสาวน้ำใส บริสุทธิ์',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'completed',
    priority: 'urgent',
    createdAt: new Date(2023, 5, 16, 8, 45),
    tests: [
      { 
        testId: 't4', 
        testName: 'Urine Analysis',
        result: 'พบเม็ดเลือดขาวเล็กน้อย',
        normalRange: 'ปกติ',
        unit: '',
        isAbnormal: true
      }
    ],
    completedAt: new Date(2023, 5, 16, 11, 30),
    resultNotes: 'แนะนำให้ผู้ป่วยดื่มน้ำมากๆ และติดตามอาการ'
  }
];

const ViewLabResults: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Filter orders based on search term
  const filteredOrders = mockCompletedOrders.filter(order => {
    return order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           order.id.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const handleViewOrder = (order: LabOrder) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };
  
  const handleDownloadResults = () => {
    // Simulate downloading results
    alert('กำลังดาวน์โหลดผลแล็บในรูปแบบ PDF...');
  };
  
  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              ผลแล็บที่เสร็จแล้ว
            </h1>
            <p className="mt-1 text-gray-500">
              ดูผลการตรวจทางห้องปฏิบัติการที่เสร็จสมบูรณ์แล้ว
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden p-4 mb-6">
          <div className="relative w-full sm:max-w-xs mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text"
              placeholder="ค้นหาตามชื่อผู้ป่วยหรือรหัสแล็บ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                <p className="text-gray-500">ไม่พบผลแล็บที่ตรงกับคำค้นหา</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* View Lab Results Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>ผลการตรวจทางห้องปฏิบัติการ</DialogTitle>
            <DialogDescription>
              {selectedOrder?.patientName} | รหัสผู้ป่วย: {selectedOrder?.patientId} | รหัสแล็บ: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              <Table>
                <TableCaption>วันที่ออกผล: {selectedOrder.completedAt ? new Date(selectedOrder.completedAt).toLocaleDateString('th-TH') : 'ไม่ระบุ'}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>รายการตรวจ</TableHead>
                    <TableHead>ผลการตรวจ</TableHead>
                    <TableHead>ค่าปกติ</TableHead>
                    <TableHead>หน่วย</TableHead>
                    <TableHead className="text-right">การแปลผล</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.tests.map(test => (
                    <TableRow key={test.testId}>
                      <TableCell className="font-medium">{test.testName}</TableCell>
                      <TableCell>{test.result}</TableCell>
                      <TableCell>{test.normalRange || '-'}</TableCell>
                      <TableCell>{test.unit || '-'}</TableCell>
                      <TableCell className="text-right">
                        {test.isAbnormal !== undefined && (
                          <span className={test.isAbnormal ? 'text-red-600 font-medium' : 'text-green-600'}>
                            {test.isAbnormal ? 'ผิดปกติ' : 'ปกติ'}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {selectedOrder.resultNotes && (
                <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-1">หมายเหตุจากห้องปฏิบัติการ</h4>
                  <p className="text-sm text-blue-700">{selectedOrder.resultNotes}</p>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleDownloadResults} className="flex items-center">
                  <FileDown className="mr-2 h-4 w-4" />
                  ดาวน์โหลด PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewLabResults;
