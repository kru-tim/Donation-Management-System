
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 md:px-8 py-6 flex flex-col items-center text-center">
        <img src="https://img5.pic.in.th/file/secure-sv1/-pngf56b39ea5460eb86.png" alt="School Logo" className="h-16 w-16 object-contain mb-3" />
        <div>
            <h1 className="text-3xl font-bold text-blue-600">ระบบจัดการเงินบริจาค</h1>
            <p className="text-slate-500 mt-1">
              แพลตฟอร์มสำหรับบันทึกและติดตามข้อมูลการบริจาค
            </p>
        </div>
      </div>
    </header>
  );
};
