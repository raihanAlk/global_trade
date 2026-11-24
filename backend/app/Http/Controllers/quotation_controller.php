<?php

namespace App\Http\Controllers;

use App\Models\quotation;
use Illuminate\Http\Request;

class quotation_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = quotation::query();

        if ($request->has('supplier_company_id')) {
            $query->where('supplier_company_id', $request->input('supplier_company_id'));
        }

        if ($request->has('importer_company_id')) {
            $query->where('importer_company_id', $request->input('importer_company_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('currency')) {
            $query->where('currency', $request->input('currency'));
        }

        $quotations = $query->with('supplier', 'importer')->orderBy('created_at', 'desc')->get();

        return $this->send_response($quotations->toArray(), 'Daftar quotation');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_company_id' => 'required|exists:companies,id',
            'importer_company_id' => 'required|exists:companies,id',
            'currency' => 'sometimes|string|size:3|default:USD',
            'validity_date' => 'sometimes|date',
            'status' => 'sometimes|in:draft,sent,accepted,rejected,expired',
            'expires_at' => 'sometimes|date',
            'notes' => 'sometimes|string',
        ]);

        $quotation = quotation::create($validated);

        return $this->send_response(
            $quotation->fresh()->load('supplier', 'importer')->toArray(),
            'quotation ditambah',
            201
        );
    }

    public function show(quotation $quotation)
    {
        return $this->send_response(
            $quotation->load('supplier', 'importer', 'items.product')->toArray(),
            'Detail quotation'
        );
    }

    public function update(Request $request, quotation $quotation)
    {
        $validated = $request->validate([
            'supplier_company_id' => 'sometimes|exists:companies,id',
            'importer_company_id' => 'sometimes|exists:companies,id',
            'currency' => 'sometimes|string|size:3',
            'validity_date' => 'sometimes|date',
            'status' => 'sometimes|in:draft,sent,accepted,rejected,expired',
            'expires_at' => 'sometimes|date',
            'notes' => 'sometimes|string',
        ]);

        $quotation->update($validated);

        return $this->send_response(
            $quotation->fresh()->load('supplier', 'importer', 'items.product')->toArray(),
            'quotation tersimpan'
        );
    }

    public function destroy(quotation $quotation)
    {
        $quotation->delete();

        return $this->send_response(null, 'quotation dihapus');
    }

    public function status(Request $request, quotation $quotation)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,accepted,rejected,expired',
        ]);

        $quotation->update($validated);

        return $this->send_response(
            $quotation->fresh()->load('supplier', 'importer')->toArray(),
            'Status quotation diperbarui'
        );
    }
}
