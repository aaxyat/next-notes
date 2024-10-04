import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    const notes = await db.collection('notes').find({ userId }).toArray();
    return res.status(200).json(notes);
  } else if (req.method === 'POST') {
    const { title, content, tags } = req.body;
    const newNote = {
      title,
      content,
      tags,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('notes').insertOne(newNote);
    return res.status(201).json({ ...newNote, _id: result.insertedId });
  }

  res.status(405).json({ error: 'Method not allowed' });
}