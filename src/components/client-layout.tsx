'use client';
import { SnackbarProvider } from 'notistack';

export function ClientProviders() {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    />
  );
}
