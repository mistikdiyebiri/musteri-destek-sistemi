# Müşteri Destek Sistemi

Modern bir müşteri destek ve bilet yönetim sistemi. Next.js, Tailwind CSS ve Prisma ile oluşturulmuştur.

## Özellikler

- Kullanıcı ve yönetici panelleri
- Bilet oluşturma ve takip sistemi
- Durum güncellemeleri ve bildirimler
- Canlı mesajlaşma özellikleri
- Model Control Protocol (MCP) entegrasyonu
- Cursor ile AI asistan desteği

## Kurulum ve Çalıştırma

### Gereksinimler

- Node.js 18.x veya üstü
- PostgreSQL veritabanı
- npm veya yarn

### Yerel Geliştirme

1. Repoyu klonlayın:
   ```bash
   git clone https://github.com/mistikdiyebiri/musteri-destek-sistemi.git
   cd musteri-destek-sistemi
   ```

2. Bağımlılıkları yükleyin:
   ```bash
   npm install --legacy-peer-deps
   ```

3. `.env` dosyasını oluşturun:
   ```bash
   cp .env.example .env
   ```
   
4. `.env` dosyasını düzenleyin ve gerekli ortam değişkenlerini ayarlayın.

5. Prisma client'ı oluşturun:
   ```bash
   npx prisma generate
   ```

6. Veritabanı şemasını senkronize edin:
   ```bash
   npx prisma db push
   ```

7. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

## AWS Amplify Dağıtımı

AWS Amplify'da uygulamayı dağıtmak için aşağıdaki adımları izleyin:

### 1. Amplify Konsolu Ayarları

1. [AWS Amplify Konsolu](https://console.aws.amazon.com/amplify/home)'na giriş yapın.
2. "Yeni uygulama oluştur" > "Git sağlayıcısı ile başla" seçin.
3. GitHub hesabınızı bağlayın ve bu repoyu seçin.
4. Ana dalı (main) seçin ve "İleri" düğmesine tıklayın.

### 2. Çevre Değişkenlerini Ayarlama

Amplify konsolunda aşağıdaki çevre değişkenlerini tanımlayın:

- `DATABASE_URL`: PostgreSQL veritabanı bağlantı URL'i
- `NEXTAUTH_SECRET`: NextAuth güvenlik anahtarı (rastgele güvenli bir dize)
- `NEXTAUTH_URL`: Uygulamanın tam URL'i (örn. https://main.xxx.amplifyapp.com)
- `API_BASE_URL`: API URL'i (genellikle NEXTAUTH_URL ile aynı)
- `MCP_SERVER_URL`: MCP sunucusunun URL'i

### 3. Yapılandırma Dosyaları

Reponun kök dizininde aşağıdaki dosyaların varlığını kontrol edin:

- `amplify.yml`: Amplify derleme ayarları
- `next.config.js`: Next.js yapılandırması (CORS, SSR ve routing ayarları)

### 4. Sorun Giderme

Dağıtımda sorunlarla karşılaşırsanız:

1. `fix-amplify.js` betiğini çalıştırın:
   ```bash
   node fix-amplify.js
   ```

2. Çıktıya göre gerekli düzeltmeleri yapın.

3. Değişiklikleri GitHub'a gönderin:
   ```bash
   git add .
   git commit -m "Amplify düzeltmeleri"
   git push
   ```

4. AWS Amplify konsolunda yeniden dağıtım başlatın.

## Geliştirme Notları

### Proje Yapısı

- `/src/app`: Next.js uygulama yönlendiricisi ve sayfa bileşenleri
- `/src/components`: Yeniden kullanılabilir UI bileşenleri
- `/src/lib`: Yardımcı işlevler ve kitaplıklar
- `/prisma`: Veritabanı şemaları ve yapılandırması

### API Rotaları

- `/api/auth/*`: NextAuth.js kimlik doğrulama endpoint'leri
- `/api/tickets`: Bilet yönetimi endpoint'leri
- `/api/mcp`: MCP entegrasyonu endpoint'leri

## Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.