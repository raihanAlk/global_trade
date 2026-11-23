<?php

namespace App\Admin\Http\Controllers;

use App\Models\TradeCenterPost;
use Illuminate\Http\Request;

class TradeCenterPostController extends BaseController
{
    public function index(Request $request)
    {
        $query = TradeCenterPost::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $posts = $query->with('author')->orderBy('published_at', 'desc')->get();

        return $this->sendResponse($posts->toArray(), 'Daftar konten pusat perdagangan');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:news,export_guide,import_guide,country_profile,glossary,event',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:trade_center_posts',
            'content' => 'required|string',
            'excerpt' => 'sometimes|string|max:255',
            'cover_image' => 'sometimes|string|max:255',
            'featured' => 'sometimes|boolean',
            'author_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:draft,pending,published,scheduled',
            'scheduled_at' => 'sometimes|date',
            'published_at' => 'sometimes|date',
        ]);

        $post = TradeCenterPost::create($validated);

        return $this->sendResponse($post->fresh()->load('author')->toArray(), 'Konten ditambah', 201);
    }

    public function show(TradeCenterPost $post)
    {
        return $this->sendResponse($post->load('author')->toArray(), 'Detail konten');
    }

    public function update(Request $request, TradeCenterPost $post)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:news,export_guide,import_guide,country_profile,glossary,event',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:trade_center_posts,slug,' . $post->id,
            'content' => 'sometimes|required|string',
            'excerpt' => 'sometimes|string|max:255',
            'cover_image' => 'sometimes|string|max:255',
            'featured' => 'sometimes|boolean',
            'author_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:draft,pending,published,scheduled',
            'scheduled_at' => 'sometimes|date',
            'published_at' => 'sometimes|date',
        ]);

        $post->update($validated);

        return $this->sendResponse($post->fresh()->load('author')->toArray(), 'Konten tersimpan');
    }

    public function destroy(TradeCenterPost $post)
    {
        $post->delete();

        return $this->sendResponse(null, 'Konten dihapus');
    }

    public function publish(Request $request, TradeCenterPost $post)
    {
        $post->status = 'published';
        $post->published_at = now();
        $post->save();

        return $this->sendResponse($post->fresh()->load('author')->toArray(), 'Konten diterbitkan');
    }

    public function schedule(Request $request, TradeCenterPost $post)
    {
        $validated = $request->validate([
            'scheduled_at' => 'required|date',
        ]);

        $post->status = 'scheduled';
        $post->scheduled_at = $validated['scheduled_at'];
        $post->save();

        return $this->sendResponse($post->fresh()->load('author')->toArray(), 'Konten dijadwalkan');
    }

    public function unschedule(TradeCenterPost $post)
    {
        $post->status = 'draft';
        $post->scheduled_at = null;
        $post->save();

        return $this->sendResponse($post->fresh()->load('author')->toArray(), 'Jadwal dibatalkan');
    }
}
