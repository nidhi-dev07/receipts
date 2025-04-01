"use client";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SEVA_OPTIONS } from "../constants/appConstants";

interface ReceiptData {
  id: number,
  bookNo: number,
  receiptNo: number,
  sevaPrakar: string,
  amount: number,
  date: string
}

export default function DownloadReport() {
  const [data, setData] = useState<ReceiptData[]>([]);

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const tableHeaders = ["No", "Date"].concat(SEVA_OPTIONS, "Description");

  const mergeDataByReceipt = (data: any[]) => {
    const groupedData: { [key: string]: any } = {};
    let totalThakorji = 0, totalGauseva = 0, totalSamgri = 0, totalGopinathji = 0, totalGurubhet = 0, totalShrinathji = 0, totalAny = 0, totalAmount = 0;
    data.forEach(({ date, receiptNo, sevaPrakar, amount, description }) => {
      if (!groupedData[receiptNo]) {
        groupedData[receiptNo] = {
          receiptNo,
          date,
          thakorji: "",
          gauseva: "",
          samgri: "",
          gopinathji: "",
          gurubhet: "",
          shrinathji: "",
          any: "",
          description: "",
        };
      }

      // Assign values based on sevaPrakar

      if (sevaPrakar.includes("Thakorji")) {
        groupedData[receiptNo].thakorji = amount || 0;
        totalThakorji += amount || 0;
        console.log("thakorji", amount, totalThakorji);
      }
  
      if (sevaPrakar.includes("Gauseva")) {
        groupedData[receiptNo].gauseva = amount || 0;
        totalGauseva += amount || 0;
        console.log("gauseva", amount, totalGauseva);
      }
        
      if (sevaPrakar.includes("Samgri")) {
        groupedData[receiptNo].samgri = amount || 0;
        totalSamgri += amount || 0;
        console.log("samgri", amount, totalSamgri);
      }
       
      if (sevaPrakar.includes("Gopinathji")) {
        groupedData[receiptNo].gopinathji = amount || 0;
        totalGopinathji += amount || 0;
        console.log("gopinathji", amount, totalGopinathji);
      }
        

      if (sevaPrakar.includes("Gurubhet")) {
        groupedData[receiptNo].gurubhet = amount || 0;
        totalGurubhet += amount || 0;
        console.log("gurubhet", amount, totalGurubhet);
      }

      if (sevaPrakar.includes("Shrinathji")) {
        groupedData[receiptNo].shrinathji = amount || 0;
        totalShrinathji += amount || 0;
        console.log("shrinathji", amount, totalShrinathji);
      }
        
      if (sevaPrakar.includes("Any")) {
        groupedData[receiptNo].any = amount || 0;
        totalAny += amount || 0;
        console.log("any", amount, totalAny);
      }
       
      if (sevaPrakar.includes("any")) groupedData[receiptNo].description = description || "";

      groupedData[receiptNo].amount += amount;
    totalAmount += amount;
    });
    console.log("totalAmount", totalAmount);
    return {mergedData: Object.values(groupedData), totals: { totalThakorji, totalGauseva, totalSamgri, totalGopinathji, totalGurubhet, totalShrinathji, totalAny }};
  }
  console.log("merge dtaa", mergeDataByReceipt(data));

  
  // 📌 Generate and Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    let tableBody = mergeDataByReceipt(data)
    let mergedData = tableBody.mergedData;
    let totals = tableBody.totals;
    const footerRow = [
      "Total",
      "", 
      totals.totalThakorji, 
      totals.totalGauseva, 
      totals.totalSamgri, 
      totals.totalGopinathji,
      totals.totalGurubhet,
      totals.totalShrinathji,
      totals.totalAny,
      totals.totalThakorji + totals.totalGauseva + totals.totalSamgri + totals.totalGopinathji + totals.totalGurubhet + totals.totalShrinathji + totals.totalAny
    ];

    doc.text("Report", 14, 10);
    autoTable(doc, {   
      head: [tableHeaders],
      body: mergedData.map((d) => Object.values(d)),
      theme: "grid",
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: "auto" }, 1: { cellWidth: "auto" } },
      foot: [footerRow]
    });
    doc.save("Report.pdf");
  };

  console.log("table headers", tableHeaders);
  return (
    <div>
      {/* <h2 className="text-2xl font-bold mb-4">Report</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Book No</th>
            <th className="border border-gray-300 p-2">Receipt No</th>
            <th className="border border-gray-300 p-2">Seva Prakar</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.id} className="text-center bg-white border-b">
              <td className="border border-gray-300 p-2">{d.id}</td>
              <td className="border border-gray-300 p-2">{d.bookNo}</td>
              <td className="border border-gray-300 p-2">{d.receiptNo}</td>
              <td className="border border-gray-300 p-2">{d.sevaPrakar}</td>
              <td className="border border-gray-300 p-2">{d.amount}</td>
              <td className="border border-gray-300 p-2">{d.date}</td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <button onClick={downloadPDF} className="bg-red-500 text-white px-4 py-2 rounded">
        Download PDF
      </button>

    </div>
  );
}
