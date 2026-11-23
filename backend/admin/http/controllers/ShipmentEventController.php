<?php

namespace App\Admin\Http\Controllers;

use App\Models\Shipment;
use App\Models\ShipmentEvent;
use Illuminate\Http\Request;

class ShipmentEventController extends BaseController
{
    public function index(Shipment $shipment)
    {
        $events = $shipment->events()->orderBy('occurred_at', 'desc')->get();

        return $this->sendResponse($events->toArray(), 'Timeline pengiriman');
    }

    public function store(Request $request, Shipment $shipment)
    {
        $validated = $request->validate([
            'event' => 'required|string|max:255',
            'occurred_at' => 'sometimes|date',
            'note' => 'sometimes|string',
        ]);

        $validated['shipment_id'] = $shipment->id;

        $event = ShipmentEvent::create($validated);

        return $this->sendResponse($event->fresh()->toArray(), 'Event ditambah', 201);
    }

    public function update(Request $request, Shipment $shipment, ShipmentEvent $event)
    {
        if ($event->shipment_id !== $shipment->id) {
            return $this->sendError('Event tidak ditemukan', [], 404);
        }

        $validated = $request->validate([
            'event' => 'sometimes|required|string|max:255',
            'occurred_at' => 'sometimes|date',
            'note' => 'sometimes|string',
        ]);

        $event->update($validated);

        return $this->sendResponse($event->fresh()->toArray(), 'Event tersimpan');
    }

    public function destroy(Shipment $shipment, ShipmentEvent $event)
    {
        if ($event->shipment_id !== $shipment->id) {
            return $this->sendError('Event tidak ditemukan', [], 404);
        }

        $event->delete();

        return $this->sendResponse(null, 'Event dihapus');
    }
}
