import BasicUserStats from "@/components/dashboard/basic-user-stats";
import PlannerBuilder from "@/components/layouts/planner-builder-layout";

export default function Page() {
  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Apply same height/width for all */}
        <div className="bg-muted/50 h-[300px] rounded-xl overflow-hidden">
          <BasicUserStats kilograms={82} height={178} />
        </div>
        <div className="bg-muted/50 h-[300px] rounded-xl overflow-hidden">
          <PlannerBuilder
            image="/workout-builder.png"
            plannerTitle="Workout Builder"
            plannerDescription="This is your workout builder"
          />
        </div>
        <div className="bg-muted/50 h-[300px] rounded-xl overflow-hidden">
          <PlannerBuilder
            image="/diet-builder.png"
            plannerTitle="Diet Builder"
            plannerDescription="This is your diet builder"
          />
        </div>
      </div>

      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </>
  );
}
