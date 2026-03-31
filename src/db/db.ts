import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { Database } from "./database.types";
dotenv.config();

const supabaseUrl = "https://zsvlpweqwqmsfrnrnmhl.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY ?? "";
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);
