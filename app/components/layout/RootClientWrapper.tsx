'use client';

import { usePathname } from 'next/navigation';
import { MotionProvider } from '../animations/Motion';
import SmoothScrollProvider from '../SmoothScrollProvider';

export default function RootClientWrapper({
  children,
  navbar,
  footer,
  contactWidget,
  homeLoader,
}: {
  children: React.ReactNode;
  navbar: React.ReactNode;
  footer: React.ReactNode;
  contactWidget: React.ReactNode;
  homeLoader: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <MotionProvider>
        {children}
        {homeLoader}
      </MotionProvider>
    );
  }

  return (
    <SmoothScrollProvider>
      <MotionProvider>
        {navbar}
        {children}
        {footer}
        {contactWidget}
        {homeLoader}
      </MotionProvider>
    </SmoothScrollProvider>
  );
}
