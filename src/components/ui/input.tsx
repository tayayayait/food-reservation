import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2, AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Input — XML 명세 3.2 기준
 *
 * Sizes:  lg(52px/검색), md(44px/일반), sm(36px/필터)
 * States: default, hover, focus, active, disabled, error, loading
 * Sub-elements: label, placeholder, helper, error message, prefix/suffix icon, character counter
 */
const inputVariants = cva(
  [
    "flex w-full bg-card border rounded-sm px-4 text-body-lg text-foreground",
    "ring-offset-background transition-colors duration-normal",
    "placeholder:text-neutral-400",
    "hover:border-neutral-500",
    "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-0 focus-visible:border-2",
    "disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      inputSize: {
        lg: "h-[52px] text-body-lg",
        default: "h-[44px] text-body-lg",
        sm: "h-[36px] text-body-md",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  },
);

export interface InputFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** 상단 라벨 */
  label?: string;
  /** 필수 항목 표시 */
  required?: boolean;
  /** 에러 메시지 (표시 시 에러 상태) */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 좌측 아이콘/요소 */
  prefixIcon?: React.ReactNode;
  /** 우측 아이콘/요소 */
  suffixIcon?: React.ReactNode;
  /** 최대 글자 수 (카운터 표시) */
  maxChars?: number;
  /** 현재 글자 수 */
  charCount?: number;
  /** 로딩 상태 */
  loading?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      className,
      inputSize,
      type,
      label,
      required,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      maxChars,
      charCount,
      loading,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id || React.useId();
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        {label && (
          <label htmlFor={inputId} className={cn("text-body-md font-medium", error ? "text-error-dark" : "text-neutral-700")}>
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative">
          {/* Prefix icon */}
          {prefixIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 [&_svg]:w-5 [&_svg]:h-5">
              {prefixIcon}
            </span>
          )}

          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ inputSize }),
              prefixIcon && "pl-10",
              (suffixIcon || loading) && "pr-10",
              error && "border-2 border-error focus-visible:border-error",
              loading && "bg-neutral-100 border-neutral-300",
              className,
            )}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            disabled={props.disabled || loading}
            {...props}
          />

          {/* Suffix / Loading spinner */}
          {loading ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
            </span>
          ) : suffixIcon ? (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 [&_svg]:w-5 [&_svg]:h-5">
              {suffixIcon}
            </span>
          ) : null}
        </div>

        {/* Bottom row: error/helper + char counter */}
        <div className="flex justify-between items-start">
          <div>
            {error && (
              <p id={errorId} className="text-body-sm text-error-dark flex items-center gap-1" role="alert">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </p>
            )}
            {!error && helperText && (
              <p id={helperId} className="text-body-sm text-neutral-600">
                {helperText}
              </p>
            )}
          </div>
          {maxChars != null && (
            <span className="text-body-xs text-neutral-500 ml-auto">
              {charCount ?? 0}/{maxChars}
            </span>
          )}
        </div>
      </div>
    );
  },
);
InputField.displayName = "InputField";

// Keep backward-compatible simple Input
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[44px] w-full rounded-sm border border-input bg-card px-4 text-body-lg ring-offset-background transition-colors duration-normal placeholder:text-neutral-400 hover:border-neutral-500 focus-visible:outline-none focus-visible:border-primary focus-visible:border-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, InputField, inputVariants };
