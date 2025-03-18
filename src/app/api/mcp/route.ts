import { NextRequest, NextResponse } from 'next/server';
import { getMCPSettings, isValidToken } from '@/lib/mcp';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// OPTIONS isteği için CORS desteği
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Token doğrulama endpoint'i
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    // Token doğrulama
    if (!token || !isValidToken(token)) {
      return NextResponse.json({ 
        success: false, 
        message: "Geçersiz token formatı. Token 'mds_' ile başlamalı ve en az 10 karakter içermelidir."
      }, { status: 400, headers: corsHeaders });
    }
    
    // Başarılı doğrulama
    return NextResponse.json({ 
      success: true, 
      message: "MCP token'ı geçerli. Bu token'ı Cursor MCP ayarları bölümüne girebilirsiniz."
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ 
      success: false, 
      message: `İşlem hatası: ${(error as Error).message}`
    }, { status: 500, headers: corsHeaders });
  }
}

// SSE bağlantısı için GET endpoint'i
export async function GET(request: NextRequest) {
  try {
    const settings = getMCPSettings();
    
    // Token kontrolü
    if (!settings.token || !isValidToken(settings.token)) {
      return new NextResponse('MCP token geçersiz', { 
        status: 401, 
        headers: {
          ...corsHeaders,
          'Content-Type': 'text/plain'
        } 
      });
    }
    
    // SSE bağlantısı başlat
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    
    // SSE başlangıç mesajı
    const encoder = new TextEncoder();
    writer.write(encoder.encode('event: connected\ndata: {"success":true}\n\n'));
    
    // Yanıtı döndür
    return new NextResponse(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("SSE Bağlantı Hatası:", error);
    return NextResponse.json({ 
      success: false, 
      message: `SSE bağlantı hatası: ${(error as Error).message}`
    }, { status: 500, headers: corsHeaders });
  }
}

// MCP mesajı almak için endpoint
export async function PUT(request: NextRequest) {
  try {
    const { message, context, token } = await request.json();
    
    // Token kontrolü - mesaj içinden veya MCP ayarlarından al
    let validToken = token;
    
    // Eğer token verilmediyse ayarlardan al
    if (!validToken) {
      const settings = getMCPSettings();
      validToken = settings.token;
    }
    
    // Token hala geçerli değilse hata döndür
    if (!isValidToken(validToken)) {
      return NextResponse.json({ 
        success: false, 
        message: "MCP token geçersiz"
      }, { status: 401, headers: corsHeaders });
    }
    
    // Burada MCP sunucusuna mesaj iletimi yapılır
    // Şimdilik basit bir yanıt döndürelim
    let response = `Mesajınız alındı: "${message}". MCP sunucusu yanıt hazırlıyor...`;
    
    // Mesajın içeriğine göre basit yanıtlar
    if (message.toLowerCase().includes("yardım") || message.toLowerCase().includes("help")) {
      response = "Size nasıl yardımcı olabilirim? Kod yazma, hata ayıklama veya proje yapılandırması konularında sorularınızı yanıtlayabilirim.";
    } 
    else if (message.toLowerCase().includes("merhaba") || message.toLowerCase().includes("selam")) {
      response = "Merhaba! Ben Cursor AI yardımcınız. Size nasıl yardımcı olabilirim?";
    }
    else if (message.toLowerCase().includes("next.js") || message.toLowerCase().includes("nextjs")) {
      response = "Next.js, React tabanlı bir web uygulama framework'üdür. Server-side rendering, statik site generation gibi özellikleri vardır. Projemizde Next.js 15 kullanıyoruz. Belirli bir konuda yardıma ihtiyacınız var mı?";
    }
    else if (message.toLowerCase().includes("token") || message.toLowerCase().includes("mcp")) {
      response = "MCP token'ı sistem tarafından otomatik olarak oluşturuldu ve yapılandırıldı. Artık Cursor AI asistanını sorunsuz bir şekilde kullanabilirsiniz!";
    }
    else if (message.toLowerCase().includes("amplify") || message.toLowerCase().includes("aws")) {
      response = "AWS Amplify, projenizi kolayca bulut ortamına dağıtmanızı sağlayan bir hizmettir. Next.js uygulamanızı Amplify ile dağıtabilirsiniz. Sistemimiz Amplify uyumlu hale getirildi ve sorunsuz dağıtım için gerekli yapılandırmalar yapıldı.";
    }
    
    // Eğer bağlamda dosya yolu belirtilmişse, ona göre yanıt oluştur
    if (context?.filePath) {
      response += `\n\nBelirttiğiniz '${context.filePath}' dosyası hakkında sorgunuzu aldım. Bu dosya hakkında daha spesifik bir bilgiye ihtiyacınız var mı?`;
    }
    
    return NextResponse.json({
      success: true,
      response
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("API Hatası:", error);
    return NextResponse.json({ 
      success: false, 
      message: `İşlem hatası: ${(error as Error).message}`
    }, { status: 500, headers: corsHeaders });
  }
}