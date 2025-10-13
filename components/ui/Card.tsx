interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
      relative bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm
      ${
        hover
          ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          : ""
      }
      ${className}
    `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      <div className="relative p-6">{children}</div>
    </div>
  );
}
