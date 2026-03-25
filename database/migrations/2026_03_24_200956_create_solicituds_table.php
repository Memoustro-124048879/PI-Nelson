<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('activo_id')->constrained('activos');
            $table->foreignId('user_id')->constrained('users');
            $table->date('fecha');
            $table->string('ubicacion_destino');
            $table->string('urgencia')->default('Media');
            $table->text('motivo');
            $table->string('estado')->default('Enviada');
            $table->foreignId('revisada_por')->nullable()->constrained('users');
            $table->text('motivo_rechazo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
