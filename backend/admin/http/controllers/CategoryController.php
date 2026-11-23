<?php

namespace App\Admin\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends BaseController
{
    public function index(Request $request)
    {
        $query = Category::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $categories = $query->orderBy('slug')->get();

        return $this->sendResponse($categories->toArray(), 'Daftar kategori');
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

        $category = Category::create($validated);

        return $this->sendResponse($category->fresh()->toArray(), 'Kategori ditambah', 201);
    }

    public function show(Category $category)
    {
        return $this->sendResponse(
            $category->load('parent', 'children', 'products')->toArray(),
            'Detail kategori'
        );
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'slug' => 'sometimes|required|string|max:255|unique:categories,slug,' . $category->id,
            'parent_id' => 'sometimes|nullable|exists:categories,id',
            'status' => 'sometimes|in:active,inactive',
            'description' => 'sometimes|string',
            'product_count' => 'sometimes|integer|min:0',
        ]);

        $category->update($validated);

        return $this->sendResponse(
            $category->fresh()->load('parent', 'children', 'products')->toArray(),
            'Kategori tersimpan'
        );
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return $this->sendResponse(null, 'Kategori dihapus');
    }

    public function countProducts(Category $category)
    {
        $count = $category->products()->count();

        return $this->sendResponse(['product_count' => $count], 'Terhitung');
    }
}
