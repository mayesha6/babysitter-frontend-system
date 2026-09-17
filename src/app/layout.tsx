import React from 'react';
import { AppProvider } from '../context/AppContext';
import { ToastProvider } from '../context/ToastContext';
import './globals.css';

export const metadata = {
  title: 'BebiCare - Premium Babysitter & Childcare Platform',
  description: 'Your partner in parenting. Find safe, verified, fun, and engaging babysitters nearby.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ToastProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
