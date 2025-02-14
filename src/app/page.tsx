import Loader from '@/components/loader';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <Loader />
      <Analytics />
    </main>
  );
}