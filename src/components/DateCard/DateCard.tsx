interface DateCardProps {
  date: Date;
  isSelected: boolean;
  handleClick: () => void;
  isCurrentMonth: boolean;
}

export default function DayCard({
  date,
  isSelected,
  handleClick,
  isCurrentMonth,
}: DateCardProps) {
  const isSelectedStyle = "bg-bright-pink md:border md:border-secondary";
  const isCurrentMonthStyle = `text-d-purple ${!isSelected && "md:bg-stone-50"}`;
  const notCurrentMonth = "text-pale-purple/90 md:bg-pale-purple/5";
  const selectedNum = "bg-secondary text-white";

  return (
    <button
      onClick={() => handleClick()}
      className={`font-main flex items-start md:border md:border-border p-2 ${isCurrentMonth ? isCurrentMonthStyle : notCurrentMonth} ${isSelected && isSelectedStyle} text-sm text-center rounded-xl cursor-pointer hover:bg-bright-pink md:rounded-none md:w-full md:aspect-square md:text-left lg:aspect-card 3xl:text-xl`}
    >
      <p
        className={`flex items-center justify-center rounded-full w-7 h-7 3xl:w-9 3xl:h-9 ${isSelected ? selectedNum : ""}`}
      >
        {date.getDate()}
      </p>
    </button>
  );
}
