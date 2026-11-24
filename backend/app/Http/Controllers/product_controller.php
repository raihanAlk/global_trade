<?php

namespace App\Http\Controllers;

use App\Models\product;
use Illuminate\Http\Request;

class product_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = product::query();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('company_id')) {
            $query->where('company_id', $request->input('company_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('search')) {
            $query->where('name', 'like', '%'.$request->input('search').'%');
        }

        $products = $query->with('category', 'company')->orderBy('created_at', 'desc')->get();

        return $this->send_response($products->toArray(), 'Daftar produk');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'currency' => 'sometimes|string|size:3|default:USD',
            'moq' => 'required|integer|min:0',
            'origin_country' => 'required|string|max:100',
            'category_id' => 'required|exists:categories,id',
            'company_id' => 'required|exists:companies,id',
            'status' => 'sometimes|string|max:255',
        ]);

        $product = product::create($validated);

        return $this->send_response(
            $product->fresh()->load('category', 'company')->toArray(),
            'Produk ditambah',
            201
        );
    }

    public function show(product $product)
    {
        $data = $product->toArray();

        $data['images'] = $product->images()
            ->orderBy('sort_order')
            ->get()
            ->toArray();

        $data['reviews'] = $product->reviews()
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->toArray();

        $data['item_counts'] = [
            'rfq' => $product->rfq_items()->count(),
            'quotation' => $product->quotation_items()->count(),
            'order' => $product->order_items()->count(),
        ];

        return $this->send_response($data, 'Detail produk');
    }

    public function update(Request $request, product $product)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'currency' => 'sometimes|string|size:3',
            'moq' => 'sometimes|required|integer|min:0',
            'origin_country' => 'sometimes|required|string|max:100',
            'category_id' => 'sometimes|required|exists:categories,id',
            'company_id' => 'sometimes|required|exists:companies,id',
            'status' => 'sometimes|string|max:255',
        ]);

        $product->update($validated);

        return $this->send_response(
            $product->fresh()->load('category', 'company')->toArray(),
            'Produk tersimpan'
        );
    }

    public function destroy(product $product)
    {
        $product->delete();

        return $this->send_response(null, 'Produk dihapus');
    }

    public function approve(product $product)
    {
        $product->status = 'approved';
        $product->reviewed_by = auth()->id() ?? null;
        $product->reviewed_at = now();
        $product->save();

        return $this->send_response(
            $product->fresh()->load('category', 'company')->toArray(),
            'Produk disetujui'
        );
    }

    public function reject(product $product)
    {
        $product->status = 'rejected';
        $product->reviewed_by = auth()->id() ?? null;
        $product->reviewed_at = now();
        $product->save();

        return $this->send_response(
            $product->fresh()->load('category', 'company')->toArray(),
            'Produk ditolak'
        );
    }

    public function request_changes(product $product)
    {
        $product->status = 'changes_requested';
        $product->reviewed_by = auth()->id() ?? null;
        $product->reviewed_at = now();
        $product->save();

        return $this->send_response(
            $product->fresh()->load('category', 'company')->toArray(),
            'Permintaan perubahan dikirim'
        );
    }
}
