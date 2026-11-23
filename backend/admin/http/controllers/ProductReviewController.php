<?php

namespace App\Admin\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends BaseController
{
    public function index(Product $product)
    {
        $reviews = $product->reviews()->orderBy('created_at', 'desc')->get();

        return $this->sendResponse($reviews->toArray(), 'Daftar ulasan produk');
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:0|max:5',
            'comment' => 'required|string',
            'approved' => 'sometimes|boolean',
            'approved_at' => 'sometimes|date',
        ]);

        $validated['product_id'] = $product->id;

        $review = ProductReview::create($validated);

        return $this->sendResponse($review->fresh()->toArray(), 'Ulasan ditambah', 201);
    }

    public function update(Request $request, Product $product, ProductReview $review)
    {
        if ($review->product_id !== $product->id) {
            return $this->sendError('Ulasan tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'rating' => 'sometimes|integer|min:0|max:5',
            'comment' => 'sometimes|required|string',
            'approved' => 'sometimes|boolean',
            'approved_at' => 'sometimes|date',
        ]);

        $review->update($validated);

        return $this->sendResponse($review->fresh()->toArray(), 'Ulasan tersimpan');
    }

    public function destroy(Product $product, ProductReview $review)
    {
        if ($review->product_id !== $product->id) {
            return $this->sendError('Ulasan tidak ditemukan', [], 404);
        }

        $review->delete();

        return $this->sendResponse(null, 'Ulasan dihapus');
    }
}
