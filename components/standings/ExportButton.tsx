'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { ExportData } from '@/lib/types/standings';

interface ExportButtonProps {
  data: ExportData;
  className?: string;
}

export default function ExportButton({ data, className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Create CSV content for classes
      const classHeaders = ['Rank', 'Class', 'Department', 'Gold', 'Silver', 'Bronze', 'Total'];
      const classRows = data.classes.map((item, index) => [
        index + 1,
        item.className,
        item.department,
        item.medals.gold,
        item.medals.silver,
        item.medals.bronze,
        item.medals.total
      ]);

      // Create CSV content for departments
      const deptHeaders = ['Rank', 'Department', 'Gold', 'Silver', 'Bronze', 'Total'];
      const deptRows = data.departments.map((item, index) => [
        index + 1,
        item.department,
        item.medals.gold,
        item.medals.silver,
        item.medals.bronze,
        item.medals.total
      ]);

      // Combine all data
      const csvContent = [
        'XIE Student Council - Medal Standings',
        `Export Date: ${data.exportDate}`,
        '',
        'CLASS STANDINGS',
        classHeaders.join(','),
        ...classRows.map(row => row.join(',')),
        '',
        'DEPARTMENT STANDINGS',
        deptHeaders.join(','),
        ...deptRows.map(row => row.join(',')),
        '',
        'SUMMARY',
        `Total Winners: ${data.totalWinners}`,
        `Total Classes: ${data.classes.length}`,
        `Total Departments: ${data.departments.length}`
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `medal-standings-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    try {
      // Create HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>XIE Student Council - Medal Standings</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            h2 { color: #666; border-bottom: 2px solid #ddd; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .gold { color: #FFD700; font-weight: bold; }
            .silver { color: #C0C0C0; font-weight: bold; }
            .bronze { color: #CD7F32; font-weight: bold; }
            .summary { background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>XIE Student Council - Medal Standings</h1>
          <p style="text-align: center; color: #666;">Export Date: ${data.exportDate}</p>
          
          <h2>Class Standings</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Class</th>
                <th>Department</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Bronze</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.classes.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.className}</td>
                  <td>${item.department}</td>
                  <td class="gold">${item.medals.gold}</td>
                  <td class="silver">${item.medals.silver}</td>
                  <td class="bronze">${item.medals.bronze}</td>
                  <td><strong>${item.medals.total}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <h2>Department Standings</h2>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Department</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Bronze</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.departments.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.department}</td>
                  <td class="gold">${item.medals.gold}</td>
                  <td class="silver">${item.medals.silver}</td>
                  <td class="bronze">${item.medals.bronze}</td>
                  <td><strong>${item.medals.total}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Winners:</strong> ${data.totalWinners}</p>
            <p><strong>Total Classes:</strong> ${data.classes.length}</p>
            <p><strong>Total Departments:</strong> ${data.departments.length}</p>
          </div>
        </body>
        </html>
      `;

      // Open in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={exportToCSV}
        disabled={isExporting}
        className="hover-lift"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'CSV'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={exportToPDF}
        disabled={isExporting}
        className="hover-lift"
      >
        <FileText className="h-4 w-4 mr-2" />
        {isExporting ? 'Exporting...' : 'PDF'}
      </Button>
    </div>
  );
}
