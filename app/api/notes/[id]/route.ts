import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const note = await Note.findById(params.id);
    if (!note) {
      return NextResponse.json({ success: false, error: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch note' }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection('notes');

    const updatedNote = await request.json();
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id), userId: updatedNote.userId },
      { $set: updatedNote }
    );

    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note updated successfully' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to update note', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    const collection = db.collection('notes');

    const result = await collection.deleteOne({ _id: new ObjectId(params.id), userId });

    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to delete note', details: error.message },
      { status: 500 }
    );
  }
}