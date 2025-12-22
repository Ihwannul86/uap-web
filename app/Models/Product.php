<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'slug',
        'product_name',
        'brand',
        'category',
        'price',
        'stock',
        'description',
        'image_url',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    // Auto-generate UUID dan Slug
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (empty($product->uuid)) {
                $product->uuid = (string) Str::uuid();
            }
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->product_name) . '-' . Str::random(6);
            }
        });
    }

    // Route key name untuk menggunakan UUID di URL
    public function getRouteKeyName()
    {
        return 'uuid';
    }

    // Relationships
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
