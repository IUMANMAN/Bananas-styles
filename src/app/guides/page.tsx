import { Metadata } from 'next';
import GuideTimeline from '@/components/GuideTimeline';
import { isAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Prompt Guides - Nano Banana',
  description: 'Best practices and tutorials for using Nano Banana image generation.',
};

export default async function GuidesPage() {
  const adminStatus = await isAdmin();

  return (
    <div className="min-h-screen pb-16">
      <GuideTimeline isAdmin={adminStatus} />
    </div>
  );
}
