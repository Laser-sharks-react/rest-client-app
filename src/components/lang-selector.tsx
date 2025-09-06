'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { MenuItem, Menu, Button } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useState } from 'react';

export function LangSelector() {
  const pathname = usePathname();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <Button variant="contained" onClick={e => setAnchorEl(e.currentTarget)}>
        <LanguageIcon />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {routing.locales.map(lng => (
          <MenuItem
            component={Link}
            key={lng}
            onClick={() => setAnchorEl(null)}
            href={pathname}
            replace
            locale={lng}
          >
            {lng}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
