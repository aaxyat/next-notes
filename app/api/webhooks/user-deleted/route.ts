import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;
const webhookSecret = process.env.WEBHOOK_SECRET;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (!webhookSecret) {
  throw new Error('Please add your webhook secret to .env.local');
}

export async function POST(req: Request) {
  const payload = await req.json();
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Error occured -- no svix headers' }, { status: 400 });
  }

  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return NextResponse.json({ error: 'Error occured' }, { status: 400 });
  }

  if (evt.type === 'user.deleted') {
    const { id: userId } = evt.data;

    try {
      const client = await MongoClient.connect(uri);
      const db = client.db(dbName);
      const collection = db.collection('notes');

      const result = await collection.deleteMany({ userId });

      await client.close();

      console.log(`Deleted ${result.deletedCount} notes for user ${userId}`);

      return NextResponse.json({ message: `Deleted ${result.deletedCount} notes for user ${userId}` });
    } catch (error) {
      console.error('Error deleting user notes:', error);
      return NextResponse.json({ error: 'Failed to delete user notes' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook received' });
}