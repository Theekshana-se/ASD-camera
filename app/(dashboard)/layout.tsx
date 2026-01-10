import { Suspense } from "react";
import { NavigationProvider } from "@/components/NavigationProvider";

// Simple loading fallback
function LoadingFallback() {
  return null;
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Auth is handled by middleware.ts - no blocking server call needed here
  // This allows instant navigation between admin pages
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </Suspense>
  );
}
