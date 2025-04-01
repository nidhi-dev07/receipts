import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { SEVA_OPTIONS } from "../constants/appConstants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), "data.json");
  const tableHeaders = ["Date", "Receipt No"].concat(SEVA_OPTIONS);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "No data found" });
  }

  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  res.status(200).json(data);
}