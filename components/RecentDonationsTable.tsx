
import React from 'react';
import { type Donation } from '../types';
import { CheckCircle, XCircle } from './ui/Icons';

interface RecentDonationsTableProps {
  donations: Donation[];
}

export const RecentDonationsTable: React.FC<RecentDonationsTableProps> = ({ donations }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  const sortedDonations = [...donations].sort((a, b) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime());

  if (donations.length === 0) {
    return <p className="text-center text-slate-500 py-8">ยังไม่มีข้อมูลการบริจาค</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-sm">
        <thead className="bg-slate-100">
          <tr>
            <th className="text-left font-semibold text-slate-600 p-3">ชื่อ-นามสกุล</th>
            <th className="text-right font-semibold text-slate-600 p-3">จำนวนเงิน (บาท)</th>
            <th className="text-center font-semibold text-slate-600 p-3">วันที่บริจาค</th>
            <th className="text-center font-semibold text-slate-600 p-3">ลดหย่อนภาษี</th>
          </tr>
        </thead>
        <tbody>
          {sortedDonations.slice(0, 10).map((donation) => (
            <tr key={donation.id} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="p-3 text-slate-800">{donation.fullName}</td>
              <td className="p-3 text-right text-slate-800 font-mono">{formatCurrency(donation.amount)}</td>
              <td className="p-3 text-center text-slate-600">{formatDate(donation.donationDate)}</td>
              <td className="p-3 flex justify-center items-center">
                {donation.wantsTaxDeduction ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-slate-400" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
