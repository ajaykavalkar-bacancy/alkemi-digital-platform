"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  loadingText?: string;
};

export function SubmitButton({ children, loadingText = "Working...", ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} type="submit" disabled={pending || props.disabled}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
