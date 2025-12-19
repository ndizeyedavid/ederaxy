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

export default function ForgetPasswordPage() {
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
            <form className={"flex flex-col gap-6"}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                  <p className="text-muted-foreground text-sm text-balance">
                    Enter your email below to login to your account
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
                  <Button type="submit">Send Reset Code</Button>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
