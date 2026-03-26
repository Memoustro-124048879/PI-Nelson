<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Activo;
use App\Models\Area;
use App\Models\Categoria;
use App\Models\Solicitud;
use App\Models\User;

class DummySeeder extends Seeder
{
    public function run()
    {
        // --- Áreas ---
        $areaCentral  = Area::firstOrCreate(['nombre' => 'Central']);
        $areaProduccion = Area::firstOrCreate(['nombre' => 'Producción']);
        $areaLogistica  = Area::firstOrCreate(['nombre' => 'Logística']);

        // --- Categorías ---
        $catHerramientas = Categoria::firstOrCreate(['nombre' => 'Herramientas'], ['prefijo' => 'HERR']);
        $catMaquinaria   = Categoria::firstOrCreate(['nombre' => 'Maquinaria'],   ['prefijo' => 'MAQN']);
        $catEquipos      = Categoria::firstOrCreate(['nombre' => 'Equipos'],      ['prefijo' => 'EQUI']);
        $catVehiculos    = Categoria::firstOrCreate(['nombre' => 'Vehículos'],    ['prefijo' => 'VEHI']);
        $catMobiliario   = Categoria::firstOrCreate(['nombre' => 'Mobiliario'],   ['prefijo' => 'MOBI']);

        // --- Activos ---
        $a1 = Activo::firstOrCreate(['qr_code' => 'SIGAF-001'], [
            'nombre'          => 'Torquímetro Digital SNAP-ON',
            'categoria_id'    => $catHerramientas->id,
            'area_id'         => $areaProduccion->id,
            'numero_serie'    => 'SN-TQ-457821',
            'marca'           => 'SNAP-ON',
            'modelo'          => 'ATECH3FR250B',
            'estado'          => 'En Uso',
            'fecha_adquisicion' => '2024-01-10',
            'costo_adquisicion' => 12500.00,
        ]);

        $a2 = Activo::firstOrCreate(['qr_code' => 'SIGAF-002'], [
            'nombre'          => 'Esmeriladora Angular DeWalt',
            'categoria_id'    => $catHerramientas->id,
            'area_id'         => $areaProduccion->id,
            'numero_serie'    => 'DW-GRD-002',
            'marca'           => 'DeWalt',
            'modelo'          => 'DCG413B',
            'estado'          => 'Disponible',
            'fecha_adquisicion' => '2024-02-15',
            'costo_adquisicion' => 3800.00,
        ]);

        $a3 = Activo::firstOrCreate(['qr_code' => 'SIGAF-003'], [
            'nombre'          => 'Puente Grúa 5 Toneladas',
            'categoria_id'    => $catMaquinaria->id,
            'area_id'         => $areaLogistica->id,
            'numero_serie'    => 'PG-5T-98741',
            'marca'           => 'DEMAG',
            'modelo'          => 'DC-COM 5-500',
            'estado'          => 'Disponible',
            'fecha_adquisicion' => '2023-05-20',
            'costo_adquisicion' => 185000.00,
        ]);

        $a4 = Activo::firstOrCreate(['qr_code' => 'SIGAF-004'], [
            'nombre'          => 'Compresor de Aire Industrial',
            'categoria_id'    => $catEquipos->id,
            'area_id'         => $areaCentral->id,
            'numero_serie'    => 'COMP-AIR-2024',
            'marca'           => 'Atlas Copco',
            'modelo'          => 'GA15',
            'estado'          => 'Mantenimiento',
            'fecha_adquisicion' => '2023-08-01',
            'costo_adquisicion' => 45000.00,
        ]);

        $a5 = Activo::firstOrCreate(['qr_code' => 'SIGAF-005'], [
            'nombre'          => 'Montacargas Eléctrico YALE',
            'categoria_id'    => $catVehiculos->id,
            'area_id'         => $areaLogistica->id,
            'numero_serie'    => 'YAL-ERC-055',
            'marca'           => 'YALE',
            'modelo'          => 'ERC055VGN',
            'estado'          => 'En Uso',
            'fecha_adquisicion' => '2022-11-10',
            'costo_adquisicion' => 210000.00,
        ]);

        $a6 = Activo::firstOrCreate(['qr_code' => 'SIGAF-006'], [
            'nombre'          => 'Escáner 3D FARO Focus',
            'categoria_id'    => $catEquipos->id,
            'area_id'         => $areaProduccion->id,
            'numero_serie'    => 'FARO-3D-2023',
            'marca'           => 'FARO',
            'modelo'          => 'Focus S350',
            'estado'          => 'Disponible',
            'fecha_adquisicion' => '2023-03-15',
            'costo_adquisicion' => 98000.00,
        ]);

        // --- Usuarios ---
        $admin = User::updateOrCreate(
            ['email' => 'admin@sigaf.com'],
            ['name' => 'Admin SIGAF', 'role' => 'ADMIN', 'password' => bcrypt('Sigaf2026!')]
        );

        $supervisor = User::updateOrCreate(
            ['email' => 'supervisor@sigaf.com'],
            ['name' => 'Carlos Supervisor', 'role' => 'SUPERVISOR', 'area_id' => $areaProduccion->id, 'password' => bcrypt('Sigaf2026!')]
        );

        $trabajador = User::updateOrCreate(
            ['email' => 'miguel@sigaf.com'],
            ['name' => 'Miguel Torres', 'role' => 'TRABAJADOR', 'area_id' => $areaProduccion->id, 'password' => bcrypt('Sigaf2026!')]
        );

        // --- Solicitudes ---
        Solicitud::firstOrCreate(
            ['activo_id' => $a1->id, 'user_id' => $trabajador->id],
            [
                'fecha'             => '2026-02-18',
                'ubicacion_destino' => 'Taller A - Área de Ensamble',
                'urgencia'          => 'Alta',
                'motivo'            => 'Revisión de maquinaria pesada en la línea de producción',
                'estado'            => 'Enviada'
            ]
        );

        Solicitud::firstOrCreate(
            ['activo_id' => $a3->id, 'user_id' => $trabajador->id],
            [
                'fecha'             => '2026-02-17',
                'ubicacion_destino' => 'Almacén Central - Zona de Carga',
                'urgencia'          => 'Media',
                'motivo'            => 'Reubicación temporal para descarga de material',
                'estado'            => 'Aceptada'
            ]
        );

        Solicitud::firstOrCreate(
            ['activo_id' => $a5->id, 'user_id' => $supervisor->id],
            [
                'fecha'             => '2026-02-16',
                'ubicacion_destino' => 'Planta Principal - Línea B',
                'urgencia'          => 'Baja',
                'motivo'            => 'Apoyo en operaciones de fin de turno',
                'estado'            => 'Enviada'
            ]
        );

        Solicitud::firstOrCreate(
            ['activo_id' => $a6->id, 'user_id' => $supervisor->id],
            [
                'fecha'             => '2026-02-15',
                'ubicacion_destino' => 'Laboratorio de Calidad',
                'urgencia'          => 'Alta',
                'motivo'            => 'Inspección de piezas para control de calidad',
                'estado'            => 'Aceptada'
            ]
        );
    }
}
