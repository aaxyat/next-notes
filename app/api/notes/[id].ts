import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { db } = await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { title, content, tags } = req.body;
    const updatedNote = {
      title,
      content,
      tags,
      updatedAt: new Date().toISOString(),
    };
    const result = await db.collection('notes').updateOne(
      { _id: new ObjectId(id as string), userId },
      { $set: updatedNote }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(200).json({ ...updatedNote, _id: id });
  } else if (req.method === 'DELETE') {
    const result = await db.collection('notes').deleteOne({ _id: new ObjectId(id as string), userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    return res.status(200).json({ message: 'Note deleted successfully' });
  }

  res.status(405).json({ error: 'Method not allowed' });
}