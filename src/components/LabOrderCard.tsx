
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LabOrder } from '@/types';
import { format } from 'date-fns';
import { Calendar, ClipboardCheck } from 'lucide-react';

interface LabOrderCardProps {
  order: LabOrder;
  showActions?: boolean;
  onViewClick?: (order: LabOrder) => void;
  onEnterResultsClick?: (order: LabOrder) => void;
  compact?: boolean;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">รอดำเนินการ</Badge>;
    case 'processing':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">กำลังดำเนินการ</Badge>;
    case 'completed':
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">เสร็จสิ้น</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">ยกเลิก</Badge>;
    default:
      return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
  }
};

const LabOrderCard: React.FC<LabOrderCardProps> = ({ 
  order, 
  showActions = true, 
  onViewClick, 
  onEnterResultsClick,
  compact = false
}) => {
  return (
    <Card className={`w-full ${compact ? 'shadow-sm' : 'shadow'} card-hover fade-in`}>
      <CardHeader className={compact ? 'pb-2' : 'pb-4'}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={`${compact ? 'text-lg' : 'text-xl'} font-semibold`}>
              {order.patientName}
            </CardTitle>
            <CardDescription className="mt-1">
              รหัสการสั่ง: {order.id}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end">
            {getStatusBadge(order.status)}
            {order.priority === 'urgent' && (
              <Badge variant="destructive" className="mt-2">ด่วน</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className={compact ? 'py-2' : 'py-4'}>
        <div className="grid gap-2">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>วันที่สั่ง: {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</span>
          </div>
          <div className="flex items-center text-sm">
            <ClipboardCheck className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>แพทย์ผู้สั่ง: {order.doctorName}</span>
          </div>
          
          {!compact && (
            <div className="mt-4">
              <p className="text-sm font-medium">รายการตรวจ:</p>
              <ul className="mt-1 space-y-1">
                {order.tests.map((test) => (
                  <li key={test.testId} className="text-sm flex justify-between">
                    <span>{test.testName}</span>
                    {test.result && (
                      <span className={`font-medium ${test.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                        {test.result} {test.unit}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {compact && (
            <p className="text-sm text-muted-foreground">
              {order.tests.length} รายการตรวจ
            </p>
          )}
        </div>
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-end gap-2">
          {onViewClick && (
            <Button 
              variant="outline" 
              onClick={() => onViewClick(order)}
            >
              ดูรายละเอียด
            </Button>
          )}
          {onEnterResultsClick && order.status === 'pending' && (
            <Button 
              onClick={() => onEnterResultsClick(order)}
            >
              บันทึกผล
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default LabOrderCard;
