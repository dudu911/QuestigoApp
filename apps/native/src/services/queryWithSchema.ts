import { z } from "zod";
import { supabase } from "./supabaseClient";

function logZodError(error: z.ZodError, table: string, data: unknown) {
  console.error(`❌ Zod validation failed for table "${table}"`);
  console.error("Issues:");
  for (const issue of error.issues) {
    console.error(
      `  • Path: ${issue.path.join(".")} | Code: ${issue.code} | Message: ${issue.message}`,
    );
  }
  console.error(
    "Raw data received from Supabase:",
    JSON.stringify(data, null, 2),
  );
}

// 🔹 Strict version (throws if invalid)
export async function queryWithSchema<T>(
  table: string,
  schema: z.ZodType<T>,
  filters?: (query: any) => any,
): Promise<T[]> {
  let query = supabase.from(table).select("*");
  if (filters) query = filters(query);

  const { data, error } = await query;
  if (error) throw error;

  try {
    return schema.array().parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      logZodError(err, table, data);
    }
    throw err;
  }
}

export async function singleWithSchema<T>(
  table: string,
  schema: z.ZodType<T>,
  filters?: (query: any) => any,
): Promise<T> {
  let query = supabase.from(table).select("*").single();
  if (filters) query = filters(query);

  const { data, error } = await query;
  if (error) throw error;

  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      logZodError(err, table, data);
    }
    throw err;
  }
}

// 🔹 Safe version (never throws, returns {data, errors})
export async function safeQueryWithSchema<T>(
  table: string,
  schema: z.ZodType<T>,
  filters?: (query: any) => any,
): Promise<{ data: T[]; errors: z.ZodError[] }> {
  let query = supabase.from(table).select("*");
  if (filters) query = filters(query);

  const { data, error } = await query;
  if (error) throw error;

  const results: T[] = [];
  const errors: z.ZodError[] = [];

  for (const row of data ?? []) {
    const parsed = schema.safeParse(row);
    if (parsed.success) {
      results.push(parsed.data);
    } else {
      errors.push(parsed.error);
      logZodError(parsed.error, table, row);
    }
  }

  return { data: results, errors };
}

export async function safeSingleWithSchema<T>(
  table: string,
  schema: z.ZodType<T>,
  filters?: (query: any) => any,
): Promise<{ data: T | null; error: z.ZodError | null }> {
  let query = supabase.from(table).select("*").single();
  if (filters) query = filters(query);

  const { data, error } = await query;
  if (error) throw error;

  const parsed = schema.safeParse(data);
  if (parsed.success) {
    return { data: parsed.data, error: null };
  } else {
    logZodError(parsed.error, table, data);
    return { data: null, error: parsed.error };
  }
}
