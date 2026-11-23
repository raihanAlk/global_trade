<?php

namespace App\Admin\Http\Controllers;

use App\Models\Shipment;
use Illuminate\Http\Request;

class ShipmentController extends BaseController
{
    public function index(Request $request)
    {
        $query = Shipment::query();

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->has('origin_country')) {
            $query->where('origin_country', $request->input('origin_country'));
        }

        if ($request->has('destination_country')) {
            $query->where('destination_country', $request->input('destination_country'));
        }

        $shipments = $query->orderBy('created_at', 'desc')->get();

        return $this->sendResponse($shipments->toArray(), 'Daftar pengiriman');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tracking_number' => 'required|string|max:255|unique:shipments',
            'origin_city' => 'sometimes|string|max:255',
            'origin_country' => 'sometimes|string|max:100',
            'destination_city' => 'sometimes|string|max:255',
            'destination_country' => 'sometimes|string|max:100',
            'estimated_arrival' => 'sometimes|date',
            'status' => 'sometimes|in:pending,in_transit,delivered,exception,cancelled',
            'current_location' => 'sometimes|string|max:255',
            'notes' => 'sometimes|string',
        ]);

        $shipment = Shipment::create($validated);

        return $this->sendResponse($shipment->fresh()->toArray(), 'Pengiriman ditambah', 201);
    }

    public function show(Shipment $shipment)
    {
        return $this->sendResponse(
            $shipment->load('events')->toArray(),
            'Detail pengiriman'
        );
    }

    public function update(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'tracking_number' => 'sometimes|required|string|max:255|unique:shipments,tracking_number,' . $shipment->id,
            'origin_city' => 'sometimes|string|max:255',
            'origin_country' => 'sometimes|string|max:100',
            'destination_city' => 'sometimes|string|max:255',
            'destination_country' => 'sometimes|string|max:100',
            'estimated_arrival' => 'sometimes|date',
            'status' => 'sometimes|in:pending,in_transit,delivered,exception,cancelled',
            'current_location' => 'sometimes|string|max:255',
            'notes' => 'sometimes|string',
        ]);

        $shipment->update($validated);

        return $this->sendResponse($shipment->fresh()->load('events')->toArray(), 'Pengiriman tersimpan');
    }

    public function destroy(Shipment $shipment)
    {
        $shipment->delete();

        return $this->sendResponse(null, 'Pengiriman dihapus');
    }

    public function status(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_transit,delivered,exception,cancelled',
        ]);

        $shipment->update($validated);

        return $this->sendResponse($shipment->fresh()->load('events')->toArray(), 'Status pengiriman diperbarui');
    }
}
