import { Dumbbell, Ruler, Weight } from "lucide-react";

export default function BasicUserStats({
  kilograms,
  height,
  age = 25,
  goal = "General Fitness",
}) {
  return (
    <div className="flex h-full flex-col justify-between p-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">👤 Your Stats</h2>
        <ul className="grid gap-3 text-sm text-muted-foreground">
          <li className="flex items-center gap-3">
            <Weight className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Weight:</span> {kilograms} kg
          </li>
          <li className="flex items-center gap-3">
            <Ruler className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Height:</span> {height} cm
          </li>
          <li className="flex items-center gap-3">
            <span className="text-primary text-lg">🎂</span>
            <span className="font-medium text-foreground">Age:</span> {age} yrs
          </li>
          <li className="flex items-center gap-3">
            <Dumbbell className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Goal:</span> {goal}
          </li>
        </ul>
      </div>

      <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          Track My Progress
        </button>
    </div>
  );
}
