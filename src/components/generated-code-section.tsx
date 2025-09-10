import { LANGUAGES } from '@/lib/constants';
import { useRequestStore } from '@/store/request-store';
import { Box, Tabs, Tab } from '@mui/material';
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
} from '@/utils/code-generators';
import { useTranslations } from 'next-intl';
import type { Language } from '@/lib/types';
import { headersArrayToObj } from '@/utils/headers-array-to-obj';

export const GeneratedCodeSection = () => {
  const { method, url, body, headers } = useRequestStore();
  const t = useTranslations('RestClientPage');

  const [lang, setLang] = useState<Language>('cURL');

  const code = useMemo(() => {
    if (!url || !method) {
      return t('notEnoughData');
    }

    const headersObj = headersArrayToObj(headers);

    switch (lang) {
      case 'cURL':
        return generateCurl(url, method, headersObj, body);
      case 'JavaScript Fetch':
        return generateFetch(url, method, headersObj, body);
      case 'JavaScript XHR':
        return generateXHR(url, method, headersObj, body);
      case 'NodeJS':
        return generateNode(url, method, headersObj, body);
      case 'Python':
        return generatePython(url, method, headersObj, body);
      case 'Java':
        return generateJava(url, method, headersObj, body);
      case 'C#':
        return generateCSharp(url, method, headersObj, body);
      case 'Go':
        return generateGo(url, method, headersObj, body);
      default:
        return '// Unsupported language';
    }
  }, [url, method, headers, lang, t, body]);

  return (
    <Box className="border rounded-md p-3 mt-4">
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
    </Box>
  );
};
