"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import { requestPasswordReset } from "@/lib/api/auth";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgetPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setServerError(null);
    setSuccessMessage(null);
    try {
      await requestPasswordReset({ email: values.email.trim() });
      setSuccessMessage(
        "If that email exists, we have sent instructions to reset your password."
      );
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details?.length) {
          for (const issue of err.details) {
            if (issue.field === "email") {
              setError("email", {
                type: "server",
                message: issue.message || err.message,
              });
            }
          }
        } else {
          setServerError(err.message);
        }
        return;
      }

      setServerError(
        err instanceof Error ? err.message : "Failed to request reset"
      );
    }
  };

  return (
    <div className="h-svh">
      <div className="flex flex-col h-full  gap-4 p-6 md:p-10">
        <div className="flex md:justify-start">
          <Link href="/dashboard/auth/login" className="flex font-medium">
            <Image
              src={"/logo/logo.png"}
              width={400}
              height={300}
              className="w-[160px] relative -top-6 right-7"
              alt="Ederaxy Logo"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form
              className={"flex flex-col gap-6"}
              onSubmit={handleSubmit(onSubmit)}
            >
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Reset your password</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email and we will send reset instructions.
                  </p>
                </div>
                {serverError ? (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {serverError}
                  </div>
                ) : null}
                {successMessage ? (
                  <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                    {successMessage}
                  </div>
                ) : null}
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    required
                  />
                  {errors.email?.message ? (
                    <p className="text-destructive mt-2 text-xs">
                      {String(errors.email.message)}
                    </p>
                  ) : null}
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send reset instructions"}
                  </Button>
                </Field>
                <FieldDescription className="text-center">
                  Remembered your password?{" "}
                  <Link
                    href="/dashboard/auth/login"
                    className="underline underline-offset-4"
                  >
                    Login
                  </Link>
                </FieldDescription>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
