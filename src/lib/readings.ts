import type { SupabaseClient } from "@supabase/supabase-js";

export type ReadingKind = "tarot" | "numerology";
export type ReadingPayload = { kind: ReadingKind; title: string; payload: Record<string, unknown> };
export type ReadingRow = { id: string; user_id: string; kind: ReadingKind; title: string; payload: Record<string, unknown>; created_at: string };
const columns = "id,user_id,kind,title,payload,created_at";
const encoder = new TextEncoder();

export function validateReading(reading: ReadingPayload): void {
  if (reading.kind !== "tarot" && reading.kind !== "numerology") throw new Error("Tipo de consulta inválido.");
  if (typeof reading.title !== "string" || reading.title.trim().length < 1 || reading.title.length > 120) throw new Error("Título inválido (1–120 caracteres).");
  if (!reading.payload || typeof reading.payload !== "object" || Array.isArray(reading.payload)) throw new Error("Contenido inválido.");
  const serialized = JSON.stringify(reading.payload);
  if (!serialized || encoder.encode(serialized).length > 12000) throw new Error("La consulta supera el límite de tamaño permitido.");
}

// La protección efectiva es RLS en PostgreSQL; el filtro adicional evita errores accidentales de UI.
export async function listReadings(client: SupabaseClient, userId: string, limit = 30): Promise<ReadingRow[]> {
  const { data, error } = await client.from("astro_readings").select(columns).eq("user_id", userId)
    .order("created_at", { ascending: false }).limit(limit);
  if (error) throw error;
  return (data ?? []) as ReadingRow[];
}

export async function saveReading(client: SupabaseClient, userId: string, reading: ReadingPayload): Promise<ReadingRow> {
  validateReading(reading);
  const { data, error } = await client.from("astro_readings")
    .insert({ user_id: userId, kind: reading.kind, title: reading.title.trim(), payload: reading.payload })
    .select(columns).single();
  if (error) throw error;
  if (!data || data.user_id !== userId) throw new Error("La respuesta no corresponde a la cuenta activa.");
  return data as ReadingRow;
}

export async function removeReading(client: SupabaseClient, userId: string, id: string): Promise<void> {
  const { data, error } = await client.from("astro_readings").delete().eq("id", id).eq("user_id", userId)
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("La consulta ya no existe o no pertenece a tu cuenta.");
}

export async function exportReadings(client: SupabaseClient, userId: string): Promise<ReadingRow[]> {
  const output: ReadingRow[] = [];
  const pageSize = 500;
  for (let offset = 0; offset <= 50000; offset += pageSize) {
    const { data, error } = await client.from("astro_readings").select(columns)
      .eq("user_id", userId).order("created_at", { ascending: false }).order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (error) throw error;
    const page = (data ?? []) as ReadingRow[];
    output.push(...page);
    if (page.length < pageSize) return output;
  }
  throw new Error("Demasiados registros para exportar de una vez. Contactá al administrador.");
}
