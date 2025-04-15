import React from "react";
import { FaArrowRight } from "react-icons/fa";

interface LoginPageProps {
    onConnect: () => void;
}

export default function LoginPage({ onConnect }: LoginPageProps) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 via-white to-blue-100">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-80 text-center">
                <h1 className="text-4xl font-semibold mb-2 text-gray-800">Hello!</h1>
                <p className="text-gray-500 mb-6">Welcome back</p>

                <div className="text-red-500 text-2xl font-bold">Тест Tailwind</div>

                <p className="text-xs text-gray-400 mt-6">
                    Don’t have an account yet?{" "}
                    <span className="text-black font-semibold">Sign up</span>
                </p>
            </div>
        </div>
    );
}
