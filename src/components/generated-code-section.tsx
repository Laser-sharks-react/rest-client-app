import { useRequestStore } from '@/store/request-store';
import { Tabs, Tab, Card } from '@mui/material';
import { useMemo, useState } from 'react';
import { generateCode } from '@/lib/utils/code-generators';
import { useTranslations } from 'next-intl';
import type { Language } from '@/lib/types/request';
import { LANGUAGES } from '@/lib/constants/request';
import { transformRequestWithVariables } from '@/lib/utils/replace-variables';

export const GeneratedCodeSection = () => {
  const request = useRequestStore();
  const transformed = transformRequestWithVariables(request);
  const t = useTranslations('RequestSender');

  const [lang, setLang] = useState<Language>('cURL');

  const code = useMemo(() => {
    if (!request.url || !request.method) {
      return t('notEnoughData');
    }

    return generateCode({ lang, request: transformed });
  }, [request, transformed, lang, t]);

  return (
    <Card>
      <Tabs
        value={lang}
        onChange={(_, newValue) => setLang(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {LANGUAGES.map(l => (
          <Tab key={l} value={l} label={l} />
        ))}
      </Tabs>
      <pre className="bg-zinc-100 p-3 mt-2 rounded text-sm overflow-x-auto">
        {code}
      </pre>
    </Card>
  );
};
