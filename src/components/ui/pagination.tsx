import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <ul data-slot="pagination-content" className={cn("flex flex-row items-center gap-1", className)} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

function PaginationLink({ className, isActive, ...props }: PaginationLinkProps) {
  return (
    <button
      aria-current={isActive ? "page" : undefined}
      data-active={isActive}
      data-slot="pagination-link"
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size: "icon",
        }),
        "size-8",
        className,
      )}
      type="button"
      {...props}
    />
  );
}

function PaginationPrevious({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Ir para a página anterior" className={cn("gap-1 px-2.5 sm:w-auto", className)} {...props}>
      <ChevronLeft className="size-4" aria-hidden="true" />
      <span className="hidden sm:block">Anterior</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Ir para a próxima página" className={cn("gap-1 px-2.5 sm:w-auto", className)} {...props}>
      <span className="hidden sm:block">Próxima</span>
      <ChevronRight className="size-4" aria-hidden="true" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">Mais páginas</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
