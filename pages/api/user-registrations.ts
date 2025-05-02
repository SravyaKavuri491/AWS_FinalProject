import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getSession({ req });
    
    if (!session?.user?.email) {
      return res.status(200).json({ registrations: [] }); // Return empty if not logged in
    }

    const registrations = await prisma.eventRegistration.findMany({
      where: { user: { email: session.user.email } },
      select: { eventId: true }
    });

    return res.status(200).json({ registrations });

  } catch (error) {
    console.error('Error fetching registrations:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}