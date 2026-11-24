<?php

namespace App\Http\Controllers;

use App\Models\category;
use Illuminate\Http\Request;

class category_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = category::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $categories = $query->orderBy('slug')->get();

        return $this->send_response($categories->toArray(), 'Daftar kategori');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:255|unique:categories',
            'parent_id' => 'sometimes|nullable|exists:categories,id',
            'status' => 'sometimes|in:active,inactive',
            'description' => 'sometimes|string',
            'product_count' => 'sometimes|integer|min:0',
        ]);

        $category = category::create($validated);

        return $this->send_response($category->fresh()->toArray(), 'Kategori ditambah', 201);
    }

    public function show(category $category)
    {
        return $this->send_response(
            $category->load('parent', 'children', 'products')->toArray(),
            'Detail kategori'
        );
    }

    public function update(Request $request, category $category)
    {
        $validated = $request->validate([
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,'.$category->id,
            'parent_id' => 'sometimes|nullable|exists:categories,id',
            'status' => 'sometimes|in:active,inactive',
            'description' => 'sometimes|string',
            'product_count' => 'sometimes|integer|min:0',
        ]);

        $category->update($validated);

        return $this->send_response(
            $category->fresh()->load('parent', 'children', 'products')->toArray(),
            'Kategori tersimpan'
        );
    }

    public function destroy(category $category)
    {
        $category->delete();

        return $this->send_response(null, 'Kategori dihapus');
    }

    public function count_products(category $category)
    {
        $count = $category->products()->count();

        return $this->send_response(['product_count' => $count], 'Terhitung');
    }
}
