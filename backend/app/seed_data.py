"""Seed data for POSapp — 200+ dummy products across 4 categories."""

from datetime import datetime

# Category: Makanan (id=1)
MAKANAN = [
    ("Nasi Goreng Spesial", 18000), ("Mie Goreng Jawa", 15000), ("Ayam Geprek", 20000),
    ("Ayam Bakar Wong Solo", 25000), ("Rendang Padang", 28000), ("Sate Ayam", 22000),
    ("Soto Ayam", 15000), ("Rawon", 20000), ("Bakso Malang", 17000), ("Mie Ayam Bakso", 18000),
    ("Nasi Pecel", 12000), ("Nasi Uduk", 14000), ("Lontong Sayur", 13000), ("Nasi Timbel", 12000),
    ("Gudeg Yogyakarta", 15000), ("Tum Ayam", 18000), ("Pepes Ikan", 22000), ("Pencuk Siti", 25000),
    ("Cumi Goreng Tepung", 24000), ("Udang Goreng Mentega", 28000), ("Kepiting Saus Padang", 45000),
    ("Rajungan Rebus", 40000), ("Ikan Goreng Sambal Dabu", 20000), ("Kakap Asam Manis", 35000),
    ("Gurame Goreng", 38000), ("Lele Goreng", 15000), ("Tongkol Bumbu Bali", 18000),
    ("Tahu Tempe Bacem", 10000), ("Tahu Isi", 8000), ("Tempe Goreng", 7000), ("Cireng", 6000),
    ("Risoles", 5000), ("Pastel", 6000), ("Kroket", 7000), ("Martabak Telur", 15000),
    ("Martabak Manis Coklat", 18000), ("Martabak Manis Keju", 20000), ("Pancong", 10000),
    ("Cakwe", 5000), ("Bubur Ayam", 12000), ("Bubur Kacang Hijau", 10000), ("Tahu Sumedang", 8000),
    ("Combro", 7000), ("Misro", 7000), ("Oncom Goreng", 6000), ("Batagor", 12000),
    ("Siomay Bandung", 13000), ("Cilok Bumbu Kacang", 10000), ("Mie Kocok", 14000),
]

# Category: Minuman (id=2)
MINUMAN = [
    ("Es Teh Manis", 5000), ("Es Jeruk", 7000), ("Es Jeruk Peras", 8000), ("Es Lemon Tea", 8000),
    ("Es Teh Tawar", 3000), ("Es Susu", 8000), ("Es Susu Coklat", 10000), ("Es Susu Vanilla", 10000),
    ("Es Kopi Hitam", 8000), ("Es Kopi Susu", 12000), ("Es Kopi Aren", 14000), ("Es Kopi Jahe", 13000),
    ("Es Cappuccino", 15000), ("Es Caffe Latte", 15000), ("Es Americano", 12000), ("Es Mocha", 16000),
    ("Es Matcha", 15000), ("Es Taro", 15000), ("Es Red Velvet", 15000), ("Es Thai Tea", 12000),
    ("Es Mangga", 12000), ("Es Jambu Kristal", 10000), ("Es Alpukat", 14000), ("Es Melon", 12000),
    ("Es Strawberry", 12000), ("Es Durian", 18000), ("Es Sirsak", 12000), ("Es Wortel", 10000),
    ("Jus Apel", 12000), ("Jus Jeruk", 12000), ("Jus Mangga", 12000), ("Jus Stroberi", 13000),
    ("Jus Tomat", 10000), ("Jus Nanas", 10000), ("Jus Semangka", 10000), ("Jus Belimbing", 10000),
    ("Air Mineral", 4000), ("Teh Hangat", 5000), ("Jeruk Hangat", 7000), ("Kopi Hangat", 8000),
    ("Wedang Jahe", 10000), ("Wedang uwuh", 12000), ("Bajigur", 10000), ("Bandrek", 10000),
    ("Cendol", 10000), ("Es Doger", 12000), ("Es Bubur Sumsum", 10000), ("Es Candil", 10000),
    ("Es Kacau", 12000), ("Es Rujak Serabi", 15000), ("Es Kuwut", 10000), ("Es Cincau", 8000),
]

# Category: Snack (id=3)
SNACK = [
    ("Keripik Singkong", 12000), ("Keripik Kentang", 15000), ("Keripik Tempe", 10000),
    ("Keripik Ubi", 12000), ("Keripik Balado", 14000), ("Keripik Paru", 18000),
    ("Basreng", 15000), ("Tori", 13000), ("Mie Lidi", 10000), ("Mie Lada", 10000),
    ("Roti Bakar Coklat", 12000), ("Roti Bakar Keju", 14000), ("Roti Bakar Kacang", 13000),
    ("Pisang Goreng", 10000), ("Pisang Keju", 12000), ("Pisang Coklat Keju", 15000),
    ("Ubi Goreng", 8000), ("Ubi Keju", 12000), ("Talas Goreng", 10000), ("Jedang", 8000),
    ("Sukun Goreng", 10000), ("Nagasari", 5000), ("Kue Pancong", 8000), ("Kue Ape", 5000),
    ("Lemper", 6000), ("Lontong", 5000), ("Kue Putu", 5000), ("Kue Talam", 5000),
    ("Kue Lapis", 6000), ("Kue Ku", 5000), ("Kue Bangkit", 8000), ("Kue Sagu Keju", 8000),
    ("Makaroni Pedas", 10000), ("Kacang Disco", 12000), ("Kacang Thailand", 10000),
    ("Edamame", 12000), ("Tahu Crispy", 8000), ("Tahu Aci", 10000), ("Cakalang Fufu", 15000),
    ("Abon Sapi", 18000), ("Abun Tah", 15000), ("Rendang Kering", 20000), ("Dendeng Balado", 22000),
    ("Roti Tawar", 15000), ("Croissant", 18000), ("Croffle", 15000), ("Puff Pastry", 12000),
    ("Dimsum Siomay", 15000), ("Dimsum Hakau", 12000), ("Dimsum Lumpia", 10000), ("Dimsum Char Siu", 18000),
    ("Chicken Wings", 18000), ("Chicken Drumstick", 20000), ("Nugget", 15000), ("Sosis Bakar", 12000),
]

# Category: Lainnya (id=4)
LAINNYA = [
    ("Sembako Medium", 50000), ("Mie Instan", 4000), ("Kopi Sachet", 3000),
    ("Teh Celup", 5000), ("Susu Kental Manis", 12000), ("Susu Bubuk", 25000),
    ("Gula Pasir", 15000), ("Garam", 5000), ("Minyak Goreng", 20000), ("Tepung Terigu", 15000),
    ("Tepung Beras", 12000), ("Tepung Tapioka", 12000), ("Sambal Botol", 8000),
    ("Saus Tomat", 9000), ("Saus Sambal", 8000), ("Kecap Manis", 10000), ("Kecap Asin", 8000),
    ("Terasi", 10000), ("Tauco", 12000), ("Sarden Kaleng", 15000), ("Ikan Asin", 15000),
    ("Telur Ayam 1kg", 22000), ("Ayam Potong 1kg", 35000), ("Daging Sapi 1kg", 130000),
    ("Beras 5kg", 75000), ("Sabun Mandi", 5000), ("Shampo Sachet", 3000),
    ("Pasta Gigi", 10000), ("Sikat Gigi", 8000), ("Minyak Kayu Putih", 12000),
    ("Minyak Angin", 15000), ("Betadine", 10000), ("Paracetamol", 5000),
    ("Obat Maag", 8000), ("Vitamin C", 10000), ("Teh Celup Green Tea", 8000),
    ("Kopi Sachet Hitam", 3000), ("Creamer", 8000), ("Gula Aren Sachet", 5000),
    ("Gas LPG 3kg", 25000), ("Arang", 10000), ("Korek Api", 3000),
    ("Plastik 1kg", 15000), ("Plastik 0.5kg", 8000), ("Tisu", 8000),
    ("Popok Bayi S", 40000), ("Popok Bayi M", 45000), ("Pembalut", 20000),
    ("Sabun Cuci Piring", 15000), ("Sabun Laundry", 18000), ("Pewangi Pakaian", 15000),
    ("Pembersih Lantai", 15000), ("Sprey Anti Nyamuk", 15000), ("Lidi Sapu", 5000),
]


def _build(items: list[tuple[str, int]], start_sku: int, now: datetime) -> list[dict]:
    out = []
    for idx, (name, price) in enumerate(items):
        img_id = (start_sku + idx) % 1000 or start_sku + idx
        out.append({
            "sku": f"PRD-{start_sku + idx:04d}",
            "name": name,
            "price": float(price),
            "stock": 50,
            "image_url": f"https://picsum.photos/seed/{img_id}/400/400",
            "created_at": now,
            "updated_at": now,
        })
    return out


def seed_makanan(now: datetime) -> list[dict]: return _build(MAKANAN, 100, now)
def seed_minuman(now: datetime) -> list[dict]: return _build(MINUMAN, 200, now)
def seed_snack(now: datetime) -> list[dict]: return _build(SNACK, 300, now)
def seed_lainnya(now: datetime) -> list[dict]: return _build(LAINNYA, 400, now)
