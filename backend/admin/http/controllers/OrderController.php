<?php

namespace App\Admin\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends BaseController
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('buyer_company_id')) {
            $query->where('buyer_company_id', $request->input('buyer_company_id'));
        }

        if ($request->has('seller_company_id')) {
            $query->where('seller_company_id', $request->input('seller_company_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('order_date')) {
            $query->whereDate('order_date', $request->input('order_date'));
        }

        $orders = $query->with('buyer', 'seller')->orderBy('order_date', 'desc')->get();

        return $this->sendResponse($orders->toArray(), 'Daftar order');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_no' => 'required|string|max:255|unique:orders',
            'buyer_company_id' => 'required|exists:companies,id',
            'seller_company_id' => 'required|exists:companies,id',
            'total_value' => 'sometimes|numeric|min:0|default:0.00',
            'currency' => 'sometimes|string|size:3|default:USD',
            'order_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,confirmed,shipped,delivered,cancelled',
            'expected_delivery' => 'sometimes|date',
        ]);

        $order = Order::create($validated);

        return $this->sendResponse(
            $order->fresh()->load('buyer', 'seller')->toArray(),
            'Order ditambah',
            201
        );
    }

    public function show(Order $order)
    {
        return $this->sendResponse(
            $order->load('buyer', 'seller', 'items.product')->toArray(),
            'Detail order'
        );
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'transaction_no' => 'sometimes|required|string|max:255|unique:orders,transaction_no,' . $order->id,
            'buyer_company_id' => 'sometimes|exists:companies,id',
            'seller_company_id' => 'sometimes|exists:companies,id',
            'total_value' => 'sometimes|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'order_date' => 'sometimes|date',
            'status' => 'sometimes|in:pending,confirmed,shipped,delivered,cancelled',
            'expected_delivery' => 'sometimes|date',
        ]);

        $order->update($validated);

        return $this->sendResponse(
            $order->fresh()->load('buyer', 'seller', 'items.product')->toArray(),
            'Order tersimpan'
        );
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return $this->sendResponse(null, 'Order dihapus');
    }

    public function status(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,shipped,delivered,cancelled',
        ]);

        $order->update($validated);

        return $this->sendResponse(
            $order->fresh()->load('buyer', 'seller')->toArray(),
            'Status order diperbarui'
        );
    }
}
