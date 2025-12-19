import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
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
          <div className="w-full max-w-xs">
            <form className={"flex flex-col gap-6"}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Welcome to Ederaxy</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Fill the form, to get access to your dashboard
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input id="password" type="password" required />
                </Field>
                <Field>
                  <Button type="submit">Register</Button>
                </Field>
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
    </div>
  );
}
