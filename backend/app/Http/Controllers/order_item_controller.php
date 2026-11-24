<?php

namespace App\Http\Controllers;

use App\Models\order;
use App\Models\order_item;
use Illuminate\Http\Request;

class order_item_controller extends base_controller
{
    public function index(order $order)
    {
        $items = $order->items()->with('product')->orderBy('sort_order')->get();

        return $this->send_response($items->toArray(), 'Daftar item order');
    }

    public function store(Request $request, order $order)
    {
        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|size:3|default:USD',
            'notes' => 'sometimes|string',
        ]);

        $validated['order_id'] = $order->id;

        $item = order_item::create($validated);

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item order ditambah', 201);
    }

    public function update(Request $request, order $order, order_item $item)
    {
        if ($item->order_id !== $order->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'product_id' => 'sometimes|exists:products,id',
            'product_name' => 'sometimes|string|max:255',
            'quantity' => 'sometimes|integer|min:0',
            'unit_price' => 'sometimes|numeric|min:0',
            'total' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'notes' => 'sometimes|string',
        ]);

        $item->update($validated);

        return $this->send_response($item->fresh()->load('product')->toArray(), 'Item order tersimpan');
    }

    public function destroy(order $order, order_item $item)
    {
        if ($item->order_id !== $order->id) {
            return $this->send_error('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->send_response(null, 'Item order dihapus');
    }
}
