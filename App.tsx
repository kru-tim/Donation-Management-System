
import React from 'react';
import { Header } from './components/Header';
import { DonationForm } from './components/DonationForm';
import { DonationStats } from './components/DonationStats';
import { RecentDonationsTable } from './components/RecentDonationsTable';
import { useDonations } from './hooks/useDonations';
import { exportDonationsToCSV } from './services/csvExporter';
import { Download, GitHub } from './components/ui/Icons';

export default function App(): React.ReactNode {
  const { 
    donations, 
    addDonation, 
    totalDonation, 
    todayDonation,
    isLoading,
    error,
    clearError
  } = useDonations();

  const handleExport = () => {
    exportDonationsToCSV(donations);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">ลงทะเบียนการบริจาค</h2>
            <DonationForm onAddDonation={addDonation} />
          </div>
          <div className="lg:col-span-2">
            <DonationStats total={totalDonation} today={todayDonation} />
            <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-700">รายการบริจาคล่าสุด</h2>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300"
                >
                  <Download className="w-5 h-5" />
                  Export to CSV
                </button>
              </div>
              {isLoading && <p className="text-center text-slate-500">Loading donations...</p>}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">Error: </strong>
                  <span className="block sm:inline">{error}</span>
                  <button onClick={clearError} className="absolute top-0 bottom-0 right-0 px-4 py-3">
                    <span className="text-2xl">&times;</span>
                  </button>
                </div>
              )}
              {!isLoading && !error && <RecentDonationsTable donations={donations} />}
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-slate-500 text-sm mt-8 border-t border-slate-200">
        <p>ระบบจัดการเงินบริจาค</p>
        <p className="mt-1">พบปัญหาการใช้งาน ติดต่อ: 088-288-4580 (ครูไอติม)</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <GitHub className="w-4 h-4" />
          <a 
            href="https://github.com/your-username/your-repo-name" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors"
          >
            View Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}