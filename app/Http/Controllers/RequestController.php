<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Solicitud;

class RequestController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $query = Solicitud::query();

        if ($user && $user->role === 'TRABAJADOR') {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'activo_id' => 'required|exists:activos,id',
            'ubicacion_destino' => 'required',
            'urgencia' => 'required',
            'motivo' => 'required'
        ]);

        $solicitud = new Solicitud($validated);
        $solicitud->user_id = $request->user()->id;
        $solicitud->fecha = now();
        $solicitud->estado = 'Enviada';
        $solicitud->save();

        return response()->json($solicitud, 201);
    }

    public function update(Request $request, $id) {
        $solicitud = Solicitud::findOrFail($id);
        
        $validated = $request->validate([
            'estado' => 'required|in:Enviada,En revisión,Aceptada,Rechazada',
            'motivo_rechazo' => 'nullable|string'
        ]);

        $solicitud->fill($validated);
        if ($request->estado !== 'Enviada') {
            $solicitud->revisada_por = $request->user()->id;
        }

        $solicitud->save();
        return response()->json($solicitud);
    }
}
