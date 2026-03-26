<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email' => 'required',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('name', $request->email)
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'Usuario no encontrado'], 401);
        }

        // SHA-256 specific requested validation, falling back to plaintext for debugging seeding
        // But also support Laravel's standard Bcrypt used in seeders
        $hashedInput = hash('sha256', $request->password);
        $isCorrect = Hash::check($request->password, $user->password) || 
                     $user->password === $hashedInput || 
                     $user->password === $request->password;
        
        if (!$isCorrect) {
            return response()->json(['message' => 'Contraseña incorrecta'], 401);
        }

        if ($user->estado === 'inactivo') {
            return response()->json(['message' => 'Usuario inactivo'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'area_id' => $user->area_id
            ]
        ]);
    }

    public function logout(Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function user(Request $request) {
        return response()->json($request->user());
    }
}
