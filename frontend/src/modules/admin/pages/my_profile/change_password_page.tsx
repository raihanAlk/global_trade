
"use client";

import { useState } from "react";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

import Button from "@/src/components/ui/button";

export default function ChangePasswordPage() {
  const [current_password, set_current_password] = useState("");
  const [new_password, set_new_password] = useState("");
  const [confirm_password, set_confirm_password] = useState("");

  const [show_current, set_show_current] = useState(false);
  const [show_new, set_show_new] = useState(false);
  const [show_confirm, set_show_confirm] = useState(false);

  const [error_message, set_error_message] = useState("");
  const [success_message, set_success_message] = useState("");

  // Memeriksa apakah password baru memenuhi persyaratan.
  const password_rules = {
    min_length: new_password.length >= 8,
    uppercase: /[A-Z]/.test(new_password),
    lowercase: /[a-z]/.test(new_password),
    number: /[0-9]/.test(new_password),
  };

  const is_password_valid = Object.values(password_rules).every(Boolean);

  // Memvalidasi input sebelum proses penggantian password.
  const handle_update_password = () => {
    set_error_message("");
    set_success_message("");

    if (!current_password || !new_password || !confirm_password) {
      set_error_message("Please fill in all password fields.");
      return;
    }

    if (!is_password_valid) {
      set_error_message("Your new password does not meet the requirements.");
      return;
    }

    if (current_password === new_password) {
      set_error_message(
        "Your new password must be different from your current password."
      );
      return;
    }

    if (new_password !== confirm_password) {
      set_error_message("New password and confirmation password do not match.");
      return;
    }

    // Simulasi berhasil. Verifikasi dan penyimpanan sebenarnya dilakukan Laravel.
    set_success_message(
      "Password validation successful. Backend integration is still required to update your password."
    );

    set_current_password("");
    set_new_password("");
    set_confirm_password("");
  };

  // Mengatur ulang semua input password.
  const handle_reset = () => {
    set_current_password("");
    set_new_password("");
    set_confirm_password("");
    set_error_message("");
    set_success_message("");
  };

  // Komponen input password dengan tombol tampil/sembunyikan.
  const PasswordInput = ({
    label,
    value,
    on_change,
    visible,
    on_toggle,
    placeholder,
  }: {
    label: string;
    value: string;
    on_change: (value: string) => void;
    visible: boolean;
    on_toggle: () => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>

      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => {
            on_change(event.target.value);
            set_error_message("");
            set_success_message("");
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500"
        />

        <button
          type="button"
          onClick={on_toggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  // Komponen indikator persyaratan password.
  const Requirement = ({
    fulfilled,
    children,
  }: {
    fulfilled: boolean;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center gap-2 text-sm">
      {fulfilled ? (
        <CheckCircle2 size={16} className="text-green-500" />
      ) : (
        <span className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600" />
      )}

      <span
        className={
          fulfilled
            ? "text-green-600 dark:text-green-400"
            : "text-gray-500 dark:text-gray-400"
        }
      >
        {children}
      </span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Update your account password to keep your account secure.
        </p>
      </div>

      {/* Security Information */}
      <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <ShieldCheck
          size={22}
          className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
        />

        <div>
          <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Keep Your Account Secure
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-blue-700 dark:text-blue-400">
            Choose a strong password that you do not use for other
            accounts. Never share your password with anyone.
          </p>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-3 border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <LockKeyhole size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Password Settings
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your current password and choose a new one.
            </p>
          </div>
        </div>

        <div className="max-w-2xl space-y-6 p-6">
          <PasswordInput
            label="Current Password"
            value={current_password}
            on_change={set_current_password}
            visible={show_current}
            on_toggle={() => set_show_current(!show_current)}
            placeholder="Enter your current password"
          />

          <div className="space-y-4">
            <PasswordInput
              label="New Password"
              value={new_password}
              on_change={set_new_password}
              visible={show_new}
              on_toggle={() => set_show_new(!show_new)}
              placeholder="Enter your new password"
            />

            {/* Password Requirements */}
            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/60">
              <p className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Password Requirements
              </p>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Requirement fulfilled={password_rules.min_length}>
                  At least 8 characters
                </Requirement>

                <Requirement fulfilled={password_rules.uppercase}>
                  At least one uppercase letter
                </Requirement>

                <Requirement fulfilled={password_rules.lowercase}>
                  At least one lowercase letter
                </Requirement>

                <Requirement fulfilled={password_rules.number}>
                  At least one number
                </Requirement>
              </div>
            </div>
          </div>

          <PasswordInput
            label="Confirm New Password"
            value={confirm_password}
            on_change={set_confirm_password}
            visible={show_confirm}
            on_toggle={() => set_show_confirm(!show_confirm)}
            placeholder="Re-enter your new password"
          />

          {/* Password Match Indicator */}
          {confirm_password.length > 0 && (
            <div
              className={`flex items-center gap-2 text-sm ${
                new_password === confirm_password
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {new_password === confirm_password ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertCircle size={16} />
              )}

              {new_password === confirm_password
                ? "Passwords match."
                : "Passwords do not match."}
            </div>
          )}

          {/* Error Message */}
          {error_message && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              {error_message}
            </div>
          )}

          {/* Success Message */}
          {success_message && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              {success_message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-5 dark:border-gray-800">
            <Button
              variant="outline"
              size="md"
              onClick={handle_reset}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handle_update_password}
            >
              <KeyRound size={16} className="mr-2" />
              Update Password
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Note */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={20}
            className="mt-0.5 text-gray-500 dark:text-gray-400"
          />

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Security Reminder
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Your password should remain confidential. The platform
              will verify your current password before accepting a
              password change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
