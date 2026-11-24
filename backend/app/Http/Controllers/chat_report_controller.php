<?php

namespace App\Http\Controllers;

use App\Models\chat_report;
use Illuminate\Http\Request;

class chat_report_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = chat_report::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('reason')) {
            $query->where('reason', $request->input('reason'));
        }

        $reports = $query->orderBy('created_at', 'desc')->get();

        return $this->send_response($reports->toArray(), 'Daftar laporan chat');
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

        $report = chat_report::create($validated);

        return $this->send_response($report->fresh()->toArray(), 'Laporan ditambah', 201);
    }

    public function show(chat_report $chat_report)
    {
        return $this->send_response($chat_report->toArray(), 'Detail laporan');
    }

    public function update(Request $request, chat_report $chat_report)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,under_review,resolved',
            'notes' => 'sometimes|string',
        ]);

        $chat_report->update($validated);

        return $this->send_response($chat_report->fresh()->toArray(), 'Laporan tersimpan');
    }

    public function destroy(chat_report $chat_report)
    {
        $chat_report->delete();

        return $this->send_response(null, 'Laporan dihapus');
    }

    public function status(Request $request, chat_report $report)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,under_review,resolved',
        ]);

        $report->update($validated);

        return $this->send_response($report->fresh()->toArray(), 'Status laporan diperbarui');
    }

    public function moderate(Request $request, chat_report $report)
    {
        $validated = $request->validate([
            'status' => 'sometimes|in:pending,under_review,resolved',
            'notes' => 'sometimes|string',
            'moderator_id' => 'sometimes|exists:users,id',
        ]);

        $report->update($validated);

        return $this->send_response($report->fresh()->toArray(), 'Catatan moderasi disimpan');
    }
}
