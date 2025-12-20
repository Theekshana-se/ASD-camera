// *********************
// Role of the component: Footer component
// Name of the component: Footer.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <Footer />
// Input parameters: no input parameters
// Output: Footer component
// *********************

import { navigation } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaGoogle } from "react-icons/fa";

const Footer = ({ settings }: { settings?: any }) => {
  const current = settings || {};

  const sale = Array.isArray(current?.footerSale) ? current.footerSale : navigation.sale;
  const about = Array.isArray(current?.footerAbout) ? current.footerAbout : navigation.about;
  const buy = Array.isArray(current?.footerBuy) ? current.footerBuy : navigation.buy;
  const help = Array.isArray(current?.footerHelp) ? current.footerHelp : navigation.help;
  const logo = current?.logoUrl || "/logo v1.png";
  const title = current?.asdCameraTitle || "ASD Camera";
  const desc = current?.asdCameraDescription || "";
  const locations = Array.isArray(current?.asdCameraLocations) ? current.asdCameraLocations : [];
  const social = current?.socialLinks || {};
  const payments = Array.isArray(current?.paymentMethods) ? current.paymentMethods : [];

  const quickLinks: any[] = (about || []).concat(sale || []).concat(buy || []).concat(help || []);

  return (
    <footer className="bg-[#e9f2ff] border-t border-gray-300" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-screen-2xl px-6 lg:px-8 pt-16 pb-10">
        <h2 id="footer-heading" className="sr-only">Footer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h3 className="text-2xl font-semibold">
                <span className="text-red-600">ASD</span> <span>Camera</span>
              </h3>
            </div>
            {desc && <p className="text-sm text-gray-700 max-w-md">{desc}</p>}
            <div className="space-y-3">
              {locations.map((loc: any, idx: number) => (
                <div key={`${loc.city}-${idx}`} className="space-y-1">
                  {loc?.city && (
                    <div className="flex items-center gap-2 text-gray-800">
                      <FaMapMarkerAlt className="text-red-600" />
                      <span className="font-medium">{loc.city}</span>
                    </div>
                  )}
                  {Array.isArray(loc?.phones) && loc.phones.map((ph: string, pIdx: number) => (
                    <div key={pIdx} className="flex items-center gap-2 text-gray-700">
                      <FaPhoneAlt />
                      <span>{ph}</span>
                    </div>
                  ))}
                </div>
              ))}
              {settings?.contactEmail && (
                <div className="flex items-center gap-2 text-gray-700">
                  <FaEnvelope />
                  <span>{settings.contactEmail}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {quickLinks.slice(0, 8).map((item: any, idx: number) => (
                <li key={`${item.name}-${item.href}-${idx}`}>
                  {String(item.href || '').startsWith('/') ? (
                    <Link href={item.href} prefetch className="text-sm text-gray-800 hover:text-gray-900">
                      {item.name}
                    </Link>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-800 hover:text-gray-900">
                      {item.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Follow Us On</h3>
            <div className="mt-3 flex items-center gap-4">
              {social?.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white shadow hover:bg-gray-50">
                  <FaFacebookF />
                </a>
              )}
              {social?.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white shadow hover:bg-gray-50">
                  <FaInstagram />
                </a>
              )}
              {social?.google && (
                <a href={social.google} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white shadow hover:bg-gray-50">
                  <FaGoogle />
                </a>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-medium">Payment Methods</h4>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {payments.map((pm: any, idx: number) => (
                  <div key={idx} className="h-12 w-full bg-white rounded shadow flex items-center justify-center p-2">
                    {pm?.imageUrl ? (
                      <Image src={pm.imageUrl} alt={pm?.name || 'payment'} width={80} height={40} className="max-h-10 w-auto object-contain" />
                    ) : (
                      <span className="text-xs text-gray-500">No image</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
