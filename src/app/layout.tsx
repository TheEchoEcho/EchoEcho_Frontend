import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from './providers';
import Header from '../components/Header';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className='p-4'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;