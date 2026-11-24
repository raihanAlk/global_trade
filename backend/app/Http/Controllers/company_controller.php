<?php

namespace App\Http\Controllers;

use App\Models\company;
use Illuminate\Http\Request;

class company_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = company::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $companies = $query->orderBy('name')->get();

        return $this->send_response($companies->toArray(), 'Daftar perusahaan');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'sometimes|in:supplier,importer,exporter',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:100',
            'website' => 'sometimes|url|max:255',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $company = company::create($validated);

        return $this->send_response($company->fresh()->toArray(), 'Perusahaan ditambah', 201);
    }

    public function show(company $company)
    {
        return $this->send_response(
            $company->load('products')->toArray(),
            'Detail perusahaan'
        );
    }

    public function update(Request $request, company $company)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|in:supplier,importer,exporter',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:255',
            'address' => 'sometimes|string',
            'city' => 'sometimes|string|max:255',
            'country' => 'sometimes|string|max:100',
            'website' => 'sometimes|url|max:255',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $company->update($validated);

        return $this->send_response($company->fresh()->toArray(), 'Perusahaan tersimpan');
    }

    public function destroy(company $company)
    {
        $company->delete();

        return $this->send_response(null, 'Perusahaan dihapus');
    }
}
