interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  center = false,
  light = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2
        className={`section-heading text-2xl md:text-3xl ${
          light ? "text-white" : "text-foreground"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`mt-2 text-base ${
            light ? "text-gray-300" : "text-muted"
          }`}
        >
          {subtitle}
        </p>
      )}
      <div
        className={`mt-3 h-1 w-16 rounded bg-primary ${
          center ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
