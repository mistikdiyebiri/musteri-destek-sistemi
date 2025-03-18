# AWS Amplify Dağıtım Rehberi

Bu rehber, müşteri destek sistemini AWS Amplify üzerinde dağıtmak için gerekli adımları içerir.

## Ön Gereksinimler

- AWS hesabı
- AWS CLI kurulumu
- GitHub veya başka bir Git sağlayıcısında bulunan proje reposu

## Adım 1: AWS Amplify Konsolu'na Giriş

1. AWS Management Console'a giriş yapın
2. Amplify servisini seçin
3. "Yeni uygulama oluştur" butonuna tıklayın
4. "Git sağlayıcısından dağıt" seçeneğini işaretleyin

## Adım 2: GitHub Reposunu Bağlama

1. GitHub hesabınızı bağlayın
2. Müşteri destek sistemi reposunu seçin
3. Ana branch'i (genellikle `main` veya `master`) belirleyin

## Adım 3: Dağıtım Ayarları

1. Servisinize bir isim verin (örn. "musteri-destek-sistemi")
2. Repo'daki `amplify.yml` dosyasının otomatik olarak algılanmasını bekleyin
3. Aşağıdaki ortam değişkenlerini ayarlayın:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_MCP_SERVER_URL`
   - `MCP_TOKEN_SECRET` (güvenli bir değer oluşturun)

## Adım 4: Dağıtımı Başlatma

1. "Kaydet ve Dağıt" butonuna tıklayın
2. Dağıtım sürecinin tamamlanmasını bekleyin (5-10 dakika sürebilir)

## Adım 5: Alan Adı Yapılandırması

1. Amplify konsolundaki "Alan Adı Yönetimi" sekmesine gidin
2. Özel alan adınızı ekleyin
3. Alan adı doğrulama adımlarını tamamlayın

## Sorun Giderme

- Dağıtım hatası durumunda build loglarını kontrol edin
- 404 hataları için Next.js Router yapılandırmasını kontrol edin
- Statik dosya erişim sorunları için Amplify build ayarlarını kontrol edin

## İleri Seviye Yapılandırmalar

- Lambda entegrasyonu için "Sunucusuz Fonksiyonlar" bölümünü kullanabilirsiniz
- Veri depolama için DynamoDB entegrasyonu ekleyebilirsiniz
- Kullanıcı kimlik doğrulama için Amazon Cognito entegrasyonu yapabilirsiniz

Amplify konsolunda, uygulamanızın dağıtım durumunu, etki alanı ayarlarını ve diğer yapılandırmaları izleyebilirsiniz.