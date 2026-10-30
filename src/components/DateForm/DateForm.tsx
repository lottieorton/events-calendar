import { toISODateString } from "../../lib/utils/date-utils";

interface DateFormProps {
  selectedDate: Date;
  onChange: (date: string) => void;
}

export default function DateForm({ selectedDate, onChange }: DateFormProps) {
  return (
    <form>
      <input
        id="date"
        type="date"
        value={toISODateString(selectedDate)}
        onChange={(e) => onChange(e.target.value)}
        className="bg-stone-50 text-sm text-d-purple p-2 rounded-3xl border border-border 3xl:text-lg 3xl:p-3"
      />
    </form>
  );
}
