import { type ApiResponse } from '@/lib/types';
import { Card } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type Props = {
  response: ApiResponse | null;
};

export const CustomResponse = ({ response }: Props) => {
  return (
    <Card className="p-4">
      <div className="overflow-auto max-h-96">
        <SyntaxHighlighter
          language="json"
          style={prism}
          wrapLongLines
          customStyle={{ fontSize: '0.875rem', borderRadius: '0.5rem' }}
        >
          {JSON.stringify(response, null, 2)}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
};
