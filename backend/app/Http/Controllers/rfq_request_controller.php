<?php

namespace App\Http\Controllers;

use App\Models\rfq_request;
use Illuminate\Http\Request;

class rfq_request_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = rfq_request::query();

        if ($request->has('supplier_company_id')) {
            $query->where('supplier_company_id', $request->input('supplier_company_id'));
        }

        if ($request->has('importer_company_id')) {
            $query->where('importer_company_id', $request->input('importer_company_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('destination_country')) {
            $query->where('destination_country', $request->input('destination_country'));
        }

        $rfqs = $query->with('supplier', 'importer')->orderBy('created_at', 'desc')->get();

        return $this->send_response($rfqs->toArray(), 'Daftar permintaan RFQ');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_company_id' => 'required|exists:companies,id',
            'importer_company_id' => 'required|exists:companies,id',
            'destination_country' => 'required|string|max:100',
            'quantity' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:draft,pending,approved,negotiating,closed',
            'expires_at' => 'sometimes|date',
            'notes' => 'sometimes|string',
        ]);

        $rfq = rfq_request::create($validated);

        return $this->send_response(
            $rfq->fresh()->load('supplier', 'importer')->toArray(),
            'Permintaan RFQ ditambah',
            201
        );
    }

    public function show(rfq_request $rfq_request)
    {
        return $this->send_response(
            $rfq_request->load('supplier', 'importer', 'items.product')->toArray(),
            'Detail permintaan RFQ'
        );
    }

    public function update(Request $request, rfq_request $rfq_request)
    {
        $validated = $request->validate([
            'supplier_company_id' => 'sometimes|exists:companies,id',
            'importer_company_id' => 'sometimes|exists:companies,id',
            'destination_country' => 'sometimes|required|string|max:100',
            'quantity' => 'sometimes|integer|min:0',
            'status' => 'sometimes|in:draft,pending,approved,negotiating,closed',
            'expires_at' => 'sometimes|date',
            'notes' => 'sometimes|string',
        ]);

        $rfq_request->update($validated);

        return $this->send_response(
            $rfq_request->fresh()->load('supplier', 'importer', 'items.product')->toArray(),
            'Permintaan RFQ tersimpan'
        );
    }

    public function destroy(rfq_request $rfq_request)
    {
        $rfq_request->delete();

        return $this->send_response(null, 'Permintaan RFQ dihapus');
    }

    public function status(Request $request, rfq_request $rfq)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,pending,approved,negotiating,closed',
        ]);

        $rfq->update($validated);

        return $this->send_response(
            $rfq->fresh()->load('supplier', 'importer')->toArray(),
            'Status permintaan RFQ diperbarui'
        );
    }
}
