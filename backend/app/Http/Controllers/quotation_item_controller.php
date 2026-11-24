<?php

namespace App\Http\Controllers;

use App\Models\quotation;
use App\Models\quotation_item;
use Illuminate\Http\Request;

class quotation_item_controller extends base_controller
{
    public function index(quotation $quotation)
    {
        $items = $quotation->items()->with('product')->orderBy('sort_order')->get();

        return $this->send_response($items->toArray(), 'Daftar item quotation');
    }

    public function store(Request $request, quotation $quotation)
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

        $item = quotation_item::create($validated);

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item quotation ditambah', 201);
    }

    public function update(Request $request, quotation $quotation, quotation_item $item)
    {
        if ($item->quotation_id !== $quotation->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
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

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item quotation tersimpan');
    }

    public function destroy(quotation $quotation, quotation_item $item)
    {
        if ($item->quotation_id !== $quotation->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->send_response(null, 'Item quotation dihapus');
    }
}
