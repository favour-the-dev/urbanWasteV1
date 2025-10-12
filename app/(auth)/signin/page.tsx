"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/ui/Navbar";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type Inputs = z.infer<typeof schema>;

export default function SignInPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(values: Inputs) {
    const toastId = toast.loading("Signing in...");
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res && (res as any).error) {
      toast.error("Invalid credentials", { id: toastId });
      return;
    }
    toast.success("Signed in", { id: toastId });
    // fetch session to get role and redirect client-side
    const resp = await fetch("/api/auth/session");
    const json = await resp.json();
    console.log("Session data:", json);
    const role = json?.user?.role;
    console.log("User role:", role);
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/operator/dashboard");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white/5 rounded shadow">
          <h1 className="text-2xl mb-4">Sign in</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Email"
              type="email"
              {...register("email")}
              error={formState.errors.email?.message as string}
            />
            <InputField
              label="Password"
              type="password"
              {...register("password")}
              error={formState.errors.password?.message as string}
            />
            <Button type="submit">Sign in</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
