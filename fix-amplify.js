#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// ANSI renkli konsol çıktıları için
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

console.log(`${colors.cyan}=========================================${colors.reset}`);
console.log(`${colors.cyan}  AWS Amplify Dağıtım Sorun Giderici${colors.reset}`);
console.log(`${colors.cyan}=========================================${colors.reset}\n`);

// Çıktı dizinini kontrol et
function checkOutputDirectory() {
  console.log(`${colors.yellow}[1] Çıktı dizini kontrolü yapılıyor...${colors.reset}`);
  
  if (fs.existsSync('.next/standalone')) {
    console.log(`${colors.green}✓ .next/standalone dizini mevcut.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ .next/standalone dizini bulunamadı!${colors.reset}`);
    console.log(`${colors.yellow}  Düzeltme: next.config.js dosyasında 'output: "standalone"' ayarının olduğundan emin olun.${colors.reset}`);
  }
  
  // Statik dosyalar kontrolü
  if (fs.existsSync('.next/static')) {
    console.log(`${colors.green}✓ .next/static dizini mevcut.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ .next/static dizini bulunamadı!${colors.reset}`);
  }
  
  console.log('');
}

// Next.js yapılandırmasını kontrol et
function checkNextConfig() {
  console.log(`${colors.yellow}[2] Next.js yapılandırması kontrol ediliyor...${colors.reset}`);
  
  if (!fs.existsSync('next.config.js')) {
    console.log(`${colors.red}✗ next.config.js dosyası bulunamadı!${colors.reset}`);
    return;
  }
  
  const configContent = fs.readFileSync('next.config.js', 'utf8');
  
  // Output ayarı kontrolü
  if (configContent.includes('output: "standalone"')) {
    console.log(`${colors.green}✓ Output ayarı "standalone" olarak belirlenmiş.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Output ayarı "standalone" olarak belirtilmemiş!${colors.reset}`);
    console.log(`${colors.yellow}  Düzeltme: next.config.js dosyasına 'output: "standalone"' ayarını ekleyin.${colors.reset}`);
  }
  
  // Rewrite kuralları kontrolü
  if (configContent.includes('rewrites()') || configContent.includes('async rewrites')) {
    console.log(`${colors.green}✓ Rewrite kuralları tanımlanmış.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}! Rewrite kuralları bulunamadı. API isteklerini yönlendirmek için gerekli olabilir.${colors.reset}`);
  }
  
  // Headers kontrolü (CORS için)
  if (configContent.includes('headers()') || configContent.includes('async headers')) {
    console.log(`${colors.green}✓ Header tanımlamaları mevcut.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}! Header (CORS) tanımlamaları bulunamadı. API istekleri için gerekli olabilir.${colors.reset}`);
  }
  
  console.log('');
}

// Amplify yapılandırmasını kontrol et
function checkAmplifyConfig() {
  console.log(`${colors.yellow}[3] AWS Amplify yapılandırması kontrol ediliyor...${colors.reset}`);
  
  if (!fs.existsSync('amplify.yml')) {
    console.log(`${colors.red}✗ amplify.yml dosyası bulunamadı!${colors.reset}`);
    console.log(`${colors.yellow}  Düzeltme: Repomuza yeni bir amplify.yml dosyası eklenmiştir, kontrol edin.${colors.reset}`);
    return;
  }
  
  const configContent = fs.readFileSync('amplify.yml', 'utf8');
  
  // Prisma generate kontrolü
  if (configContent.includes('npx prisma generate')) {
    console.log(`${colors.green}✓ Prisma client generate komutu tanımlanmış.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Prisma client generate komutu bulunamadı!${colors.reset}`);
    console.log(`${colors.yellow}  Düzeltme: amplify.yml dosyasına preBuild aşamasına 'npx prisma generate' komutunu ekleyin.${colors.reset}`);
  }
  
  // baseDirectory kontrolü
  if (configContent.includes('baseDirectory: .next')) {
    console.log(`${colors.green}✓ Çıktı dizini .next olarak ayarlanmış.${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Çıktı dizini .next olarak ayarlanmamış!${colors.reset}`);
    console.log(`${colors.yellow}  Düzeltme: amplify.yml dosyasında baseDirectory ayarını kontrol edin.${colors.reset}`);
  }
  
  // Önbellek ayarları kontrolü
  if (configContent.includes('cache:') && configContent.includes('node_modules')) {
    console.log(`${colors.green}✓ Önbellek ayarları tanımlanmış.${colors.reset}`);
  } else {
    console.log(`${colors.yellow}! Önbellek ayarları eksik olabilir. Daha hızlı derleme için bu ayarları ekleyin.${colors.reset}`);
  }
  
  console.log('');
}

// Statik dosyaları kontrol et
function checkStaticFiles() {
  console.log(`${colors.yellow}[4] Statik dosyalar kontrolü yapılıyor...${colors.reset}`);
  
  if (fs.existsSync('public')) {
    console.log(`${colors.green}✓ public dizini mevcut.${colors.reset}`);
    
    // favicon kontrolü
    if (fs.existsSync('public/favicon.ico')) {
      console.log(`${colors.green}✓ favicon.ico dosyası mevcut.${colors.reset}`);
    } else {
      console.log(`${colors.yellow}! favicon.ico dosyası bulunamadı.${colors.reset}`);
    }
  } else {
    console.log(`${colors.yellow}! public dizini bulunamadı. Statik dosyalar için bu dizini oluşturun.${colors.reset}`);
  }
  
  console.log('');
}

// Çevresel değişkenleri kontrol et
function checkEnvironmentVariables() {
  console.log(`${colors.yellow}[5] Çevresel değişkenler kontrolü yapılıyor...${colors.reset}`);
  
  console.log(`${colors.magenta}ℹ AWS Amplify konsolunda aşağıdaki çevresel değişkenleri ayarlamanız gerekiyor:${colors.reset}`);
  console.log(`  - DATABASE_URL: Veritabanı bağlantı URL'i`);
  console.log(`  - NEXTAUTH_SECRET: NextAuth için güvenlik anahtarı`);
  console.log(`  - NEXTAUTH_URL: Uygulamanın tam URL'i (örn. https://main.xxx.amplifyapp.com)`);
  console.log(`  - API_BASE_URL: API URL'i (genellikle NEXTAUTH_URL ile aynı)`);
  console.log(`  - MCP_SERVER_URL: MCP sunucusunun URL'i`);
  
  console.log('');
}

// Ana çalıştırma
async function runChecks() {
  checkOutputDirectory();
  checkNextConfig();
  checkAmplifyConfig();
  checkStaticFiles();
  checkEnvironmentVariables();
  
  console.log(`${colors.cyan}=========================================${colors.reset}`);
  console.log(`${colors.cyan}  Kontroller tamamlandı${colors.reset}`);
  console.log(`${colors.cyan}=========================================${colors.reset}\n`);
  
  console.log(`${colors.magenta}Sonraki adımlar:${colors.reset}`);
  console.log(`1. Yukarıdaki sorunları düzeltin`);
  console.log(`2. Değişiklikleri GitHub'a gönderin: ${colors.green}git add . && git commit -m "Amplify düzeltmeleri" && git push${colors.reset}`);
  console.log(`3. AWS Amplify konsolunda çevresel değişkenlerin ayarlandığından emin olun`);
  console.log(`4. Yeniden dağıtım için: AWS Amplify konsolunda "Redeploy this version" düğmesine tıklayın\n`);
}

runChecks();