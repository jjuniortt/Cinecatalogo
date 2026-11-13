import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar — CineCatálogo",
};

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const sp = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-md">
        <AuthForm next={sp?.next ?? "/"} />
      </div>
    </main>
  );
}
