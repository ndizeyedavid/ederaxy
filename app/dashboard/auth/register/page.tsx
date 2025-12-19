"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type TeacherRegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  schoolName: string;
  schoolType: string;
  teacherTitle: string;
  yearsExperience: string;
  highestQualification: string;
  subjects: string;
  preferredCurriculum: string;
  agreeToTerms: boolean;
};

export default function RegisterPage() {
  const steps = useMemo(
    () => ["Account", "Teacher", "School", "Preferences", "Review"],
    []
  );
  const [stepIndex, setStepIndex] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    getValues,
    control,
  } = useForm<TeacherRegisterFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phone: "",
      country: "",
      city: "",
      schoolName: "",
      schoolType: "",
      teacherTitle: "",
      yearsExperience: "",
      highestQualification: "",
      subjects: "",
      preferredCurriculum: "",
      agreeToTerms: false,
    },
  });

  const form = watch();

  const currentStep = steps[stepIndex] ?? steps[0];
  const isLastStep = stepIndex === steps.length - 1;
  const isFirstStep = stepIndex === 0;

  const fieldsByStep = useMemo(() => {
    const mapping: Record<string, (keyof TeacherRegisterFormValues)[]> = {
      Account: ["email", "password", "confirmPassword"],
      Teacher: ["fullName", "phone"],
      School: ["schoolName"],
      Preferences: ["agreeToTerms"],
      Review: [],
    };
    return mapping;
  }, []);

  const canProceed = useMemo(() => {
    if (currentStep === "Account") {
      return Boolean(
        form.email?.trim() &&
          form.password?.trim() &&
          form.confirmPassword?.trim() &&
          form.password === form.confirmPassword &&
          !errors.email &&
          !errors.password &&
          !errors.confirmPassword
      );
    }
    if (currentStep === "Teacher") {
      return Boolean(
        form.fullName?.trim() &&
          form.phone?.trim() &&
          !errors.fullName &&
          !errors.phone
      );
    }
    if (currentStep === "School") {
      return Boolean(form.schoolName?.trim() && !errors.schoolName);
    }
    if (currentStep === "Preferences") {
      return Boolean(form.agreeToTerms);
    }
    return true;
  }, [currentStep, errors, form]);

  const curriculumOptions = useMemo(
    () => [
      { id: "", label: "Select" },
      { id: "rwanda", label: "Rwanda" },
      { id: "cambridge", label: "Cambridge" },
      { id: "ib", label: "IB" },
    ],
    []
  );

  const onContinue = async () => {
    const fields = fieldsByStep[currentStep] ?? [];
    const ok = await trigger(fields as any, { shouldFocus: true });
    if (!ok) return;
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const onValidSubmit = (values: TeacherRegisterFormValues) => {
    console.log("Register teacher (UI-only)", values);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="bg-muted relative hidden lg:block">
        <div className="flex md:justify-start">
          <Link href="/dashboard/auth/login" className="flex font-medium">
            <Image
              src={"/logo/logo.png"}
              width={400}
              height={300}
              className="w-[160px] relative top-2 left-2"
              alt="Ederaxy Logo"
            />
          </Link>
        </div>
        <img
          src="/auth-placeholder.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-2xl">
            <form
              className={"flex flex-col gap-6"}
              onSubmit={handleSubmit(onValidSubmit)}
            >
              <FieldGroup>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-2xl font-bold">
                      Create your teacher account
                    </h1>
                    <p className="text-muted-foreground text-sm text-balance">
                      Step {stepIndex + 1} of {steps.length}: {currentStep}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {steps.map((label, index) => {
                      const active = index === stepIndex;
                      const done = index < stepIndex;
                      return (
                        <div
                          key={label}
                          className={
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            (active
                              ? "bg-primary text-primary-foreground"
                              : done
                              ? "bg-muted text-foreground"
                              : "bg-muted/60 text-muted-foreground")
                          }
                        >
                          {label}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {currentStep === "Account" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="teacher@example.com"
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
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <Input
                        id="password"
                        type="password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                          },
                        })}
                        required
                      />
                      {errors.password?.message ? (
                        <p className="text-destructive mt-2 text-xs">
                          {String(errors.password.message)}
                        </p>
                      ) : null}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="confirmPassword">
                        Confirm password
                      </FieldLabel>
                      <Input
                        id="confirmPassword"
                        type="password"
                        {...register("confirmPassword", {
                          required: "Please confirm your password",
                          validate: (value) =>
                            value === getValues("password") ||
                            "Passwords do not match",
                        })}
                        required
                      />
                      {errors.confirmPassword?.message ? (
                        <p className="text-destructive mt-2 text-xs">
                          {String(errors.confirmPassword.message)}
                        </p>
                      ) : null}
                    </Field>
                  </div>
                ) : null}

                {currentStep === "Teacher" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                      <Input
                        id="fullName"
                        placeholder="e.g. David Ndizeye"
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        required
                      />
                      {errors.fullName?.message ? (
                        <p className="text-destructive mt-2 text-xs">
                          {String(errors.fullName.message)}
                        </p>
                      ) : null}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="teacherTitle">Title</FieldLabel>
                      <Input
                        id="teacherTitle"
                        placeholder="e.g. Mr / Ms / Dr"
                        {...register("teacherTitle")}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="phone">Phone</FieldLabel>
                      <Controller
                        control={control}
                        name="phone"
                        rules={{ required: "Phone is required" }}
                        render={({ field }) => (
                          <PhoneInput
                            id="phone"
                            defaultCountry="RW"
                            international
                            placeholder="e.g. 78 000 0000"
                            value={field.value}
                            onChange={(value) => field.onChange(value ?? "")}
                            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm placeholder:text-white/40 focus-within:border-emerald-400/70 focus-within:outline-none"
                          />
                        )}
                      />
                      {errors.phone?.message ? (
                        <p className="text-destructive mt-2 text-xs">
                          {String(errors.phone.message)}
                        </p>
                      ) : null}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="yearsExperience">
                        Years of experience
                      </FieldLabel>
                      <Input
                        id="yearsExperience"
                        type="number"
                        min={0}
                        placeholder="e.g. 3"
                        {...register("yearsExperience")}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="highestQualification">
                        Highest qualification
                      </FieldLabel>
                      <Input
                        id="highestQualification"
                        placeholder="e.g. B.Ed / BSc / MSc"
                        {...register("highestQualification")}
                      />
                    </Field>
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="subjects">
                        Subjects you teach
                      </FieldLabel>
                      <Input
                        id="subjects"
                        placeholder="e.g. Mathematics, Physics"
                        {...register("subjects")}
                      />
                    </Field>
                  </div>
                ) : null}

                {currentStep === "School" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="schoolName">School name</FieldLabel>
                      <Input
                        id="schoolName"
                        placeholder="e.g. Ederaxy Academy"
                        {...register("schoolName", {
                          required: "School name is required",
                        })}
                        required
                      />
                      {errors.schoolName?.message ? (
                        <p className="text-destructive mt-2 text-xs">
                          {String(errors.schoolName.message)}
                        </p>
                      ) : null}
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="schoolType">School type</FieldLabel>
                      <select
                        id="schoolType"
                        {...register("schoolType")}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                      >
                        <option value="">Select</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="university">University</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="preferredCurriculum">
                        Preferred curriculum
                      </FieldLabel>
                      <select
                        id="preferredCurriculum"
                        {...register("preferredCurriculum")}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                      >
                        {curriculumOptions.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="country">Country</FieldLabel>
                      <Input
                        id="country"
                        placeholder="e.g. Rwanda"
                        {...register("country")}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="city">City</FieldLabel>
                      <Input
                        id="city"
                        placeholder="e.g. Kigali"
                        {...register("city")}
                      />
                    </Field>
                  </div>
                ) : null}

                {currentStep === "Preferences" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="agreeToTerms">Terms</FieldLabel>
                      <label className="mt-2 flex items-start gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70">
                        <input
                          id="agreeToTerms"
                          type="checkbox"
                          {...register("agreeToTerms", {
                            required: true,
                          })}
                          className="mt-0.5 size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                        />
                        <span>
                          I agree to the Terms of Service and Privacy Policy.
                        </span>
                      </label>
                      {errors.agreeToTerms ? (
                        <p className="text-destructive mt-2 text-xs">
                          You must accept the terms to continue.
                        </p>
                      ) : null}
                    </Field>
                  </div>
                ) : null}

                {currentStep === "Review" ? (
                  <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0f1117] p-4 text-sm text-white/80">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div>
                        <div className="text-xs text-white/50">Email</div>
                        <div className="font-semibold">{form.email || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Name</div>
                        <div className="font-semibold">
                          {form.fullName || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Phone</div>
                        <div className="font-semibold">{form.phone || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">School</div>
                        <div className="font-semibold">
                          {form.schoolName || "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Subjects</div>
                        <div className="font-semibold">
                          {form.subjects || "-"}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-white/50">
                      When API wiring is ready, this step will submit your
                      details and create the account.
                    </p>
                  </div>
                ) : null}

                <div className="flex items-center justify-between gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isFirstStep}
                    onClick={onBack}
                  >
                    Back
                  </Button>
                  {isLastStep ? (
                    <Button
                      type="submit"
                      disabled={!canProceed || isSubmitting}
                    >
                      Create account
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      disabled={!canProceed}
                      onClick={onContinue}
                    >
                      Continue
                    </Button>
                  )}
                </div>

                <Field>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link
                      href="/dashboard/auth/login"
                      className="underline underline-offset-4"
                    >
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .PhoneInput {
          color: rgb(255 255 255);
        }

        .PhoneInputInput {
          background: transparent;
          color: rgb(255 255 255);
          border: 0;
          outline: none;
          width: 100%;
        }

        .PhoneInputCountrySelect {
          background: transparent;
          color: rgb(255 255 255);
        }

        .PhoneInputCountrySelect option {
          background: #0f1117;
          color: rgb(255 255 255);
        }

        .PhoneInputCountryIcon {
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
