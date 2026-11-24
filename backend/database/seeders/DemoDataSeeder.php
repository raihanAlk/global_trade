<?php

namespace Database\Seeders;

use App\Models\Business;
use App\Models\BusinessMembership;
use App\Models\User;
use App\Models\VerificationDocument;
use App\Models\VerificationStatusHistory;
use App\Models\VerificationSubmission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class DemoDataSeeder extends Seeder
{
    /**
     * Membuat data DEMO yang aman dijalankan berulang kali.
     * Tidak menghapus data yang sudah ada dan hanya mengubah record
     * dengan alamat email / nomor registrasi khusus demo.
     */
    public function run(): void
    {
        $countries = [
            'Indonesia', 'United States', 'Germany', 'Japan', 'Singapore',
            'Australia', 'Malaysia', 'Thailand', 'United Kingdom', 'Canada',
        ];

        $firstNames = [
            'Andi', 'Budi', 'Citra', 'Dewi', 'Eko',
            'Farah', 'Gilang', 'Hana', 'Irfan', 'Jasmine',
            'Kevin', 'Lina', 'Made', 'Nadia', 'Oscar',
            'Putri', 'Rizky', 'Sinta', 'Taufik', 'Vina',
        ];

        $users = [];
        foreach ($firstNames as $index => $firstName) {
            $number = $index + 1;
            $users[] = User::updateOrCreate(
                ['email' => sprintf('demo.user%02d@example.test', $number)],
                [
                    'name' => $firstName . ' Demo',
                    'country' => $countries[$index % count($countries)],
                    'role' => $number % 2 === 0 ? 'exporter' : 'importer',
                    'account_status' => match ($number % 7) {
                        0 => 'suspended',
                        5 => 'inactive',
                        default => 'active',
                    },
                    'password' => Hash::make('DemoUser123!'),
                ]
            );
        }

        $businessNames = [
            'Nusantara Agro Export', 'Pacific Trade Solutions', 'Berlin Industrial Supply',
            'Sakura Electronics Trading', 'Lion City Foods Pte Ltd', 'Southern Cross Imports',
            'Kuala Lumpur Global Goods', 'Bangkok Textile Export', 'Britannia Wholesale Ltd',
            'Maple Leaf Trading Inc',
        ];

        $statuses = [
            'pending', 'pending',
            'in_review', 'in_review',
            'needs_information', 'needs_information',
            'approved', 'approved',
            'rejected', 'suspended',
        ];

        $admin = User::where('role', 'admin')->where('account_status', 'active')->first();

        foreach ($businessNames as $index => $businessName) {
            $number = $index + 1;
            $owner = $users[($index * 2) % count($users)];
            $status = $statuses[$index];

            $business = Business::updateOrCreate(
                ['registration_number' => sprintf('DEMO-REG-%04d', $number)],
                [
                    'legal_name' => $businessName,
                    'display_name' => str_replace([' Export', ' Trading', ' Supply', ' Imports', ' Wholesale'], '', $businessName),
                    'country' => $countries[$index],
                    'business_type' => $index % 2 === 0 ? 'Exporter' : 'Importer',
                    'email' => sprintf('contact%02d@example.test', $number),
                    'phone' => sprintf('+1000000%04d', $number),
                    'website' => sprintf('https://company%02d.example.test', $number),
                    'address' => 'Demo business address ' . $number,
                    'description' => 'Dummy company record for testing the GlobalTrade Hub admin panel.',
                    'verification_status' => $status,
                ]
            );

            BusinessMembership::updateOrCreate(
                ['business_id' => $business->id, 'user_id' => $owner->id],
                ['membership_role' => 'owner', 'status' => 'active']
            );

            $submission = VerificationSubmission::updateOrCreate(
                ['business_id' => $business->id],
                [
                    'submitted_by' => $owner->id,
                    'status' => $status,
                    'admin_notes' => $status === 'approved'
                        ? 'Demo review completed. Documents accepted.'
                        : ($status === 'rejected' ? 'Demo rejection: submitted information could not be verified.' : null),
                    'request_message' => $status === 'needs_information'
                        ? 'Please provide an updated supporting document.'
                        : null,
                    'reviewed_by' => in_array($status, ['in_review', 'needs_information', 'approved', 'rejected', 'suspended'], true)
                        ? $admin?->id
                        : null,
                    'reviewed_at' => in_array($status, ['in_review', 'needs_information', 'approved', 'rejected', 'suspended'], true)
                        ? now()->subDays($number)
                        : null,
                ]
            );

            $documentReviewStatus = match ($status) {
                'approved' => 'accepted',
                'rejected', 'suspended' => 'rejected',
                'needs_information' => 'needs_reupload',
                default => 'pending',
            };

            foreach ([
                ['type' => 'Business Registration', 'file' => 'business-registration.txt'],
                ['type' => 'Company Profile', 'file' => 'company-profile.txt'],
            ] as $documentIndex => $documentInfo) {
                $relativePath = sprintf(
                    'demo-verification/submission-%d/document-%d.txt',
                    $submission->id,
                    $documentIndex + 1
                );

                Storage::disk('local')->put(
                    $relativePath,
                    "GLOBALTRADE HUB - DEMO DOCUMENT\n"
                    . "Company: {$business->legal_name}\n"
                    . "Document: {$documentInfo['type']}\n"
                    . "Registration: {$business->registration_number}\n"
                    . "This is fictional test data. It is not an official business document.\n"
                );

                VerificationDocument::updateOrCreate(
                    [
                        'verification_submission_id' => $submission->id,
                        'document_type' => $documentInfo['type'],
                    ],
                    [
                        'original_name' => $documentInfo['file'],
                        'file_path' => $relativePath,
                        'mime_type' => 'text/plain',
                        'review_status' => $documentReviewStatus,
                        'review_note' => $status === 'needs_information'
                            ? 'Please upload a clearer or updated version.'
                            : null,
                    ]
                );
            }

            VerificationStatusHistory::updateOrCreate(
                [
                    'verification_submission_id' => $submission->id,
                    'to_status' => $status,
                ],
                [
                    'from_status' => null,
                    'notes' => 'Initial demo submission status.',
                    'changed_by' => $admin?->id,
                ]
            );
        }
    }
}
