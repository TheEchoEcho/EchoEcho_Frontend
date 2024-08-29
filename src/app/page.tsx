import type { Metadata } from 'next'
import Map from '../components/Map'

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