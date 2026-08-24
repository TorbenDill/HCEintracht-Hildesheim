interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <section className="bg-dark text-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wide">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-lg text-gray-300 max-w-2xl">{subtitle}</p>
        )}
        <div className="mt-4 h-1 w-20 rounded bg-primary" />
      </div>
    </section>
  );
}
