<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activo extends Model
{
    protected $fillable = [
        'qr_code', 'nombre', 'categoria_id', 'numero_serie', 'marca',
        'modelo', 'fecha_adquisicion', 'costo_adquisicion', 'proveedor',
        'vida_util', 'area_id', 'estado', 'observaciones'
    ];

    public function area() {
        return $this->belongsTo(Area::class);
    }
}
