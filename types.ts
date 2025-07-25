export interface Donation {
  id: string;
  fullName: string;
  amount: number;
  donationDate: string; // YYYY-MM-DD
  wantsTaxDeduction: boolean;
  nationalId?: string;
  slipUrl: string;
}

export interface SlipData {
  amount: number | null;
  date: string | null;
}

export interface SlipUploadPayload {
  base64: string;
  type: string;
  name: string;
}

export interface NewDonationPayload extends Omit<Donation, 'id' | 'slipUrl'> {
    slip: SlipUploadPayload;
}
