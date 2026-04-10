import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from "./database.types";
import * as mongoose from "mongoose";

dotenv.config();

const supabaseUrl = "https://zsvlpweqwqmsfrnrnmhl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

async function connectToMongoDB() {
  await mongoose.connect(process.env.MONGODB_URI ?? "", { dbName: "Modul6" });
}

connectToMongoDB()
  .then(() => console.log("Connect to MongDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
