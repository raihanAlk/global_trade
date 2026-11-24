
"use client";

import { useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Pencil,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

import Button from "@/src/components/ui/button";
import Input from "@/src/components/ui/input";

// Data sementara untuk simulasi akun yang sedang login.
const initial_profile = {
  full_name: "Budi Santoso",
  email: "budi.santoso@email.com",
  phone_number: "+62 812 3456 7890",
  company: "GlobalTrade Hub",
};

export default function AccountInformationPage() {
  const [profile, set_profile] = useState(initial_profile);
  const [is_editing, set_is_editing] = useState(false);
  const [is_saved, set_is_saved] = useState(false);

  // Mengubah data profil berdasarkan input yang diedit.
  const handle_change = (field: keyof typeof profile, value: string) => {
    set_profile((previous) => ({
      ...previous,
      [field]: value,
    }));

    set_is_saved(false);
  };

  // Menyimpan perubahan sementara di state frontend.
  const handle_save = () => {
    set_is_editing(false);
    set_is_saved(true);
  };

  // Membatalkan perubahan dan mengembalikan data sebelumnya.
  const handle_cancel = () => {
    set_profile(initial_profile);
    set_is_editing(false);
    set_is_saved(false);
  };

  const initials = profile.full_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Information
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your personal information and account details.
          </p>
        </div>

        {!is_editing ? (
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              set_is_saved(false);
              set_is_editing(true);
            }}
          >
            <Pencil size={16} className="mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handle_cancel}
            >
              <X size={16} className="mr-2" />
              Cancel
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handle_save}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Success Message */}
      {is_saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400">
          <CheckCircle2 size={18} />
          Profile changes saved successfully.
        </div>
      )}

      {/* Profile Overview */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {initials || <UserRound size={32} />}
          </div>

          <div className="space-y-2">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {profile.full_name || "Your Name"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Super Administrator
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Personal Information
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your personal account information.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <Input
            label="Full Name"
            name="full_name"
            value={profile.full_name}
            onChange={(event) =>
              handle_change("full_name", event.target.value)
            }
            disabled={!is_editing}
            size="md"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={profile.email}
            onChange={(event) =>
              handle_change("email", event.target.value)
            }
            disabled={!is_editing}
            size="md"
          />

          <Input
            label="Phone Number"
            name="phone_number"
            value={profile.phone_number}
            onChange={(event) =>
              handle_change("phone_number", event.target.value)
            }
            disabled={!is_editing}
            size="md"
          />

          <Input
            label="Company / Organization"
            name="company"
            value={profile.company}
            onChange={(event) =>
              handle_change("company", event.target.value)
            }
            disabled={!is_editing}
            size="md"
          />
        </div>
      </div>

      {/* Account Details */}
      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-6 py-5 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Account Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your account role and status.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Role
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
              <ShieldCheck size={17} className="text-blue-600" />
              Super Administrator
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Status
            </p>
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Active
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Account Type
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Administrator Account
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
              Platform
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              GlobalTrade Hub
            </p>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="flex gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <Building2
          size={20}
          className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
        />

        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            Account Information
          </p>
          <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
            Your account details are displayed here. Some information,
            such as your role and account status, is managed by the
            platform administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
