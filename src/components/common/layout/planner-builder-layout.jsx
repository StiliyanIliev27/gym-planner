// PlannerBuilder.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PlannerBuilder({
  image,
  plannerTitle,
  plannerDescription,
  href = "#",
  badge,
  features = [],
}) {
  return (
    <Card className="h-full pt-0 overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/50 flex flex-col">
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={plannerTitle}
          fill
          className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {badge && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-white/90 text-gray-900 shadow-lg">
              <Sparkles className="h-3 w-3 mr-1" />
              {badge}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 flex flex-col flex-1 justify-between">
        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="font-semibold text-base leading-tight line-clamp-1">{plannerTitle}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {plannerDescription}
            </p>
          </div>

          {features.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link href={href} className="block">
            <Button className="w-full group/button" size="sm">
              Start Planning
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover/button:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
