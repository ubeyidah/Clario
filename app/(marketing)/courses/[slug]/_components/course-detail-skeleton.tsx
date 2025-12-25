import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronsUpDown } from "lucide-react";

export default function CourseDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-5 gap-10 mb-24">
      <div>
        <Skeleton className="aspect-video w-full rounded-lg" />

        <div className="mt-6 px-1 space-y-3">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-full" />
          <div className="flex flex-wrap mt-4 gap-3">
            <Badge variant="secondary">
              <Skeleton className="h-4 w-20" />
            </Badge>
            <Badge variant="secondary">
              <Skeleton className="h-4 w-20" />
            </Badge>
          </div>
        </div>

        <Separator className="my-7" />

        <div className="space-y-6">
          <Skeleton className="h-6 w-1/3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((chapter) => (
              <Collapsible
                className="border rounded-md p-2 border-border/40"
                key={chapter}
                defaultOpen={chapter === 1}
              >
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="flex items-center gap-1 pr-2">
                      <Badge variant="secondary">
                        <Skeleton className="h-4 w-12" />
                      </Badge>
                      <ChevronsUpDown className="size-4" />
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator className="my-2 bg-border/40" />
                  <div className="pl-8 pr-3 pt-3 space-y-4 mb-2">
                    {[1, 2].map((lesson) => (
                      <div key={lesson} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Skeleton className="size-8 rounded-full" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Card className="sticky top-8 bg-card/40">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Separator className="my-2" />
            <div className="space-y-3 mb-6 rounded-lg p-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 space-y-3 mb-8">
              <Skeleton className="h-5 w-32" />
              {[1, 2].map((feature) => (
                <div key={feature} className="pl-2 text-sm flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
            <Button className="w-full" disabled>
              <Skeleton className="h-5 w-20" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
