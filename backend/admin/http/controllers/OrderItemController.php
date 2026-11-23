<?php

namespace App\Admin\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends BaseController
{
    public function index(Order $order)
    {
        $items = $order->items()->with('product')->orderBy('sort_order')->get();

        return $this->sendResponse($items->toArray(), 'Daftar item order');
    }

    public function store(Request $request, Order $order)
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

        $item = OrderItem::create($validated);

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item order ditambah', 201);
    }

    public function update(Request $request, Order $order, OrderItem $item)
    {
        if ($item->order_id !== $order->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
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

        return $this->sendResponse($item->fresh()->load('product')->toArray(), 'Item order tersimpan');
    }

    public function destroy(Order $order, OrderItem $item)
    {
        if ($item->order_id !== $order->id) {
            return $this->sendError('Item tidak ditemukan', [], 404);
        }

        $item->delete();

        return $this->sendResponse(null, 'Item order dihapus');
    }
}
