import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const availabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mode: z.enum(["ESTABELECIMENTO", "DOMICILIAR"]),
});

const bookingSchema = z.object({
  slotId: z.string().uuid(),
  kind: z.enum(["SERVICO", "CURSO"]),
  itemId: z.string().uuid(),
  mode: z.enum(["ESTABELECIMENTO", "DOMICILIAR"]),
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(8).max(30),
  email: z.string().trim().email().max(255).or(z.literal("")),
  address: z.object({
    postalCode: z.string().trim().max(12), street: z.string().trim().max(160),
    number: z.string().trim().max(20), complement: z.string().trim().max(100),
    neighborhood: z.string().trim().max(100), city: z.string().trim().max(100), state: z.string().trim().max(2),
  }),
}).superRefine((data, ctx) => {
  if (data.mode === "DOMICILIAR") {
    for (const key of ["postalCode", "street", "number", "neighborhood", "city", "state"] as const) {
      if (!data.address[key]) ctx.addIssue({ code: "custom", path: ["address", key], message: "Campo obrigatório" });
    }
  }
});

export const getAvailableSlots = createServerFn({ method: "GET" })
  .inputValidator((input) => availabilitySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const start = `${data.date}T00:00:00-03:00`;
    const endDate = new Date(`${data.date}T12:00:00-03:00`);
    endDate.setDate(endDate.getDate() + 1);
    const end = endDate.toISOString();
    const { data: slots, error } = await supabaseAdmin.from("availability_slots").select("id, starts_at, attendance_mode").gte("starts_at", start).lt("starts_at", end).eq("available", true).or(`attendance_mode.is.null,attendance_mode.eq.${data.mode}`).order("starts_at");
    if (error) throw new Error("Não foi possível consultar os horários.");
    return (slots ?? []).filter((slot) => new Date(slot.starts_at) > new Date()).map((slot) => ({ id: slot.id, startsAt: slot.starts_at }));
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((input) => bookingSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const table = data.kind === "CURSO" ? "courses" : "services";
    const { data: item } = await supabaseAdmin.from(table).select("id, name, price_cents").eq("id", data.itemId).eq("active", true).maybeSingle();
    if (!item) throw new Error("A opção escolhida não está disponível.");
    const { data: slot } = await supabaseAdmin.from("availability_slots").select("id, starts_at, available").eq("id", data.slotId).maybeSingle();
    if (!slot?.available || new Date(slot.starts_at) <= new Date()) throw new Error("Este horário não está mais disponível.");
    const location = data.mode === "ESTABELECIMENTO" ? "Av. Rio Largo, nº 100" : `${data.address.street}, ${data.address.number} — ${data.address.neighborhood}, ${data.address.city}/${data.address.state} — CEP ${data.address.postalCode}`;
    const payload = {
      slot_id: slot.id, kind: data.kind, service_id: data.kind === "SERVICO" ? item.id : null,
      course_id: data.kind === "CURSO" ? item.id : null, item_name: item.name, starts_at: slot.starts_at,
      attendance_mode: data.mode, client_name: data.name, client_phone: data.phone, client_email: data.email || null,
      postal_code: data.mode === "DOMICILIAR" ? data.address.postalCode : null, street: data.mode === "DOMICILIAR" ? data.address.street : null,
      street_number: data.mode === "DOMICILIAR" ? data.address.number : null, complement: data.mode === "DOMICILIAR" ? data.address.complement || null : null,
      neighborhood: data.mode === "DOMICILIAR" ? data.address.neighborhood : null, city: data.mode === "DOMICILIAR" ? data.address.city : null,
      state: data.mode === "DOMICILIAR" ? data.address.state.toUpperCase() : null, location_text: location, price_cents: item.price_cents,
    };
    const { data: booking, error } = await supabaseAdmin.from("bookings").insert(payload).select("id, item_name, starts_at, attendance_mode, location_text").single();
    if (error?.code === "23505") throw new Error("Este horário acabou de ser reservado. Escolha outro.");
    if (error || !booking) throw new Error("Não foi possível finalizar agora. Seus dados permanecem nesta tela.");
    await supabaseAdmin.from("availability_slots").update({ available: false }).eq("id", slot.id);
    return booking;
  });