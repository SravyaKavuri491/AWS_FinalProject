import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { eventId, eventName, userEmail, cardNumber, cardExpiry, cardCvc } = req.body;

    // Create the registration record with payment details
    const registration = await prisma.eventRegistration.create({
      data: {
        eventName,
        userEmail,
        paymentDetails: {
          create: {
            cardLastFour: cardNumber.slice(-4),
            cardExpiry,
            paymentStatus: 'MOCK_COMPLETED'
          }
        },
        event: { connect: { id: Number(eventId) } },
        // Connect to user if exists, otherwise just store email
        ...(await prisma.user.findUnique({ where: { email: userEmail } }) 
          ? { user: { connect: { email: userEmail } } }
          : {})
      },
      select: {
        id: true,
        eventName: true,
        userEmail: true,
        createdAt: true,
        paymentDetails: {
          select: {
            cardLastFour: true,
            paymentStatus: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      registration
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}