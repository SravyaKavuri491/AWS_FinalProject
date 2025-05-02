import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/model/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set response headers
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  }

  try {
    const { email, firstName, lastName, phoneNumber, address } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        phoneNumber,
        address
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        address: true
      }
    });

    return res.status(200).json({
      success: true,
      user: updatedUser
    });

  } catch (error: any) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      details: error.message
    });
  }
}