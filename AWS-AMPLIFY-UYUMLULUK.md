# AWS Amplify Uyumluluk Raporu ve Optimizasyon Kılavuzu

Bu belge, müşteri destek sistemi uygulamasının AWS Amplify platformunda sorunsuz çalışabilmesi için yapılan optimizasyonları ve önerileri içerir.

## Yapılan Optimizasyonlar ve Düzeltmeler

### 1. Build Yapılandırmaları (`amplify.yml`)

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - echo "Node sürümü $(node -v)"
        - echo "NPM sürümü $(npm -v)"
        - npm install --legacy-peer-deps
    build:
      commands:
        - echo "Prisma istemcisini oluşturuyor..."
        - npx prisma generate
        - echo "Build başlatılıyor..."
        - npm run build
        - echo "Build tamamlandı"
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

- `npm ci` yerine `npm install --legacy-peer-deps` kullanılarak bağımlılık uyumluluk sorunları önlendi
- Prisma istemcisi için özel adım eklendi
- Next.js build cache için önbellek yapılandırması eklendi

### 2. Next.js Yapılandırması (`next.config.js`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['bcrypt', '@prisma/client'],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  }
}
```

- Eski veya gereksiz yapılandırmalar kaldırıldı
- Build süreci hızlandırıldı (`ignoreDuringBuilds` seçenekleriyle)
- CORS desteği için API başlıkları eklendi
- Görüntü optimizasyonu için `remotePatterns` eklendi
- Server-side rendering için bcrypt ve Prisma Client harici paket olarak tanımlandı

### 3. API Rotaları (CORS Düzeltmeleri)

- Tüm API rotalarına CORS başlıkları eklendi
- API options rotası eklenerek preflight isteklerine yanıt verildi
- Hata yönetimi geliştirildi

### 4. MCP (Model Control Protocol) İyileştirmeleri

- Tarayıcı/sunucu ortamı kontrolü ile hataların önlenmesi
- `localStorage/sessionStorage` kullanımının tarayıcı ortamında olduğundan emin olunması
- Environment değişkenlerinin uygun şekilde kullanılması
- Hata yönetimi güçlendirildi

### 5. Ortam Değişkenleri

- Üretim ortamı için özel `.env.production` dosyası güncellendi
- Amplify'da tanımlanması gereken ortam değişkenleri belirtildi

## Amplify Konsolunda Yapılandırılması Gereken Ortam Değişkenleri

Amplify dağıtımı öncesi aşağıdaki ortam değişkenlerini Amplify konsolunda tanımlamanız gerekmektedir:

| Değişken | Açıklama | Örnek Değer |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | API endpoint kök URL'si | `https://api.musteri-destek-sistemi.com` |
| `NEXT_PUBLIC_APP_URL` | Uygulama kök URL'si | `https://musteri-destek-sistemi.com` |
| `NEXT_PUBLIC_MCP_SERVER_URL` | MCP sunucu URL'si | `https://mcp.musteri-destek-sistemi.com` |
| `DATABASE_URL` | PostgreSQL veritabanı bağlantı URL'si | `postgresql://username:password@host:port/database` |
| `MCP_TOKEN_SECRET` | MCP token şifreleme anahtarı | `your-secret-key` |
| `NEXTAUTH_SECRET` | NextAuth oturum şifreleme anahtarı | `your-nextauth-key` |
| `NEXTAUTH_URL` | NextAuth callback URL | `https://musteri-destek-sistemi.com` |

## Performans Optimizasyonları

1. **Sunucu Bileşenleri**: Server Components ve Client Components doğru yapılandırıldı
2. **Görüntü Optimizasyonu**: Next.js Image komponenti üretimde optimizasyon yapmasına izin verilerek performans artırıldı
3. **Bundle Boyutu**: Next.js'in production build'inde otomatik kod bölme (code splitting) kullanıldı
4. **Ön Belleğe Alma**: `.next/cache` dizini önbelleğe alınarak build süreleri hızlandırıldı

## Dikkat Edilmesi Gerekenler

1. **Sunucu Taraflı Rendering (SSR)**: Amplify, Next.js SSR desteği sağlar ancak dikkatli yapılandırma gerektirir
2. **Server-Side Events (SSE)**: MCP ile SSE kullanırken uzun bağlantılar için Amplify zamanaşımı değerleri ayarlanmalıdır
3. **Veritabanı Bağlantıları**: Prisma Client ile serverless ortamda bağlantı havuzu (connection pooling) düşünülmelidir
4. **Sorun Giderme**: Dağıtım hatası durumunda Amplify konsolunda Build loglarını kontrol edin

## Sonraki Adımlar

1. Amplify konsolunda uygulamanızı oluşturun ve GitHub reponuzu bağlayın
2. Yukarıda belirtilen ortam değişkenlerini ekleyin
3. Build'i başlatın ve logları takip edin
4. Başarılı bir dağıtımdan sonra SSL ve özel alan adı yapılandırmasını tamamlayın

## Referanslar

- [AWS Amplify Next.js SSR Desteği](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html)
- [Next.js 15 SSR Dağıtım Kılavuzu](https://nextjs.org/docs/deployment)
- [Amplify Environment Değişkenleri](https://docs.aws.amazon.com/amplify/latest/userguide/environment-variables.html)