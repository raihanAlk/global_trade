<?php

namespace App\Http\Controllers;

use App\Models\shipment;
use Illuminate\Http\Request;

class shipment_controller extends base_controller
{
    public function index(Request $request)
    {
        $query = shipment::query();

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

        return $this->send_response($shipments->toArray(), 'Daftar pengiriman');
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

        $shipment = shipment::create($validated);

        return $this->send_response($shipment->fresh()->toArray(), 'Pengiriman ditambah', 201);
    }

    public function show(shipment $shipment)
    {
        return $this->send_response(
            $shipment->load('events')->toArray(),
            'Detail pengiriman'
        );
    }

    public function update(Request $request, shipment $shipment)
    {
        $validated = $request->validate([
            'tracking_number' => 'sometimes|required|string|max:255|unique:shipments,tracking_number,'.$shipment->id,
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

        return $this->send_response($shipment->fresh()->load('events')->toArray(), 'Pengiriman tersimpan');
    }

    public function destroy(shipment $shipment)
    {
        $shipment->delete();

        return $this->send_response(null, 'Pengiriman dihapus');
    }

    public function status(Request $request, shipment $shipment)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_transit,delivered,exception,cancelled',
        ]);

        $shipment->update($validated);

        return $this->send_response($shipment->fresh()->load('events')->toArray(), 'Status pengiriman diperbarui');
    }
}
