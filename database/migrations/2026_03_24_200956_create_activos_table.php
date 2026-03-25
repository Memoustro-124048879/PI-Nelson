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
        Schema::create('activos', function (Blueprint $table) {
            $table->id();
            $table->string('qr_code')->unique();
            $table->string('nombre');
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->string('numero_serie')->nullable();
            $table->string('marca')->nullable();
            $table->string('modelo')->nullable();
            $table->date('fecha_adquisicion')->nullable();
            $table->decimal('costo_adquisicion', 15, 2)->nullable();
            $table->string('proveedor')->nullable();
            $table->integer('vida_util')->nullable();
            $table->foreignId('area_id')->constrained('areas');
            $table->string('estado')->default('Disponible');
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activos');
    }
};
