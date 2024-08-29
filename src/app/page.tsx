import type { Metadata } from 'next'
import dynamic from 'next/dynamic';

const Map = dynamic(import('../components/Map'), { ssr: false });

export const metadata: Metadata = {
  title: 'Home | EchoEcho',
}

function Page() {
  return (
    <div>
      <Map center={[22.35, 113.599]} />
    </div>
  );
}

export default Page;