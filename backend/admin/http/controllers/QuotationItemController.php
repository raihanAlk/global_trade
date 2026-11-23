<?php

namespace App\Admin\Http\Controllers;

use App\Models\Quotation;
use App\Models\QuotationItem;
use Illuminate\Http\Request;

class QuotationItemController extends BaseController
{
    public function index(Quotation $quotation)
    {
        $items = $quotation->items()->with('product')->orderBy('sort_order')->get();

        return $this->sendResponse($items->toArray(), 'Daftar item quotation');
    }

    public function store(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|size:3|default:USD',
            'total' => 'sometimes|numeric|min:0',
            'notes' => 'sometimes|string',
        ]);

        $validated['quotation_id'] = $quotation->id;

        $item = QuotationItem::create($validated);

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item quotation ditambah', 201);
    }

    public function update(Request $request, Quotation $quotation, QuotationItem $item)
    {
        if ($item->quotation_id !== $quotation->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:0',
            'unit_price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'total' => 'sometimes|numeric|min:0',
            'notes' => 'sometimes|string',
        ]);

        $item->update($validated);

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item quotation tersimpan');
    }

    public function destroy(Quotation $quotation, QuotationItem $item)
    {
        if ($item->quotation_id !== $quotation->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->sendResponse(null, 'Item quotation dihapus');
    }
}
