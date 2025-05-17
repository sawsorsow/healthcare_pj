import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LabTest } from '@/types';

// Mock data for lab tests
const availableLabTests: LabTest[] = [
  { id: 't1', name: 'Complete Blood Count (CBC)', type: 'blood' },
  { id: 't2', name: 'Blood Glucose', type: 'blood' },
  { id: 't3', name: 'Liver Function Test', type: 'blood' },
  { id: 't4', name: 'Urine Analysis', type: 'urine' },
  { id: 't5', name: 'Kidney Function Test', type: 'blood' },
  { id: 't6', name: 'Lipid Profile', type: 'blood' },
  { id: 't7', name: 'Thyroid Function Test', type: 'blood' },
  { id: 't8', name: 'X-Ray Chest', type: 'imaging' },
  { id: 't9', name: 'Electrocardiogram (ECG)', type: 'other' },
  { id: 't10', name: 'Coagulation Panel', type: 'blood' },
];

const CreateLabOrder: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) return null;
  
  const handleTestChange = (testId: string) => {
    setSelectedTests(prev => 
      prev.includes(testId)
        ? prev.filter(id => id !== testId)
        : [...prev, testId]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !patientName || selectedTests.length === 0) {
      toast({
        variant: "destructive",
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบถ้วน และเลือกรายการตรวจอย่างน้อย 1 รายการ",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "สั่งแล็บสำเร็จ",
        description: "ระบบได้บันทึกรายการสั่งแล็บของคุณเรียบร้อยแล้ว",
      });
      setIsSubmitting(false);
      navigate('/doctor/dashboard');
    }, 1500);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              สั่งแล็บใหม่
            </h1>
            <p className="mt-1 text-gray-500">
              กรุณากรอกข้อมูลและเลือกรายการตรวจ
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Patient Information */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลผู้ป่วย</CardTitle>
                <CardDescription>กรอกข้อมูลผู้ป่วยที่ต้องการสั่งแล็บ</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">รหัสผู้ป่วย</Label>
                    <Input
                      id="patientId"
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      placeholder="เช่น HN-123456"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="patientName">ชื่อ-นามสกุลผู้ป่วย</Label>
                    <Input
                      id="patientName"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="เช่น นายสมชาย ใจดี"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>ความเร่งด่วน</Label>
                    <RadioGroup 
                      value={priority} 
                      onValueChange={(value) => setPriority(value as 'normal' | 'urgent')}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="normal" id="normal" />
                        <Label htmlFor="normal">ปกติ</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="urgent" id="urgent" />
                        <Label htmlFor="urgent">ด่วน</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">หมายเหตุ (ถ้ามี)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="ข้อมูลเพิ่มเติมหรือประวัติผู้ป่วยที่เกี่ยวข้อง"
                      rows={4}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {/* Lab Test Selection */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>รายการตรวจ</CardTitle>
                <CardDescription>เลือกรายการตรวจที่ต้องการสั่ง</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Blood tests */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">การตรวจเลือด</h3>
                    <div className="grid gap-2">
                      {availableLabTests
                        .filter(test => test.type === 'blood')
                        .map(test => (
                          <div key={test.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={test.id} 
                              checked={selectedTests.includes(test.id)}
                              onCheckedChange={() => handleTestChange(test.id)}
                            />
                            <Label htmlFor={test.id}>{test.name}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Urine tests */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">การตรวจปัสสาวะ</h3>
                    <div className="grid gap-2">
                      {availableLabTests
                        .filter(test => test.type === 'urine')
                        .map(test => (
                          <div key={test.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={test.id} 
                              checked={selectedTests.includes(test.id)}
                              onCheckedChange={() => handleTestChange(test.id)}
                            />
                            <Label htmlFor={test.id}>{test.name}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Imaging */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">การตรวจทางรังสีวิทยา</h3>
                    <div className="grid gap-2">
                      {availableLabTests
                        .filter(test => test.type === 'imaging')
                        .map(test => (
                          <div key={test.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={test.id} 
                              checked={selectedTests.includes(test.id)}
                              onCheckedChange={() => handleTestChange(test.id)}
                            />
                            <Label htmlFor={test.id}>{test.name}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                  
                  {/* Other tests */}
                  <div>
                    <h3 className="text-lg font-medium mb-2">การตรวจอื่นๆ</h3>
                    <div className="grid gap-2">
                      {availableLabTests
                        .filter(test => test.type === 'other')
                        .map(test => (
                          <div key={test.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={test.id} 
                              checked={selectedTests.includes(test.id)}
                              onCheckedChange={() => handleTestChange(test.id)}
                            />
                            <Label htmlFor={test.id}>{test.name}</Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mr-2"
                    onClick={() => navigate('/doctor/dashboard')}
                  >
                    ยกเลิก
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedTests.length === 0 || !patientId || !patientName}
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกการสั่งแล็บ'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLabOrder;
