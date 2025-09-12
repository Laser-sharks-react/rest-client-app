import 'server-only';
import Link from 'next/link';
import { fetchUserHistory } from '@/lib/utils/fetch-user-history';
import { getUserId } from '@/lib/utils/get-user-id';

export const dynamic = 'force-dynamic';

// const AnalyticsClient = NextDynamic(() => import('./parts/AnalyticsClient'), {
//   ssr: false,
// });

export default async function HistoryPage() {
  const uid = await getUserId();
  if (!uid) {
    return <div className="p-6">Unauthorized</div>;
  }

  const realRows = await fetchUserHistory(uid, 200);
  console.log(realRows);
  const rows = [];

  if (!rows.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-2">History & Analytics</h1>
        <p className="text-gray-500 mb-4">
          You haven’t executed any requests yet.
        </p>
        <div className="space-y-2">
          <Link className="text-blue-600 underline" href="/rest">
            Open REST client
          </Link>
        </div>
      </div>
    );
  }

  //здесь аналитика
}
