<?php

namespace App\Admin\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;

class ProductImageController extends BaseController
{
    public function index(Product $product)
    {
        $images = $product->images()->orderBy('sort_order')->get();

        return $this->sendResponse($images->toArray(), 'Daftar gambar produk');
    }

    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'url' => 'required|string|max:255',
            'alt' => 'sometimes|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
            'is_primary' => 'sometimes|boolean',
        ]);

        $validated['product_id'] = $product->id;

        if (! $validated['is_primary']) {
            $validated['is_primary'] = false;
        }

        if (! $validated['sort_order']) {
            $max = ProductImage::where('product_id', $product->id)->max('sort_order');
            $validated['sort_order'] = ($max ?? 0) + 1;
        }

        $image = ProductImage::create($validated);

        return $this->sendResponse($image->fresh()->toArray(), 'Gambar ditambah', 201);
    }

    public function update(Request $request, Product $product, ProductImage $image)
    {
        if ($image->product_id !== $product->id) {
            return $this->sendError('Gambar tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'url' => 'sometimes|required|string|max:255',
            'alt' => 'sometimes|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
            'is_primary' => 'sometimes|boolean',
        ]);

        $image->update($validated);

        return $this->sendResponse($image->fresh()->toArray(), 'Gambar tersimpan');
    }

    public function destroy(Product $product, ProductImage $image)
    {
        if ($image->product_id !== $product->id) {
            return $this->sendError('Gambar tidak ditemukan', [], 404);
        }

        $image->delete();

        return $this->sendResponse(null, 'Gambar dihapus');
    }
}
