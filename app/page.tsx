import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation';
import { NoteTakingAppComponent } from '@/components/note-taking-app';

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return <NoteTakingAppComponent />;
}