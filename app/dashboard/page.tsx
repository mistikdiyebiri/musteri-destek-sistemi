export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Toplam Destek Talepleri</h2>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Açık Talepler</h2>
          <p className="text-3xl font-bold text-yellow-500">8</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Çözülen Talepler</h2>
          <p className="text-3xl font-bold text-green-500">16</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Ortalama Çözüm Süresi</h2>
          <p className="text-3xl font-bold text-purple-600">4.2s</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Son Aktiviteler</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium">Yeni destek talebi açıldı</p>
              <p className="text-sm text-gray-500">12 dakika önce</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium">Destek talebi çözüldü</p>
              <p className="text-sm text-gray-500">45 dakika önce</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-medium">Departman değişikliği</p>
              <p className="text-sm text-gray-500">2 saat önce</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Hızlı Erişim</h2>
          <div className="grid grid-cols-2 gap-4">
            <a href="/dashboard/tickets" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center">
              <p className="font-medium">Talepler</p>
            </a>
            <a href="/dashboard/departments" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center">
              <p className="font-medium">Departmanlar</p>
            </a>
            <a href="/dashboard/staff" className="bg-yellow-50 hover:bg-yellow-100 p-4 rounded-lg text-center">
              <p className="font-medium">Personel</p>
            </a>
            <a href="/dashboard/settings/mcp" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center">
              <p className="font-medium">MCP Ayarları</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}