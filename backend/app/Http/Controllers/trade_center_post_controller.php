<?php

namespace App\Http\Controllers;

use App\Models\trade_center_post;
use Illuminate\Http\Request;

class trade_center_post_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = trade_center_post::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $posts = $query->with('author')->orderBy('published_at', 'desc')->get();

        return $this->send_response($posts->toArray(), 'Daftar konten pusat perdagangan');
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

        $post = trade_center_post::create($validated);

        return $this->send_response($post->fresh()->load('author')->toArray(), 'Konten ditambah', 201);
    }

    public function show(trade_center_post $trade_center_post)
    {
        return $this->send_response($trade_center_post->load('author')->toArray(), 'Detail konten');
    }

    public function update(Request $request, trade_center_post $trade_center_post)
    {
        $validated = $request->validate([
            'type' => 'sometimes|in:news,export_guide,import_guide,country_profile,glossary,event',
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:trade_center_posts,slug,'.$trade_center_post->id,
            'content' => 'sometimes|required|string',
            'excerpt' => 'sometimes|string|max:255',
            'cover_image' => 'sometimes|string|max:255',
            'featured' => 'sometimes|boolean',
            'author_id' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:draft,pending,published,scheduled',
            'scheduled_at' => 'sometimes|date',
            'published_at' => 'sometimes|date',
        ]);

        $trade_center_post->update($validated);

        return $this->send_response($trade_center_post->fresh()->load('author')->toArray(), 'Konten tersimpan');
    }

    public function destroy(trade_center_post $trade_center_post)
    {
        $trade_center_post->delete();

        return $this->send_response(null, 'Konten dihapus');
    }

    public function publish(Request $request, trade_center_post $post)
    {
        $post->status = 'published';
        $post->published_at = now();
        $post->save();

        return $this->send_response($post->fresh()->load('author')->toArray(), 'Konten diterbitkan');
    }

    public function schedule(Request $request, trade_center_post $post)
    {
        $validated = $request->validate([
            'scheduled_at' => 'required|date',
        ]);

        $post->status = 'scheduled';
        $post->scheduled_at = $validated['scheduled_at'];
        $post->save();

        return $this->send_response($post->fresh()->load('author')->toArray(), 'Konten dijadwalkan');
    }

    public function unschedule(trade_center_post $post)
    {
        $post->status = 'draft';
        $post->scheduled_at = null;
        $post->save();

        return $this->send_response($post->fresh()->load('author')->toArray(), 'Jadwal dibatalkan');
    }
}
