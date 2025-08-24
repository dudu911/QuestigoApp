import { z } from "zod";
import { supabase } from "./supabaseClient";

export async function queryWithSchema<T>(
  table: string,
  schema: z.ZodType<T>,
  filters?: (query: any) => any,
): Promise<T[]> {
  let query = supabase.from(table).select("*");
  if (filters) query = filters(query);

  const { data, error } = await query;
  if (error) throw error;

  return schema.array().parse(data);
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

  return schema.parse(data);
}
