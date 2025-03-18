// AWS Amplify dağıtım sorunlarını çözmek için yardımcı script
// Sayfalar bomboş görünüyorsa veya bileşenler yüklenmiyorsa kullanın

// Bu scripti aşağıdaki komutu çalıştırarak kullanın:
// node fix-amplify.js

const fs = require('fs');
const path = require('path');

console.log('AWS Amplify dağıtım sorunlarını çözme aracı başlatılıyor...');

// 1. .next/standalone klasörünün varlığını kontrol et
const standalonePath = path.join(process.cwd(), '.next', 'standalone');
if (fs.existsSync(standalonePath)) {
  console.log('.next/standalone klasörü bulundu. Next.js yapılandırmanız Amplify ile uyumlu.');
} else {
  console.log('DİKKAT: .next/standalone klasörü bulunamadı!');
  console.log('Bu, next.config.js dosyanızda output: "standalone" ayarının eksik olduğunu gösterir.');
  
  // next.config.js dosyasını kontrol et ve düzelt
  const configPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(configPath)) {
    let config = fs.readFileSync(configPath, 'utf8');
    
    // Standalone output ayarını ekle
    if (!config.includes('output:')) {
      config = config.replace(
        'module.exports = {',
        'module.exports = {\n  output: "standalone",');
      
      fs.writeFileSync(configPath, config);
      console.log('next.config.js dosyası güncellendi ve output: "standalone" ayarı eklendi.');
    }
  }
}

// 2. amplify.yml dosyasını kontrol et
const amplifyYmlPath = path.join(process.cwd(), 'amplify.yml');
if (fs.existsSync(amplifyYmlPath)) {
  let amplifyYml = fs.readFileSync(amplifyYmlPath, 'utf8');
  
  // baseDirectory ayarını kontrol et
  if (!amplifyYml.includes('baseDirectory: .next')) {
    console.log('amplify.yml dosyasında baseDirectory ayarını kontrol edin.');
    console.log('Doğru değer: baseDirectory: .next');
  } else {
    console.log('amplify.yml dosyası doğru yapılandırılmış.');
  }
}

// 3. Statik dosyaları kontrol et
const publicPath = path.join(process.cwd(), 'public');
if (fs.existsSync(publicPath)) {
  console.log('public klasörü bulundu.');
  
  // robots.txt yoksa oluştur
  const robotsPath = path.join(publicPath, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    fs.writeFileSync(robotsPath, 'User-agent: *\nAllow: /');
    console.log('robots.txt dosyası oluşturuldu.');
  }
} else {
  console.log('public klasörü bulunamadı! Static dosyaları servis etmek için bir public klasörü oluşturun.');
  fs.mkdirSync(publicPath);
  console.log('public klasörü oluşturuldu.');
}

console.log('\nTEST TAMAMLANDI. Bu düzeltmeleri uyguladıktan sonra projenizi yeniden derleyip Amplify\'a dağıtın.');
console.log('Ayrıca, AWS Amplify konsolundan çevresel değişkenleri ayarlamayı unutmayın.');