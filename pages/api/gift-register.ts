import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    let userId = null;
    
    if (session) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      userId = user?.id || null;
    }

    // Check if already registered
    const existingRegistration = await prisma.giftRegistration.findFirst({
      where: {
        OR: [
          { email },
          ...(userId ? [{ userId }] : [])
        ]
      }
    });

    if (existingRegistration) {
      return res.status(200).json({ 
        message: 'Already registered for gift',
        registered: true
      });
    }

    // Create gift registration
    const registration = await prisma.giftRegistration.create({
      data: {
        name,
        email,
        ...(userId ? { user: { connect: { id: userId } } } : {})
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Registered for gift successfully'
    });
  } catch (error) {
    console.error('Gift registration error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
}