"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { submitContact, type ContactPayload } from "@/lib/contact";
import { fluid } from "@/lib/fluid";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(payload: ContactPayload): Errors {
  const errors: Errors = {};
  if (!payload.name) errors.name = "Please enter your name.";
  if (!payload.email) errors.email = "Please enter your email address.";
  else if (!EMAIL.test(payload.email))
    errors.email = "That email address doesn’t look right.";
  if (!payload.message) errors.message = "Please add a short message.";
  return errors;
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const read = (key: string) => String(data.get(key) ?? "").trim();
    const payload: ContactPayload = {
      name: read("name"),
      email: read("email"),
      company: read("company"),
      message: read("message"),
    };

    const found = validate(payload);
    setErrors(found);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus("sending");
    try {
      await submitContact(payload);
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  function clearError(name: FieldName) {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (status === "sent" || status === "error") setStatus("idle");
  }

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex flex-col"
      style={{ gap: fluid(20, 20) }}
    >
      <Field id="name" label="Full Name" error={errors.name}>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Name"
          className="field"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          onChange={() => clearError("name")}
        />
      </Field>

      <Field id="email" label="Email Address" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          placeholder="Email"
          className="field"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          onChange={() => clearError("email")}
        />
      </Field>

      <Field
        id="company"
        label={
          <>
            Company Name <span className="text-body/50">(Optional)</span>
          </>
        }
      >
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Company name"
          className="field"
        />
      </Field>

      <Field id="message" label="Message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          placeholder="Message"
          className="field resize-none"
          style={{ height: fluid(140, 140) }}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          onChange={() => clearError("message")}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-outline sm:w-[calc(180*var(--k))]"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        <p role="status" aria-live="polite" className="t-ui text-oxblood">
          {status === "sent" && (
            <span className="inline-block animate-[fade-rise_0.6s_var(--ease)_both]">
              Thank you — we’ll be in touch shortly.
            </span>
          )}
          {status === "error" && (
            <span className="inline-block animate-[fade-rise_0.6s_var(--ease)_both] text-maroon">
              Something went wrong. Please try again.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: ReactNode;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col" style={{ gap: fluid(8, 8) }}>
      <label htmlFor={id} className="t-small font-medium text-body">
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          className="t-small animate-[fade-rise_0.4s_var(--ease)_both] text-maroon"
        >
          {error}
        </p>
      )}
    </div>
  );
}
