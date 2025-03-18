export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-800 text-white p-4">
        <div className="text-xl font-bold mb-8">Müşteri Destek</div>
        
        <nav className="space-y-2">
          <a href="/dashboard" className="block px-4 py-2 rounded hover:bg-blue-700">
            Dashboard
          </a>
          <a href="/dashboard/tickets" className="block px-4 py-2 rounded hover:bg-blue-700">
            Talepler
          </a>
          <a href="/dashboard/departments" className="block px-4 py-2 rounded hover:bg-blue-700">
            Departmanlar
          </a>
          <a href="/dashboard/staff" className="block px-4 py-2 rounded hover:bg-blue-700">
            Personel
          </a>
          <a href="/dashboard/statistics" className="block px-4 py-2 rounded hover:bg-blue-700">
            İstatistikler
          </a>
          <a href="/dashboard/roles" className="block px-4 py-2 rounded hover:bg-blue-700">
            Roller
          </a>
          <a href="/dashboard/permissions" className="block px-4 py-2 rounded hover:bg-blue-700">
            İzinler
          </a>
          <a href="/dashboard/cursor" className="block px-4 py-2 rounded hover:bg-blue-700">
            Cursor AI
          </a>
          
          <div className="pt-4 mt-4 border-t border-blue-700">
            <a href="/dashboard/settings/mcp" className="block px-4 py-2 rounded hover:bg-blue-700">
              MCP Ayarları
            </a>
            <a href="/dashboard/settings/api" className="block px-4 py-2 rounded hover:bg-blue-700">
              API Ayarları
            </a>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Navigation */}
        <div className="bg-white p-4 shadow-md flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Yönetim Paneli</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <span className="mr-2">Admin</span>
              <img className="h-8 w-8 rounded-full" src="https://ui-avatars.com/api/?name=Admin&color=7F9CF5&background=EBF4FF" alt="User Avatar" />
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}