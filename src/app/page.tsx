import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const DynamicHomePage = dynamic(() => import('../components/HomePageContent'), {
  ssr: false,
  loading: () => <Skeleton className="h-96 w-full" />
});

const HomePage = () => {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <DynamicHomePage />
    </Suspense>
  );
};

export default HomePage;