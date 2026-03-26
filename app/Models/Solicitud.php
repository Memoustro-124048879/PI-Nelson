<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Activo;

class Solicitud extends Model
{
    protected $table = 'solicitudes';
    protected $guarded = [];

    public function activo() {
        return $this->belongsTo(Activo::class);
    }
}
