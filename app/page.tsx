export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Müşteri Destek Sistemi</h1>
      <p className="text-xl mb-4">Hoş Geldiniz</p>
      <div className="mt-8">
        <a href="/auth/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Giriş Yap
        </a>
      </div>
    </div>
  );
}