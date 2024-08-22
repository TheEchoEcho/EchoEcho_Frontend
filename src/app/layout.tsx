import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Header from '../components/Header';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className='h-16 fixed top-0 left-0 right-0'>
            <Header />
          </div>
          <div className='mt-16 p-4'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;