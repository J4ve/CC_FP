/* GenericMart - Product Catalog
   Blueprint §5.2: Card schema = badge, image, name, desc, price, rating, CTA, Quick View.
   Blueprint §5.3: Filterable specs (motorPower, batteryType, brand, scale).

   Image sourcing strategy:
   - Each product has a primary `img` and a 2-3 image `gallery`.
   - URLs are loremflickr.com tag-searches with a deterministic `lock` seed → real Flickr photo
     matching the keywords. Reliable, topical, no API key needed.
   - `onerror` in the renderer falls back to a Material Symbol icon if the network fails.

   Norwegian (Bokmål) translations inline per product so the language toggle can swap on the fly.
*/

// Helper: compose a loremflickr URL for tag-based topical photos.
function ttImg(tags, seed, w = 640, h = 640) {
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(tags)}?lock=${seed}`;
}

const GM_PRODUCTS = [
  {
    id: 1,
    name: "AeroPro X4 Professional Quadcopter",
    brand: "AeroPro",
    category: "drones",
    price: 45000,
    salePrice: 38650,
    img:     "https://image.qwenlm.ai/public_source/32d72af3-5c7b-437a-8259-f23a4302fd44/1db99e685-cbac-42b2-9c28-cd82aac62b24.png",
    gallery: [
      "https://image.qwenlm.ai/public_source/32d72af3-5c7b-437a-8259-f23a4302fd44/1db99e685-cbac-42b2-9c28-cd82aac62b24.png",
      ttImg("drone,aerial", 1012, 1200, 900),
      ttImg("drone,sky",    1013, 1200, 900)
    ],
    icon: "flight",
    badge: "Sale",
    rating: 4.5,
    reviews: 128,
    desc: "Professional cinema-grade quadcopter with 4K/60fps gimbal, 8 km range, and omnidirectional obstacle sensing.",
    descNo: "Profesjonell kinodrone med 4K/60fps gimbal, 8 km rekkevidde og hindringsdeteksjon i alle retninger.",
    chips: ["4K 60FPS", "8km Range", "43min Flight"],
    chipsNo: ["4K 60FPS", "8 km rekkevidde", "43 min flytid"],
    specs: {
      Camera: "4/3 CMOS Hasselblad",
      "Flight Time": "43 min",
      Range: "8 km",
      Weight: "958 g",
      Resolution: "4K/60fps",
      "Obstacle Sensing": "Omnidirectional"
    },
    motorPower: "High",
    batteryType: "LiPo 4S",
    scale: ""
  },
  {
    id: 2,
    name: "VoltRider Pro Electric Scooter",
    brand: "VoltRider",
    category: "vehicles",
    price: 68350,
    img:     "https://image.qwenlm.ai/public_source/32d72af3-5c7b-437a-8259-f23a4302fd44/1c7b2f449-df6f-42a9-a47f-b5d7b849cbcd.png",
    gallery: [
      "https://image.qwenlm.ai/public_source/32d72af3-5c7b-437a-8259-f23a4302fd44/1c7b2f449-df6f-42a9-a47f-b5d7b849cbcd.png",
      ttImg("scooter,city", 1022, 1200, 900),
      ttImg("kick,scooter", 1023, 1200, 900)
    ],
    icon: "electric_scooter",
    badge: "New",
    rating: 5,
    reviews: 42,
    desc: "Foldable 1000W electric scooter with 50 km range, 35 km/h top speed, and IP54 rating.",
    descNo: "Sammenleggbar 1000 W elsparkesykkel med 50 km rekkevidde, 35 km/t toppfart og IP54-godkjenning.",
    chips: ["1000W", "50km Range", "IP54"],
    chipsNo: ["1000 W", "50 km rekkevidde", "IP54"],
    specs: {
      Motor: "1000W Brushless",
      Range: "50 km",
      "Top Speed": "35 km/h",
      Weight: "16.4 kg",
      "Charge Time": "5 hours",
      "Water Rating": "IP54"
    },
    motorPower: "1000W",
    batteryType: "Li-ion 48V",
    scale: ""
  },
  {
    id: 3,
    name: "CoreDev IoT Development Board V2",
    brand: "CoreDev",
    category: "electronics",
    price: 2400,
    img:     ttImg("circuit,board", 1031),
    gallery: [
      ttImg("circuit,board",        1031, 1200, 900),
      ttImg("microcontroller,chip", 1032, 1200, 900),
      ttImg("electronics,pcb",      1033, 1200, 900)
    ],
    icon: "memory",
    badge: "",
    rating: 4,
    reviews: 89,
    desc: "ARM Cortex-M4 dev board with WiFi 6, BLE 5.2, and 40 GPIO pins for rapid prototyping.",
    descNo: "ARM Cortex-M4 utviklingskort med WiFi 6, BLE 5.2 og 40 GPIO-pinner for rask prototyping.",
    chips: ["ARM Cortex-M4", "WiFi/BLE"],
    chipsNo: ["ARM Cortex-M4", "WiFi/BLE"],
    specs: {
      MCU: "ARM Cortex-M4 @ 240 MHz",
      Memory: "8 MB Flash, 512 KB RAM",
      Wireless: "WiFi 6 + BLE 5.2",
      GPIO: "40 pins",
      Power: "USB-C / 3.3V",
      Toolchain: "Arduino + PlatformIO"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 4,
    name: "PrintMaster Pro Enclosed 3D Printer",
    brand: "PrintMaster",
    category: "tools",
    price: 32850,
    img:     ttImg("3d,printer", 1041),
    gallery: [
      ttImg("3d,printer",       1041, 1200, 900),
      ttImg("3dprinting,maker", 1042, 1200, 900),
      ttImg("printer,workshop", 1043, 1200, 900)
    ],
    icon: "deployed_code",
    badge: "",
    rating: 5,
    reviews: 215,
    desc: "Enclosed CoreXY 3D printer with auto-leveling, 300×300×350 mm build volume, dual cooling.",
    descNo: "Innelukket CoreXY 3D-skriver med automatisk nivellering, 300×300×350 mm byggevolum og dobbel kjøling.",
    chips: ["Auto-Leveling", "CoreXY", "300³ mm"],
    chipsNo: ["Auto-nivellering", "CoreXY", "300³ mm"],
    specs: {
      Volume: "300×300×350 mm",
      Kinematics: "CoreXY",
      Leveling: "Auto (BL-Touch)",
      "Max Speed": "500 mm/s",
      "Max Temp": "300 °C nozzle / 110 °C bed",
      Connectivity: "WiFi + USB-C"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 5,
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    category: "electronics",
    price: 18500,
    img:     ttImg("headphones", 1051),
    gallery: [
      ttImg("headphones",        1051, 1200, 900),
      ttImg("headphones,studio", 1052, 1200, 900),
      ttImg("headphones,music",  1053, 1200, 900)
    ],
    icon: "headphones",
    badge: "",
    rating: 4.5,
    reviews: 312,
    desc: "Industry-leading noise canceling with 30-hour battery, multipoint connection, LDAC support.",
    descNo: "Markedsledende støydemping med 30 timers batteri, multipoint-tilkobling og LDAC-støtte.",
    chips: ["ANC", "30h Battery", "LDAC"],
    chipsNo: ["ANC", "30 t batteri", "LDAC"],
    specs: {
      Driver: "30 mm Carbon Fiber",
      Battery: "30 hours",
      "Noise Canceling": "Auto NC Optimizer",
      Weight: "250 g",
      Bluetooth: "5.2",
      Codec: "LDAC, AAC"
    },
    motorPower: "",
    batteryType: "Li-ion",
    scale: ""
  },
  {
    id: 6,
    name: "Mountain E-Bike 750W",
    brand: "TrailWatt",
    category: "vehicles",
    price: 100650,
    img:     ttImg("mountain,bike", 1061),
    gallery: [
      ttImg("mountain,bike",  1061, 1200, 900),
      ttImg("ebike,electric", 1062, 1200, 900),
      ttImg("bicycle,trail",  1063, 1200, 900)
    ],
    icon: "directions_bike",
    badge: "New",
    rating: 4.5,
    reviews: 76,
    desc: "Full-suspension 750W mid-drive e-bike, 100 km range, Shimano 11-speed, hydraulic disc brakes.",
    descNo: "750 W el-terrengsykkel med fjæring foran og bak, 100 km rekkevidde, Shimano 11-trinns og hydrauliske skivebremser.",
    chips: ["750W Mid-drive", "100km Range"],
    chipsNo: ["750 W middrev", "100 km rekkevidde"],
    specs: {
      Motor: "750W Mid-drive",
      Battery: "720 Wh",
      Range: "100 km",
      Gears: "Shimano 11-speed",
      Brakes: "Hydraulic Disc",
      Weight: "23 kg"
    },
    motorPower: "750W",
    batteryType: "Li-ion 48V",
    scale: ""
  },
  {
    id: 7,
    name: "Racing Drone FPV Kit",
    brand: "AeroPro",
    category: "drones",
    price: 37050,
    img:     ttImg("drone,racing", 1071),
    gallery: [
      ttImg("drone,racing",  1071, 1200, 900),
      ttImg("drone,fpv",     1072, 1200, 900),
      ttImg("quadcopter,kit",1073, 1200, 900)
    ],
    icon: "rocket_launch",
    badge: "",
    rating: 4,
    reviews: 53,
    desc: "Complete FPV racing drone kit with digital goggles, controller, 3 batteries - ready to fly.",
    descNo: "Komplett FPV-racingdrone-pakke med digitale briller, kontroller og 3 batterier - klar til å fly.",
    chips: ["120 km/h", "FPV Goggles"],
    chipsNo: ["120 km/t", "FPV-briller"],
    specs: {
      "Top Speed": "120 km/h",
      Camera: "1080p 60fps",
      "Flight Time": "8 min/battery",
      Batteries: "3× LiPo 4S",
      Goggles: "5.8 GHz Digital",
      Weight: "410 g"
    },
    motorPower: "2400KV",
    batteryType: "LiPo 4S",
    scale: ""
  },
  {
    id: 8,
    name: "Smart Home Hub Pro",
    brand: "NodeNest",
    category: "electronics",
    price: 6850,
    img:     ttImg("smarthome,hub", 1081),
    gallery: [
      ttImg("smarthome,hub",     1081, 1200, 900),
      ttImg("smarthome,device",  1082, 1200, 900),
      ttImg("smartspeaker,iot",  1083, 1200, 900)
    ],
    icon: "home_iot_device",
    badge: "New",
    rating: 4,
    reviews: 94,
    desc: "Central hub for smart devices - Zigbee, Z-Wave, Matter, WiFi 6E, voice control.",
    descNo: "Sentral hub for smartenheter - Zigbee, Z-Wave, Matter, WiFi 6E og talestyring.",
    chips: ["Matter", "WiFi 6E"],
    chipsNo: ["Matter", "WiFi 6E"],
    specs: {
      Protocols: "Zigbee, Z-Wave, Matter",
      WiFi: "WiFi 6E",
      Display: "7-inch touchscreen",
      Voice: "Alexa + Google",
      Devices: "Up to 300",
      Power: "USB-C PD"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 9,
    name: "Precision Digital Caliper Set",
    brand: "MicroEdge",
    category: "tools",
    price: 3650,
    img:     ttImg("caliper,measure", 1091),
    gallery: [
      ttImg("caliper,measure",  1091, 1200, 900),
      ttImg("workshop,tools",   1092, 1200, 900),
      ttImg("precision,tool",   1093, 1200, 900)
    ],
    icon: "straighten",
    badge: "",
    rating: 4.5,
    reviews: 187,
    desc: "Stainless steel digital calipers with 0.01 mm resolution, IP54, Bluetooth data export.",
    descNo: "Digitalt skyvelær i rustfritt stål med 0,01 mm oppløsning, IP54 og Bluetooth-dataeksport.",
    chips: ["0.01mm", "IP54", "Bluetooth"],
    chipsNo: ["0,01 mm", "IP54", "Bluetooth"],
    specs: {
      Range: "0–200 mm",
      Resolution: "0.01 mm",
      Accuracy: "±0.02 mm",
      Material: "Hardened Stainless",
      Battery: "CR2032 (1500 h)",
      Output: "Bluetooth + USB"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 10,
    name: "RC Crawler 1:10 Scale 4WD",
    brand: "TerraClimb",
    category: "vehicles",
    price: 22750,
    img:     ttImg("rc,car", 1101),
    gallery: [
      ttImg("rc,car",        1101, 1200, 900),
      ttImg("rc,crawler",    1102, 1200, 900),
      ttImg("offroad,toy",   1103, 1200, 900)
    ],
    icon: "directions_car",
    badge: "",
    rating: 4,
    reviews: 61,
    desc: "1:10 scale 4WD rock crawler, 540 brushed motor, waterproof ESC, oil-filled shocks.",
    descNo: "1:10 skala 4WD steinklatrer med 540 børsteanker-motor, vanntett ESC og oljefylte støtdempere.",
    chips: ["1:10", "4WD", "Waterproof"],
    chipsNo: ["1:10", "4WD", "Vanntett"],
    specs: {
      Scale: "1:10",
      Drive: "4WD shaft-driven",
      Motor: "540 Brushed",
      ESC: "60A Waterproof",
      Battery: "7.4V 3000 mAh LiPo",
      "Run Time": "35 min"
    },
    motorPower: "540 Brushed",
    batteryType: "LiPo 2S",
    scale: "1:10"
  },
  {
    id: 11,
    name: "ServoBot 6-Axis Robotic Arm",
    brand: "RoboKit",
    category: "robotics",
    price: 29100,
    img:     ttImg("robot,arm", 1111),
    gallery: [
      ttImg("robot,arm",        1111, 1200, 900),
      ttImg("robotics,industry",1112, 1200, 900),
      ttImg("robot,automation", 1113, 1200, 900)
    ],
    icon: "precision_manufacturing",
    badge: "",
    rating: 4.5,
    reviews: 38,
    desc: "Educational 6-axis robotic arm with metal gears, 500 g payload, Python + ROS API.",
    descNo: "Pedagogisk 6-akset robotarm med metallgir, 500 g nyttelast og Python + ROS API.",
    chips: ["6-Axis", "ROS"],
    chipsNo: ["6-akset", "ROS"],
    specs: {
      Axes: "6 DoF",
      Payload: "500 g",
      Reach: "420 mm",
      Repeatability: "±0.5 mm",
      Control: "Python / ROS / Arduino",
      Power: "12 V / 5 A"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 12,
    name: "Solar Panel Kit 400W",
    brand: "SunForge",
    category: "components",
    price: 31750,
    img:     ttImg("solar,panel", 1121),
    gallery: [
      ttImg("solar,panel",   1121, 1200, 900),
      ttImg("solar,energy",  1122, 1200, 900),
      ttImg("photovoltaic",  1123, 1200, 900)
    ],
    icon: "solar_power",
    badge: "",
    rating: 4.5,
    reviews: 102,
    desc: "Portable 400W solar panel kit with MPPT controller and 1000W pure sine inverter.",
    descNo: "Bærbart 400 W solcellepanelsett med MPPT-regulator og 1000 W ren sinus-omformer.",
    chips: ["400W", "MPPT"],
    chipsNo: ["400 W", "MPPT"],
    specs: {
      Output: "400 W Peak",
      Panels: "2× 200 W Mono",
      Inverter: "1000 W Pure Sine",
      Controller: "MPPT 30 A",
      "Weight/panel": "12 kg",
      Warranty: "25 years"
    },
    motorPower: "",
    batteryType: "Solar",
    scale: ""
  },
  {
    id: 13,
    name: "GPS Tracker Pro 4G",
    brand: "TrackLite",
    category: "electronics",
    price: 4200,
    img:     ttImg("gps,tracker", 1131),
    gallery: [
      ttImg("gps,tracker",     1131, 1200, 900),
      ttImg("gps,navigation",  1132, 1200, 900),
      ttImg("location,device", 1133, 1200, 900)
    ],
    icon: "location_on",
    badge: "",
    rating: 4,
    reviews: 71,
    desc: "Real-time 4G LTE GPS tracker with 2-week battery, geofencing, IP67 rating.",
    descNo: "4G LTE GPS-sporer i sanntid med 2 ukers batteri, geofencing og IP67-klassifisering.",
    chips: ["4G LTE", "IP67"],
    chipsNo: ["4G LTE", "IP67"],
    specs: {
      Network: "4G LTE Cat-1",
      Battery: "2 weeks",
      Accuracy: "2.5 m",
      Waterproof: "IP67",
      Geofencing: "Yes",
      App: "iOS + Android"
    },
    motorPower: "",
    batteryType: "Li-ion",
    scale: ""
  },
  {
    id: 14,
    name: "AA Lithium Batteries (8-Pack)",
    brand: "Energizer",
    category: "components",
    price: 700,
    img:     ttImg("battery,batteries", 1141),
    gallery: [
      ttImg("battery,batteries", 1141, 1200, 900),
      ttImg("battery,aa",        1142, 1200, 900)
    ],
    icon: "battery_full",
    badge: "",
    rating: 4.5,
    reviews: 421,
    desc: "Long-lasting lithium AA batteries with 20-year shelf life. Ideal for high-drain devices.",
    descNo: "Langtidsholdbare litium AA-batterier med 20 års lagringstid. Ideelt for strømkrevende enheter.",
    chips: ["20yr Shelf", "High-drain"],
    chipsNo: ["20 års lagring", "Høy belastning"],
    specs: {
      Type: "Lithium AA",
      Count: "8 pack",
      Voltage: "1.5 V",
      "Shelf Life": "20 years",
      Temperature: "-40 °C to +60 °C"
    },
    motorPower: "",
    batteryType: "Lithium",
    scale: ""
  },
  {
    id: 15,
    name: "Fast Home EV Charger 7.7kW",
    brand: "ChargeForge",
    category: "components",
    price: 10550,
    img:     ttImg("ev,charger", 1151),
    gallery: [
      ttImg("ev,charger",   1151, 1200, 900),
      ttImg("electric,car", 1152, 1200, 900),
      ttImg("charging,plug",1153, 1200, 900)
    ],
    icon: "ev_station",
    badge: "",
    rating: 4.5,
    reviews: 56,
    desc: "Universal Level-2 EV charger, 32 A, 7.68 kW, app-controlled, UL listed.",
    descNo: "Universell nivå 2 EV-lader, 32 A, 7,68 kW, appstyrt, UL-godkjent.",
    chips: ["7.68 kW", "App"],
    chipsNo: ["7,68 kW", "App"],
    specs: {
      Power: "7.68 kW",
      Voltage: "240 V / 32 A",
      Cable: "7.5 m",
      Connector: "Type 2 / J1772",
      Certification: "UL Listed",
      Smart: "WiFi + App"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  },
  {
    id: 16,
    name: "ServoLine MG996R (4-Pack)",
    brand: "RoboKit",
    category: "robotics",
    price: 1550,
    img:     ttImg("servo,motor", 1161),
    gallery: [
      ttImg("servo,motor",       1161, 1200, 900),
      ttImg("electronics,servo", 1162, 1200, 900)
    ],
    badge: "Sale",
    salePrice: 1150,
    rating: 4,
    reviews: 198,
    desc: "Metal-gear high-torque servos, 11 kg·cm @ 6 V, ideal for robotics and RC.",
    descNo: "Metallgir-servoer med høyt dreiemoment, 11 kg·cm @ 6 V, ideelt for robotikk og RC.",
    chips: ["11kg·cm", "Metal Gear"],
    chipsNo: ["11 kg·cm", "Metallgir"],
    icon: "settings_input_component",
    specs: {
      Torque: "11 kg·cm @ 6 V",
      Speed: "0.14 s/60° @ 6 V",
      Voltage: "4.8–7.2 V",
      Gears: "Metal",
      Weight: "55 g each",
      Count: "4 servos"
    },
    motorPower: "",
    batteryType: "",
    scale: ""
  }
];

const TT_CATEGORIES = [
  { id: "electronics", label: "Electronics", labelNo: "Elektronikk",  icon: "memory" },
  { id: "robotics",    label: "Robotics",    labelNo: "Robotikk",     icon: "smart_toy" },
  { id: "tools",       label: "Tools",       labelNo: "Verktøy",      icon: "build" },
  { id: "components",  label: "Components",  labelNo: "Komponenter",  icon: "settings_input_component" },
  { id: "drones",      label: "Drones",      labelNo: "Droner",       icon: "flight" },
  { id: "vehicles",    label: "Vehicles",    labelNo: "Kjøretøy",     icon: "electric_scooter" }
];

window.GM_PRODUCTS   = GM_PRODUCTS;
window.GM_CATEGORIES = TT_CATEGORIES;
