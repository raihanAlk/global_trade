<?php

namespace App\Admin\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends BaseController
{
    public function index(Request $request)
    {
        $query = Company::query();

        if ($request->has('type')) {
            $query->where('type', $request->input('type'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $companies = $query->orderBy('name')->get();

        return $this->sendResponse($companies->toArray(), 'Daftar perusahaan');
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

        $company = Company::create($validated);

        return $this->sendResponse($company->fresh()->toArray(), 'Perusahaan ditambah', 201);
    }

    public function show(Company $company)
    {
        return $this->sendResponse(
            $company->load('products')->toArray(),
            'Detail perusahaan'
        );
    }

    public function update(Request $request, Company $company)
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

        return $this->sendResponse($company->fresh()->toArray(), 'Perusahaan tersimpan');
    }

    public function destroy(Company $company)
    {
        $company->delete();

        return $this->sendResponse(null, 'Perusahaan dihapus');
    }
}
