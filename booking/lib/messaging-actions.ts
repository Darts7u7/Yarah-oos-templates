'use server';

import { revalidatePath } from 'next/cache';
import { requireAuthenticatedSession } from '@/lib/auth-session';
import { createYarahServerClient } from '@/lib/yarah';

type Result = { success: true } | { success: false; error: string };

export async function sendBookingMessage(input: {
  bookingId: string;
  body: string;
}): Promise<Result> {
  const session = await requireAuthenticatedSession();
  const yarah = createYarahServerClient({ accessToken: session.accessToken });

  const body = input.body.trim();
  if (!body) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  const { error } = await yarah.database.from('booking_messages').insert([
    {
      booking_id: input.bookingId,
      sender_id: session.viewer.id,
      body,
    },
  ]);

  if (error) {
    return { success: false, error: error.message ?? 'Send failed.' };
  }

  revalidatePath(`/account/bookings/${input.bookingId}`);
  revalidatePath(`/dashboard/bookings/${input.bookingId}`);
  return { success: true };
}
