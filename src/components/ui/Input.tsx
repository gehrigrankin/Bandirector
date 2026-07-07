"use client";

import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <label className="block w-full" htmlFor={inputId}>
        {label ? (
          <span className="mb-1.5 block text-sm font-medium text-text-muted">
            {label}
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-bg-input px-4 text-base",
            "placeholder:text-text-dim",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            error && "border-danger",
            className,
          )}
          {...rest}
        />
        {error ? (
          <span className="mt-1 block text-xs text-danger">{error}</span>
        ) : null}
      </label>
    );
  },
);

Input.displayName = "Input";
