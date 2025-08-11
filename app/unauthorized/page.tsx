import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Unauthorized</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <Link href="/" className="text-blue-600 hover:underline">Go Home</Link>
    </main>
  );
}
