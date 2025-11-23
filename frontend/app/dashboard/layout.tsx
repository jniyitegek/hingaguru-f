import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Toaster } from 'sonner';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


export const metadata: Metadata = {
  title: 'Dashboard | HingaGuru',
  description: 'Your farming management dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
      <Toaster />
    </div>
  );
}
