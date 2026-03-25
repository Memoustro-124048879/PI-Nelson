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
        Schema::create('reportes', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->string('tipo');
            $table->foreignId('activo_id')->constrained('activos');
            $table->foreignId('user_id')->constrained('users');
            $table->date('fecha');
            $table->string('ubicacion_evento');
            $table->text('notas')->nullable();
            $table->string('estado')->default('Enviado');
            $table->json('archivos')->nullable();
            $table->string('subtipo')->nullable();
            $table->string('tiempo_estimado')->nullable();
            $table->boolean('requiere_salida')->default(false);
            $table->string('gravedad')->nullable();
            $table->text('personas_involucradas')->nullable();
            $table->boolean('hubo_dano')->default(false);
            $table->boolean('requiere_baja')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
