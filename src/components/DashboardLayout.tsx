import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-muted">
      <Navbar />
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
