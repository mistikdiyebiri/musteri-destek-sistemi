"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  KeyIcon, 
  CheckIcon, 
  ExclamationCircleIcon, 
  ArrowPathIcon, 
  EyeIcon, 
  EyeSlashIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ComputerDesktopIcon,
  ClipboardDocumentIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { 
  getMCPSettings, 
  saveMCPSettings, 
  testMCPConnection, 
  generateMCPToken,
  sendMessageToCursor,
  MCPSettingsType, 
  defaultMCPSettings
} from '@/lib/mcp';
import Link from 'next/link';

// Cursor AI mesaj tipini tanımlayalım
interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

// Environment değişkenleri özellikle Amplify için doğrulama
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const MCP_SERVER_URL = process.env.NEXT_PUBLIC_MCP_SERVER_URL || '';

export default function MCPSettingsPage() {
  const [mcpSettings, setMCPSettings] = useState<MCPSettingsType>(defaultMCPSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(`${API_BASE_URL}/api/mcp`);
  
  // Cursor AI için ekstra state'ler
  const [activeTab, setActiveTab] = useState('mcp-settings'); // 'mcp-settings' veya 'cursor-ai'
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde mevcut ayarları yükle
  useEffect(() => {
    try {
      const settings = getMCPSettings();
      setMCPSettings(settings);
      
      // API endpoint'i güncelle
      if (API_BASE_URL) {
        setApiEndpoint(`${API_BASE_URL}/api/mcp`);
      }
      
      // Cursor AI hoşgeldin mesajı
      setMessages([
        {
          id: '1',
          sender: 'ai',
          content: 'Merhaba! Ben Cursor AI yardımcısıyım. Kodunuzla ilgili herhangi bir sorunuz varsa veya yardıma ihtiyacınız olursa sorabilirsiniz.',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Ayarlar yüklenirken hata:", error);
      // Varsayılan ayarları kullan
      setMCPSettings(defaultMCPSettings);
    }
  }, []);
  
  // Mesajlar güncellendiğinde otomatik olarak aşağı kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Aşağı kaydırma fonksiyonu
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Token oluşturma işlemi
  const handleGenerateToken = () => {
    try {
      setIsGeneratingToken(true);
      
      const newToken = generateMCPToken();
      setMCPSettings({
        ...mcpSettings,
        token: newToken,
        testStatus: null,
        lastTested: null
      });
      
      setTimeout(() => {
        setIsGeneratingToken(false);
      }, 500);
    } catch (error) {
      console.error("Token oluşturma hatası:", error);
      setIsGeneratingToken(false);
    }
  };
  
  // Token'ı panoya kopyalama
  const copyTokenToClipboard = () => {
    if (!mcpSettings.token) return;
    
    try {
      navigator.clipboard.writeText(mcpSettings.token)
        .then(() => {
          setTokenCopied(true);
          setTimeout(() => setTokenCopied(false), 2000);
        })
        .catch(err => {
          console.error('Panoya kopyalama hatası:', err);
          // Alternatif kopyalama yöntemi
          const textArea = document.createElement('textarea');
          textArea.value = mcpSettings.token;
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            document.execCommand('copy');
            setTokenCopied(true);
            setTimeout(() => setTokenCopied(false), 2000);
          } catch (e) {
            console.error('Alternatif kopyalama başarısız:', e);
          }
          
          document.body.removeChild(textArea);
        });
    } catch (error) {
      console.error('Kopyalama işlemi başarısız:', error);
    }
  };

  // MCP bağlantısını test etme fonksiyonu
  const testConnection = async () => {
    setIsTesting(true);
    setTestMessage('');
    
    try {
      // API endpoint kontrol et
      if (!apiEndpoint) {
        throw new Error("API endpoint belirtilmemiş. Lütfen API URL ayarlarını kontrol edin.");
      }
      
      // API endpoint'i üzerinden token doğrulama
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: mcpSettings.token })
      });
      
      if (!response.ok) {
        throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      const updatedSettings: MCPSettingsType = {
        ...mcpSettings,
        testStatus: result.success ? 'success' : 'error',
        lastTested: new Date().toISOString()
      };
      
      setMCPSettings(updatedSettings);
      setTestMessage(result.message);
      
      // Başarılı test sonrası ayarları hemen kaydet
      if (result.success) {
        saveMCPSettings(updatedSettings);
      }
    } catch (error) {
      setMCPSettings({
        ...mcpSettings,
        testStatus: 'error',
        lastTested: new Date().toISOString()
      });
      
      setTestMessage(`Hata: ${(error as Error).message || 'Bilinmeyen bir hata oluştu'}`);
    } finally {
      setIsTesting(false);
    }
  };

  // Ayarları kaydetme fonksiyonu
  const saveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Ayarları kaydet
      saveMCPSettings(mcpSettings);
      
      // Başarı bildirimi
      showNotification('success', 'MCP ayarları başarıyla kaydedildi.');
    } catch (err) {
      const error = err as Error;
      
      // Hata bildirimi
      showNotification('error', `Ayarlar kaydedilirken hata oluştu: ${error.message || 'Bilinmeyen bir hata'}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Bildirim gösterme yardımcı fonksiyonu
  const showNotification = (type: 'success' | 'error', message: string) => {
    const notificationElement = document.createElement('div');
    notificationElement.className = `fixed top-4 right-4 ${
      type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'
    } p-4 rounded shadow-md z-50`;
    notificationElement.style.transition = 'all 0.5s ease';
    
    const iconName = type === 'success' 
      ? '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />'
      : '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />';
    
    notificationElement.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 ${type === 'success' ? 'text-green-500' : 'text-red-500'}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            ${iconName}
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium">${message}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notificationElement);
    
    // Belirli süre sonra bildirimi kaldır
    setTimeout(() => {
      notificationElement.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notificationElement);
      }, 500);
    }, type === 'success' ? 3000 : 5000);
  };

  // Token göster/gizle
  const toggleTokenVisibility = () => {
    setShowToken(!showToken);
  };
  
  // Kurulum talimatlarını göster/gizle
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  // NPX komutu oluştur
  const getCursorCommand = () => {
    if (!mcpSettings.token) return '';
    
    // Sunucu URL'sini belirle: önce ayarlardaki, sonra env'deki, en son varsayılan
    const serverUrl = mcpSettings.serverUrl || MCP_SERVER_URL || 'http://localhost';
    
    return `npx -y @smithery/cli@latest run @musteridesteksistemi/cursor --config "{\\"accessToken\\":\\"${mcpSettings.token}\\",\\"serverUrl\\":\\"${serverUrl}\\"}"`;
  };
  
  // Cursor AI mesaj gönderme fonksiyonu
  const handleSendMessage = async () => {
    if (!input.trim() || isSending) return;
    
    // Kullanıcı mesajını ekle
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsSending(true);
    
    try {
      // Cursor'a mesaj gönder
      const context = currentFilePath ? { filePath: currentFilePath } : undefined;
      
      // API endpoint kontrol et
      if (!apiEndpoint) {
        throw new Error("API endpoint belirtilmemiş. Lütfen API URL ayarlarını kontrol edin.");
      }
      
      // PUT isteği gönder
      const response = await fetch(`${apiEndpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: mcpSettings.token,
          message: input, 
          context 
        })
      });
      
      if (!response.ok) {
        throw new Error(`API yanıt hatası: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.response) {
        // AI yanıtını ekle
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: result.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Hata mesajı ekle
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          content: `Üzgünüm, bir hata oluştu: ${result.error || 'Bilinmeyen bir hata'}. Lütfen MCP ayarlarınızı kontrol edin.`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      // Hata mesajı ekle
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: `Üzgünüm, bir hata oluştu: ${(error as Error).message || 'Bilinmeyen bir hata'}. Lütfen MCP ayarlarınızı kontrol edin.`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };
  
  // Enter tuşuna basıldığında mesaj gönder
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="px-4 py-5 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            MCP & Cursor AI
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Model Kontrol Protokolü (MCP) ve Cursor AI Asistanı ayarlarını yönetin.
          </p>
        </div>
      </div>
      
      {/* Sekmeler */}
      <div className="mt-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('mcp-settings')}
            className={`${
              activeTab === 'mcp-settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm`}
          >
            MCP Ayarları
          </button>
          <button
            onClick={() => setActiveTab('cursor-ai')}
            className={`${
              activeTab === 'cursor-ai'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <SparklesIcon className="w-4 h-4 mr-1" />
            Cursor AI Asistanı
          </button>
        </nav>
      </div>
      
      {/* MCP Ayarları Sekmesi */}
      {activeTab === 'mcp-settings' && (
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Cursor IDE Entegrasyonu</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Projenizi Cursor IDE ile entegre ederek AI asistanına erişin ve kod desteği alın.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* MCP Kurulum Bilgileri */}
              <div className="sm:col-span-6">
                <button
                  type="button"
                  onClick={toggleInstructions}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {showInstructions ? 'Kurulum Talimatlarını Gizle' : 'Kurulum Talimatlarını Göster'}
                </button>
                
                {showInstructions && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <h3 className="text-md font-medium text-blue-800">MCP Kurulum Talimatları</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p className="mb-2">MCP (Model Control Protocol), Cursor IDE ile projenizi entegre etmek için kullanılır. Bu entegrasyon sayesinde Cursor üzerinden AI asistanına erişebilir ve kod desteği alabilirsiniz.</p>
                      
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>
                          <strong>Cursor IDE'yi Kurun:</strong> <a href="https://cursor.sh" target="_blank" rel="noopener noreferrer" className="underline">cursor.sh</a> adresinden Cursor IDE'yi indirin ve kurun.
                        </li>
                        <li>
                          <strong>Sistemden Token Oluşturun:</strong> Aşağıdaki "Token Oluştur" butonuna tıklayarak bir MCP token'ı oluşturun.
                        </li>
                        <li>
                          <strong>Cursor IDE'yi Açın:</strong> Cursor IDE'yi başlatın ve MCP ayarları bölümüne gidin.
                        </li>
                        <li>
                          <strong>Token'ı Cursor'a Girin:</strong> Oluşturduğunuz token'ı Cursor MCP ayarları bölümüne girin veya aşağıdaki komutu terminal üzerinden çalıştırın.
                        </li>
                        <li>
                          <strong>Bağlantıyı Test Edin:</strong> Token oluşturduktan sonra "Bağlantıyı Test Et" butonuna tıklayarak token'ın geçerli olduğunu doğrulayın.
                        </li>
                      </ol>
                      
                      <div className="mt-4">
                        <p className="font-medium">Not:</p>
                        <p>Bu kurulum sayesinde, Cursor IDE'nizden doğrudan müşteri destek sisteminize erişebilecek ve sorularınızı yanıtlayabileceksiniz.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Token Ayarları */}
              <div className="sm:col-span-6">
                <label htmlFor="mcp-token" className="block text-sm font-medium text-gray-700">
                  MCP Token
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow">
                    <input
                      type={showToken ? "text" : "password"}
                      name="mcp-token"
                      id="mcp-token"
                      value={mcpSettings.token}
                      onChange={(e) => setMCPSettings({...mcpSettings, token: e.target.value})}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-l-md sm:text-sm border-gray-300"
                      placeholder="mds_xxxxxxxxxxxx"
                    />
                    <button
                      type="button"
                      onClick={toggleTokenVisibility}
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
                    >
                      {showToken ? (
                        <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <EyeIcon className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateToken}
                    disabled={isGeneratingToken}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {isGeneratingToken ? (
                      <ArrowPathIcon className="animate-spin h-5 w-5 mr-1" />
                    ) : (
                      <KeyIcon className="h-5 w-5 mr-1" />
                    )}
                    Token Oluştur
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  MCP token, Cursor IDE'den sistemimize güvenli bir şekilde bağlanmanızı sağlar.
                </p>
              </div>
              
              {/* API Endpoint Seçeneği */}
              <div className="sm:col-span-6">
                <label htmlFor="api-endpoint" className="block text-sm font-medium text-gray-700">
                  API Endpoint
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    name="api-endpoint"
                    id="api-endpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full rounded-md sm:text-sm border-gray-300"
                    placeholder="https://example.com/api/mcp"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  MCP API endpoint adresi. Varsayılan değer: /api/mcp
                </p>
              </div>
              
              {/* Token Kopyalama */}
              <div className="sm:col-span-6">
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={testConnection}
                    disabled={isTesting || !mcpSettings.token}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isTesting ? (
                      <>
                        <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                        Test Ediliyor...
                      </>
                    ) : (
                      <>
                        {mcpSettings.testStatus === 'success' ? (
                          <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                        ) : (
                          <ExclamationCircleIcon className="-ml-1 mr-2 h-5 w-5" />
                        )}
                        Bağlantıyı Test Et
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={copyTokenToClipboard}
                    disabled={!mcpSettings.token}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {tokenCopied ? (
                      <>
                        <CheckIcon className="-ml-1 mr-2 h-5 w-5 text-green-500" />
                        Kopyalandı!
                      </>
                    ) : (
                      <>
                        <ClipboardDocumentIcon className="-ml-1 mr-2 h-5 w-5" />
                        Token'ı Kopyala
                      </>
                    )}
                  </button>
                </div>
                
                {testMessage && (
                  <div 
                    className={`mt-3 p-3 rounded-md ${
                      mcpSettings.testStatus === 'success' 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {testMessage}
                  </div>
                )}
              </div>
              
              {/* Terminal Komutu */}
              {mcpSettings.token && (
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terminal Komutu
                  </label>
                  <div className="bg-gray-50 rounded-md p-3 font-mono text-sm text-gray-800 overflow-x-auto border border-gray-200">
                    {getCursorCommand()}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Bu komutu Cursor'u yüklediğiniz sistemde çalıştırabilirsiniz.
                  </p>
                </div>
              )}
              
              {/* Ayarları Kaydet Butonu */}
              <div className="sm:col-span-6 flex justify-end">
                <button
                  type="button"
                  onClick={saveSettings}
                  disabled={isSaving}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
                      Ayarları Kaydet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cursor AI Asistanı Sekmesi */}
      {activeTab === 'cursor-ai' && (
        <div className="mt-6">
          <div className="bg-white shadow-sm rounded-lg flex flex-col h-[70vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h1 className="text-lg font-medium text-gray-900">Cursor AI Yardımcısı</h1>
              </div>
            </div>
            
            {/* Dosya Yolu Girişi */}
            <div className="p-3 bg-gray-50 border-b">
              <div className="flex items-start flex-wrap gap-2">
                <div className="flex-grow">
                  <label htmlFor="filePath" className="block text-xs font-medium text-gray-700 mb-1">
                    Sorgunuzla İlgili Dosya Yolu (İsteğe bağlı)
                  </label>
                  <input
                    type="text"
                    id="filePath"
                    className="block w-full border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="örn: /src/app/dashboard/page.tsx"
                    value={currentFilePath}
                    onChange={(e) => setCurrentFilePath(e.target.value)}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Belirli bir dosya hakkında soru soruyorsanız, daha doğru yanıtlar almak için yolunu belirtin
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mesaj Alanı */}
            <div className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="text-xs mb-1">
                        {message.sender === 'user' ? 'Siz' : 'Cursor AI'} - {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}
                
                {isSending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                      <div className="flex items-center space-x-2">
                        <ArrowPathIcon className="h-4 w-4 animate-spin text-blue-500" />
                        <span>Cursor AI yanıt hazırlıyor...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Mesaj Girişi */}
            <div className="border-t p-4">
              <div className="flex items-end">
                <div className="flex-grow">
                  <textarea
                    rows={3}
                    placeholder="Cursor AI'ya bir soru sorun veya yardım isteyin..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none text-sm"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Projenizdeki kodla ilgili sorular sorun, kod analizi isteyin veya geliştirme önerileri alın.
                    <br />
                    Enter tuşu ile gönderebilirsiniz.
                  </p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isSending}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <PaperAirplaneIcon className="h-5 w-5 mr-1" /> Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}