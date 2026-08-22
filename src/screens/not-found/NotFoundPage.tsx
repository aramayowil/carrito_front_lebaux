import Link from "next/link";

import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="container flex min-h-[60dvh] flex-col items-center gap-4 py-20 text-center">
      <h1 className="text-3xl font-semibold text-foreground">404</h1>
      <p className="text-muted-foreground">{"No encontramos esta página."}</p>
      <Button render={<Link href="/" />}>{"Volver al inicio"}</Button>
    </div>
  );
}
