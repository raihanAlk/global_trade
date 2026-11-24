<?php
require 'vendor/autoload.php';
use Illuminate\Support\Str;

$strings = ['RFQRequest', 'Company', 'Order', 'Quotation', 'Product', 'Category', 'Shipment', 'RFQItem'];
foreach ($strings as $s) {
    echo $s . ': ' . Str::snake($s) . PHP_EOL;
}
