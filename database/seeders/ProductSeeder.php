<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'product_name' => 'Galon Aqua 19L',
                'brand' => 'Aqua',
                'category' => 'Galon Air Mineral',
                'price' => 25000,
                'stock' => 100,
                'description' => 'Galon air mineral Aqua ukuran 19 liter. Air bersih dan aman untuk dikonsumsi sehari-hari.',
                'image_url' => 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500',
            ],
            [
                'product_name' => 'Galon Le Minerale 19L',
                'brand' => 'Le Minerale',
                'category' => 'Galon Air Mineral',
                'price' => 23000,
                'stock' => 80,
                'description' => 'Galon air mineral Le Minerale ukuran 19 liter dengan kandungan mineral alami.',
                'image_url' => 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500',
            ],
            [
                'product_name' => 'Galon Cleo 19L',
                'brand' => 'Cleo',
                'category' => 'Galon Air Mineral',
                'price' => 20000,
                'stock' => 120,
                'description' => 'Galon air mineral Cleo ukuran 19 liter dengan proses penyaringan 3 kali.',
                'image_url' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
            ],
            [
                'product_name' => 'Galon Vit 19L',
                'brand' => 'Vit',
                'category' => 'Galon Air Mineral',
                'price' => 22000,
                'stock' => 90,
                'description' => 'Galon air mineral Vit ukuran 19 liter dengan harga terjangkau.',
                'image_url' => 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=500',
            ],
            [
                'product_name' => 'Galon Ades 19L',
                'brand' => 'Ades',
                'category' => 'Galon Air Mineral',
                'price' => 24000,
                'stock' => 75,
                'description' => 'Galon air mineral Ades ukuran 19 liter dengan kualitas terjamin.',
                'image_url' => 'https://images.unsplash.com/photo-1550536328-f4e5d82d3c87?w=500',
            ],
            [
                'product_name' => 'Galon Prima 19L',
                'brand' => 'Prima',
                'category' => 'Galon Air Mineral',
                'price' => 21000,
                'stock' => 110,
                'description' => 'Galon air mineral Prima ukuran 19 liter pilihan ekonomis.',
                'image_url' => 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
