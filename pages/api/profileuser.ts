import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/model/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get email from cookies (set during login)
    const email = req.cookies.userEmail;
    
    if (!email) {
      return res.status(400).json({ error: 'User email not found in session' });
    }

    // Fetch user data
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}