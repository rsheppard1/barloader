import PlateCalculator from '@/components/PlateCalculator';
import { Analytics } from '@vercel/analytics/react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <PlateCalculator />
      <Analytics />
    </main>
  );
}