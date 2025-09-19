import { useRequestStore } from '@/store/request-store';
import { Tabs, Tab, Card } from '@mui/material';
import { useMemo, useState } from 'react';
import { generateRequestCode } from '@/lib/utils/code-generators';
import { useTranslations } from 'next-intl';
import type { Language } from '@/lib/types/request';
import { LANGUAGES } from '@/lib/constants/request';

export const GeneratedCodeSection = () => {
  const request = useRequestStore();
  const t = useTranslations('RequestSender');

  const [lang, setLang] = useState<Language>('cURL');

  const code = useMemo(() => {
    if (!request.url || !request.method) {
      return t('notEnoughData');
    }
    return generateRequestCode(lang, request);
  }, [request, lang, t]);

  return (
    <Card>
      <Tabs
        value={lang}
        onChange={(_, newValue) => setLang(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {LANGUAGES.map(lang => (
          <Tab key={lang} value={lang} label={lang} />
        ))}
      </Tabs>
      <pre className="bg-zinc-100 p-3 mt-2 rounded text-sm overflow-x-auto">
        {code}
      </pre>
    </Card>
  );
};
