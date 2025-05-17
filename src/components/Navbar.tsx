
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, ClipboardCheck, Heart, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;
  
  const isDoctorRoute = location.pathname.startsWith('/doctor');
  const isLabRoute = location.pathname.startsWith('/lab');
  
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-primary-800">MedLab</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {isDoctorRoute && (
                <>
                  <Link 
                    to="/doctor/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/doctor/dashboard' 
                        ? 'border-primary-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ClipboardCheck className="mr-1 h-4 w-4" />
                    แดชบอร์ด
                  </Link>
                  <Link 
                    to="/doctor/create-order"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/doctor/create-order' 
                        ? 'border-primary-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Calendar className="mr-1 h-4 w-4" />
                    สั่งแล็บ
                  </Link>
                  <Link 
                    to="/doctor/results"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/doctor/results' 
                        ? 'border-primary-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ClipboardCheck className="mr-1 h-4 w-4" />
                    ผลแล็บ
                  </Link>
                </>
              )}
              
              {isLabRoute && (
                <>
                  <Link 
                    to="/lab/dashboard"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/lab/dashboard' 
                        ? 'border-primary-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ClipboardCheck className="mr-1 h-4 w-4" />
                    รายการรอดำเนินการ
                  </Link>
                  <Link 
                    to="/lab/completed"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location.pathname === '/lab/completed' 
                        ? 'border-primary-500 text-gray-900' 
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <ClipboardCheck className="mr-1 h-4 w-4" />
                    ผลแล็บที่เสร็จแล้ว
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>บัญชีผู้ใช้</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {user.role === 'doctor' ? 'แพทย์' : 'เจ้าหน้าที่ห้องปฏิบัติการ'}
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="flex justify-around pb-3">
          {isDoctorRoute && (
            <>
              <Link 
                to="/doctor/dashboard"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                  location.pathname === '/doctor/dashboard' 
                    ? 'text-primary-600' 
                    : 'text-gray-600'
                }`}
              >
                <ClipboardCheck className="h-5 w-5 mb-1" />
                แดชบอร์ด
              </Link>
              <Link 
                to="/doctor/create-order"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                  location.pathname === '/doctor/create-order' 
                    ? 'text-primary-600' 
                    : 'text-gray-600'
                }`}
              >
                <Calendar className="h-5 w-5 mb-1" />
                สั่งแล็บ
              </Link>
              <Link 
                to="/doctor/results"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                  location.pathname === '/doctor/results' 
                    ? 'text-primary-600' 
                    : 'text-gray-600'
                }`}
              >
                <ClipboardCheck className="h-5 w-5 mb-1" />
                ผลแล็บ
              </Link>
            </>
          )}
          
          {isLabRoute && (
            <>
              <Link 
                to="/lab/dashboard"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                  location.pathname === '/lab/dashboard' 
                    ? 'text-primary-600' 
                    : 'text-gray-600'
                }`}
              >
                <ClipboardCheck className="h-5 w-5 mb-1" />
                รอดำเนินการ
              </Link>
              <Link 
                to="/lab/completed"
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium ${
                  location.pathname === '/lab/completed' 
                    ? 'text-primary-600' 
                    : 'text-gray-600'
                }`}
              >
                <ClipboardCheck className="h-5 w-5 mb-1" />
                เสร็จแล้ว
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
