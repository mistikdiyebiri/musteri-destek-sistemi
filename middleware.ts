import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware fonksiyonu - bütün istekleri yakalar
export function middleware(request: NextRequest) {
  // Yanıt nesnesini oluştur
  const response = NextResponse.next();
  
  // CORS başlıklarını ekle - özellikle AWS Amplify dağıtımları için önemli
  // Bu, API rotalarının farklı origin'lerden gelen isteklere yanıt verebilmesini sağlar
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // OPTIONS isteklerini hemen yanıtla (preflight istekleri)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
  }
  
  // Güvenlik başlıklarını ekle - özellikle üretim ortamında önemli
  // Content-Security-Policy, XSS saldırılarına karşı koruma sağlar
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}

// Middleware sadece belirtilen path'lerde çalışacak
export const config = {
  matcher: [
    // API rotaları için
    '/api/:path*',
    // Aşağıdaki rotaları middleware'den hariç tut (statik dosyalar vb.)
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};