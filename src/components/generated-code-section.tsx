import { useRequestStore } from '@/store/request-store';
import { Tabs, Tab, Card } from '@mui/material';
import { useMemo, useState } from 'react';
import {
  generateCSharp,
  generateCurl,
  generateFetch,
  generateGo,
  generateJava,
  generateNode,
  generatePython,
  generateXHR,
} from '@/lib/utils/code-generators';
import { useTranslations } from 'next-intl';
import type { Language } from '@/lib/types/request';
import { LANGUAGES } from '@/lib/constants/request';

export const GeneratedCodeSection = () => {
  const request = useRequestStore();
  const t = useTranslations('RequestPage');

  const [lang, setLang] = useState<Language>('cURL');

  const code = useMemo(() => {
    if (!request.url || !request.method) {
      return t('notEnoughData');
    }

    switch (lang) {
      case 'cURL':
        return generateCurl(request);
      case 'JavaScript Fetch':
        return generateFetch(request);
      case 'JavaScript XHR':
        return generateXHR(request);
      case 'NodeJS':
        return generateNode(request);
      case 'Python':
        return generatePython(request);
      case 'Java':
        return generateJava(request);
      case 'C#':
        return generateCSharp(request);
      case 'Go':
        return generateGo(request);
      default:
        return '// Unsupported language';
    }
  }, [request, lang, t]);

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
