"use client";

import { useState } from "react";
import { json } from "stream/consumers";
import Image from 'next/image';
import bgImg from "../../../public/bg-image.jpeg";
import DownloadReport from "../components/DownloadReport";
import { SEVA_OPTIONS } from "../constants/appConstants";

export default function ReceiptForm() {

  const [formData, setFormData] = useState({
    bookNo: "",
    receiptNo: "",
    sevaPrakar: "",
    amount: "",
    date: "",
    description: ""
  });
  const [message, setMessage] = useState("");
  const [isInput, setIsInput] = useState(false);
  const [inputNumber, setInputNumber] = useState<number | "">("");
  const [options, setOptions] = useState<number[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    // switch (e.target.name) {
    //   case "bookNo":
    //     const value = parseInt(e.target.value, 10);
    //     if (!isNaN(value) && value > 0) {
    //       setInputNumber(value);
  
    //       const start = (value - 1) * 50 + 1;
    //       const end = value * 50;
    //       const generatedOptions = Array.from({ length: 50 }, (_, i) => start + i);
  
    //       setOptions(generatedOptions);
    //     } else {
    //       setInputNumber("");
    //       setOptions([]);
    //     }
    //     break;
    //   case "sevaPrakar":
    //     if ( e.target.value === "any") {
    //       setIsInput(true);
    //     }
    //     break;
    //   default:
    //     break;
    // }
    if (e.target.name === "bookNo") {
      const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
          setInputNumber(value);
  
          const start = (value - 1) * 50 + 1;
          const end = value * 50;
          const generatedOptions = Array.from({ length: 50 }, (_, i) => start + i);
  
          setOptions(generatedOptions);
        } else {
          setInputNumber("");
          setOptions([]);
        }
    } else if (e.target.name === "sevaPrakar" && e.target.value === "any") {
      setIsInput(true);
    }
    setFormData({ ...formData, [e.target.name]: (e.target.name === "amount" ? Number(e.target.value) : e.target.value) });
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("formdata", JSON.stringify(formData));
    const response = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setMessage("Data saved successfully!");
      setFormData({ bookNo: "", receiptNo: "", sevaPrakar: "", amount: "", date: "", description: "" });
    } else {
      setMessage("Operation failed. Try again.");
    }
  };

  const viewReport = async (e: React.MouseEvent ) => {
    e.preventDefault();
    const response = await fetch("/api/report");
    if (response.ok) {
      const data = await response.json();
      console.log("Report Data:", data);
    } else {
      console.error("Failed to fetch report data");
    }
  }

  return (
    <div>
      {/* <Image src={bgImg} alt="Background Image" />  */}
      <div className="max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl" style={{ opacity: "0.7" }}>
        <h2 className="text-2xl font-bold text-center mb-4">Receipt</h2>
        {message && <p className="text-center text-green-500">{message}</p>}
        <form className="space-y-4">
          <div className="flex space-x-4">
            <label className="w-2/6 block text-sm font-medium">Book No.</label>
            <input
              type="number"
              name="bookNo"
              value={formData.bookNo}
              onChange={handleChange}
              className="w-2/6 p-2 border rounded col-span-2"
              min={1}
              max={50}
            />
            <label className=" w-2/6 block text-sm font-medium">Receipt No.</label>

            <select
              value={formData.receiptNo}
              name="receiptNo"
              onChange={handleChange}
              className="w-2/6 p-2 border rounded"
              disabled={options.length === 0}
            >
              <option value="">Select</option>
              {options.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Seva Prakar:</label>
            <select
              name="sevaPrakar"
              value={formData.sevaPrakar}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select</option>
              {Array.from(SEVA_OPTIONS).map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <br/>
            {isInput && <input type="text" placeholder="Enter description" name="description" value={formData.description} className="w-full p-2 border rounded" onChange={handleChange} />}
          </div>
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-1/3 p-2 border rounded"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={submitForm} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Save
            </button>
            <button onClick={viewReport} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
              View Report
            </button>
            <DownloadReport />
          </div>
        </form>
      </div>

    </div>


  );
}
