<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use App\Models\Activo;

class AssetController extends Controller
{
    public function index(Request $request) {
        $user = $request->user();
        $query = Activo::with('area');
        
        if ($user && $user->role === 'SUPERVISOR') {
            $query->where('area_id', $user->area_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'categoria_id' => 'nullable|integer',
            'area_id' => 'nullable|integer',
            'qr_code' => 'nullable|string',
            'numero_serie' => 'nullable|string',
            'marca' => 'nullable|string',
            'modelo' => 'nullable|string',
            'fecha_adquisicion' => 'nullable|date',
            'costo' => 'nullable|numeric',
            'proveedor' => 'nullable|string',
            'vida_util' => 'nullable|integer',
            'estado' => 'nullable|string',
            'observaciones' => 'nullable|string'
        ]);

        $activo = new Activo($validated);
        // Map frontend fields
        if ($request->has('costo')) $activo->costo_adquisicion = $request->costo;
        if ($request->has('area_id')) $activo->area_id = $request->area_id;

        if ($request->has('ubicacion') && $request->ubicacion) {
            $area = \App\Models\Area::firstOrCreate(['nombre' => $request->ubicacion]);
            $activo->area_id = $area->id;
        }

        if (!$activo->qr_code) {
            $activo->qr_code = 'SIGAF-' . strtoupper(Str::random(8));
        }

        $activo->save();

        return response()->json($activo, 201);
    }

    public function show($id) {
        $activo = Activo::with('area')->findOrFail($id);
        return response()->json($activo);
    }

    public function update(Request $request, $id) {
        $activo = Activo::findOrFail($id);
        
        $activo->fill($request->all());
        if ($request->has('costo')) $activo->costo_adquisicion = $request->costo;
        if ($request->has('ubicacion') && $request->ubicacion) {
            $area = \App\Models\Area::firstOrCreate(['nombre' => $request->ubicacion]);
            $activo->area_id = $area->id;
        }

        $activo->save();
        return response()->json($activo);
    }

    public function destroy($id) {
        $activo = Activo::findOrFail($id);
        $activo->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
