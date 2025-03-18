export default function MCPSettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">MCP Ayarları</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Cursor IDE Entegrasyonu</h2>
          <p className="text-gray-600 mb-4">
            MCP (Model Context Protocol) ile Cursor IDE'yi entegre ederek müşteri destek ekibiniz için AI destekli kod geliştirme araçlarını kullanabilirsiniz.
          </p>
          
          <div className="mb-4">
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              <span>Kurulum Talimatlarını Göster</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Cursor IDE'yi indirin ve yükleyin: <a href="https://cursor.sh" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://cursor.sh</a></li>
                <li>Cursor IDE'de, Sol taraftaki Ayarlar (Dişli) simgesine tıklayın</li>
                <li>MCP sekmesini seçin</li>
                <li>Aşağıda oluşturduğunuz MCP tokenini ve sunucu URL'sini girin</li>
                <li>Bağlantıyı test edin ve kaydedin</li>
              </ol>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">MCP Token</h2>
          <p className="text-gray-600 mb-4">
            MCP ile iletişim için bir token oluşturun ve yönetin.
          </p>
          
          <div className="flex items-center mt-4 space-x-2">
            <input
              type="text"
              placeholder="MCP Token"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              readOnly
            />
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
              Yeni Token Oluştur
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Bağlantıyı Test Et
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Terminal Komutu</h2>
          <p className="text-gray-600 mb-4">
            MCP sunucusunu başlatmak için aşağıdaki komutu sistemde çalıştırın.
          </p>
          
          <div className="bg-gray-800 text-white p-3 rounded-md font-mono text-sm overflow-x-auto">
            npm run mcp-server
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md">
            Ayarları Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}