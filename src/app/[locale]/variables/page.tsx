import LoadingScreen from '@/components/loading-screen';
import dynamic from 'next/dynamic';

const VariablesListDynamic = dynamic(
  () => import('@/components/variables-list').then(mod => mod.VariablesList),
  {
    loading: () => <LoadingScreen />,
  }
);

export default function VariablesPage() {
  return <VariablesListDynamic />;
}
