export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <h1 className="text-center text-3xl font-bold">Bienvenue sur l'application !</h1>
      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"><a href="/dashboard">Login</a></button>
    </div>
  );
}