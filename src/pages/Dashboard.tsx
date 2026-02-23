import { useApp } from '@/context/AppContext';
import { Navigate } from 'react-router-dom';
import DonorDashboard from '@/pages/DonorDashboard';
import HospitalDashboard from '@/pages/HospitalDashboard';

const Dashboard = () => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === 'hospital' ? <HospitalDashboard /> : <DonorDashboard />;
};

export default Dashboard;
