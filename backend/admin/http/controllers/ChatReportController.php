<?php

namespace App\Admin\Http\Controllers;

use App\Models\ChatReport;
use Illuminate\Http\Request;

class ChatReportController extends BaseController
{
    public function index(Request $request)
    {
        $query = ChatReport::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('reason')) {
            $query->where('reason', $request->input('reason'));
        }

        $reports = $query->orderBy('created_at', 'desc')->get();

        return $this->sendResponse($reports->toArray(), 'Daftar laporan chat');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'conversation_id' => 'sometimes|string|max:255',
            'reported_user_name' => 'required|string|max:255',
            'reporter_name' => 'required|string|max:255',
            'reason' => 'sometimes|in:spam,harassment,fraud,inappropriate,other',
            'notes' => 'sometimes|string',
            'moderator_id' => 'sometimes|exists:users,id',
        ]);

        $report = ChatReport::create($validated);

        return $this->sendResponse($report->fresh()->toArray(), 'Laporan ditambah', 201);
    }

    public function show(ChatReport $report)
    {
        return $this->sendResponse($report->toArray(), 'Detail laporan');
    }

    public function update(Request $request, ChatReport $report)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,under_review,resolved',
            'notes' => 'sometimes|string',
        ]);

        $report->update($validated);

        return $this->sendResponse($report->fresh()->toArray(), 'Laporan tersimpan');
    }

    public function destroy(ChatReport $report)
    {
        $report->delete();

        return $this->sendResponse(null, 'Laporan dihapus');
    }

    public function status(Request $request, ChatReport $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,under_review,resolved',
        ]);

        $report->update($validated);

        return $this->sendResponse($report->fresh()->toArray(), 'Status laporan diperbarui');
    }

    public function moderate(Request $request, ChatReport $report)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,under_review,resolved',
            'notes' => 'sometimes|string',
            'moderator_id' => 'sometimes|exists:users,id',
        ]);

        $report->update($validated);

        return $this->sendResponse($report->fresh()->toArray(), 'Catatan moderasi disimpan');
    }
}
