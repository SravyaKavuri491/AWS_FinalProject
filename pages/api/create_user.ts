import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from "@/model/db";
import bcrypt from 'bcrypt';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, password, phoneNumber, address } = req.body;

    try {
        // Validate required fields
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({ error: 'First name, last name, email and password are required' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = await prisma.user.create({ 
            data: { 
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber: phoneNumber || null,
                address: address || null
            } 
        });

        // Return user data without password
        const { password: _, ...userData } = user;
        res.status(200).json(userData);

    } catch (e) {
        console.error('Registration error:', e);
        res.status(500).json({ error: 'Registration failed' });
    }
}