<?php

namespace App\Admin\Http\Controllers;

use App\Models\RFQRequest;
use App\Models\RFQItem;
use Illuminate\Http\Request;

class RFQItemController extends BaseController
{
    public function index(RFQRequest $rfq)
    {
        $items = $rfq->items()->with('product')->orderBy('sort_order')->get();

        return $this->sendResponse($items->toArray(), 'Daftar item RFQ');
    }

    public function store(Request $request, RFQRequest $rfq)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|size:3|default:USD',
            'notes' => 'sometimes|string',
        ]);

        $validated['rfq_id'] = $rfq->id;

        $item = RFQItem::create($validated);

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item RFQ ditambah', 201);
    }

    public function update(Request $request, RFQRequest $rfq, RFQItem $item)
    {
        if ($item->rfq_id !== $rfq->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:0',
            'unit_price' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'notes' => 'sometimes|string',
        ]);

        $item->update($validated);

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item RFQ tersimpan');
    }

    public function destroy(RFQRequest $rfq, RFQItem $item)
    {
        if ($item->rfq_id !== $rfq->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->sendResponse(null, 'Item RFQ dihapus');
    }
}
