'use client';

import { SnackbarProvider } from 'notistack';

export function Providers({ children }: { children: React.ReactNode }) {
  return <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>;
}
