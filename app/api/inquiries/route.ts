import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const inquirySchema = z.object({
  tripTitle: z.string().trim().min(1, 'Trip title is required'),
  groupSize: z.string().trim().min(1, 'Group size is required'),
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().refine((val) => isValidPhoneNumber(val), {
    message: 'Enter a valid phone number.',
  }),
  country: z.string().trim().min(2, 'Country is required'),
  travelDate: z.string().refine((date) => new Date(date) >= new Date(new Date().toDateString()), {
    message: 'Travel date cannot be in the past',
  }),
  adultMale: z.number().min(0),
  adultFemale: z.number().min(0),
  childMale: z.number().min(0),
  childFemale: z.number().min(0),
  notes: z.string().optional(),
  estimatedTotal: z.string(),
  agreed: z.literal(true, { message: 'You must agree to be contacted' }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validationResult = inquirySchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || 'Validation failed';
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = validationResult.data;

    const newInquiry = await prisma.bookingSubmission.create({
      data: {
        tripTitle: data.tripTitle,
        groupSize: data.groupSize,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        travelDate: data.travelDate,
        adultMale: data.adultMale,
        adultFemale: data.adultFemale,
        childMale: data.childMale,
        childFemale: data.childFemale,
        notes: data.notes || '',
        estimatedTotal: data.estimatedTotal,
      },
    });

    return NextResponse.json({ success: true, inquiry: newInquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error', details: String(error) }, { status: 500 });
  }
}