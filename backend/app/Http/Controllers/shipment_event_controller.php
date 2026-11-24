<?php

namespace App\Http\Controllers;

use App\Models\shipment;
use App\Models\shipment_event;
use Illuminate\Http\Request;

class shipment_event_controller extends base_controller
{
    public function index(shipment $shipment)
    {
        $events = $shipment->events()->orderBy('occurred_at', 'desc')->get();

        return $this->send_response($events->toArray(), 'Timeline pengiriman');
    }

    public function store(Request $request, shipment $shipment)
    {
        $validated = $request->validate([
            'event' => 'required|string|max:255',
            'occurred_at' => 'sometimes|date',
            'note' => 'sometimes|string',
        ]);

        $validated['shipment_id'] = $shipment->id;

        $event = shipment_event::create($validated);

        return $this->send_response($event->fresh()->toArray(), 'Event ditambah', 201);
    }

    public function update(Request $request, shipment $shipment, shipment_event $event)
    {
        if ($event->shipment_id !== $shipment->id) {
            return $this->send_error('Event tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'event' => 'sometimes|required|string|max:255',
            'occurred_at' => 'sometimes|date',
            'note' => 'sometimes|string',
        ]);

        $event->update($validated);

        return $this->send_response($event->fresh()->toArray(), 'Event tersimpan');
    }

    public function destroy(shipment $shipment, shipment_event $event)
    {
        if ($event->shipment_id !== $shipment->id) {
            return $this->send_error('Event tidak ditemukan', [], 404);
        }

        $event->delete();

        return $this->send_response(null, 'Event dihapus');
    }
}
