// PlannerBuilder.tsx
import Image from "next/image";

export default function PlannerBuilder({
  image,
  plannerTitle,
  plannerDescription,
}) {
  return (
    <div className="relative w-full h-[300px] rounded-xl overflow-hidden">
      <Image
        src={image}
        alt={plannerTitle}
        fill
        className="object-cover"
        priority
      />

      <div className="absolute bottom-0 left-0 w-full bg-gray-900/70 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{plannerTitle}</h3>
          <p className="text-sm text-gray-300">{plannerDescription}</p>
        </div>

        <button className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition">
          Start Planning
        </button>
      </div>
    </div>
  );
}
