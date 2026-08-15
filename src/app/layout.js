import { AppProvider } from '../context/AppContext';
import './globals.css';

export const metadata = {
  title: 'BebiCare - Premium Babysitter & Childcare Platform',
  description: 'Your partner in parenting. Find safe, verified, fun, and engaging babysitters nearby.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
