# AWS Amplify Hata Çözüm Kılavuzu

Bu belge, AWS Amplify üzerinde Next.js 15.2.3 uygulamasını çalıştırırken karşılaşılan yaygın sorunları ve çözümlerini belgelemektedir.

## Tespit Edilen Hatalar

```
⚠ Invalid next.config.js options detected:
⚠ Unrecognized key(s) in object: 'serverComponentsExternalPackages' at "experimental"
⚠ Unrecognized key(s) in object: 'swcMinify'
⚠ `experimental.serverComponentsExternalPackages` has been moved to `serverExternalPackages`. Please update your next.config.js file accordingly.
```

```
It looks like you're trying to use TypeScript but do not have the required package(s) installed.
Please install typescript and @types/react by running:
npm install --save-dev typescript @types/react
```

## Çözümler

### 1. Next.js 15.2.3 Yapılandırma Değişiklikleri

Next.js 15.2.3'te bazı yapılandırma seçenekleri değiştirilmiştir:

- `experimental.serverComponentsExternalPackages` -> `serverExternalPackages` olarak değiştirildi
- `swcMinify` artık varsayılan olarak true ve ayrıca belirtmeye gerek yok

Düzeltme:
```javascript
// Eski
const nextConfig = {
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ["bcrypt", "@prisma/client"],
  },
  // ...
};

// Yeni (Düzeltilmiş)
const nextConfig = {
  serverExternalPackages: ["bcrypt", "@prisma/client", "prisma"],
  // ...
};
```

### 2. TypeScript Bağımlılıkları

TypeScript kullanımı için gerekli paketlerin yüklenmesi:

```bash
npm install --save-dev typescript @types/react @types/node @types/react-dom
```

Bu sorunu çözmek için `amplify.yml` dosyasına aşağıdaki adım eklenmiştir:

```yaml
preBuild:
  commands:
    - npm install --legacy-peer-deps
    - npm install --save-dev typescript @types/react @types/node @types/react-dom
    - npx prisma generate
```

### 3. Prisma Şema ve İstemci Oluşturma

Build sürecinde Prisma Client'ın düzgün şekilde oluşturulabilmesi için:

1. `prisma/schema.prisma` dosyasının projenin kök dizininde mevcut olduğundan emin olun
2. `amplify.yml` içinde preBuild aşamasında `npx prisma generate` komutunun çalıştırıldığından emin olun

### 4. Admin Giriş Sorunu

Admin paneline erişim için:

1. Veritabanında bir admin kullanıcısı oluşturmak için `prisma/seed.ts` dosyası eklenmiştir
2. Veritabanında admin kullanıcısı oluşturmak için aşağıdaki komutu çalıştırın:

```bash
npx prisma db seed
```

## AWS Amplify Ortam Değişkenleri

AWS Amplify konsolunda aşağıdaki ortam değişkenlerini ayarladığınızdan emin olun:

- `DATABASE_URL`: PostgreSQL veritabanı bağlantı URL'i
- `NEXTAUTH_SECRET`: Güvenli bir rastgele dize
- `NEXTAUTH_URL`: Uygulamanın tam URL'i (örn. https://main.xxx.amplifyapp.com)
- `API_BASE_URL`: API URL'i (genellikle NEXTAUTH_URL ile aynı)
- `MCP_SERVER_URL`: MCP sunucusunun URL'i

## Yeniden Dağıtma

Sorunu çözdükten sonra uygulamayı yeniden dağıtmak için:

1. Tüm değişiklikleri GitHub'a gönderin:
```bash
git add .
git commit -m "Next.js 15.2.3 uyumluluk ve TypeScript güncellmeleri"
git push
```

2. AWS Amplify konsolunda "Redeploy this version" seçeneğini tıklayın, veya otomatik dağıtım ayarlandıysa değişiklikler otomatik olarak dağıtılacaktır.