
import React, { useState, useCallback } from 'react';
import { type NewDonationPayload } from '../types';
import { extractInfoFromSlip } from '../services/geminiService';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Checkbox } from './ui/Checkbox';
import { Spinner } from './ui/Spinner';
import { UploadCloud } from './ui/Icons';

interface DonationFormProps {
  onAddDonation: (donation: NewDonationPayload) => Promise<void>;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};


export const DonationForm: React.FC<DonationFormProps> = ({ onAddDonation }) => {
  const [fullName, setFullName] = useState('');
  const [amount, setAmount] = useState('');
  const [donationDate, setDonationDate] = useState(new Date().toISOString().split('T')[0]);
  const [initialNationalId, setInitialNationalId] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [wantsTaxDeduction, setWantsTaxDeduction] = useState(false);
  const [taxNationalId, setTaxNationalId] = useState('');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  
  const [isAmountLocked, setIsAmountLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file)); 
      setOcrLoading(true);
      setError(null);
      setIsAmountLocked(false);
      try {
        const base64String = await fileToBase64(file);
        const slipData = await extractInfoFromSlip(base64String.split(',')[1]);
        if (slipData?.amount) {
          setAmount(slipData.amount.toString());
          setIsAmountLocked(true); // Lock the amount field on successful OCR
        } else {
           setError('ไม่สามารถอ่านจำนวนเงินจากสลิปได้ กรุณากรอกด้วยตนเอง');
        }
        if (slipData?.date) {
          setDonationDate(slipData.date);
        }
      } catch (err) {
        setError('ไม่สามารถอ่านข้อมูลจากสลิปได้ กรุณากรอกข้อมูลด้วยตนเอง');
      } finally {
        setOcrLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isCertified) {
      setError('กรุณายืนยันความถูกต้องของข้อมูล');
      return;
    }
    if (!slipFile) {
        setError('กรุณาอัปโหลดสลิปการโอนเงิน');
        return;
    }
    if (!amount || parseFloat(amount) <= 0) {
        setError('กรุณากรอกจำนวนเงินให้ถูกต้อง');
        return;
    }
    if (wantsTaxDeduction && taxNationalId.length !== 13) {
      setError('กรุณากรอกเลขบัตรประชาชน 13 หลักให้ถูกต้อง');
      return;
    }

    setIsLoading(true);
    
    try {
      // --- Create custom filename ---
      const sanitizedFullName = fullName.trim().replace(/\s+/g, '-');
      const taxStatus = wantsTaxDeduction ? 'ลดหย่อนภาษี' : 'ไม่ลดหย่อน';
      // Using sv-SE locale gives a nice YYYY-MM-DD HH:MM:SS format, which is great for sorting
      const timestamp = new Date().toLocaleString('sv-SE').replace(/:/g, '-');
      const fileExtension = slipFile.name.split('.').pop() || 'jpg';
      const newFileName = `${sanitizedFullName}_${amount}B_${taxStatus}_${donationDate}_${timestamp}.${fileExtension}`;
      // -----------------------------

      const base64 = await fileToBase64(slipFile);
      await onAddDonation({
        fullName,
        amount: parseFloat(amount),
        donationDate,
        wantsTaxDeduction,
        nationalId: wantsTaxDeduction ? taxNationalId : undefined,
        slip: {
            base64: base64.split(',')[1],
            type: slipFile.type,
            name: newFileName // Use the newly generated filename
        }
      });
      // Reset form
      setFullName('');
      setAmount('');
      setDonationDate(new Date().toISOString().split('T')[0]);
      setInitialNationalId('');
      setIsCertified(false);
      setWantsTaxDeduction(false);
      setTaxNationalId('');
      setSlipFile(null);
      setSlipPreview(null);
      setIsAmountLocked(false);

    } catch(err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-6">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
      
      <div>
        <label htmlFor="initialNationalId" className="block text-sm font-medium text-slate-600 mb-1">ยืนยันตัวตน (เลขบัตรประชาชน 13 หลัก)</label>
        <Input id="initialNationalId" type="text" value={initialNationalId} onChange={e => setInitialNationalId(e.target.value)} placeholder="x-xxxx-xxxxx-xx-x" maxLength={13} required />
      </div>

      <Checkbox
        id="certification"
        label="ข้าพเจ้ารับรองว่าข้อมูลทั้งหมดเป็นความจริง"
        checked={isCertified}
        onChange={e => setIsCertified(e.target.checked)}
      />

      <div className="border-t border-slate-200 pt-6 space-y-4">
        <Input id="fullName" label="ชื่อ-นามสกุล ผู้บริจาค" value={fullName} onChange={e => setFullName(e.target.value)} required />
        <Input 
          id="amount" 
          label="จำนวนเงิน (บาท)" 
          type="number" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          required 
          placeholder="กรอกจำนวนเงิน หรืออัปโหลดสลิป"
          readOnly={isAmountLocked}
        />
        <Input id="donationDate" label="วันที่โอน" type="date" value={donationDate} onChange={e => setDonationDate(e.target.value)} required />
      
        <div className="flex items-center space-x-3">
          <label htmlFor="slipUpload" className="w-full cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-3 px-4 rounded-lg text-center transition duration-300 flex items-center justify-center gap-2">
            <UploadCloud className="w-5 h-5" />
            {slipFile ? 'เปลี่ยนสลิป' : 'อัปโหลดสลิป'}
          </label>
          <input id="slipUpload" type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
          {ocrLoading && <Spinner />}
        </div>

        {slipPreview && (
            <div className="mt-4">
                <img src={slipPreview} alt="Slip Preview" className="max-w-full h-auto rounded-lg border" />
            </div>
        )}

        <Checkbox
          id="taxDeduction"
          label="ต้องการลดหย่อนภาษี (e-Donation)"
          checked={wantsTaxDeduction}
          onChange={e => setWantsTaxDeduction(e.target.checked)}
        />

        {wantsTaxDeduction && (
          <Input id="taxNationalId" label="เลขบัตรประชาชนสำหรับลดหย่อนภาษี" value={taxNationalId} onChange={e => setTaxNationalId(e.target.value)} placeholder="x-xxxx-xxxxx-xx-x" maxLength={13} required={wantsTaxDeduction} />
        )}
      </div>

      <Button type="submit" disabled={isLoading || !isCertified} className="w-full">
        {isLoading ? <Spinner /> : 'ส่งข้อมูลการบริจาค'}
      </Button>
    </form>
  );
};