"use client";
import { CustomButton, SectionTitle, SmartButton } from "@/components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    // chechking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmpassword") as string;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      toast.error("Email is invalid");
      return;
    }

    if (!isValidPassword(password)) {
      const msg = "Password must be at least 8 characters, include uppercase, lowercase, number and special character";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords are not equal");
      toast.error("Passwords are not equal");
      return;
    }

    setIsSubmitting(true);
    setError(""); // Clear previous errors
    
    try {
      console.log("Attempting registration...");
      // sending API request for registering user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("Registration response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("Registration successful:", data);
        toast.success("✅ Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
        // Keep loading true for transition
      } else {
        // Handle error responses
        setIsSubmitting(false);
        
        let errorMessage = "Registration failed. Please try again.";
        
        try {
          const data = await res.json();
          console.log("Registration error data:", data);
          
          // Handle different types of errors
          if (data.details && Array.isArray(data.details)) {
            // Validation errors
            errorMessage = data.details.map((err: any) => err.message).join(", ");
          } else if (data.error) {
            // General errors
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          if (res.status === 500) {
            errorMessage = "Server error. Please try again later or contact support.";
          } else if (res.status === 429) {
            errorMessage = "Too many attempts. Please wait a few minutes and try again.";
          } else if (res.status === 400) {
            errorMessage = "Invalid registration data. Please check your information.";
          }
        }
        
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      setIsSubmitting(false);
      console.error("Registration network error:", error);
      
      const errorMsg = "Cannot connect to server. Please check your internet connection and try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }
  return (
    <div className="bg-gradient-to-br from-[#F8F9FA] to-[#E8EAF0] min-h-screen">
      <SectionTitle title="Register" path="Home | Register" />
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="flex justify-center flex-col items-center">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-[#1A1F2E]">
            Sign up on our website
          </h2>
        </div>

        <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 px-6 py-12 shadow-lg sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6 text-[#1A1F2E]"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-[#1A1F2E] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF1F1F] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium leading-6 text-[#1A1F2E]"
                >
                  Lastname
                </label>
                <div className="mt-2">
                  <input
                    id="lastname"
                    name="lastname"
                    type="text"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-[#1A1F2E] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF1F1F] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-[#1A1F2E]"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-[#1A1F2E] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF1F1F] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-[#1A1F2E]"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-[#1A1F2E] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF1F1F] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmpassword"
                  className="block text-sm font-medium leading-6 text-[#1A1F2E]"
                >
                  Confirm password
                </label>
                <div className="mt-2">
                  <input
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-[#1A1F2E] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#FF1F1F] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-[#FF1F1F] focus:ring-[#FF1F1F]"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-[#4B5563]"
                  >
                    Accept our terms and privacy policy
                  </label>
                </div>
              </div>

              <div>
                <SmartButton
                  type="submit"
                  loading={isSubmitting}
                  className="w-full"
                >
                  Register
                </SmartButton>

                <p className="text-red-600 text-center text-[16px] my-4">
                  {error && error}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
