const getStoreSearchUrl = (platformName, productName) => {
  const query = encodeURIComponent(productName);
  switch (platformName.toLowerCase().trim()) {
    case 'amazon':
      return `https://www.amazon.in/s?k=${query}`;
    case 'flipkart':
      return `https://www.flipkart.com/search?q=${query}`;
    case 'croma':
      return `https://www.croma.com/searchB?q=${query}`;
    case 'reliance digital':
      return `https://www.reliancedigital.in/search?q=${query}`;
    case 'myntra':
      return `https://www.myntra.com/search?q=${query}`;
    case 'ajio':
      return `https://www.ajio.com/search/?text=${query}`;
    case 'nykaa':
      return `https://www.nykaa.com/search/result/?q=${query}`;
    case 'tata cliq':
      return `https://www.tatacliq.com/search/?searchCategory=all&text=${query}`;
    case 'meesho':
      return `https://www.meesho.com/search?q=${query}`;
    default:
      return `https://google.com/search?q=${query}+buy+online`;
  }
};

const blueprints = [
  // 1. Smartphones
  {
    id: 'iphone-15-pro',
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/4/r/-original-imagtc4g22rcatjg.jpeg?q=70',
    description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a powerful iPhone camera system.',
    basePrice: 134900,
    platforms: [
      { name: 'Amazon', discount: 5000, rating: 4.6, reviews: 12050 },
      { name: 'Flipkart', discount: 6000, rating: 4.7, reviews: 8000 },
      { name: 'Croma', discount: 0, rating: 4.5, reviews: 4500 }
    ]
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 5G (256 GB) - Titanium Gray',
    brand: 'Samsung',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/m/z/-original-imahgfmxumntk7sy.jpeg?q=70',
    description: 'The ultimate Galaxy Ultra experience. Features Galaxy AI, a built-in S Pen, a stunning 200MP camera, and the Snapdragon 8 Gen 3 processor.',
    basePrice: 129999,
    platforms: [
      { name: 'Amazon', discount: 10000, rating: 4.6, reviews: 9450 },
      { name: 'Flipkart', discount: 12000, rating: 4.5, reviews: 6500 },
      { name: 'Reliance Digital', discount: 9000, rating: 4.5, reviews: 900 }
    ]
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12 5G (16GB RAM, 512GB Storage) - Silky Black',
    brand: 'OnePlus',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/7/z/j/12-cph2573-oneplus-original-imahjngudb3jjkew.jpeg?q=70',
    description: 'Redefined flagship performance with the Snapdragon 8 Gen 3, a 4th Gen Hasselblad Camera for Mobile, and super-fast 100W SUPERVOOC charging.',
    basePrice: 69999,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.5, reviews: 3400 },
      { name: 'Flipkart', discount: 2000, rating: 4.4, reviews: 1500 }
    ]
  },
  {
    id: 'google-pixel-8a',
    name: 'Google Pixel 8a 5G (128 GB) - Aloe Green',
    brand: 'Google',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/f/h/n/pixel-8a-ga05570-in-google-original-imahyn3ncc6gcfnc.jpeg?q=70',
    description: 'Powered by the custom Google Tensor G3 chip, featuring advanced AI photo editing tools like Best Take and Magic Eraser, and 7 years of OS updates.',
    basePrice: 52999,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.5, reviews: 1200 },
      { name: 'Flipkart', discount: 4500, rating: 4.4, reviews: 2300 }
    ]
  },
  {
    id: 'xiaomi-14',
    name: 'Xiaomi 14 5G (12GB RAM, 512GB Storage) - Jade Green',
    brand: 'Xiaomi',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/2/z/-original-imahfpwv6yzawcuc.jpeg?q=70',
    description: 'Compact 6.36-inch flagship with Leica Professional Optical Lens, Snapdragon 8 Gen 3 processor, and 90W HyperCharge.',
    basePrice: 79999,
    platforms: [
      { name: 'Amazon', discount: 10000, rating: 4.5, reviews: 850 },
      { name: 'Flipkart', discount: 8000, rating: 4.4, reviews: 520 }
    ]
  },
  {
    id: 'moto-edge-50',
    name: 'Motorola Edge 50 Pro 5G (12GB RAM, 256GB) - Luxe Lavender',
    brand: 'Motorola',
    category: 'Electronics',
    subCategory: 'Smartphone',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/g/i/n/-original-imagzhspjy5g8nh3.jpeg?q=70',
    description: 'Stunning curved pOLED display, Pantone validated camera and colors, and blazing-fast 125W TurboPower charging.',
    basePrice: 35999,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.3, reviews: 1800 },
      { name: 'Flipkart', discount: 4000, rating: 4.4, reviews: 3400 }
    ]
  },

  // 2. Laptops & Tablets
  {
    id: 'macbook-air-m3',
    name: 'Apple 2024 MacBook Air 13-inch (M3 chip, 8GB RAM, 256GB SSD) - Space Grey',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Laptop',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/s/d/p/chromebook-11ijl9-chromebook-lenovo-original-imahczggpnn6tgge.jpeg?q=70',
    description: 'The incredibly thin and fast MacBook Air with the M3 chip. Built for Apple Intelligence and featuring up to 18 hours of battery life.',
    basePrice: 114900,
    platforms: [
      { name: 'Amazon', discount: 8000, rating: 4.7, reviews: 3200 },
      { name: 'Croma', discount: 10000, rating: 4.6, reviews: 1100 }
    ]
  },
  {
    id: 'dell-xps-13',
    name: 'Dell XPS 13 9340 Laptop (Intel Core Ultra 7, 16GB RAM, 512GB SSD) - Platinum',
    brand: 'Dell',
    category: 'Electronics',
    subCategory: 'Laptop',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/f/u/d/-original-imahmhhncbddugp2.jpeg?q=70',
    description: 'Crafted from premium aluminum with a stunning borderless InfinityEdge display. Intel Evo edition powered by the latest Intel Core Ultra 7 processor.',
    basePrice: 145990,
    platforms: [
      { name: 'Amazon', discount: 12000, rating: 4.3, reviews: 780 },
      { name: 'Croma', discount: 15000, rating: 4.4, reviews: 220 }
    ]
  },
  {
    id: 'asus-zenbook',
    name: 'ASUS Zenbook 14 OLED Laptop (AMD Ryzen 7, 16GB RAM, 1TB SSD) - Ponder Blue',
    brand: 'ASUS',
    category: 'Electronics',
    subCategory: 'Laptop',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/s/9/z/-original-imahg53xygzzzb6g.jpeg?q=70',
    description: 'Breathtaking 14-inch 2.8K 120Hz OLED HDR display, exceptionally portable metal chassis, and stellar performance with the Ryzen 7 processor.',
    basePrice: 94990,
    platforms: [
      { name: 'Amazon', discount: 8000, rating: 4.5, reviews: 350 },
      { name: 'Croma', discount: 6000, rating: 4.3, reviews: 120 }
    ]
  },
  {
    id: 'hp-pavilion',
    name: 'HP Pavilion 15 Laptop (Intel Core i5, 16GB RAM, 512GB SSD) - Natural Silver',
    brand: 'HP',
    category: 'Electronics',
    subCategory: 'Laptop',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/e/t/p/-original-imahhjyugkghz6yp.jpeg?q=70',
    description: 'Premium performance in a thin and light design. Featuring long battery life and a micro-edge full HD screen for visual excellence.',
    basePrice: 62900,
    platforms: [
      { name: 'Amazon', discount: 5000, rating: 4.3, reviews: 1240 },
      { name: 'Croma', discount: 4000, rating: 4.2, reviews: 650 }
    ]
  },
  {
    id: 'lenovo-thinkpad',
    name: 'Lenovo ThinkPad E14 Gen 5 (Intel Core i5, 16GB RAM, 512GB SSD) - Black',
    brand: 'Lenovo',
    category: 'Electronics',
    subCategory: 'Laptop',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/e/o/n/thinkpad-e14-business-laptop-lenovo-original-imah7qfvgmgmyzfu.jpeg?q=70',
    description: 'Legendary durability and performance. Boasting a spill-resistant keyboard, red TrackPoint, and robust security features for business professionals.',
    basePrice: 68900,
    platforms: [
      { name: 'Amazon', discount: 6000, rating: 4.4, reviews: 540 },
      { name: 'Croma', discount: 5000, rating: 4.3, reviews: 180 }
    ]
  },
  {
    id: 'ipad-pro',
    name: 'Apple iPad Pro 11-inch (M4 chip, Retina XDR, 256GB, Wi-Fi) - Silver',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Tablet',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/tablet/a/m/e/-original-imagj72vegwqvkxk.jpeg?q=70',
    description: 'Impossibly thin design powered by the revolutionary M4 chip with an advanced Neural Engine, and a tandem OLED display representing the peak of screens.',
    basePrice: 99900,
    platforms: [
      { name: 'Amazon', discount: 4000, rating: 4.7, reviews: 620 },
      { name: 'Flipkart', discount: 5000, rating: 4.6, reviews: 450 }
    ]
  },
  {
    id: 'samsung-tab-s9',
    name: 'Samsung Galaxy Tab S9 Ultra (12GB RAM, 256GB Storage) - Graphite',
    brand: 'Samsung',
    category: 'Electronics',
    subCategory: 'Tablet',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/tablet/p/j/n/-original-imah69ytz7yfmhje.jpeg?q=70',
    description: 'Breathtaking 14.6-inch Dynamic AMOLED 2X display, IP68 water resistance, and the powerful Snapdragon 8 Gen 2 processor with S Pen included.',
    basePrice: 108999,
    platforms: [
      { name: 'Amazon', discount: 9000, rating: 4.7, reviews: 420 },
      { name: 'Flipkart', discount: 10000, rating: 4.6, reviews: 310 }
    ]
  },

  // 3. Audio & Wearables
  {
    id: 'sony-wh-1000xm5',
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
    brand: 'Sony',
    category: 'Electronics',
    subCategory: 'Headphones',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/v/a/p/-original-imahfctt8rdznt4g.jpeg?q=70',
    description: 'Industry-leading noise cancellation with two processors controlling 8 microphones, Auto NC Optimizer, and exceptional call quality.',
    basePrice: 29990,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.5, reviews: 6000 },
      { name: 'Croma', discount: 2500, rating: 4.6, reviews: 3200 }
    ]
  },
  {
    id: 'bose-qc-ultra',
    name: 'Bose QuietComfort Ultra Wireless Headphones - Sandstone',
    brand: 'Bose',
    category: 'Electronics',
    subCategory: 'Headphones',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/v/a/p/-original-imahfctt8rdznt4g.jpeg?q=70',
    description: 'Immersive spatial audio, custom-tuned noise cancellation, and luxury materials for unmatched comfort. The pinnacle of quiet comfort.',
    basePrice: 35900,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.6, reviews: 1450 },
      { name: 'Reliance Digital', discount: 4000, rating: 4.6, reviews: 180 }
    ]
  },
  {
    id: 'airpods-pro-2',
    name: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Headphones',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/y/j/y/-original-imahftff4z9zffxz.jpeg?q=70',
    description: 'Featuring up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.',
    basePrice: 24900,
    platforms: [
      { name: 'Amazon', discount: 2000, rating: 4.7, reviews: 9200 },
      { name: 'Flipkart', discount: 2500, rating: 4.6, reviews: 6800 }
    ]
  },
  {
    id: 'airpods-max',
    name: 'Apple AirPods Max Wireless Over-Ear Headphones - Space Grey',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Headphones',
    image: 'https://rukminim2.flixcart.com/image/612/612/kigbjbk0-0/headphone/p/p/i/mgyh3hn-a-apple-original-imafy8wbdnh4kbkd.jpeg?q=70',
    description: 'Apple-designed dynamic driver provides high-fidelity audio. Active Noise Cancellation blocks outside noise, so you can immerse yourself in music.',
    basePrice: 59900,
    platforms: [
      { name: 'Amazon', discount: 5000, rating: 4.6, reviews: 3400 },
      { name: 'Croma', discount: 4000, rating: 4.5, reviews: 950 }
    ]
  },
  {
    id: 'sennheiser-m4',
    name: 'Sennheiser Momentum 4 Wireless Headset - Denim Edition',
    brand: 'Sennheiser',
    category: 'Electronics',
    subCategory: 'Headphones',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/v/a/p/-original-imahfctt8rdznt4g.jpeg?q=70',
    description: 'Incredible audio quality with Sennheiser Signature Sound, customizable Adaptive Noise Cancellation, and an unmatched 60-hour battery life.',
    basePrice: 34990,
    platforms: [
      { name: 'Amazon', discount: 5000, rating: 4.5, reviews: 850 }
    ]
  },
  {
    id: 'jbl-flip-6',
    name: 'JBL Flip 6 Waterproof Portable Bluetooth Speaker - Squad Green',
    brand: 'JBL',
    category: 'Electronics',
    subCategory: 'Audio',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/s/r/l/-original-imahgapgd9zpn28y.jpeg?q=70',
    description: 'Powerful JBL Original Pro Sound with 2-way speaker system. IP67 waterproof and dustproof with 12 hours of playtime on a single charge.',
    basePrice: 11999,
    platforms: [
      { name: 'Amazon', discount: 2000, rating: 4.6, reviews: 18500 },
      { name: 'Flipkart', discount: 2200, rating: 4.5, reviews: 12000 }
    ]
  },
  {
    id: 'marshall-emberton',
    name: 'Marshall Emberton II Portable Bluetooth Speaker - Black & Brass',
    brand: 'Marshall',
    category: 'Electronics',
    subCategory: 'Audio',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/speaker/z/a/t/-original-imaheqrrajqtwerg.jpeg?q=70',
    description: 'A compact portable speaker with the loud and vibrant sound only Marshall can deliver. Features 30+ hours of portable playtime on a single charge.',
    basePrice: 14999,
    platforms: [
      { name: 'Amazon', discount: 1500, rating: 4.7, reviews: 4100 },
      { name: 'Flipkart', discount: 1000, rating: 4.6, reviews: 2200 }
    ]
  },

  // 4. Gaming
  {
    id: 'sony-ps5-slim',
    name: 'Sony PlayStation 5 (PS5) Slim Console - Digital Edition',
    brand: 'Sony',
    category: 'Electronics',
    subCategory: 'Gaming',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/gamingconsole/5/n/u/-original-imaghyykrhvewh4y.jpeg?q=70',
    description: 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio.',
    basePrice: 44990,
    platforms: [
      { name: 'Amazon', discount: 4000, rating: 4.7, reviews: 2300 },
      { name: 'Flipkart', discount: 5000, rating: 4.6, reviews: 3800 }
    ]
  },
  {
    id: 'nintendo-switch',
    name: 'Nintendo Switch OLED Model - Neon Blue & Neon Red Joy-Con',
    brand: 'Nintendo',
    category: 'Electronics',
    subCategory: 'Gaming',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/gamingconsole/v/o/e/64-switch-oled-console-with-neon-blue-neon-red-joy-con-nintendo-original-imah7e7wupmmghfp.jpeg?q=70',
    description: 'Featuring a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.',
    basePrice: 32999,
    platforms: [
      { name: 'Amazon', discount: 4000, rating: 4.7, reviews: 18900 }
    ]
  },

  // 5. Cameras & Drones
  {
    id: 'dji-mini-4',
    name: 'DJI Mini 4 Pro Fly More Combo - GPS Camera Drone',
    brand: 'DJI',
    category: 'Electronics',
    subCategory: 'Drone',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/screen-guard/nano-glass/f/m/3/5-5-inch-138-vd-enterprise-original-imahjdcg65rxmyvt.jpeg?q=70',
    description: 'Our most advanced mini camera drone to date. Integrates powerful imaging capabilities, omnidirectional obstacle sensing, and 45-min flight times.',
    basePrice: 95000,
    platforms: [
      { name: 'Amazon', discount: 6000, rating: 4.8, reviews: 1100 }
    ]
  },
  {
    id: 'dji-osmo',
    name: 'DJI Osmo Pocket 3 Gimbal Camera - ActiveTrack 6.0 Vlogging Cam',
    brand: 'DJI',
    category: 'Electronics',
    subCategory: 'Camera',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/screen-guard/nano-glass/r/j/s/2set-219-pranshi-original-imahnfcc5sytsaug.jpeg?q=70',
    description: 'Features a powerful 1-inch CMOS sensor that puts detail-rich imaging right in the palm of your hand. Dynamic, smooth 3-axis stabilization.',
    basePrice: 54900,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.7, reviews: 1540 },
      { name: 'Croma', discount: 2000, rating: 4.6, reviews: 350 }
    ]
  },
  {
    id: 'gopro-hero12',
    name: 'GoPro HERO12 Black Action Camera - Waterproof with HDR Video',
    brand: 'GoPro',
    category: 'Electronics',
    subCategory: 'Camera',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/sports-action-camera/o/3/r/x4-pro-4k-action-camera-16mp-wifi-waterproof-sports-camera-with-original-imahhkfwvfw9gzmg.jpeg?q=70',
    description: 'Incredible image quality, even better HyperSmooth video stabilization, and a huge boost in battery life. Shoots 5.3K video with HDR.',
    basePrice: 38000,
    platforms: [
      { name: 'Amazon', discount: 3500, rating: 4.5, reviews: 1650 },
      { name: 'Croma', discount: 3000, rating: 4.5, reviews: 380 }
    ]
  },
  {
    id: 'fujifilm-xt50',
    name: 'Fujifilm X-T50 Mirrorless Digital Camera with XC15-45mm Lens',
    brand: 'Fujifilm',
    category: 'Electronics',
    subCategory: 'Camera',
    image: 'https://rukminim2.flixcart.com/image/312/312/l0bbonk0/sports-action-camera/m/7/u/full-hd-1080p-action-camera-waterproof-sport-camera-with-2-inch-original-imagc5fvv8f4gurw.jpeg?q=70',
    description: 'A compact, lightweight body equipped with a 40.2-megapixel sensor, 5-axis in-body image stabilization, and Fujifilm\'s legendary Film Simulation dial.',
    basePrice: 129999,
    platforms: [
      { name: 'Amazon', discount: 5000, rating: 4.6, reviews: 120 }
    ]
  },
  {
    id: 'sony-a7iv',
    name: 'Sony Alpha 7 IV Full-Frame Mirrorless Camera (Body Only)',
    brand: 'Sony',
    category: 'Electronics',
    subCategory: 'Camera',
    image: 'https://rukminim2.flixcart.com/image/312/312/kw9krrk0/dslr-camera/k/k/a/-original-imag8z5wg5asqhhy.jpeg?q=70',
    description: 'Boasting a groundbreaking 33MP Exmor R CMOS sensor, high-speed BIONZ XR processor, and state-of-the-art Real-time Eye AF for photo and video.',
    basePrice: 219900,
    platforms: [
      { name: 'Amazon', discount: 15000, rating: 4.8, reviews: 890 },
      { name: 'Reliance Digital', discount: 12000, rating: 4.7, reviews: 110 }
    ]
  },

  // 6. Wearables
  {
    id: 'apple-watch-9',
    name: 'Apple Watch Series 9 GPS 45mm Smartwatch - Midnight Aluminum',
    brand: 'Apple',
    category: 'Electronics',
    subCategory: 'Wearables',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/smartwatch/i/c/w/-original-imahdyxra9x9dnbd.jpeg?q=90',
    description: 'S9 SiP makes this watch super bright and capable. New double tap gesture interface, on-device Siri, and advanced fitness/health trackers.',
    basePrice: 44900,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.6, reviews: 2200 },
      { name: 'Flipkart', discount: 4000, rating: 4.5, reviews: 1150 }
    ]
  },
  {
    id: 'garmin-venu-3',
    name: 'Garmin Venu 3 GPS Smartwatch with Bright AMOLED Display - Black',
    brand: 'Garmin',
    category: 'Electronics',
    subCategory: 'Wearables',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/smartwatch/j/k/s/40-active-2-round-dial-black-android-ios-melbon-yes-original-imaha8brnhhkhmhe.jpeg?q=90',
    description: 'Advanced health and fitness smartwatch with voice calls, sleep coach, wheelchair mode, and a crystal-clear 1.4-inch AMOLED display.',
    basePrice: 44990,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.6, reviews: 450 },
      { name: 'Croma', discount: 2000, rating: 4.4, reviews: 80 }
    ]
  },

  // 7. Fashion - Shoes & Clothing
  {
    id: 'nike-revolution-6',
    name: 'Nike Men\'s Revolution 6 Next Nature Running Shoes - Black/White',
    brand: 'Nike',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/4/r/-original-imagtc4g22rcatjg.jpeg?q=70',
    description: 'Breathable, lightweight running shoes made from at least 20% recycled content by weight. Delivers plush, comfortable support for your daily run.',
    basePrice: 3695,
    platforms: [
      { name: 'Myntra', discount: 1000, rating: 4.2, reviews: 15000 },
      { name: 'Ajio', discount: 1200, rating: 4.0, reviews: 8000 }
    ]
  },
  {
    id: 'nike-air-max',
    name: 'Nike Air Max SC Lifestyle Shoes - White/Black/Gym Red',
    brand: 'Nike',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/shoe/n/n/m/-original-imahnsbq5nxtbw4k.jpeg?q=90',
    description: 'Casual, classic runner style with visible Air cushioning. Perfect everyday styling, lightweight materials, and maximum underfoot comfort.',
    basePrice: 7495,
    platforms: [
      { name: 'Myntra', discount: 1500, rating: 4.4, reviews: 3100 },
      { name: 'Ajio', discount: 1800, rating: 4.3, reviews: 1400 }
    ]
  },
  {
    id: 'adidas-ultraboot',
    name: 'Adidas Men\'s Ultraboost Light Running Shoes - Core Black/White',
    brand: 'Adidas',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/m/z/-original-imahgfmxumntk7sy.jpeg?q=70',
    description: 'Experience epic energy with the lightest Ultraboost ever. Features a Primeknit+ upper, linear energy push system, and BOOST cushioning.',
    basePrice: 18999,
    platforms: [
      { name: 'Myntra', discount: 6000, rating: 4.6, reviews: 3200 },
      { name: 'Ajio', discount: 7000, rating: 4.5, reviews: 1800 }
    ]
  },
  {
    id: 'adidas-stan-smith',
    name: 'Adidas Originals Stan Smith Leather Sneakers - White/Green',
    brand: 'Adidas',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/shoe/t/q/9/-original-imahha94jxvjgcdq.jpeg?q=90',
    description: 'The clean, minimal design that changed the court and the streets forever. Premium leather build, perforated 3-Stripes, and rubber cupsole.',
    basePrice: 8999,
    platforms: [
      { name: 'Myntra', discount: 2000, rating: 4.5, reviews: 4200 },
      { name: 'Ajio', discount: 2500, rating: 4.4, reviews: 1900 }
    ]
  },
  {
    id: 'puma-velocity',
    name: 'Puma Velocity Nitro 3 Running Shoes - Fireglow/Black',
    brand: 'Puma',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/shoe/t/l/o/-original-imah4zhdyqssmf4f.jpeg?q=90',
    description: 'An all-in-one neutral running shoe for any distance. Features high-performance NITRO foam cushioning and PUMAGRIP traction outsole.',
    basePrice: 11999,
    platforms: [
      { name: 'Myntra', discount: 4000, rating: 4.4, reviews: 680 },
      { name: 'Ajio', discount: 4500, rating: 4.3, reviews: 320 }
    ]
  },
  {
    id: 'reebok-classic',
    name: 'Reebok Classic Leather Sneakers - Chalk White/Gum',
    brand: 'Reebok',
    category: 'Fashion',
    subCategory: 'Shoes',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/shoe/f/l/8/-original-imahh96f3zggcg2m.jpeg?q=90',
    description: 'A timeless silhouette introduced in 1983. Soft garment leather upper offers superior comfort, with durable die-cut EVA midsole.',
    basePrice: 6599,
    platforms: [
      { name: 'Myntra', discount: 1500, rating: 4.3, reviews: 1800 },
      { name: 'Ajio', discount: 1800, rating: 4.2, reviews: 950 }
    ]
  },
  {
    id: 'levis-jeans',
    name: 'Levi\'s Men\'s 511 Slim Fit Stretch Denim Jeans - Dark Wash',
    brand: "Levi's",
    category: 'Fashion',
    subCategory: 'Jeans',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/7/z/j/12-cph2573-oneplus-original-imahjngudb3jjkew.jpeg?q=70',
    description: 'A modern slim with room to move. The 511 Slim Fit Jeans are a classic since right now. They sit below the waist with a slim fit from hip to ankle.',
    basePrice: 4199,
    platforms: [
      { name: 'Myntra', discount: 1200, rating: 4.2, reviews: 4200 },
      { name: 'Ajio', discount: 1400, rating: 4.1, reviews: 3100 }
    ]
  },
  {
    id: 'levis-jacket',
    name: 'Levi\'s Men\'s Original Denim Trucker Jacket - Indigo',
    brand: "Levi's",
    category: 'Fashion',
    subCategory: 'Jacket',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/f/h/n/pixel-8a-ga05570-in-google-original-imahyn3ncc6gcfnc.jpeg?q=70',
    description: 'The original jean jacket since 1967. A symbol of self-expression for decades, and the perfect in-between layer that looks great with everything.',
    basePrice: 5499,
    platforms: [
      { name: 'Myntra', discount: 1500, rating: 4.4, reviews: 1800 },
      { name: 'Amazon', discount: 1200, rating: 4.3, reviews: 650 }
    ]
  },
  {
    id: 'allen-solly-trouser',
    name: 'Allen Solly Men\'s Cotton Slim Fit Trousers - Khaki',
    brand: 'Allen Solly',
    category: 'Fashion',
    subCategory: 'Trousers',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/z/2/z/-original-imahfpwv6yzawcuc.jpeg?q=70',
    description: 'Perfect blend of comfort and style. Ideal for semi-formal settings and casual outings, made with high-quality stretch cotton.',
    basePrice: 2499,
    platforms: [
      { name: 'Myntra', discount: 700, rating: 4.2, reviews: 2200 },
      { name: 'Ajio', discount: 900, rating: 4.0, reviews: 1100 }
    ]
  },
  {
    id: 'raymond-shirt',
    name: 'Raymond Men\'s Slim Fit Cotton Formal Shirt - Crisp White',
    brand: 'Raymond',
    category: 'Fashion',
    subCategory: 'Shirt',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/g/i/n/-original-imagzhspjy5g8nh3.jpeg?q=70',
    description: 'Exquisitely crafted in premium cotton, this formal shirt offers a sharp slim-fit silhouette, standard collar, and single cuffs. Essential formal wear.',
    basePrice: 2299,
    platforms: [
      { name: 'Myntra', discount: 500, rating: 4.3, reviews: 8200 },
      { name: 'Ajio', discount: 600, rating: 4.2, reviews: 4500 }
    ]
  },
  {
    id: 'tommy-polo',
    name: 'Tommy Hilfiger Slim Fit Cotton Classic Polo Shirt - Navy',
    brand: 'Tommy Hilfiger',
    category: 'Fashion',
    subCategory: 'Shirt',
    image: 'https://rukminim2.flixcart.com/image/300/300/xif0q/t-shirt/c/k/8/xl-ujc24-polo-fs-beig-blk-brklyn-41-jump-cuts-original-imahddkv6nxuchsm.jpeg?q=90',
    description: 'Classic American cool style. Made of organic stretch cotton piqué, featuring the signature flag embroidery on the chest and two-button collar.',
    basePrice: 3999,
    platforms: [
      { name: 'Myntra', discount: 1000, rating: 4.5, reviews: 1200 },
      { name: 'Amazon', discount: 800, rating: 4.3, reviews: 320 }
    ]
  },
  {
    id: 'w-kurta',
    name: 'W for Woman Women\'s Floral Printed Kurta Set - Mint Green',
    brand: 'W for Woman',
    category: 'Fashion',
    subCategory: 'Ethnic',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/s/d/p/chromebook-11ijl9-chromebook-lenovo-original-imahczggpnn6tgge.jpeg?q=70',
    description: 'A stylish mint-green A-line printed kurta with trousers and dupatta. Ideal ethnic wear for office, gatherings, or festive occasions.',
    basePrice: 4599,
    platforms: [
      { name: 'Myntra', discount: 1600, rating: 4.4, reviews: 1200 },
      { name: 'Ajio', discount: 1800, rating: 4.2, reviews: 540 }
    ]
  },
  {
    id: 'biba-ethnic',
    name: 'Biba Women\'s Polyester Anarkali Kurta Suit Set - Royal Blue',
    brand: 'Biba',
    category: 'Fashion',
    subCategory: 'Ethnic',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/f/u/d/-original-imahmhhncbddugp2.jpeg?q=70',
    description: 'Flowing Anarkali printed suit set with round neck, 3/4 sleeves, matched knit pants and sheer printed dupatta. Exquisite festive wear.',
    basePrice: 6500,
    platforms: [
      { name: 'Myntra', discount: 2000, rating: 4.5, reviews: 920 },
      { name: 'Ajio', discount: 2200, rating: 4.3, reviews: 310 }
    ]
  },

  // 8. Home Appliances
  {
    id: 'dyson-v15',
    name: 'Dyson V15 Detect Cordless Vacuum Cleaner - Yellow/Nickel',
    brand: 'Dyson',
    category: 'Home Appliances',
    subCategory: 'Vacuum Cleaner',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/vacuum-cleaner/x/l/d/-original-imahg6fharydfwvr.jpeg?q=70',
    description: 'Dysons most powerful, intelligent cordless vacuum. Reveals invisible dust with a precisely-angled laser and automatically adapts suction power.',
    basePrice: 65900,
    platforms: [
      { name: 'Amazon', discount: 6000, rating: 4.6, reviews: 980 },
      { name: 'Croma', discount: 5000, rating: 4.5, reviews: 420 }
    ]
  },
  {
    id: 'philips-airfryer',
    name: 'Philips Digital Airfryer HD9252/90 with Touch Panel (4.1L) - Black',
    brand: 'Philips',
    category: 'Home Appliances',
    subCategory: 'Kitchen',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/air-fryer/g/b/j/-original-imahndvdge5tzhbj.jpeg?q=70',
    description: 'Great tasting fries with up to 90% less fat, thanks to Rapid Air technology. Includes a digital touchscreen with 7 preset cooking options.',
    basePrice: 9995,
    platforms: [
      { name: 'Amazon', discount: 2500, rating: 4.4, reviews: 23400 },
      { name: 'Flipkart', discount: 2800, rating: 4.3, reviews: 18000 }
    ]
  },
  {
    id: 'instant-pot',
    name: 'Instant Pot Duo Plus 9-in-1 Electric Pressure Cooker (6 Quart)',
    brand: 'Instant Pot',
    category: 'Home Appliances',
    subCategory: 'Kitchen',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/electric-cooker/9/j/0/-original-imahkq7fznzh5tmh.jpeg?q=70',
    description: 'Upgraded version with custom programs, easy-seal lid, and status indicator. Replaces pressure cooker, slow cooker, rice cooker, yogurt maker, and sterilizer.',
    basePrice: 15990,
    platforms: [
      { name: 'Amazon', discount: 3000, rating: 4.6, reviews: 45000 }
    ]
  },
  {
    id: 'hamilton-maker',
    name: 'Hamilton Beach Dual Breakfast Sandwich Maker - Silver',
    brand: 'Hamilton Beach',
    category: 'Home Appliances',
    subCategory: 'Kitchen',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sandwich-maker/p/w/2/-original-imah8jeg6arhzc95.jpeg?q=70',
    description: 'Cook two delicious breakfast sandwiches at home in just 5 minutes or less. Use your own fresh ingredients, including eggs, cheese, and meats.',
    basePrice: 6999,
    platforms: [
      { name: 'Amazon', discount: 1500, rating: 4.4, reviews: 22000 }
    ]
  },
  {
    id: 'dyson-airwrap',
    name: 'Dyson Airwrap Multi-Styler Complete Long - Nickel/Copper',
    brand: 'Dyson',
    category: 'Home Appliances',
    subCategory: 'BeautyTech',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/electric-hair-styler/x/t/t/1500-airshot-all-in-1-hair-multi-styler-for-curl-smooth-dry-blow-original-imahbg7f48hfpzty.jpeg?q=70',
    description: 'Style your hair with air, not extreme heat. Engineered for multiple hair types, featuring barrels to curl and wave in both directions, brushes to control.',
    basePrice: 49900,
    platforms: [
      { name: 'Amazon', discount: 4000, rating: 4.6, reviews: 1420 },
      { name: 'Nykaa', discount: 3000, rating: 4.7, reviews: 520 }
    ]
  },
  {
    id: 'havells-fan',
    name: 'Havells Swing LX 400mm Wall Fan - White',
    brand: 'Havells',
    category: 'Home Appliances',
    subCategory: 'Electricals',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/fan/w/3/v/swing-hs-125-1-induction-wall-fan-400-havells-original-imahddxyhkcpwsbg.jpeg?q=70',
    description: 'High-speed wall fan with aerodynamically designed blades and 120 ribs guard. Offers thermal overload protection for extra safety and reliability.',
    basePrice: 3499,
    platforms: [
      { name: 'Amazon', discount: 800, rating: 4.2, reviews: 5400 },
      { name: 'Flipkart', discount: 600, rating: 4.1, reviews: 2300 }
    ]
  },
  {
    id: 'voltas-ac',
    name: 'Voltas 1.5 Ton 3 Star Inverter Split AC - White',
    brand: 'Voltas',
    category: 'Home Appliances',
    subCategory: 'Cooling',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/air-conditioner-new/y/s/j/-original-imahmyxhrwzrham6.jpeg?q=70',
    description: 'Stabilizer-free operation split air conditioner with copper condenser coil, 4-in-1 adjustable mode, anti-dust filter, and turbo cooling option.',
    basePrice: 36990,
    platforms: [
      { name: 'Amazon', discount: 2000, rating: 4.2, reviews: 3100 },
      { name: 'Croma', discount: 1000, rating: 4.3, reviews: 1500 }
    ]
  },

  // 9. Beauty
  {
    id: 'loreal-hyaluronic',
    name: 'L\'Oreal Paris Revitalift 1.5% Hyaluronic Acid Serum (30ml)',
    brand: 'L\'Oreal',
    category: 'Beauty',
    subCategory: 'Serum',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/s/9/z/-original-imahg53xygzzzb6g.jpeg?q=70',
    description: 'Intense hydrating face serum that plumps, moisturizes, and visibly reduces wrinkles by 47% in two weeks. Lightweight and non-sticky formula.',
    basePrice: 999,
    platforms: [
      { name: 'Nykaa', discount: 200, rating: 4.5, reviews: 34500 },
      { name: 'Myntra', discount: 150, rating: 4.4, reviews: 12000 },
      { name: 'Amazon', discount: 250, rating: 4.5, reviews: 19800 }
    ]
  },
  {
    id: 'cerave-cleanser',
    name: 'CeraVe Hydrating Foaming Cream Cleanser for Normal to Dry Skin',
    brand: 'CeraVe',
    category: 'Beauty',
    subCategory: 'Cleanser',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/face-wash/g/t/9/200-bright-beauty-facewash-with-niacinamide-for-glass-skin-like-original-imah4qgfc6htgecj.jpeg?q=70',
    description: 'Developed with dermatologists, a gentle foaming cleanser that contains 3 essential ceramides, amino acids, and hyaluronic acid to lock in moisture.',
    basePrice: 1250,
    platforms: [
      { name: 'Nykaa', discount: 100, rating: 4.6, reviews: 8900 },
      { name: 'Amazon', discount: 150, rating: 4.5, reviews: 14500 }
    ]
  },
  {
    id: 'cerave-moisturizer',
    name: 'CeraVe Moisturizing Cream for Dry to Very Dry Skin (340g)',
    brand: 'CeraVe',
    category: 'Beauty',
    subCategory: 'Moisturizer',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/3/5/b/-original-imahm9xfhe8ngzz4.jpeg?q=70',
    description: 'A rich, non-greasy, fast-absorbing moisturizing cream containing 3 essential ceramides and hyaluronic acid to restore the skins protective barrier.',
    basePrice: 1450,
    platforms: [
      { name: 'Nykaa', discount: 150, rating: 4.7, reviews: 12400 },
      { name: 'Amazon', discount: 200, rating: 4.6, reviews: 22000 }
    ]
  },
  {
    id: 'lakme-gloss',
    name: 'Lakme Absolute Skin Gloss Gel Face Cream (50g)',
    brand: 'Lakme',
    category: 'Beauty',
    subCategory: 'Moisturizer',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/c/s/q/-original-imahyfqhzeh8sgqj.jpeg?q=70',
    description: 'Enriched with mineral-laden glacial water, this skin gloss gel melts into your skin to yield a cool, hydrated, and glossy finish instantly.',
    basePrice: 550,
    platforms: [
      { name: 'Nykaa', discount: 100, rating: 4.3, reviews: 8400 },
      { name: 'Myntra', discount: 50, rating: 4.2, reviews: 3100 }
    ]
  },
  {
    id: 'mac-fix',
    name: 'MAC Prep + Prime Fix+ Facial Hydration Spray (100ml)',
    brand: 'MAC',
    category: 'Beauty',
    subCategory: 'SettingSpray',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/toner/i/s/n/50-instant-refreshing-mist-for-instant-refreshing-glow-hydrates-original-imahm6epjh8q2dzx.jpeg?q=70',
    description: 'A lightweight water mist gently loaded with vitamins and minerals, infused with a blend of green tea, chamomile, and cucumber to soothe and refresh skin.',
    basePrice: 2300,
    platforms: [
      { name: 'Nykaa', discount: 200, rating: 4.7, reviews: 6500 },
      { name: 'Myntra', discount: 100, rating: 4.6, reviews: 1800 }
    ]
  },
  {
    id: 'estee-lauder',
    name: 'Estee Lauder Advanced Night Repair Synchronized Recovery Complex',
    brand: 'Estee Lauder',
    category: 'Beauty',
    subCategory: 'Serum',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/j/4/l/50-hyaluronic-acid-2-intense-hydrating-night-gel-powered-with-original-imahbr4q6pt7p2zw.jpeg?q=70',
    description: 'Our revolutionary serum for radiant, younger-looking skin. Features exclusive Chronolux Power Signal Technology to reduce lines and wrinkles.',
    basePrice: 8900,
    platforms: [
      { name: 'Nykaa', discount: 900, rating: 4.7, reviews: 4200 },
      { name: 'Amazon', discount: 500, rating: 4.5, reviews: 1800 }
    ]
  },

  // 10. Home Decor
  {
    id: 'lego-orchid',
    name: 'LEGO Icons Orchid 10311 Artificial Plant Building Set for Adults',
    brand: 'LEGO',
    category: 'Home Decor',
    subCategory: 'Toys',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/block-construction/a/c/k/icons-tiny-plants-building-set-for-adults-10329-758-pieces-lego-original-imagwgybheknygzm.jpeg?q=70',
    description: 'Enjoy a mindful building project and create a beautiful orchid display for your home. Inspired by a real orchid with amazing attention to detail.',
    basePrice: 4799,
    platforms: [
      { name: 'Amazon', discount: 800, rating: 4.8, reviews: 28000 },
      { name: 'Flipkart', discount: 500, rating: 4.7, reviews: 1200 }
    ]
  },
  {
    id: 'chumbak-mug',
    name: 'Chumbak Ceramic Handpainted Coffee Mug - Teal Floral',
    brand: 'Chumbak',
    category: 'Home Decor',
    subCategory: 'Kitchen',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/mug/k/o/p/blue-petal-ceramic-mug-elegant-floral-design-tea-coffee-cup-500-original-imahmkvgksmffh29.jpeg?q=70',
    description: 'Start your mornings with this beautiful, hand-painted ceramic mug. Crafted from premium stoneware, this mug features our iconic floral print.',
    basePrice: 595,
    platforms: [
      { name: 'Myntra', discount: 150, rating: 4.5, reviews: 820 },
      { name: 'Amazon', discount: 100, rating: 4.4, reviews: 1400 }
    ]
  },
  {
    id: 'ikea-lamp',
    name: 'IKEA FADO Table Lamp with LED Bulb - Globe Glass Design',
    brand: 'IKEA',
    category: 'Home Decor',
    subCategory: 'Lighting',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/table-lamp/m/f/h/sunset-projection-lamp-light-for-home-decor-cars-video-shoots-original-imahhu66kenshjmz.jpeg?q=70',
    description: 'Provides a soft, cozy light that creates a warm, welcoming atmosphere in your room. Features a spherical glass dome and a plastic base.',
    basePrice: 1499,
    platforms: [
      { name: 'Amazon', discount: 300, rating: 4.5, reviews: 3200 },
      { name: 'Flipkart', discount: 200, rating: 4.3, reviews: 800 }
    ]
  },
  {
    id: 'homecentre-frame',
    name: 'Home Centre Oak Wood Wall Photo Frame - Large',
    brand: 'Home Centre',
    category: 'Home Decor',
    subCategory: 'Frames',
    image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/normal-photo-frame/z/j/3/a4-size-noemal-photo-frame-rectanglar-fantastic-normal-photo-original-imahz5mvcv6n5jtv.jpeg?q=70',
    description: 'Display your favorite memories in style with this elegant wall frame, constructed with high-quality engineered oak wood and glass pane.',
    basePrice: 999,
    platforms: [
      { name: 'Myntra', discount: 300, rating: 4.4, reviews: 1200 },
      { name: 'Amazon', discount: 200, rating: 4.3, reviews: 3100 }
    ]
  },
  {
    id: 'philips-hue-bulb',
    name: 'Philips Hue Smart 9W LED bulb (E27, Multicolor)',
    brand: 'Philips',
    category: 'Home Decor',
    subCategory: 'Lighting',
    image: 'https://m.media-amazon.com/images/I/614C92yS4FL._SL1500_.jpg',
    description: 'Control your lights with voice or app. 16 million colors to customize your lighting based on your mood, supports Alexa and Google Assistant.',
    basePrice: 2899,
    platforms: [
      { name: 'Amazon', discount: 600, rating: 4.5, reviews: 8200 },
      { name: 'Reliance Digital', discount: 400, rating: 4.4, reviews: 1200 }
    ]
  },
  {
    id: 'kindle-paperwhite-reader',
    name: 'Kindle Paperwhite (16 GB) - 6.8-inch display and warm light',
    brand: 'Amazon',
    category: 'Electronics',
    subCategory: 'E-reader',
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile-panel/m/7/v/back-a54-5g-maxout-original-imagxgh2yyx4fgsf.jpeg?q=70',
    description: 'Purpose-built for reading. With a flush-front design and 300 ppi glare-free display that reads like real paper, even in bright sunlight.',
    basePrice: 14999,
    platforms: [
      { name: 'Amazon', discount: 2000, rating: 4.7, reviews: 8200 }
    ]
  }
];

const generateProductsFromBlueprints = (blueprints) => {
  return blueprints.map(bp => {
    const prices = bp.platforms.map(plat => {
      const discount = plat.discount || 0;
      const deliveryCharge = bp.basePrice < 500 ? 40 : 0; // free delivery for high value
      const finalPrice = bp.basePrice - discount + deliveryCharge;
      
      return {
        platformName: plat.name,
        price: bp.basePrice,
        discount: discount,
        deliveryCharge: deliveryCharge,
        finalPrice: finalPrice,
        productUrl: getStoreSearchUrl(plat.name, bp.name),
        rating: plat.rating || 4.5,
        reviewsCount: plat.reviews || 100,
        stockStatus: 'In Stock'
      };
    });

    const sortedPrices = [...prices].sort((a, b) => a.finalPrice - b.finalPrice);

    return {
      _id: `demo-${bp.id}`,
      name: bp.name,
      brand: bp.brand,
      category: bp.category,
      subCategory: bp.subCategory,
      image: bp.image,
      description: bp.description,
      prices: prices,
      lowestPrice: sortedPrices[0].finalPrice,
      bestPlatform: sortedPrices[0].platformName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });
};

export const demoProducts = generateProductsFromBlueprints(blueprints);
