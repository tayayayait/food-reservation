import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Textarea — XML 명세 3.3 기준
 *
 * min-height: 120px, max-height: 240px
 * padding: 12px 16px, font: 16px
 * resize: vertical (모바일에서는 none)
 * 문자 카운터: 우하단 body-xs
 * States: Input과 동일
 */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** 상단 라벨 */
  label?: string;
  /** 필수 항목 표시 */
  required?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 최대 글자 수 */
  maxChars?: number;
  /** 현재 글자 수 */
  charCount?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, required, error, helperText, maxChars, charCount, id, ...props }, ref) => {
    const textareaId = id || React.useId();
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    const describedBy = [errorId, helperId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        {label && (
          <label htmlFor={textareaId} className={cn("text-body-md font-medium", error ? "text-error-dark" : "text-neutral-700")}>
            {label}
            {required && <span className="text-error ml-0.5">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            "flex w-full rounded-sm border border-input bg-card px-4 py-3 text-body-lg",
            "min-h-[120px] max-h-[240px]",
            "resize-y sm:resize-none",
            "ring-offset-background transition-colors duration-normal",
            "placeholder:text-neutral-400",
            "hover:border-neutral-500",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:border-2",
            "disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400",
            error && "border-2 border-error focus-visible:border-error",
            className,
          )}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />

        {/* Bottom row */}
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
Textarea.displayName = "Textarea";

export { Textarea };
