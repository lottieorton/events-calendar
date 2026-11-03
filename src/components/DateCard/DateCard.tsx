export type DateCardVariant = "selected" | "current" | "adjacent";

const variantClasses: Record<DateCardVariant, string> = {
  selected: "bg-bright-pink md:border md:border-secondary",
  current: "text-d-purple md:bg-stone-50",
  adjacent: "text-pale-purple/90 md:bg-pale-purple/5",
};

interface DateCardProps {
  variant?: DateCardVariant;
  date: Date;
  handleClick: () => void;
}

export default function DateCard({
  variant = "current",
  date,
  handleClick,
}: DateCardProps) {
  const selectedNum = "bg-secondary text-white";

  return (
    <button
      onClick={() => handleClick()}
      className={`font-main flex items-start md:border md:border-border p-2 text-sm text-center ${variantClasses[variant]} rounded-xl cursor-pointer hover:bg-bright-pink md:rounded-none md:w-full md:aspect-square md:text-left lg:aspect-card 3xl:text-xl`}
    >
      <p
        className={`flex items-center justify-center rounded-full w-7 h-7 3xl:w-9 3xl:h-9 ${variant === "selected" ? selectedNum : ""}`}
      >
        {date.getDate()}
      </p>
    </button>
  );
}
