
import React from 'react';
import { DollarSign, Calendar } from './ui/Icons';

interface DonationStatsProps {
  total: number;
  today: number;
}

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; color: string }> = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${color}`}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const DonationStats: React.FC<DonationStatsProps> = ({ total, today }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        icon={<DollarSign className="text-blue-500" />}
        title="ยอดบริจาครวมทั้งหมด"
        value={formatCurrency(total)}
        color="border-blue-500"
      />
      <StatCard
        icon={<Calendar className="text-green-500" />}
        title="ยอดบริจาควันนี้"
        value={formatCurrency(today)}
        color="border-green-500"
      />
    </div>
  );
};
