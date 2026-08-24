import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-black text-primary">404</h1>
      <p className="mt-4 text-xl font-bold">Seite nicht gefunden</p>
      <p className="mt-2 text-muted max-w-md">
        Die angeforderte Seite existiert leider nicht. Vielleicht findest du
        über die Navigation, was du suchst.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Zur Startseite
      </Link>
    </section>
  );
}
