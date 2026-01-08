import { siGoogle } from "simple-icons";

import { SimpleIcon } from "@/components/simple-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GoogleButton({ className, ...props }: React.ComponentProps<typeof Button>) {
  // Google login is not implemented yet - button is disabled
  return (
    <Button
      variant="secondary"
      className={cn(className)}
      disabled
      title="Autentificarea cu Google nu este disponibilă momentan"
      {...props}
    >
      <SimpleIcon icon={siGoogle} className="size-4" />
      Continuă cu Google
    </Button>
  );
}
