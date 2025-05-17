
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { LabOrder } from '@/types';
import { AlertTriangle } from 'lucide-react';

// Mock data - this would normally be fetched from an API
const mockPendingOrders: Record<string, LabOrder> = {
  'LAB-2023-001': {
    id: 'LAB-2023-001',
    patientId: 'P001',
    patientName: 'นายสมชาย ใจดี',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'pending',
    priority: 'normal',
    createdAt: new Date(2023, 5, 15, 9, 30),
    tests: [
      { 
        testId: 't1', 
        testName: 'Complete Blood Count (CBC)',
        normalRange: 'N/A',
        unit: ''
      },
      { 
        testId: 't2', 
        testName: 'Blood Glucose',
        normalRange: '70-99',
        unit: 'mg/dL'
      }
    ]
  },
  'LAB-2023-003': {
    id: 'LAB-2023-003',
    patientId: 'P003',
    patientName: 'นางนารี สุขสบาย',
    doctorId: 'd1',
    doctorName: 'พญ.สมศรี ใจดี',
    status: 'pending',
    priority: 'urgent',
    createdAt: new Date(2023, 5, 16, 8, 0),
    tests: [
      { 
        testId: 't4', 
        testName: 'Urine Analysis',
        normalRange: 'N/A',
        unit: ''
      },
      { 
        testId: 't5', 
        testName: 'Kidney Function Test - Creatinine',
        normalRange: '0.6-1.2',
        unit: 'mg/dL'
      },
      { 
        testId: 't5_2', 
        testName: 'Kidney Function Test - BUN',
        normalRange: '7-20',
        unit: 'mg/dL'
      }
    ]
  }
};

const EnterResults: React.FC = () => {
  const { orderId } = useParams<{orderId: string}>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<LabOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [abnormalFlags, setAbnormalFlags] = useState<Record<string, boolean>>({});
  const [resultNotes, setResultNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Simulate API call to fetch order details
    setTimeout(() => {
      const fetchedOrder = orderId ? mockPendingOrders[orderId] : null;
      
      if (fetchedOrder) {
        setOrder(fetchedOrder);
        // Initialize test results with empty strings
        const initialResults: Record<string, string> = {};
        const initialFlags: Record<string, boolean> = {};
        fetchedOrder.tests.forEach(test => {
          initialResults[test.testId] = '';
          initialFlags[test.testId] = false;
        });
        setTestResults(initialResults);
        setAbnormalFlags(initialFlags);
      } else {
        toast({
          variant: "destructive",
          title: "ไม่พบรายการสั่งแล็บ",
          description: "ไม่พบรายการสั่งแล็บที่ระบุ หรือรายการนี้อาจถูกดำเนินการไปแล้ว",
        });
        navigate('/lab/dashboard');
      }
      
      setIsLoading(false);
    }, 1000);
  }, [orderId, navigate, toast]);
  
  const handleResultChange = (testId: string, value: string) => {
    setTestResults(prev => ({ ...prev, [testId]: value }));
  };
  
  const handleAbnormalFlagChange = (testId: string, checked: boolean) => {
    setAbnormalFlags(prev => ({ ...prev, [testId]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that all tests have results
    const hasEmptyResults = Object.values(testResults).some(result => result === '');
    if (hasEmptyResults) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกผลการตรวจให้ครบทุกรายการ",
      });
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "บันทึกผลสำเร็จ",
        description: "ผลการตรวจได้รับการบันทึกเรียบร้อยแล้ว",
      });
      setSubmitting(false);
      navigate('/lab/dashboard');
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!order || !user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              บันทึกผลการตรวจ
            </h1>
            <p className="mt-1 text-gray-500">
              กรอกผลการตรวจสำหรับรายการแล็บ #{order.id}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button variant="outline" onClick={() => navigate('/lab/dashboard')}>
              ย้อนกลับ
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Order Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลการสั่งแล็บ</CardTitle>
                <CardDescription>รายละเอียดผู้ป่วยและการสั่ง</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">ชื่อผู้ป่วย</h4>
                  <p>{order.patientName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">รหัสผู้ป่วย</h4>
                  <p>{order.patientId}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">แพทย์ผู้สั่ง</h4>
                  <p>{order.doctorName}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">วันที่สั่ง</h4>
                  <p>{new Date(order.createdAt).toLocaleDateString('th-TH', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">ระดับความเร่งด่วน</h4>
                  <p className={order.priority === 'urgent' ? 'text-red-600 font-medium' : ''}>
                    {order.priority === 'urgent' ? 'ด่วน' : 'ปกติ'}
                  </p>
                </div>
                
                {order.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">หมายเหตุจากแพทย์</h4>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Test Results Form */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>บันทึกผลการตรวจ</CardTitle>
                <CardDescription>กรอกผลการตรวจสำหรับแต่ละรายการ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {order.priority === 'urgent' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-red-700">
                            รายการนี้มีความเร่งด่วน กรุณาดำเนินการโดยเร็วที่สุด
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-6">
                    {order.tests.map((test, index) => (
                      <div key={test.testId}>
                        {index > 0 && <Separator className="my-4" />}
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={test.testId}>{test.testName}</Label>
                            {test.normalRange && (
                              <p className="text-xs text-gray-500 mt-1">
                                ค่าปกติ: {test.normalRange} {test.unit}
                              </p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="sm:col-span-2">
                              <Input
                                id={test.testId}
                                value={testResults[test.testId]}
                                onChange={(e) => handleResultChange(test.testId, e.target.value)}
                                placeholder={`ผลการตรวจ ${test.testName}`}
                                required
                              />
                            </div>
                            
                            <div>
                              <Input 
                                type="text" 
                                value={test.unit || ''} 
                                disabled
                                placeholder="หน่วย"
                                className="bg-gray-50"
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id={`abnormal-${test.testId}`}
                              checked={abnormalFlags[test.testId]}
                              onCheckedChange={(checked) => 
                                handleAbnormalFlagChange(test.testId, checked === true)
                              }
                            />
                            <Label 
                              htmlFor={`abnormal-${test.testId}`} 
                              className="text-sm text-red-600"
                            >
                              ผลการตรวจผิดปกติ
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="mt-6">
                      <Label htmlFor="resultNotes">หมายเหตุจากห้องปฏิบัติการ (ถ้ามี)</Label>
                      <Textarea
                        id="resultNotes"
                        value={resultNotes}
                        onChange={(e) => setResultNotes(e.target.value)}
                        placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับผลการตรวจ เช่น คำแนะนำ หรือข้อสังเกต"
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/lab/dashboard')}
                  disabled={submitting}
                >
                  ยกเลิก
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกผล'}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EnterResults;
