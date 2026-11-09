import AuthForm from "@/components/AuthForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar — CineCatálogo",
};

export default function EntrarPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pb-16 pt-32">
      <div className="w-full max-w-md">
        <AuthForm next={searchParams?.next ?? "/"} />
      </div>
    </main>
  );
}
