import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Card placeholder compacta para un catálogo técnico. */
export function TechnicalCatalogCardSkeleton() {
  return (
    <Card
      aria-hidden="true"
      className="h-full gap-0 rounded-xl border-border/80 bg-background py-0 shadow-none"
    >
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <Skeleton className="mt-5 h-3 w-28 rounded-full" />
        <Skeleton className="mt-2 h-6 w-3/5 rounded-md" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </div>

        <div className="mt-5 flex min-h-6 items-center gap-3 border-t border-border/70 pt-4">
          <Skeleton className="h-3 w-16 rounded-full" />
          <Skeleton className="h-3 w-28 rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2 px-5 pb-5 sm:px-6 sm:pb-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-8 w-3/5 rounded-md" />
      </CardFooter>
    </Card>
  );
}
