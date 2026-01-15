"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

type ConditionalLayoutProps = {
  children: React.ReactNode;
  settings: any;
};

export default function ConditionalLayout({ children, settings }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  // For admin routes, don't show header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For public routes, show header/footer
  return (
    <>
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
      {settings?.whatsappEnabled && settings?.whatsappNumber && (
        <WhatsAppButton number={settings.whatsappNumber} />
      )}
    </>
  );
}
