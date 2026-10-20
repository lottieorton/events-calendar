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
  const selectedBg = "bg-[#F8D8E0]";
  const selectedNum = "bg-d-pink text-white";

  return (
    <button
      onClick={() => handleClick()}
      className={`font-main flex justify-center p-2 ${isCurrentMonth ? "text-d-purple" : "text-[#BDA6AE]"} text-sm text-center rounded-xl cursor-pointer ${isSelected ? selectedBg : "hover:bg-[#F8D8E0]"}`}
    >
      <p
        className={`rounded-full p-1 aspect-square ${isSelected ? selectedNum : ""}`}
      >
        {date.getDate()}
      </p>
    </button>
  );
}
