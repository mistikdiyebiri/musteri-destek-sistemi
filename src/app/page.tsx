"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  // Client-side rendering için
  useEffect(() => {
    setMounted(true);
  }, []);

  // Server-side rendering sırasında hiçbir şey gösterme
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Müşteri Destek Sistemi</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Dashboard
              </Link>
              <Link 
                href="/auth/login" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Müşteri Destek Sisteminize Hoş Geldiniz
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Kullanıcı dostu arayüzümüz ve güçlü özellikleriyle müşteri taleplerinizi etkili bir şekilde yönetin.
            </p>
            
            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Özellik Kartı 1 */}
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Bilet Yönetimi
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Tüm destek taleplerini tek bir yerden kolayca yönetin, önceliklendirebilir ve kategorilere ayırabilirsiniz.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Özellik Kartı 2 */}
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Gerçek Zamanlı Bildirimler
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Yeni mesajlar veya durum güncellemeleri hakkında anında bildirimler alın, hiçbir şey gözden kaçırmayın.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Özellik Kartı 3 */}
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        Detaylı Analitikler
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        Performans göstergeleri ve raporlar ile destek ekibinizin etkinliğini ölçün ve iyileştirin.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="bg-gray-100 p-8 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Admin Giriş</h3>
                  <p className="mb-4">Müşteri destek sisteminizi yönetmek için admin paneline giriş yapın.</p>
                  <Link 
                    href="/dashboard/admin" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Admin Paneli
                  </Link>
                </div>
                
                <div className="bg-gray-100 p-8 rounded-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Kullanıcı Giriş</h3>
                  <p className="mb-4">Destek taleplerini görmek ve yeni talepte bulunmak için giriş yapın.</p>
                  <Link 
                    href="/auth/login" 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Giriş Sayfası
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Müşteri Destek Sistemi. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  );
}