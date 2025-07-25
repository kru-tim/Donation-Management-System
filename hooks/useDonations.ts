
import { useState, useEffect, useCallback } from 'react';
import { type Donation, type NewDonationPayload } from '../types';

// ===================================================================================
// !! IMPORTANT !!
// 1. Deploy the `Code.gs` script as a Web App in your Google Account.
//    - Set "Execute as" to "Me".
//    - Set "Who has access" to "Anyone".
// 2. Copy the Web App URL provided after deployment.
// 3. Paste the URL here to connect the frontend to your backend.
// ===================================================================================
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw1qf5hTuII8ij6X_b_cZq5J4JlqtFrZKIvZ7zEF7SetvgpnBXbVbHOTgq9WEiERVGn/exec';


export const useDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDonations = useCallback(async () => {
    if (!SCRIPT_URL.startsWith('https')) {
        setError('Please set the Google Apps Script URL in hooks/useDonations.ts');
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(SCRIPT_URL);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setDonations(result.data.sort((a: Donation, b: Donation) => new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred during fetch.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const addDonation = useCallback(async (newDonationData: NewDonationPayload) => {
     if (!SCRIPT_URL.startsWith('https')) {
        throw new Error('Please set the Google Apps Script URL in hooks/useDonations.ts');
    }
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            // Change content type to text/plain to avoid CORS preflight issues with Google Apps Script.
            // The backend script can still parse the JSON payload from the request body.
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(newDonationData),
        });
        
        const resultText = await response.text();
        const result = JSON.parse(resultText);

        if (result.error) {
            throw new Error(result.error);
        }
        
        setDonations(prevDonations => [result.data, ...prevDonations]);

    } catch (err) {
        console.error("Failed to add donation:", err);
        // Re-throw the error to be caught by the form's error handler
        throw err;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayDonation = donations
    .filter(d => d.donationDate === todayStr)
    .reduce((sum, d) => sum + d.amount, 0);

  const totalDonation = donations.reduce((sum, d) => sum + d.amount, 0);

  return {
    donations,
    addDonation,
    totalDonation,
    todayDonation,
    isLoading,
    error,
    clearError,
  };
};
