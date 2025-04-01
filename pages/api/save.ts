import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

// Path to the local JSON file
const filePath = path.join(process.cwd(), "data.json");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const newData = req.body;

      // Read existing data
      let existingData = [];
      if (fs.existsSync(filePath)) {
        const fileContents = fs.readFileSync(filePath, "utf-8");
        existingData = JSON.parse(fileContents || "[]");
      }

      // Append new data
      existingData.push({ id: existingData.length + 1, ...newData });

      // Save updated data
      fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2), "utf-8");

      return res.status(200).json({ message: "Data saved successfully!" });
    } catch (error) {
      console.error("Error saving data:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  return res.status(405).json({ message: "Method Not Allowed" });
}
