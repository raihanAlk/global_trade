<?php

namespace App\Http\Controllers;

use App\Models\rfq_item;
use App\Models\rfq_request;
use Illuminate\Http\Request;

class rfq_item_controller extends base_controller
{
    public function index(rfq_request $rfq)
    {
        $items = $rfq->items()->with('product')->orderBy('sort_order')->get();

        return $this->send_response($items->toArray(), 'Daftar item RFQ');
    }

    public function store(Request $request, rfq_request $rfq)
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

        $item = rfq_item::create($validated);

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item RFQ ditambah', 201);
    }

    public function update(Request $request, rfq_request $rfq, rfq_item $item)
    {
        if ($item->rfq_id !== $rfq->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
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

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item RFQ tersimpan');
    }

    public function destroy(rfq_request $rfq, rfq_item $item)
    {
        if ($item->rfq_id !== $rfq->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->send_response(null, 'Item RFQ dihapus');
    }
}
