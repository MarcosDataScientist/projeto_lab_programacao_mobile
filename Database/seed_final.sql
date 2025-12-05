-- Seed de Produtos e Anúncios
-- 50 produtos de tecnologia e 100 anúncios variados

-- Inserir 50 produtos de tecnologia
INSERT INTO product (sku, name, description, cost, inventory, ean) VALUES
-- Celulares
('IPHONE-15-128', 'iPhone 15 128GB', 'Apple iPhone 15 com 128GB de armazenamento, tela Super Retina XDR de 6.1 polegadas', 4500.00, 25, '7891234567890'),
('IPHONE-15-256', 'iPhone 15 256GB', 'Apple iPhone 15 com 256GB de armazenamento, câmera dupla de 48MP', 5200.00, 18, '7891234567891'),
('IPHONE-14-128', 'iPhone 14 128GB', 'Apple iPhone 14 com 128GB, chip A15 Bionic, tela de 6.1 polegadas', 3800.00, 30, '7891234567892'),
('SAMSUNG-S23-128', 'Samsung Galaxy S23 128GB', 'Samsung Galaxy S23 com 128GB, tela Dynamic AMOLED 2X de 6.1"', 3200.00, 22, '7891234567893'),
('SAMSUNG-S23-256', 'Samsung Galaxy S23 256GB', 'Samsung Galaxy S23 com 256GB, câmera tripla de 50MP', 3800.00, 15, '7891234567894'),
('SAMSUNG-A54-128', 'Samsung Galaxy A54 128GB', 'Samsung Galaxy A54 com 128GB, tela Super AMOLED de 6.4"', 1800.00, 40, '7891234567895'),
('XIAOMI-13-256', 'Xiaomi 13 256GB', 'Xiaomi 13 com 256GB, Snapdragon 8 Gen 2, câmera Leica', 2800.00, 20, '7891234567896'),
('XIAOMI-REDMI-128', 'Xiaomi Redmi Note 12 128GB', 'Xiaomi Redmi Note 12 com 128GB, tela AMOLED de 6.67"', 1200.00, 35, '7891234567897'),
('MOTOROLA-EDGE-128', 'Motorola Edge 40 128GB', 'Motorola Edge 40 com 128GB, tela pOLED de 6.55"', 2200.00, 28, '7891234567898'),
('MOTOROLA-G84-128', 'Motorola Moto G84 128GB', 'Motorola Moto G84 com 128GB, bateria de 5000mAh', 1400.00, 32, '7891234567899'),

-- Smartwatches
('APPLE-WATCH-S9-45', 'Apple Watch Series 9 45mm', 'Apple Watch Series 9 GPS 45mm, caixa de alumínio', 2800.00, 15, '7891234567900'),
('APPLE-WATCH-S9-41', 'Apple Watch Series 9 41mm', 'Apple Watch Series 9 GPS 41mm, caixa de alumínio', 2500.00, 18, '7891234567901'),
('APPLE-WATCH-SE-44', 'Apple Watch SE 44mm', 'Apple Watch SE GPS 44mm, segunda geração', 1800.00, 25, '7891234567902'),
('SAMSUNG-WATCH-6-44', 'Samsung Galaxy Watch6 44mm', 'Samsung Galaxy Watch6 Bluetooth 44mm, tela Super AMOLED', 1600.00, 20, '7891234567903'),
('SAMSUNG-WATCH-5-40', 'Samsung Galaxy Watch5 40mm', 'Samsung Galaxy Watch5 Bluetooth 40mm, resistente à água', 1200.00, 22, '7891234567904'),
('XIAOMI-WATCH-S1', 'Xiaomi Watch S1', 'Xiaomi Watch S1 Active, tela AMOLED de 1.43"', 800.00, 30, '7891234567905'),
('AMAZFIT-GTR-4', 'Amazfit GTR 4', 'Amazfit GTR 4, GPS integrado, bateria de até 14 dias', 900.00, 28, '7891234567906'),
('GARMIN-VENU-2', 'Garmin Venu 2', 'Garmin Venu 2, GPS, monitoramento de saúde avançado', 2000.00, 12, '7891234567907'),

-- Fones de Ouvido
('AIRPODS-PRO-2', 'Apple AirPods Pro 2', 'Apple AirPods Pro 2ª geração com cancelamento ativo de ruído', 1800.00, 35, '7891234567908'),
('AIRPODS-3', 'Apple AirPods 3ª Geração', 'Apple AirPods 3ª geração com chip H1', 1200.00, 40, '7891234567909'),
('SAMSUNG-BUDS-2', 'Samsung Galaxy Buds2 Pro', 'Samsung Galaxy Buds2 Pro, cancelamento de ruído inteligente', 1000.00, 30, '7891234567910'),
('SAMSUNG-BUDS-FE', 'Samsung Galaxy Buds FE', 'Samsung Galaxy Buds FE, cancelamento de ruído', 600.00, 45, '7891234567911'),
('SONY-WH-1000XM5', 'Sony WH-1000XM5', 'Sony WH-1000XM5, cancelamento de ruído líder, 30h de bateria', 2200.00, 18, '7891234567912'),
('SONY-WF-1000XM5', 'Sony WF-1000XM5', 'Sony WF-1000XM5, fones intra-auriculares com cancelamento de ruído', 1800.00, 22, '7891234567913'),
('JBL-TUNE-770NC', 'JBL Tune 770NC', 'JBL Tune 770NC, cancelamento de ruído, 70h de bateria', 800.00, 38, '7891234567914'),
('JBL-LIVE-660NC', 'JBL Live 660NC', 'JBL Live 660NC, cancelamento de ruído adaptativo', 900.00, 32, '7891234567915'),
('XIAOMI-BUDS-4', 'Xiaomi Buds 4 Pro', 'Xiaomi Buds 4 Pro, cancelamento de ruído híbrido', 700.00, 40, '7891234567916'),
('EDIFIER-W820NB', 'Edifier W820NB', 'Edifier W820NB, cancelamento de ruído ativo, Hi-Res Audio', 500.00, 50, '7891234567917'),

-- Tablets
('IPAD-AIR-64', 'iPad Air 64GB', 'Apple iPad Air 10.9" 64GB Wi-Fi, chip M1', 3500.00, 20, '7891234567918'),
('IPAD-AIR-256', 'iPad Air 256GB', 'Apple iPad Air 10.9" 256GB Wi-Fi, chip M1', 4500.00, 15, '7891234567919'),
('IPAD-10-64', 'iPad 10.2" 64GB', 'Apple iPad 10.2" 64GB Wi-Fi, chip A13 Bionic', 2800.00, 25, '7891234567920'),
('SAMSUNG-TAB-S9-128', 'Samsung Galaxy Tab S9 128GB', 'Samsung Galaxy Tab S9 11" 128GB Wi-Fi, S Pen incluído', 4200.00, 12, '7891234567921'),
('SAMSUNG-TAB-A9-64', 'Samsung Galaxy Tab A9 64GB', 'Samsung Galaxy Tab A9 10.5" 64GB Wi-Fi', 1200.00, 30, '7891234567922'),
('XIAOMI-PAD-6-128', 'Xiaomi Pad 6 128GB', 'Xiaomi Pad 6 11" 128GB Wi-Fi, Snapdragon 870', 2000.00, 22, '7891234567923'),
('LENOVO-TAB-M10', 'Lenovo Tab M10 Plus', 'Lenovo Tab M10 Plus 10.6" 64GB Wi-Fi', 1000.00, 28, '7891234567924'),

-- Notebooks
('MACBOOK-AIR-M2-256', 'MacBook Air 13" M2 256GB', 'Apple MacBook Air 13" chip M2 256GB SSD, 8GB RAM', 8500.00, 10, '7891234567925'),
('MACBOOK-AIR-M2-512', 'MacBook Air 13" M2 512GB', 'Apple MacBook Air 13" chip M2 512GB SSD, 8GB RAM', 10500.00, 8, '7891234567926'),
('MACBOOK-PRO-M3-512', 'MacBook Pro 14" M3 512GB', 'Apple MacBook Pro 14" chip M3 512GB SSD, 18GB RAM', 15000.00, 5, '7891234567927'),
('DELL-XPS-13-512', 'Dell XPS 13 512GB', 'Dell XPS 13 Intel Core i7 512GB SSD, 16GB RAM', 7500.00, 12, '7891234567928'),
('DELL-G15-I7-512', 'Dell G15 i7 512GB', 'Dell G15 Gaming Intel i7 512GB SSD, 16GB RAM, RTX 3050', 5500.00, 15, '7891234567929'),
('LENOVO-IDEAPAD-512', 'Lenovo IdeaPad 3i 512GB', 'Lenovo IdeaPad 3i Intel i5 512GB SSD, 8GB RAM', 3200.00, 20, '7891234567930'),
('ASUS-VIVOBOOK-512', 'ASUS VivoBook 15 512GB', 'ASUS VivoBook 15 Intel i5 512GB SSD, 8GB RAM', 2800.00, 18, '7891234567931'),
('HP-PAVILION-512', 'HP Pavilion 15 512GB', 'HP Pavilion 15 Intel i5 512GB SSD, 8GB RAM', 3000.00, 16, '7891234567932'),

-- Acessórios
('CARREGADOR-MAGSAFE', 'Carregador MagSafe Apple', 'Carregador MagSafe Apple 15W para iPhone', 300.00, 60, '7891234567933'),
('CABO-LIGHTNING-2M', 'Cabo Lightning 2m Apple', 'Cabo Lightning para USB-C 2 metros Apple', 150.00, 80, '7891234567934'),
('CABO-USB-C-2M', 'Cabo USB-C 2m', 'Cabo USB-C para USB-C 2 metros, suporte a 100W', 80.00, 100, '7891234567935'),
('POWERBANK-20000', 'Power Bank 20000mAh', 'Power Bank 20000mAh com carregamento rápido USB-C', 200.00, 45, '7891234567936'),
('POWERBANK-10000', 'Power Bank 10000mAh', 'Power Bank 10000mAh compacto com entrada USB-C', 120.00, 55, '7891234567937'),
('CASE-IPHONE-15', 'Case iPhone 15 Silicone', 'Case de silicone para iPhone 15, várias cores', 150.00, 70, '7891234567938'),
('CASE-IPHONE-14', 'Case iPhone 14 Transparente', 'Case transparente para iPhone 14 com proteção', 80.00, 85, '7891234567939'),
('PELICULA-VIDRO-IPHONE', 'Película de Vidro iPhone', 'Película de vidro temperado para iPhone, kit com 2 unidades', 50.00, 120, '7891234567940'),
('SUPORTE-NOTEBOOK', 'Suporte para Notebook', 'Suporte ergonômico para notebook, altura ajustável', 100.00, 40, '7891234567941'),
('MOUSE-LOGI-MX3', 'Mouse Logitech MX Master 3S', 'Mouse Logitech MX Master 3S sem fio, sensor de 8000 DPI', 450.00, 30, '7891234567942'),
('TECLADO-LOGI-MX', 'Teclado Logitech MX Keys', 'Teclado Logitech MX Keys sem fio, retroiluminado', 600.00, 25, '7891234567943'),
('WEBCAM-LOGI-C920', 'Webcam Logitech C920', 'Webcam Logitech C920 HD Pro 1080p com microfone', 500.00, 20, '7891234567944'),
('HD-EXTERNO-1TB', 'HD Externo 1TB', 'HD Externo portátil 1TB USB 3.0', 350.00, 35, '7891234567945'),
('SSD-EXTERNO-512GB', 'SSD Externo 512GB', 'SSD Externo portátil 512GB USB-C', 400.00, 28, '7891234567946');

-- Inserir 100 anúncios variados
INSERT INTO listing (marketplace_item_id, price, marketplace, product_id) VALUES
-- iPhone 15 128GB (produto_id 1)
('MLB1234567890', 5200.00, 'Mercado Livre', 1),
('MLB1234567891', 5100.00, 'Mercado Livre', 1),
('AMZ-IPH15-128-001', 5300.00, 'Amazon', 1),
('AMZ-IPH15-128-002', 5250.00, 'Amazon', 1),
('MAG-IPH15-128-001', 5150.00, 'Magazine Luiza', 1),

-- iPhone 15 256GB (produto_id 2)
('MLB1234567892', 5900.00, 'Mercado Livre', 2),
('MLB1234567893', 5800.00, 'Mercado Livre', 2),
('AMZ-IPH15-256-001', 6000.00, 'Amazon', 2),
('AMZ-IPH15-256-002', 5950.00, 'Amazon', 2),
('MAG-IPH15-256-001', 5850.00, 'Magazine Luiza', 2),
('AMR-IPH15-256-001', 5900.00, 'Americanas', 2),

-- iPhone 14 128GB (produto_id 3)
('MLB1234567894', 4200.00, 'Mercado Livre', 3),
('MLB1234567895', 4100.00, 'Mercado Livre', 3),
('AMZ-IPH14-128-001', 4300.00, 'Amazon', 3),
('MAG-IPH14-128-001', 4150.00, 'Magazine Luiza', 3),
('CBH-IPH14-128-001', 4200.00, 'Casas Bahia', 3),

-- Samsung Galaxy S23 128GB (produto_id 4)
('MLB1234567896', 3600.00, 'Mercado Livre', 4),
('MLB1234567897', 3500.00, 'Mercado Livre', 4),
('AMZ-S23-128-001', 3700.00, 'Amazon', 4),
('MAG-S23-128-001', 3550.00, 'Magazine Luiza', 4),
('AMR-S23-128-001', 3600.00, 'Americanas', 4),

-- Samsung Galaxy S23 256GB (produto_id 5)
('MLB1234567898', 4200.00, 'Mercado Livre', 5),
('AMZ-S23-256-001', 4300.00, 'Amazon', 5),
('MAG-S23-256-001', 4150.00, 'Magazine Luiza', 5),

-- Samsung Galaxy A54 128GB (produto_id 6)
('MLB1234567899', 2000.00, 'Mercado Livre', 6),
('MLB1234567900', 1950.00, 'Mercado Livre', 6),
('AMZ-A54-128-001', 2100.00, 'Amazon', 6),
('MAG-A54-128-001', 2050.00, 'Magazine Luiza', 6),
('CBH-A54-128-001', 2000.00, 'Casas Bahia', 6),

-- Xiaomi 13 256GB (produto_id 7)
('MLB1234567901', 3100.00, 'Mercado Livre', 7),
('AMZ-XM13-256-001', 3200.00, 'Amazon', 7),
('MAG-XM13-256-001', 3150.00, 'Magazine Luiza', 7),

-- Xiaomi Redmi Note 12 128GB (produto_id 8)
('MLB1234567902', 1350.00, 'Mercado Livre', 8),
('MLB1234567903', 1300.00, 'Mercado Livre', 8),
('AMZ-REDMI-12-001', 1400.00, 'Amazon', 8),
('CBH-REDMI-12-001', 1350.00, 'Casas Bahia', 8),

-- Motorola Edge 40 128GB (produto_id 9)
('MLB1234567904', 2450.00, 'Mercado Livre', 9),
('AMZ-EDGE40-001', 2500.00, 'Amazon', 9),
('MAG-EDGE40-001', 2400.00, 'Magazine Luiza', 9),

-- Motorola Moto G84 128GB (produto_id 10)
('MLB1234567905', 1550.00, 'Mercado Livre', 10),
('AMZ-G84-001', 1600.00, 'Amazon', 10),
('CBH-G84-001', 1550.00, 'Casas Bahia', 10),

-- Apple Watch Series 9 45mm (produto_id 11)
('MLB1234567906', 3100.00, 'Mercado Livre', 11),
('AMZ-AW9-45-001', 3200.00, 'Amazon', 11),
('MAG-AW9-45-001', 3150.00, 'Magazine Luiza', 11),

-- Apple Watch Series 9 41mm (produto_id 12)
('MLB1234567907', 2800.00, 'Mercado Livre', 12),
('AMZ-AW9-41-001', 2900.00, 'Amazon', 12),

-- Apple Watch SE 44mm (produto_id 13)
('MLB1234567908', 2000.00, 'Mercado Livre', 13),
('MLB1234567909', 1950.00, 'Mercado Livre', 13),
('AMZ-AWSE-44-001', 2100.00, 'Amazon', 13),
('CBH-AWSE-44-001', 2000.00, 'Casas Bahia', 13),

-- Samsung Galaxy Watch6 44mm (produto_id 14)
('MLB1234567910', 1800.00, 'Mercado Livre', 14),
('AMZ-W6-44-001', 1850.00, 'Amazon', 14),
('MAG-W6-44-001', 1800.00, 'Magazine Luiza', 14),

-- Samsung Galaxy Watch5 40mm (produto_id 15)
('MLB1234567911', 1350.00, 'Mercado Livre', 15),
('AMZ-W5-40-001', 1400.00, 'Amazon', 15),

-- Xiaomi Watch S1 (produto_id 16)
('MLB1234567912', 900.00, 'Mercado Livre', 16),
('AMZ-XMW-S1-001', 950.00, 'Amazon', 16),

-- Amazfit GTR 4 (produto_id 17)
('MLB1234567913', 1000.00, 'Mercado Livre', 17),
('AMZ-AMZ-GTR4-001', 1050.00, 'Amazon', 17),

-- Garmin Venu 2 (produto_id 18)
('MLB1234567914', 2200.00, 'Mercado Livre', 18),
('AMZ-GAR-VENU2-001', 2300.00, 'Amazon', 18),

-- Apple AirPods Pro 2 (produto_id 19)
('MLB1234567915', 2000.00, 'Mercado Livre', 19),
('MLB1234567916', 1950.00, 'Mercado Livre', 19),
('AMZ-APP2-001', 2100.00, 'Amazon', 19),
('MAG-APP2-001', 2000.00, 'Magazine Luiza', 19),
('AMR-APP2-001', 2050.00, 'Americanas', 19),

-- Apple AirPods 3ª Geração (produto_id 20)
('MLB1234567917', 1350.00, 'Mercado Livre', 20),
('AMZ-AP3-001', 1400.00, 'Amazon', 20),
('CBH-AP3-001', 1350.00, 'Casas Bahia', 20),

-- Samsung Galaxy Buds2 Pro (produto_id 21)
('MLB1234567918', 1150.00, 'Mercado Livre', 21),
('AMZ-BUDS2P-001', 1200.00, 'Amazon', 21),

-- Samsung Galaxy Buds FE (produto_id 22)
('MLB1234567919', 700.00, 'Mercado Livre', 22),
('MLB1234567920', 680.00, 'Mercado Livre', 22),
('AMZ-BUDS-FE-001', 720.00, 'Amazon', 22),
('CBH-BUDS-FE-001', 700.00, 'Casas Bahia', 22),

-- Sony WH-1000XM5 (produto_id 23)
('MLB1234567921', 2450.00, 'Mercado Livre', 23),
('AMZ-SONY-WH-001', 2500.00, 'Amazon', 23),
('MAG-SONY-WH-001', 2450.00, 'Magazine Luiza', 23),

-- Sony WF-1000XM5 (produto_id 24)
('MLB1234567922', 2000.00, 'Mercado Livre', 24),
('AMZ-SONY-WF-001', 2100.00, 'Amazon', 24),

-- JBL Tune 770NC (produto_id 25)
('MLB1234567923', 900.00, 'Mercado Livre', 25),
('AMZ-JBL-770-001', 950.00, 'Amazon', 25),

-- JBL Live 660NC (produto_id 26)
('MLB1234567924', 1000.00, 'Mercado Livre', 26),
('AMZ-JBL-660-001', 1050.00, 'Amazon', 26),

-- Xiaomi Buds 4 Pro (produto_id 27)
('MLB1234567925', 800.00, 'Mercado Livre', 27),
('AMZ-XM-BUDS4-001', 850.00, 'Amazon', 27),

-- Edifier W820NB (produto_id 28)
('MLB1234567926', 550.00, 'Mercado Livre', 28),
('AMZ-EDF-W820-001', 600.00, 'Amazon', 28),
('CBH-EDF-W820-001', 550.00, 'Casas Bahia', 28),

-- iPad Air 64GB (produto_id 29)
('MLB1234567927', 3800.00, 'Mercado Livre', 29),
('AMZ-IPA-AIR64-001', 3900.00, 'Amazon', 29),
('MAG-IPA-AIR64-001', 3850.00, 'Magazine Luiza', 29),

-- iPad Air 256GB (produto_id 30)
('MLB1234567928', 4800.00, 'Mercado Livre', 30),
('AMZ-IPA-AIR256-001', 4900.00, 'Amazon', 30),

-- iPad 10.2" 64GB (produto_id 31)
('MLB1234567929', 3100.00, 'Mercado Livre', 31),
('MLB1234567930', 3050.00, 'Mercado Livre', 31),
('AMZ-IPA-102-001', 3200.00, 'Amazon', 31),
('CBH-IPA-102-001', 3100.00, 'Casas Bahia', 31),

-- Samsung Galaxy Tab S9 128GB (produto_id 32)
('MLB1234567931', 4500.00, 'Mercado Livre', 32),
('AMZ-TAB-S9-001', 4600.00, 'Amazon', 32),

-- Samsung Galaxy Tab A9 64GB (produto_id 33)
('MLB1234567932', 1350.00, 'Mercado Livre', 33),
('AMZ-TAB-A9-001', 1400.00, 'Amazon', 33),
('CBH-TAB-A9-001', 1350.00, 'Casas Bahia', 33),

-- Xiaomi Pad 6 128GB (produto_id 34)
('MLB1234567933', 2200.00, 'Mercado Livre', 34),
('AMZ-XM-PAD6-001', 2300.00, 'Amazon', 34),

-- Lenovo Tab M10 Plus (produto_id 35)
('MLB1234567934', 1150.00, 'Mercado Livre', 35),
('AMZ-LNV-M10-001', 1200.00, 'Amazon', 35),

-- MacBook Air 13" M2 256GB (produto_id 36)
('MLB1234567935', 9200.00, 'Mercado Livre', 36),
('AMZ-MBA-M2-256-001', 9300.00, 'Amazon', 36),
('MAG-MBA-M2-256-001', 9250.00, 'Magazine Luiza', 36),

-- MacBook Air 13" M2 512GB (produto_id 37)
('MLB1234567936', 11200.00, 'Mercado Livre', 37),
('AMZ-MBA-M2-512-001', 11300.00, 'Amazon', 37),

-- MacBook Pro 14" M3 512GB (produto_id 38)
('MLB1234567937', 15800.00, 'Mercado Livre', 38),
('AMZ-MBP-M3-512-001', 16000.00, 'Amazon', 38),

-- Dell XPS 13 512GB (produto_id 39)
('MLB1234567938', 8000.00, 'Mercado Livre', 39),
('AMZ-DELL-XPS-001', 8100.00, 'Amazon', 39),
('MAG-DELL-XPS-001', 8050.00, 'Magazine Luiza', 39),

-- Dell G15 i7 512GB (produto_id 40)
('MLB1234567939', 6000.00, 'Mercado Livre', 40),
('MLB1234567940', 5950.00, 'Mercado Livre', 40),
('AMZ-DELL-G15-001', 6100.00, 'Amazon', 40),
('AMR-DELL-G15-001', 6000.00, 'Americanas', 40),

-- Lenovo IdeaPad 3i 512GB (produto_id 41)
('MLB1234567941', 3500.00, 'Mercado Livre', 41),
('AMZ-LNV-ID3-001', 3600.00, 'Amazon', 41),
('CBH-LNV-ID3-001', 3500.00, 'Casas Bahia', 41),

-- ASUS VivoBook 15 512GB (produto_id 42)
('MLB1234567942', 3100.00, 'Mercado Livre', 42),
('AMZ-ASUS-VB15-001', 3200.00, 'Amazon', 42),

-- HP Pavilion 15 512GB (produto_id 43)
('MLB1234567943', 3300.00, 'Mercado Livre', 43),
('AMZ-HP-PAV-001', 3400.00, 'Amazon', 43),

-- Carregador MagSafe (produto_id 44)
('MLB1234567944', 350.00, 'Mercado Livre', 44),
('MLB1234567945', 340.00, 'Mercado Livre', 44),
('AMZ-MAGSAFE-001', 360.00, 'Amazon', 44),
('CBH-MAGSAFE-001', 350.00, 'Casas Bahia', 44),

-- Cabo Lightning 2m (produto_id 45)
('MLB1234567946', 180.00, 'Mercado Livre', 45),
('AMZ-LIGHT-2M-001', 190.00, 'Amazon', 45),

-- Cabo USB-C 2m (produto_id 46)
('MLB1234567947', 100.00, 'Mercado Livre', 46),
('MLB1234567948', 95.00, 'Mercado Livre', 46),
('AMZ-USB-C-2M-001', 105.00, 'Amazon', 46),
('CBH-USB-C-2M-001', 100.00, 'Casas Bahia', 46),

-- Power Bank 20000mAh (produto_id 47)
('MLB1234567949', 230.00, 'Mercado Livre', 47),
('AMZ-PB-20K-001', 240.00, 'Amazon', 47),

-- Power Bank 10000mAh (produto_id 48)
('MLB1234567950', 140.00, 'Mercado Livre', 48),
('MLB1234567951', 135.00, 'Mercado Livre', 48),
('AMZ-PB-10K-001', 145.00, 'Amazon', 48),
('CBH-PB-10K-001', 140.00, 'Casas Bahia', 48),

-- Case iPhone 15 Silicone (produto_id 49)
('MLB1234567952', 180.00, 'Mercado Livre', 49),
('AMZ-CASE-IP15-001', 190.00, 'Amazon', 49),

-- Case iPhone 14 Transparente (produto_id 50)
('MLB1234567953', 100.00, 'Mercado Livre', 50),
('AMZ-CASE-IP14-001', 110.00, 'Amazon', 50),
('CBH-CASE-IP14-001', 100.00, 'Casas Bahia', 50);

