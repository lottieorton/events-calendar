interface DateCardProps {
  date: number;
  selected: boolean;
}

export default function DayCard({ date, selected }: DateCardProps) {
  const selectedBg = "bg-[#F8D8E0]";
  const selectedNum = "bg-d-pink text-white";

  return (
    <button
      onClick={() => console.log("clicked")}
      className={`font-main flex justify-center p-2 text-d-purple text-sm text-center rounded-xl cursor-pointer ${selected ? selectedBg : ""}`}
    >
      <p
        className={`rounded-full p-1 aspect-square ${selected ? selectedNum : ""}`}
      >
        {date}
      </p>
    </button>
  );
}
