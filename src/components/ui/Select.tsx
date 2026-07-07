"use client";

import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, className, id, children, ...rest }, ref) => {
    const selectId = id ?? rest.name;
    return (
      <label className="block w-full" htmlFor={selectId}>
        {label ? (
          <span className="mb-1.5 block text-sm font-medium text-text-muted">
            {label}
          </span>
        ) : null}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-bg-input px-3 text-base",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
      </label>
    );
  },
);

Select.displayName = "Select";
