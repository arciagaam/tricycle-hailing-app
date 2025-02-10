'use client'
import { loginSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import HeroTitle from "../_components/HeroTitle";

export default function Login() {
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(values)
    })

    if (res.ok) {
      router.push('/')
    }

  }

  return (
    <div className="flex flex-col p-10 gap-4 w-full lg:max-w-[70dvw] 2xl:max-w-[1400px]">
      <HeroTitle />
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <FormField
            control={loginForm.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Link href="/register" className="flex items-center justify-center text-center w-full text-muted-foreground text-xs hover:text-primary/80">
          {"Don't have an account yet?"}
      </Link>
    </div>
  );
}
