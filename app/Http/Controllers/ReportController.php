<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Reporte;
use App\Models\Mantenimiento;

class ReportController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $query = Reporte::with('activo');

        if ($user && $user->role === 'TRABAJADOR') {
            $query->where('user_id', $user->id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'titulo' => 'required',
            'tipo' => 'required',
            'activo_id' => 'required|exists:activos,id',
            'ubicacion_evento' => 'required',
            'notas' => 'required',
            'subtipo' => 'nullable',
            'gravedad' => 'nullable'
        ]);

        $reporte = new Reporte($validated);
        $reporte->user_id = $request->user()->id;
        $reporte->fecha = now();
        $reporte->estado = 'Enviado';
        $reporte->save();

        return response()->json($reporte, 201);
    }

    public function update(Request $request, $id) {
        $reporte = Reporte::findOrFail($id);
        
        $validated = $request->validate([
            'estado' => 'required'
        ]);

        $reporte->update($validated);

        if ($reporte->tipo === 'Mantenimiento' && $reporte->estado === 'Aprobado') {
            Mantenimiento::create([
                'reporte_id' => $reporte->id,
                'activo_id' => $reporte->activo_id,
                'estado' => 'Abierto',
                'costo_total' => 0
            ]);
        }

        return response()->json($reporte);
    }
}
