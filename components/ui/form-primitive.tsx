import * as React from "react";
import {
  useForm,
  FormProvider,
  UseFormReturn,
  FieldValues,
  UseFormProps,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodType } from "zod";
import { cn } from "@/lib/utils";

interface FormProps<T extends FieldValues> {
  schema: ZodType<T, any, any>;
  onSubmit: (data: T) => void | Promise<void>;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  defaultValues?: UseFormProps<T>["defaultValues"];
  className?: string;
}

export function Form<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className,
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        noValidate
      >
        {children(methods)}
      </form>
    </FormProvider>
  );
}

export function FormField({
  label,
  error,
  children,
  hint,
}: {
  label?: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1 text-xs text-negative animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[10px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
