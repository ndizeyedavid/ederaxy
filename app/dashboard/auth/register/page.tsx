"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api/client";
import {
  login,
  me,
  register as registerUser,
  uploadProfilePicture,
} from "@/lib/api/auth";
import { getCurriculums, type CurriculumListItem } from "@/lib/api/curriculums";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useRouter } from "next/navigation";

type TeacherRegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  dob: string;
  nationalId: string;
  profilePicture: FileList | null;
  bio: string;
  phone: string;
  country: string;
  city: string;
  schoolName: string;
  schoolType: string;
  teacherTitle: string;
  yearsExperience: string;
  highestQualification: string;
  subjects: string[];
  preferredCurriculum: string;
  agreeToTerms: boolean;
};

export default function RegisterPage() {
  const router = useRouter();
  const steps = useMemo(
    () => [
      "Account",
      "Teacher",
      "Profile picture",
      "School",
      "Preferences",
      "Review",
    ],
    []
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [curriculums, setCurriculums] = useState<CurriculumListItem[]>([]);
  const [curriculumsLoading, setCurriculumsLoading] = useState(false);
  const [curriculumsError, setCurriculumsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await me();
        if (!cancelled) router.replace("/dashboard/Teacher");
      } catch {
        // not logged in
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setCurriculumsLoading(true);
      setCurriculumsError(null);
      try {
        const res = await getCurriculums();
        if (cancelled) return;
        setCurriculums(res.curriculums);
      } catch (err) {
        if (cancelled) return;
        setCurriculumsError(
          err instanceof Error ? err.message : "Failed to load curriculums"
        );
      } finally {
        if (!cancelled) setCurriculumsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    getValues,
    control,
    setValue,
    setError,
  } = useForm<TeacherRegisterFormValues>({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      dob: "",
      nationalId: "",
      profilePicture: null,
      bio: "",
      phone: "",
      country: "",
      city: "",
      schoolName: "",
      schoolType: "",
      teacherTitle: "",
      yearsExperience: "",
      highestQualification: "",
      subjects: [],
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
      "Profile picture": [],
      School: ["schoolName"],
      Preferences: ["agreeToTerms"],
      Review: [],
    };
    return mapping;
  }, []);

  const profilePreviewUrl = useMemo(() => {
    const file = form.profilePicture?.[0];
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [form.profilePicture]);

  useEffect(() => {
    return () => {
      if (profilePreviewUrl) URL.revokeObjectURL(profilePreviewUrl);
    };
  }, [profilePreviewUrl]);

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

  const onContinue = async () => {
    const fields = fieldsByStep[currentStep] ?? [];
    const ok = await trigger(fields as any, { shouldFocus: true });
    if (!ok) return;
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const onBack = () => setStepIndex((prev) => Math.max(prev - 1, 0));

  const onValidSubmit = (values: TeacherRegisterFormValues) => {
    return;
  };

  const onFinalSubmit = async (values: TeacherRegisterFormValues) => {
    setServerError(null);
    try {
      if (!values.fullName.trim()) {
        setError("fullName", {
          type: "manual",
          message: "Full name is required",
        });
        return;
      }

      if (!values.email.trim()) {
        setError("email", { type: "manual", message: "Email is required" });
        return;
      }

      if (!values.password.trim() || values.password.length < 8) {
        setError("password", {
          type: "manual",
          message: "Password must be at least 8 characters",
        });
        return;
      }

      if (values.password !== values.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }

      if (!values.nationalId.trim()) {
        setError("nationalId", {
          type: "manual",
          message: "National ID is required for teacher registration",
        });
        return;
      }

      const yearsExperience = values.yearsExperience?.trim()
        ? Number(values.yearsExperience)
        : undefined;

      const registerPayload = {
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        password: values.password,
        role: "teacher" as const,
        dob: values.dob || undefined,
        nationalId: values.nationalId.trim() || undefined,
        bio: values.bio?.trim() || undefined,
        phone: values.phone || undefined,
        teacherTitle: values.teacherTitle?.trim() || undefined,
        yearsExperience:
          typeof yearsExperience === "number" && !Number.isNaN(yearsExperience)
            ? yearsExperience
            : undefined,
        highestQualification: values.highestQualification?.trim() || undefined,
        subjects: values.subjects?.length ? values.subjects : undefined,
        schoolName: values.schoolName?.trim() || undefined,
        schoolType: values.schoolType || undefined,
        country: values.country?.trim() || undefined,
        city: values.city?.trim() || undefined,
        preferredCurriculumId: values.preferredCurriculum?.trim() || undefined,
        agreeToTerms: values.agreeToTerms,
        termsVersion: "v1",
      };

      await registerUser(registerPayload);

      await login({ email: values.email.trim(), password: values.password });

      const profileFile = values.profilePicture?.[0] ?? null;
      if (profileFile) {
        await uploadProfilePicture(profileFile);
      }

      router.push("/dashboard/Teacher");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.details?.length) {
          for (const issue of err.details) {
            const field = issue.field as
              | keyof TeacherRegisterFormValues
              | undefined;
            if (field && field in (errors as any) === false) {
              // fallthrough
            }
            if (field === "fullName")
              setError("fullName", {
                type: "server",
                message: issue.message || err.message,
              });
            if (field === "email")
              setError("email", {
                type: "server",
                message: issue.message || err.message,
              });
            if (field === "password")
              setError("password", {
                type: "server",
                message: issue.message || err.message,
              });
            if (field === "nationalId")
              setError("nationalId", {
                type: "server",
                message: issue.message || err.message,
              });
          }
          if (!serverError) setServerError(err.message);
        } else {
          setServerError(err.message);
        }
        return;
      }

      setServerError(
        err instanceof Error ? err.message : "Registration failed"
      );
    }
  };

  const [subjectDraft, setSubjectDraft] = useState("");

  const addSubjects = (raw: string) => {
    const candidates = raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!candidates.length) return;

    const current = getValues("subjects") ?? [];
    const next = Array.from(new Set([...current, ...candidates]));
    setValue("subjects", next, { shouldDirty: true, shouldValidate: false });
  };

  const removeSubject = (subject: string) => {
    const current = getValues("subjects") ?? [];
    setValue(
      "subjects",
      current.filter((s) => s !== subject),
      { shouldDirty: true, shouldValidate: false }
    );
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
              onSubmit={handleSubmit(onFinalSubmit)}
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

                  {serverError ? (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {serverError}
                    </div>
                  ) : null}

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
                            value: 8,
                            message: "Password must be at least 8 characters",
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

                {currentStep === "Profile picture" ? (
                  <div className="grid gap-4">
                    <Field>
                      <FieldLabel htmlFor="profilePicture">
                        Profile picture
                      </FieldLabel>
                      <Input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        {...register("profilePicture")}
                      />
                    </Field>

                    {profilePreviewUrl ? (
                      <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                          Preview
                        </p>
                        <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                          <img
                            src={profilePreviewUrl}
                            alt="Profile preview"
                            className="h-64 w-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-xs text-white/50">
                          {form.profilePicture?.[0]?.name ?? ""}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 text-sm text-white/60">
                        Upload an image to preview it here.
                      </div>
                    )}
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
                      <FieldLabel htmlFor="dob">Date of birth</FieldLabel>
                      <Input id="dob" type="date" {...register("dob")} />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="nationalId">National ID</FieldLabel>
                      <Input
                        id="nationalId"
                        placeholder="Optional"
                        {...register("nationalId")}
                      />
                    </Field>

                    <Field className="sm:col-span-2">
                      <FieldLabel htmlFor="bio">Bio</FieldLabel>
                      <textarea
                        id="bio"
                        rows={3}
                        placeholder="Tell students a bit about you (optional)"
                        {...register("bio")}
                        className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                      />
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
                      <div className="mt-2 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          {(form.subjects ?? []).map((subject) => (
                            <span
                              key={subject}
                              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80"
                            >
                              {subject}
                              <button
                                type="button"
                                onClick={() => removeSubject(subject)}
                                className="text-white/60 transition hover:text-white"
                                aria-label={`Remove ${subject}`}
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>

                        <input
                          id="subjects"
                          value={subjectDraft}
                          onChange={(e) => {
                            const nextValue = e.currentTarget.value;
                            if (nextValue.includes(",")) {
                              addSubjects(nextValue);
                              setSubjectDraft("");
                              return;
                            }
                            setSubjectDraft(nextValue);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "," || e.key === "Enter") {
                              e.preventDefault();
                              addSubjects(subjectDraft);
                              setSubjectDraft("");
                            }
                            if (
                              e.key === "Backspace" &&
                              !subjectDraft &&
                              (form.subjects?.length ?? 0) > 0
                            ) {
                              const last =
                                form.subjects?.[form.subjects.length - 1];
                              if (last) removeSubject(last);
                            }
                          }}
                          onBlur={() => {
                            if (subjectDraft.trim()) {
                              addSubjects(subjectDraft);
                              setSubjectDraft("");
                            }
                          }}
                          placeholder="Type a subject and press comma"
                          className="mt-3 w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                        />
                      </div>
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
                        <option value="">Select</option>
                        {curriculums.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      {curriculumsLoading ? (
                        <p className="mt-2 text-xs text-white/50">
                          Loading curriculums...
                        </p>
                      ) : null}
                      {curriculumsError ? (
                        <p className="mt-2 text-xs text-rose-200">
                          {curriculumsError}
                        </p>
                      ) : null}
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
                        <div className="text-xs text-white/50">DOB</div>
                        <div className="font-semibold">{form.dob || "-"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">National ID</div>
                        <div className="font-semibold">
                          {form.nationalId || "-"}
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
                          {(form.subjects ?? []).length
                            ? (form.subjects ?? []).join(", ")
                            : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">Bio</div>
                        <div className="font-semibold">
                          {form.bio?.trim() ? form.bio : "-"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-white/50">
                          Profile picture
                        </div>
                        <div className="font-semibold">
                          {form.profilePicture?.[0]?.name ?? "-"}
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
