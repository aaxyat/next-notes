import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection('notes');

    const notes = await collection.find({ userId }).toArray();

    await client.close();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection('notes');

    const note = await request.json();
    const result = await collection.insertOne(note);

    await client.close();

    return NextResponse.json({ ...note, _id: result.insertedId });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to create note', details: error.message },
      { status: 500 }
    );
  }
}