"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import InputField from "../../../components/ui/InputField";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/ui/Navbar";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "operator"]),
});

type Inputs = z.infer<typeof schema>;

export default function SignUpPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: { role: "operator" },
  });

  async function onSubmit(values: Inputs) {
    const toastId = toast.loading("Creating account...");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(json?.error || "Signup failed", { id: toastId });
      return;
    }
    toast.success("Account created", { id: toastId });
    router.push("/signin");
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white/5 rounded shadow">
          <h1 className="text-2xl mb-4">Create an account</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
              label="Full name"
              {...register("name")}
              error={formState.errors.name?.message as string}
            />
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
            <div className="mb-4">
              <label className="block text-sm mb-1">Role</label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 rounded bg-white/5"
              >
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Button type="submit">Create account</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
