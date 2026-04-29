import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SignupForm from "@/components/auth/SignupForm";
import LoginForm from "@/components/auth/LoginForm";
import { saveUser } from "@/lib/storage";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("auth flow", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("submits the signup form and creates a session", async () => {
    render(<SignupForm />);

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: "Test User" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-signup-password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByLabelText(/Confirm/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(localStorage.getItem("habit-tracker-session")).toBeTruthy();
    });
  });

  it("shows an error for duplicate signup email", async () => {
    saveUser({
      id: "1",
      email: "test@example.com",
      password: "123",
      createdAt: "",
    });

    render(<SignupForm />);

    fireEvent.change(screen.getByTestId("auth-signup-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByTestId("auth-signup-submit"));

    await waitFor(() => {
      expect(screen.getByText(/User already exists/i)).toBeTruthy();
    });
  });

  it("submits the login form and stores the active session", async () => {
    saveUser({
      id: "1",
      email: "test@example.com",
      password: "password123",
      createdAt: "",
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("auth-login-password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(localStorage.getItem("habit-tracker-session")).toBeTruthy();
    });
  });

  it("shows an error for invalid login credentials", async () => {
    render(<LoginForm />);

    fireEvent.change(screen.getByTestId("auth-login-email"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.click(screen.getByTestId("auth-login-submit"));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeTruthy();
    });
  });
});
