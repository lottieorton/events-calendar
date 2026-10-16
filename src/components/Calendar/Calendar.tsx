import { useState } from "react";
import Button from "../Buttons/Button";
import DateCard from "../DateCard/DateCard";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(12);

  const dates = [
    28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1,
  ];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <h1 className="font-sans text-d-purple text-2xl font-extrabold">
          October 2026
        </h1>
        <div className="flex gap-2">
          <Button>
            <i className="fa-solid fa-angle-left text-d-purple"></i>
          </Button>
          <Button>
            <i className="fa-solid fa-angle-right text-d-purple"></i>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 p-4 gap-2 bg-stone-50 rounded-3xl border border-[#EEDDE1] justify-items-center">
        <p className="text-xs text-center text-pale-purple font-semibold">
          Mon
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Tue
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Wed
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Thu
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Fri
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Sat
        </p>
        <p className="text-xs text-center text-pale-purple font-semibold">
          Sun
        </p>
        {dates.map((d) => {
          return <DateCard date={d} selected={d === selectedDate} key={d} />;
        })}
      </div>
    </section>
  );
}
