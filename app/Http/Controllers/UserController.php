<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request) {
        // Admin sees all, Supervisor sees only their area
        $user = $request->user();
        $query = User::query();

        if ($user && $user->role === 'SUPERVISOR') {
            $query->where('area_id', $user->area_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required',
            'role' => 'required|in:ADMIN,SUPERVISOR,TRABAJADOR',
            'area_id' => 'nullable|integer',
            'estado' => 'required|in:activo,inactivo'
        ]);

        $validated['password'] = hash('sha256', $validated['password']);
        $newUser = User::create($validated);
        return response()->json($newUser, 201);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required',
            'email' => 'sometimes|required|email',
            'role' => 'sometimes|required',
            'area_id' => 'nullable|integer',
            'estado' => 'sometimes|required'
        ]);

        if ($request->has('password') && !empty($request->password)) {
            $validated['password'] = hash('sha256', $request->password);
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy($id) {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
