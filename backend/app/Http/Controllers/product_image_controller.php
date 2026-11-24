<?php

namespace App\Http\Controllers;

use App\Models\product;
use App\Models\product_image;
use Illuminate\Http\Request;

class product_image_controller extends base_controller
{
    public function index(product $product)
    {
        $images = $product->images()->orderBy('sort_order')->get();

        return $this->send_response($images->toArray(), 'Daftar gambar produk');
    }

    public function store(Request $request, product $product)
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
            $max = product_image::where('product_id', $product->id)->max('sort_order');
            $validated['sort_order'] = ($max ?? 0) + 1;
        }

        $image = product_image::create($validated);

        return $this->send_response($image->fresh()->toArray(), 'Gambar ditambah', 201);
    }

    public function update(Request $request, product $product, product_image $image)
    {
        if ($image->product_id !== $product->id) {
            return $this->send_error('Gambar tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'url' => 'sometimes|required|string|max:255',
            'alt' => 'sometimes|string|max:255',
            'sort_order' => 'sometimes|integer|min:0',
            'is_primary' => 'sometimes|boolean',
        ]);

        $image->update($validated);

        return $this->send_response($image->fresh()->toArray(), 'Gambar tersimpan');
    }

    public function destroy(product $product, product_image $image)
    {
        if ($image->product_id !== $product->id) {
            return $this->send_error('Gambar tidak ditemukan', [], 404);
        }

        $image->delete();

        return $this->send_response(null, 'Gambar dihapus');
    }
}
