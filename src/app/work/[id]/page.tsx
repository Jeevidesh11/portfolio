import Link from "next/link";
import { notFound } from "next/navigation";
import { profile } from "@/content/profile";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return profile.doors.map((door) => ({ id: door.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const door = profile.doors.find((entry) => entry.id === id);
  if (!door) return { title: "Work" };
  return {
    title: `${door.title} — Jeevidesh M`,
    description: door.kicker,
  };
}

export default async function WorkDoorPage({ params }: PageProps) {
  const { id } = await params;
  const door = profile.doors.find((entry) => entry.id === id);
  if (!door) notFound();

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-10 md:px-12">
        <div className="flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)]/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--foreground)]/20"
          >
            ← Back to the doors
          </Link>
          <span className="text-xs uppercase tracking-[0.14em] opacity-55">{door.plate}</span>
        </div>

        <div className="mt-24 max-w-2xl">
          <h1 className="text-5xl font-semibold tracking-tight md:text-7xl">{door.title}</h1>
          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
            {door.kicker}
          </p>
          <p className="mt-10 text-lg text-[var(--muted)]">
            This room is ready. We&apos;ll design the work for this door next.
          </p>
        </div>
      </div>
    </main>
  );
}
