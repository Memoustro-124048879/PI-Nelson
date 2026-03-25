<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Mantenimiento;
use App\Models\MantenimientoRegistro;

class MaintenanceController extends Controller
{
    public function index(Request $request) {
        $query = Mantenimiento::with(['activo', 'registros']);
        return response()->json($query->get());
    }

    public function show($id) {
        return response()->json(Mantenimiento::with(['activo', 'registros'])->findOrFail($id));
    }

    public function update(Request $request, $id) {
        $mantenimiento = Mantenimiento::findOrFail($id);
        if ($request->has('estado')) {
            $mantenimiento->estado = $request->estado;
            $mantenimiento->save();
        }
        return response()->json($mantenimiento);
    }
}
