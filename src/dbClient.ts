import { createClient } from "@supabase/supabase-js";

const [dbUrl, dbAnonKey] = [
	"https://iznxtliixtlbqfsidoxj.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6bnh0bGlpeHRsYnFmc2lkb3hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTk0MDUsImV4cCI6MjAxOTU3NTQwNX0.2uky25yqEFGlTPPjH1c10SchFIaCZhtoVbfdynmkAPc",
];

export const dbClient = createClient(dbUrl, dbAnonKey);
