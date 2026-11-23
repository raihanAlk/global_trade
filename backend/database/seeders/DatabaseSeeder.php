<?php

namespace Database\Seeders;

use App\Admin\Models\Category;
use App\Admin\Models\Company;
use App\Admin\Models\Order;
use App\Admin\Models\OrderItem;
use App\Admin\Models\Product;
use App\Admin\Models\ProductImage;
use App\Admin\Models\ProductReview;
use App\Admin\Models\Quotation;
use App\Admin\Models\QuotationItem;
use App\Admin\Models\RFQItem;
use App\Admin\Models\RFQRequest;
use App\Admin\Models\Shipment;
use App\Admin\Models\ShipmentEvent;
use App\Admin\Models\TradeCenterPost;
use App\Models\User;
use App\Admin\Models\ChatReport;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Users
        $admin = User::create([
            'name' => 'Admin Distribusi',
            'email' => 'admin@globaltrade.local',
            'password' => bcrypt('admin123'),
        ]);

        $moderator = User::create([
            'name' => 'Rina Wibowo',
            'email' => 'rina@globaltrade.local',
            'password' => bcrypt('moderator123'),
        ]);

        $editor = User::create([
            'name' => 'Budi Santoso',
            'email' => 'budi@globaltrade.local',
            'password' => bcrypt('editor123'),
        ]);

        $users = [$admin, $moderator, $editor];

        // Categories
        $categories = [
            ['slug' => 'beras-daging', 'parent_id' => null, 'status' => 'active', 'description' => 'Beras dan daging', 'product_count' => 0],
            ['slug' => 'minuman', 'parent_id' => null, 'status' => 'active', 'description' => 'Minuman kemasan', 'product_count' => 0],
            ['slug' => 'kue-resep', 'parent_id' => null, 'status' => 'active', 'description' => 'Kue dan resep', 'product_count' => 0],
            ['slug' => 'kondisioner', 'parent_id' => null, 'status' => 'active', 'description' => 'Kimia dan kondisioner', 'product_count' => 0],
            ['slug' => 'peralatan', 'parent_id' => null, 'status' => 'inactive', 'description' => 'Peralatan dagang', 'product_count' => 0],
            ['slug' => 'internet', 'parent_id' => null, 'status' => 'active', 'description' => 'Jasa digital', 'product_count' => 0],
        ];

        foreach ($categories as &$cat) {
            $cat['id'] = Category::create($cat)->id;
        }
        unset($cat);

        // Companies
        $companies = [
            ['name' => 'PT Maju Jaya Abadi', 'type' => 'supplier', 'status' => 'active'],
            ['name' => 'PT Nur Sari Pangan', 'type' => 'supplier', 'status' => 'active'],
            ['name' => 'PT Global Exports Lestari', 'type' => 'exporter', 'status' => 'active'],
            ['name' => 'PT Dunia Ekspor', 'type' => 'exporter', 'status' => 'active'],
            ['name' => 'PT Sejahtera Impor', 'type' => 'importer', 'status' => 'active'],
            ['name' => 'PT Raya Supply Chain', 'type' => 'importer', 'status' => 'active'],
            ['name' => 'PT Matahari Abadi', 'type' => 'supplier', 'status' => 'inactive'],
            ['name' => 'PT Permata Lintas', 'type' => 'importer', 'status' => 'active'],
        ];

        foreach ($companies as &$co) {
            $co['id'] = Company::create($co)->id;
        }
        unset($co);

        // Products with images and reviews
        $products = [
            ['name' => 'Beras Premium Adulasi', 'description' => 'Beras padi premium 25 kg', 'price' => 180000, 'currency' => 'USD', 'moq' => 10, 'origin_country' => 'Thailand', 'category_slug' => 'beras-daging', 'company_id' => null],
            ['name' => 'Kopi Robusta Pare', 'description' => 'Kopi robusta segar 1 kg', 'price' => 24000, 'currency' => 'USD', 'moq' => 50, 'origin_country' => 'Indonesia', 'category_slug' => 'beras-daging', 'company_id' => null],
            ['name' => 'Cacao Bunguru', 'description' => 'Cacao bubuk murni 1 kg', 'price' => 45000, 'currency' => 'USD', 'moq' => 30, 'origin_country' => 'Ecuador', 'category_slug' => 'beras-daging', 'company_id' => null],
            ['name' => 'Teh Manis Kuning', 'description' => 'Teh manis kemasan 30 sachet', 'price' => 15000, 'currency' => 'USD', 'moq' => 100, 'origin_country' => 'Indonesia', 'category_slug' => 'minuman', 'company_id' => null],
            ['name' => 'Gula Pasir Hi-Melasse', 'description' => 'Gula pasir halus 1 kg', 'price' => 9500, 'currency' => 'USD', 'moq' => 200, 'origin_country' => 'Thailand', 'category_slug' => 'minuman', 'company_id' => null],
            ['name' => 'Makanan Instan Soto', 'description' => 'Makanan instan soto 6 porsi', 'price' => 22000, 'currency' => 'USD', 'moq' => 50, 'origin_country' => 'Indonesia', 'category_slug' => 'kue-resep', 'company_id' => null],
            ['name' => 'Minyak Goreng Hayati', 'description' => 'Minyak goreng sayuran 5 liter', 'price' => 42000, 'currency' => 'USD', 'moq' => 20, 'origin_country' => 'Malaysia', 'category_slug' => 'kondisioner', 'company_id' => null],
            ['name' => 'Tepung Terigu Terpal', 'description' => 'Tepung terigu pr walk 25 kg', 'price' => 98000, 'currency' => 'USD', 'moq' => 15, 'origin_country' => 'USA', 'category_slug' => 'peralatan', 'company_id' => null],
        ];

        foreach ($products as &$p) {
            $cat = Category::where('slug', $p['category_slug'])->first();
            $co = $companies[array_rand($companies)];
            $p['category_id'] = $cat->id;
            $p['company_id'] = $co['id'];
            unset($p['category_slug']);
            $product = Product::create($p);
            $p['id'] = $product->id;

            // Images
            $imageUrls = [
                'https://images.unsplash.com/photo-1596462507344-7f658b88800c?w=600',
                'https://images.unsplash.com/photo-1596462507344-7f658b88800c?w=400',
            ];
            foreach ($imageUrls as $i => $url) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $url,
                    'alt' => $product->name . ' gambar ' . ($i + 1),
                    'sort_order' => $i,
                    'is_primary' => $i === 0,
                ]);
            }

            // Review
            if (isset($users[1])) {
                ProductReview::create([
                    'product_id' => $product->id,
                    'user_id' => $users[1]->id,
                    'rating' => 4,
                    'comment' => 'Produk bagus, packaging rapi.',
                    'approved' => true,
                    'approved_at' => now(),
                ]);
            }
        }
        unset($p);

        // RFQ Requests
        $rfqs = [
            ['supplier_company_id' => 1, 'importer_company_id' => 5, 'destination_country' => 'Vietnam', 'quantity' => 500, 'status' => 'pending', 'expires_at' => date('Y-m-d', strtotime('+14 days')), 'notes' => 'RFQ untuk kebutuhan pasar Selatan'],
            ['supplier_company_id' => 2, 'importer_company_id' => 6, 'destination_country' => 'Thai', 'quantity' => 200, 'status' => 'approved', 'expires_at' => date('Y-m-d', strtotime('+21 days')), 'notes' => 'Kebutuhan teh manis'],
            ['supplier_company_id' => 1, 'importer_company_id' => 7, 'destination_country' => 'Malaysia', 'quantity' => 300, 'status' => 'negotiating', 'expires_at' => date('Y-m-d', strtotime('+10 days')), 'notes' => 'Mohon penawaran tambahan'],
            ['supplier_company_id' => 2, 'importer_company_id' => 5, 'destination_country' => 'Singapura', 'quantity' => 100, 'status' => 'draft', 'expires_at' => date('Y-m-d', strtotime('+7 days')), 'notes' => 'Draft RFQ'],
        ];

        foreach ($rfqs as &$r) {
            $rfq = RFQRequest::create($r);
            $r['id'] = $rfq->id;

            $productsForRFQ = Product::inRandomOrder()->limit(2)->get();
            foreach ($productsForRFQ as $idx => $product) {
                RFQItem::create([
                    'rfq_id' => $rfq->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => rand(10, 100),
                    'unit_price' => $product->price,
                    'currency' => $product->currency,
                    'notes' => $idx === 0 ? 'Item utama' : null,
                ]);
            }
        }
        unset($r);

        // Quotations
        $quotations = [
            ['supplier_company_id' => 1, 'importer_company_id' => 5, 'currency' => 'USD', 'validity_date' => date('Y-m-d', strtotime('+21 days')), 'status' => 'sent', 'expires_at' => date('Y-m-d', strtotime('+28 days')), 'notes' => 'Quotation kopi'],
            ['supplier_company_id' => 2, 'importer_company_id' => 6, 'currency' => 'USD', 'validity_date' => date('Y-m-d', strtotime('+14 days')), 'status' => 'draft', 'expires_at' => date('Y-m-d', strtotime('+21 days')), 'notes' => 'Quotation teh'],
            ['supplier_company_id' => 3, 'importer_company_id' => 7, 'currency' => 'USD', 'validity_date' => date('Y-m-d', strtotime('+30 days')), 'status' => 'accepted', 'expires_at' => date('Y-m-d', strtotime('+35 days')), 'notes' => 'Quotation minyak goreng'],
        ];

        foreach ($quotations as &$q) {
            $quotation = Quotation::create($q);
            $q['id'] = $quotation->id;

            $items = Product::inRandomOrder()->limit(2)->get();
            foreach ($items as $idx => $product) {
                $total = $product->price * rand(10, 50);
                QuotationItem::create([
                    'quotation_id' => $quotation->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => rand(10, 50),
                    'unit_price' => $product->price,
                    'currency' => $product->currency,
                    'total' => round($total, 2),
                    'notes' => null,
                ]);
            }
        }
        unset($q);

        // Orders
        $orders = [
            ['transaction_no' => 'ORD-' . strtoupper(Str::random(6)), 'buyer_company_id' => 5, 'seller_company_id' => 1, 'order_date' => date('Y-m-d'), 'status' => 'confirmed', 'expected_delivery' => date('Y-m-d', strtotime('+7 days'))],
            ['transaction_no' => 'ORD-' . strtoupper(Str::random(6)), 'buyer_company_id' => 6, 'seller_company_id' => 2, 'order_date' => date('Y-m-d', strtotime('-1 day')), 'status' => 'pending', 'expected_delivery' => date('Y-m-d', strtotime('+3 days'))],
            ['transaction_no' => 'ORD-' . strtoupper(Str::random(6)), 'buyer_company_id' => 7, 'seller_company_id' => 3, 'order_date' => date('Y-m-d', strtotime('-2 days')), 'status' => 'shipped', 'expected_delivery' => date('Y-m-d', strtotime('+5 days'))],
            ['transaction_no' => 'ORD-' . strtoupper(Str::random(6)), 'buyer_company_id' => 5, 'seller_company_id' => 4, 'order_date' => date('Y-m-d', strtotime('-3 days')), 'status' => 'delivered', 'expected_delivery' => date('Y-m-d', strtotime('-1 day'))],
        ];

        foreach ($orders as &$o) {
            $order = Order::create($o);
            $o['id'] = $order->id;

            $items = Product::inRandomOrder()->limit(2)->get();
            foreach ($items as $idx => $product) {
                $total = $product->price * rand(5, 30);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => rand(5, 30),
                    'unit_price' => $product->price,
                    'total' => round($total, 2),
                    'notes' => null,
                ]);
            }
        }
        unset($o);

        // Shipments
        $shipments = [
            ['tracking_number' => 'CX-' . strtoupper(Str::random(6)), 'origin_city' => 'Ho Chi Minh', 'origin_country' => 'Viet Nam', 'destination_city' => 'Jakarta', 'destination_country' => 'Indonesia', 'estimated_arrival' => date('Y-m-d', strtotime('+4 days')), 'status' => 'in_transit', 'current_location' => 'Gi Bong'],
            ['tracking_number' => 'CX-' . strtoupper(Str::random(6)), 'origin_city' => 'Hong Kong', 'origin_country' => 'Hong Kong', 'destination_city' => 'Makassar', 'destination_country' => 'Indonesia', 'estimated_arrival' => date('Y-m-d', strtotime('+6 days')), 'status' => 'pending', 'current_location' => null],
            ['tracking_number' => 'CX-' . strtoupper(Str::random(6)), 'origin_city' => 'Singapura', 'origin_country' => 'Singapura', 'destination_city' => 'Jakarta', 'destination_country' => 'Indonesia', 'estimated_arrival' => date('Y-m-d', strtotime('+2 days')), 'status' => 'delivered', 'current_location' => 'Jakarta'],
            ['tracking_number' => 'CX-' . strtoupper(Str::random(6)), 'origin_city' => 'Kuala Lumpur', 'origin_country' => 'Malaysia', 'destination_city' => 'Surabaya', 'destination_country' => 'Indonesia', 'estimated_arrival' => date('Y-m-d', strtotime('+8 days')), 'status' => 'exception', 'current_location' => 'Barat daya'],
        ];

        foreach ($shipments as &$s) {
            $shipment = Shipment::create($s);
            $s['id'] = $shipment->id;

            $events = [
                ['event' => 'Penerimaan paket', 'note' => 'Paket diterima di gudang'],
                ['event' => 'Di angkat', 'note' => 'Paket diangkat untuk pengiriman'],
            ];
            if ($shipment->status === 'delivered') {
                $events[] = ['event' => 'Selesai', 'note' => 'Paket sampai tujuan'];
            } elseif ($shipment->status === 'in_transit') {
                $events[] = ['event' => 'Dipantau', 'note' => 'Berada di tengah rute'];
            } elseif ($shipment->status === 'exception') {
                $events[] = ['event' => 'Delay', 'note' => 'Terjadi penundaan vận chuyển'];
            } else {
                $events[] = ['event' => 'Dikonfirmasi', 'note' => 'Pengiriman dijadwalkan'];
            }

            foreach ($events as $e) {
                ShipmentEvent::create([
                    'shipment_id' => $shipment->id,
                    'event' => $e['event'],
                    'occurred_at' => now(),
                    'note' => $e['note'],
                ]);
            }
        }
        unset($s);

        // Trade Center posts
        $posts = [
            ['type' => 'news', 'title' => 'Harga kopi naik di Eropa', 'content' => 'Harga kopi robusta mengalami kenaikan...',
             'excerpt' => 'Berita pasar perdagangan internasional.', 'status' => 'published', 'published_at' => now(), 'scheduled_at' => null],
            ['type' => 'export_guide', 'title' => 'Panduan ekspor kopi Indonesia', 'content' => 'Langkah-langkah ekspor kopi...',
             'excerpt' => 'Panduan lengkap ekspor kopi ke Eropa.', 'status' => 'published', 'published_at' => now(), 'scheduled_at' => null],
            ['type' => 'import_guide', 'title' => 'Panduan impor minyak goreng', 'content' => 'Persiapan impor minyak goreng...',
             'excerpt' => 'Panduan impor minyak goreng dari Malaysia.', 'status' => 'draft', 'published_at' => null, 'scheduled_at' => now()->addDay()],
            ['type' => 'country_profile', 'title' => 'Profil negara Malaysia', 'content' => 'Profil pasar Malaysia...',
             'excerpt' => 'Profil ekonomi dan kemudahan perdagangan.', 'status' => 'published', 'published_at' => now(), 'scheduled_at' => null],
            ['type' => 'glossary', 'title' => 'Istilah perdagangan internasional', 'content' => 'Definisi istilah-istilah perdagangan...',
             'excerpt' => 'Kamus istilah perdagangan global.', 'status' => 'pending', 'published_at' => null, 'scheduled_at' => null],
            ['type' => 'event', 'title' => 'Event Ekspor Asia', 'content' => 'Agenda event perdagangan di Asia...',
             'excerpt' => 'Event perdagangan internasional terbaru.', 'status' => 'scheduled', 'published_at' => null, 'scheduled_at' => now()->addDays(5)],
        ];

        foreach ($posts as &$post) {
            $post['slug'] = Str::slug($post['title']);
            $post['author_id'] = $users[2]->id;
            $saved = TradeCenterPost::create($post);
            $post['id'] = $saved->id;
        }
        unset($post);

        // Chat reports
        $reports = [
            ['conversation_id' => 'conv_' . strtoupper(Str::random(6)), 'reported_user_name' => 'User B', 'reporter_name' => 'User A', 'reason' => 'spam', 'status' => 'pending'],
            ['conversation_id' => 'conv_' . strtoupper(Str::random(6)), 'reported_user_name' => 'User C', 'reporter_name' => 'User A', 'reason' => 'harassment', 'status' => 'under_review'],
            ['conversation_id' => 'conv_' . strtoupper(Str::random(6)), 'reported_user_name' => 'User D', 'reporter_name' => 'User B', 'reason' => 'fraud', 'status' => 'resolved'],
            ['conversation_id' => 'conv_' . strtoupper(Str::random(6)), 'reported_user_name' => 'User E', 'reporter_name' => 'User C', 'reason' => 'inappropriate', 'status' => 'pending'],
        ];

        foreach ($reports as &$rep) {
            $rep['moderator_id'] = $users[1]->id;
            ChatReport::create($rep);
        }
        unset($rep);

        $this->command->info('Semua seeder berhasil dijalankan.');
    }
}
