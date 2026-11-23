<?php

namespace App\Admin\Http\Controllers;

use App\Models\RFQRequest;
use Illuminate\Http\Request;

class RFQRequestController extends BaseController
{
    public function index(Request $request)
    {
        $query = RFQRequest::query();

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

        return $this->sendResponse($rfqs->toArray(), 'Daftar permintaan RFQ');
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

        $rfq = RFQRequest::create($validated);

        return $this->sendResponse(
            $rfq->fresh()->load('supplier', 'importer')->toArray(),
            'Permintaan RFQ ditambah',
            201
        );
    }

    public function show(RFQRequest $rfq)
    {
        return $this->sendResponse(
            $rfq->load('supplier', 'importer', 'items.product')->toArray(),
            'Detail permintaan RFQ'
        );
    }

    public function update(Request $request, RFQRequest $rfq)
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

        $rfq->update($validated);

        return $this->sendResponse(
            $rfq->fresh()->load('supplier', 'importer', 'items.product')->toArray(),
            'Permintaan RFQ tersimpan'
        );
    }

    public function destroy(RFQRequest $rfq)
    {
        $rfq->delete();

        return $this->sendResponse(null, 'Permintaan RFQ dihapus');
    }

    public function status(Request $request, RFQRequest $rfq)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,pending,approved,negotiating,closed',
        ]);

        $rfq->update($validated);

        return $this->sendResponse(
            $rfq->fresh()->load('supplier', 'importer')->toArray(),
            'Status permintaan RFQ diperbarui'
        );
    }
}
