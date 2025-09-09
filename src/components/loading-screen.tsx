'use client';

import { Box, CircularProgress } from '@mui/material';

export default function LoadingScreen() {
  return (
    <Box className="h-screen flex items-center justify-center">
      <CircularProgress />
    </Box>
  );
}
