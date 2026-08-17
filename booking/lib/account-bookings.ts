import 'server-only';

import { createYarahServerClient } from '@/lib/yarah';
import type { Booking, BookingMessage, Profile, Review } from '@/lib/types';

function buildClient(accessToken: string) {
  return createYarahServerClient({ accessToken });
}

function assertNoError(error: { message?: string } | null, fallback: string) {
  if (error) {
    throw new Error(error.message ?? fallback);
  }
}

type ProfileSnippet = Pick<Profile, 'user_id' | 'display_name' | 'avatar_url'>;

async function loadProfileSnippets(
  yarah: ReturnType<typeof buildClient>,
  userIds: string[],
): Promise<Map<string, ProfileSnippet>> {
  const unique = Array.from(new Set(userIds.filter(Boolean)));
  if (unique.length === 0) return new Map();

  const { data, error } = await yarah.database
    .from('profiles')
    .select('user_id, display_name, avatar_url')
    .in('user_id', unique);

  if (error) throw new Error(error.message ?? 'Unable to load profile data.');
  return new Map((data ?? []).map((row) => [row.user_id, row as ProfileSnippet]));
}

const BOOKING_DETAIL_SELECT = `
  *,
  service:service_id(id, name, duration_min, image_url),
  provider:provider_id(id, slug, business_name, avatar_url, timezone, location)
`;

export async function getMyBookings(accessToken: string) {
  const yarah = buildClient(accessToken);
  const { data, error } = await yarah.database
    .from('bookings')
    .select(BOOKING_DETAIL_SELECT)
    .order('start_at', { ascending: false });

  // RLS scopes this to bookings where customer_id = auth.uid() OR provider owner.
  // For the customer dashboard caller we further filter on customer_id.
  assertNoError(error, 'Unable to load bookings.');
  return (data ?? []) as Booking[];
}

export async function getBookingForViewer(bookingId: string, accessToken: string) {
  const yarah = buildClient(accessToken);
  const { data, error } = await yarah.database
    .from('bookings')
    .select(BOOKING_DETAIL_SELECT)
    .eq('id', bookingId)
    .maybeSingle();

  assertNoError(error, 'Unable to load booking.');
  return (data ?? null) as Booking | null;
}

export async function getBookingMessages(bookingId: string, accessToken: string) {
  const yarah = buildClient(accessToken);
  const { data, error } = await yarah.database
    .from('booking_messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true });

  assertNoError(error, 'Unable to load messages.');

  const profilesByUserId = await loadProfileSnippets(
    yarah,
    (data ?? []).map((row) => row.sender_id as string),
  );
  return (data ?? []).map((row) => ({
    ...(row as BookingMessage),
    sender: profilesByUserId.get(row.sender_id as string) ?? null,
  }));
}

export async function getBookingReview(bookingId: string, accessToken: string) {
  const yarah = buildClient(accessToken);
  const { data, error } = await yarah.database
    .from('reviews')
    .select('*')
    .eq('booking_id', bookingId)
    .maybeSingle();

  assertNoError(error, 'Unable to load review.');
  return (data ?? null) as Review | null;
}

export async function getMyProfile(accessToken: string, userId: string) {
  const yarah = buildClient(accessToken);
  const { data, error } = await yarah.database
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  assertNoError(error, 'Unable to load your profile.');
  return (data ?? null) as Profile | null;
}
