<?php

namespace App\Http\Controllers;

use App\Models\product;
use App\Models\product_review;
use Illuminate\Http\Request;

class product_review_controller extends base_controller
{
    public function index(product $product)
    {
        $reviews = $product->reviews()->orderBy('created_at', 'desc')->get();

        return $this->send_response($reviews->toArray(), 'Daftar ulasan produk');
    }

    public function store(Request $request, product $product)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:0|max:5',
            'comment' => 'required|string',
            'approved' => 'sometimes|boolean',
            'approved_at' => 'sometimes|date',
        ]);

        $validated['product_id'] = $product->id;

        $review = product_review::create($validated);

        return $this->send_response($review->fresh()->toArray(), 'Ulasan ditambah', 201);
    }

    public function update(Request $request, product $product, product_review $review)
    {
        if ($review->product_id !== $product->id) {
            return $this->send_error('Ulasan tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'rating' => 'sometimes|integer|min:0|max:5',
            'comment' => 'sometimes|required|string',
            'approved' => 'sometimes|boolean',
            'approved_at' => 'sometimes|date',
        ]);

        $review->update($validated);

        return $this->send_response($review->fresh()->toArray(), 'Ulasan tersimpan');
    }

    public function destroy(product $product, product_review $review)
    {
        if ($review->product_id !== $product->id) {
            return $this->send_error('Ulasan tidak ditemukan', [], 404);
        }

        $review->delete();

        return $this->send_response(null, 'Ulasan dihapus');
    }
}
