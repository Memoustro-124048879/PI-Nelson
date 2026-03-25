<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $area = \App\Models\Area::create(['nombre' => 'Central']);

        User::create([
            'name' => 'Admin SIGAF',
            'email' => 'Admin@sigaf.com',
            'password' => hash('sha256', 'demo123'),
            'role' => 'ADMIN',
            'area_id' => null,
            'estado' => 'activo'
        ]);

        User::create([
            'name' => 'Supervisor SIGAF',
            'email' => 'Supervisor@sigaf.com',
            'password' => hash('sha256', 'demo123'),
            'role' => 'SUPERVISOR',
            'area_id' => $area->id,
            'estado' => 'activo'
        ]);

        User::create([
            'name' => 'Trabajador SIGAF',
            'email' => 'Trabajador@sigaf.com',
            'password' => hash('sha256', 'demo123'),
            'role' => 'TRABAJADOR',
            'area_id' => $area->id,
            'estado' => 'activo'
        ]);
    }
}
