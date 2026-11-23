<?php

namespace App\Admin\Http\Controllers;

use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends BaseController
{
    public function index(Request $request)
    {
        $query = Quotation::query();

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

        return $this->sendResponse($quotations->toArray(), 'Daftar quotation');
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

        $quotation = Quotation::create($validated);

        return $this->sendResponse(
            $quotation->fresh()->load('supplier', 'importer')->toArray(),
            'Quotation ditambah',
            201
        );
    }

    public function show(Quotation $quotation)
    {
        return $this->sendResponse(
            $quotation->load('supplier', 'importer', 'items.product')->toArray(),
            'Detail quotation'
        );
    }

    public function update(Request $request, Quotation $quotation)
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

        return $this->sendResponse(
            $quotation->fresh()->load('supplier', 'importer', 'items.product')->toArray(),
            'Quotation tersimpan'
        );
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return $this->sendResponse(null, 'Quotation dihapus');
    }

    public function status(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,accepted,rejected,expired',
        ]);

        $quotation->update($validated);

        return $this->sendResponse(
            $quotation->fresh()->load('supplier', 'importer')->toArray(),
            'Status quotation diperbarui'
        );
    }
}
