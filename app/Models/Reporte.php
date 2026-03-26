<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    protected $guarded = [];

    public function activo() {
        return $this->belongsTo(Activo::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
