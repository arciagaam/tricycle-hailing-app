'use client'
import { loginSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import HeroTitle from "../_components/HeroTitle";
import { useState } from "react";
import { Spinner } from "../_components/Spinner";

export default function Login() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {

    setIsLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(values)
    })

    if (!res.ok) {
      const { message } = await res.json();
      setIsLoading(false)
      return toast.error(message)

    }

    setIsLoading(false)

    toast.success('Succesfully logged in')
    router.push('/')
    router.refresh()
  }

  return (
    <>

      {isLoading &&
        <div className='absolute z-[999] bg-black/10 inset-0 flex flex-col items-center justify-center'>
          <div className="flex flex-col rounded-md bg-white p-8">
            <Spinner />
          </div>
        </div>
      }

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

            <Button type="submit">Login</Button>
          </form>
        </Form>
        <Link href="/register" className="flex items-center justify-center text-center w-full text-inactive text-xs hover:text-primary/80">
          {"Don't have an account yet?"}
        </Link>
      </div>
    </>
  );
}
