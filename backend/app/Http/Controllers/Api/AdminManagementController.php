<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Business;
use App\Models\User;
use App\Models\VerificationDocument;
use App\Models\VerificationStatusHistory;
use App\Models\VerificationSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminManagementController extends Controller
{
    private const VERIFICATION_STATUSES = ['pending', 'in_review', 'needs_information', 'approved', 'rejected', 'suspended'];

    public function dashboard()
    {
        return response()->json([
            'users' => User::count(),
            'active_users' => User::where('account_status', 'active')->count(),
            'businesses' => Business::count(),
            'pending_verifications' => VerificationSubmission::whereIn('status', ['pending', 'in_review', 'needs_information'])->count(),
            'approved_businesses' => Business::where('verification_status', 'approved')->count(),
        ]);
    }

    public function users(Request $request)
    {
        $query = User::query()->select(['id', 'name', 'email', 'country', 'role', 'account_status', 'created_at']);
        $this->applySearch($query, $request, ['name', 'email', 'country']);
        foreach (['country', 'role'] as $field) {
            if ($request->filled($field)) $query->where($field, $request->string($field)->toString());
        }
        if ($request->filled('status')) $query->where('account_status', $request->string('status')->toString());
        return response()->json($query->latest()->paginate(min(max((int) $request->input('per_page', 15), 1), 100)));
    }

    public function user(User $user)
    {
        return response()->json($user->only(['id', 'name', 'email', 'country', 'role', 'account_status', 'created_at', 'updated_at']) + [
            'business_memberships' => $user->memberships()->with('business:id,legal_name,country,verification_status')->get(),
        ]);
    }

    public function updateUserStatus(Request $request, User $user)
    {
        $data = $request->validate(['status' => ['required', Rule::in(['active', 'inactive', 'suspended'])]]);
        if ($request->user()->is($user)) {
            return response()->json(['message' => 'Admin tidak dapat mengubah status akunnya sendiri dari panel ini.'], 422);
        }
        $user->update(['account_status' => $data['status']]);
        return response()->json(['message' => 'Status akun berhasil diperbarui.', 'user' => $user->only(['id', 'name', 'email', 'account_status'])]);
    }

    public function businesses(Request $request)
    {
        $query = Business::query()->withCount('memberships');
        $this->applySearch($query, $request, ['legal_name', 'display_name', 'country', 'registration_number', 'email']);
        foreach (['country', 'business_type'] as $field) {
            if ($request->filled($field)) $query->where($field, $request->string($field)->toString());
        }
        if ($request->filled('status')) $query->where('verification_status', $request->string('status')->toString());
        return response()->json($query->latest()->paginate(min(max((int) $request->input('per_page', 15), 1), 100)));
    }

    public function business(Business $business)
    {
        return response()->json($business->load(['memberships.user:id,name,email,role,account_status', 'verificationSubmissions' => fn ($q) => $q->latest()]));
    }

    public function verifications(Request $request)
    {
        $query = VerificationSubmission::query()->with('business:id,legal_name,display_name,country,registration_number,verification_status');
        if ($request->filled('status')) $query->where('status', $request->string('status')->toString());
        if ($request->filled('search')) {
            $term = '%'.$request->string('search')->toString().'%';
            $query->whereHas('business', fn ($q) => $q->where('legal_name', 'like', $term)->orWhere('country', 'like', $term)->orWhere('registration_number', 'like', $term));
        }
        return response()->json($query->latest()->paginate(min(max((int) $request->input('per_page', 15), 1), 100)));
    }

    public function verification(VerificationSubmission $submission)
    {
        return response()->json($submission->load([
            'business', 'documents', 'histories.changedBy:id,name,email', 'submittedBy:id,name,email', 'reviewedBy:id,name,email',
        ]));
    }

    public function updateVerification(Request $request, VerificationSubmission $submission)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(self::VERIFICATION_STATUSES)],
            'admin_notes' => ['nullable', 'string', 'max:10000'],
            'request_message' => ['nullable', 'string', 'max:5000'],
            'documents' => ['sometimes', 'array'],
            'documents.*.id' => ['required_with:documents', 'integer'],
            'documents.*.review_status' => ['required_with:documents', Rule::in(['pending', 'accepted', 'rejected', 'needs_reupload'])],
            'documents.*.review_note' => ['nullable', 'string', 'max:3000'],
        ]);

        $previous = $submission->status;
        DB::transaction(function () use ($request, $submission, $data, $previous) {
            $submission->update([
                'status' => $data['status'],
                'admin_notes' => $data['admin_notes'] ?? $submission->admin_notes,
                'request_message' => $data['request_message'] ?? $submission->request_message,
                'reviewed_by' => $request->user()->id,
                'reviewed_at' => now(),
            ]);
            if ($previous !== $data['status']) {
                VerificationStatusHistory::create([
                    'verification_submission_id' => $submission->id,
                    'from_status' => $previous,
                    'to_status' => $data['status'],
                    'notes' => $data['admin_notes'] ?? $data['request_message'] ?? null,
                    'changed_by' => $request->user()->id,
                ]);
            }
            foreach ($data['documents'] ?? [] as $documentData) {
                VerificationDocument::where('verification_submission_id', $submission->id)
                    ->whereKey($documentData['id'])
                    ->update(['review_status' => $documentData['review_status'], 'review_note' => $documentData['review_note'] ?? null]);
            }
            $submission->business()->update(['verification_status' => $data['status']]);
        });

        return response()->json(['message' => 'Keputusan verifikasi berhasil disimpan.', 'submission' => $submission->fresh()->load('business', 'documents', 'histories')]);
    }

    public function previewDocument(VerificationSubmission $submission, VerificationDocument $document)
    {
        abort_unless($document->verification_submission_id === $submission->id, 404);
        abort_unless(Storage::disk('local')->exists($document->file_path), 404);
        return Storage::disk('local')->response($document->file_path, $document->original_name, [
            'Content-Type' => $document->mime_type ?: 'application/octet-stream',
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, no-store',
        ]);
    }

    private function applySearch($query, Request $request, array $columns): void
    {
        if (!$request->filled('search')) return;
        $term = '%'.$request->string('search')->toString().'%';
        $query->where(function ($builder) use ($columns, $term) {
            foreach ($columns as $column) $builder->orWhere($column, 'like', $term);
        });
    }
}
