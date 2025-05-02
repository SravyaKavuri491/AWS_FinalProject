import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { name, email, issue, content } = req.body

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        issue,
        content: content || null
      }
    })

    return res.status(200).json(feedback)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}