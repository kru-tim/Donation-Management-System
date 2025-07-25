
import { type Donation } from '../types';

export const exportDonationsToCSV = (donations: Donation[]) => {
  if (donations.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = [
    "ID",
    "Full Name",
    "Amount",
    "Donation Date",
    "Wants Tax Deduction",
    "National ID",
    "Slip URL"
  ];

  const csvRows = [headers.join(',')];

  for (const donation of donations) {
    const values = [
      donation.id,
      `"${donation.fullName.replace(/"/g, '""')}"`,
      donation.amount,
      donation.donationDate,
      donation.wantsTaxDeduction,
      donation.nationalId || '',
      donation.slipUrl
    ];
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `donations_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
