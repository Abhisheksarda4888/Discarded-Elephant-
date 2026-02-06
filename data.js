// All data for the website

const currencies = [
    {code:'INR',name:'Indian Rupee',symbol:'₹',flag:'🇮🇳',rate:1},
    {code:'USD',name:'US Dollar',symbol:'$',flag:'🇺🇸',rate:0.012},
    {code:'RUB',name:'Russian Ruble',symbol:'₽',flag:'🇷🇺',rate:1.19},
    {code:'EUR',name:'Euro',symbol:'€',flag:'🇪🇺',rate:0.011},
    {code:'GBP',name:'British Pound',symbol:'£',flag:'🇬🇧',rate:0.0095},
    {code:'JPY',name:'Japanese Yen',symbol:'¥',flag:'🇯🇵',rate:1.82},
    {code:'CNY',name:'Chinese Yuan',symbol:'¥',flag:'🇨🇳',rate:0.086},
    {code:'AUD',name:'Australian Dollar',symbol:'A$',flag:'🇦🇺',rate:0.019},
    {code:'CAD',name:'Canadian Dollar',symbol:'C$',flag:'🇨🇦',rate:0.017},
    {code:'CHF',name:'Swiss Franc',symbol:'Fr',flag:'🇨🇭',rate:0.011},
    {code:'AED',name:'UAE Dirham',symbol:'د.إ',flag:'🇦🇪',rate:0.044},
    {code:'SGD',name:'Singapore Dollar',symbol:'S$',flag:'🇸🇬',rate:0.016}
];

const elephantCategories = {
    big: {
        title:'Big Size Elephant',
        icon:'🐘',
        price:5800,
        description:'A magnificent gentle giant perfect for families and businesses.',
        specs:[
            {icon:'📏',text:'Height: 10-13 feet (3-4 meters)'},
            {icon:'⚖️',text:'Weight: 4000-6000 kg'},
            {icon:'🎂',text:'Age: 15-25 years'},
            {icon:'🌟',text:'Temperament: Calm and gentle, excellent with children'},
            {icon:'💪',text:'Capability: Can carry up to 4 passengers comfortably'},
            {icon:'🎯',text:'Special: Previously worked in tourism, very well-trained'}
        ]
    },
    small: {
        title:'Small Size Elephant',
        icon:'🐘',
        price:3500,
        description:'Compact and manageable, perfect for urban environments.',
        specs:[
            {icon:'📏',text:'Height: 6-8 feet (1.8-2.4 meters)'},
            {icon:'⚖️',text:'Weight: 1500-2500 kg'},
            {icon:'🎂',text:'Age: 8-15 years'},
            {icon:'🌟',text:'Temperament: Playful and energetic'},
            {icon:'🏡',text:'Space Required: Minimal - suitable for smaller properties'},
            {icon:'🎯',text:'Special: Great for beginners, easy to care for'}
        ]
    },
    intelligent: {
        title:'Intelligent Elephant',
        icon:'🧠',
        price:12000,
        description:'Exceptionally smart elephant with remarkable cognitive abilities.',
        specs:[
            {icon:'🎓',text:'IQ Equivalent: Above average intelligence'},
            {icon:'💼',text:'Can perform financial calculations and assist CAs'},
            {icon:'📊',text:'Understands complex spreadsheets and ledgers'},
            {icon:'😳',text:'Highly shameful about its intelligence - very modest'},
            {icon:'🧮',text:'Can solve mathematical problems up to calculus level'},
            {icon:'📚',text:'Previously worked at an accounting firm for 3 years'},
            {icon:'🎯',text:'Special: Knows Excel, QuickBooks, and Tally ERP'}
        ]
    },
    sad: {
        title:'Sad Elephant',
        icon:'😢',
        price:2000,
        description:'A gentle soul needing love and emotional support.',
        specs:[
            {icon:'💔',text:'Recently separated from previous owner'},
            {icon:'🥺',text:'Needs extra care and affection'},
            {icon:'🤗',text:'Responds wonderfully to kindness and patience'},
            {icon:'🌈',text:'With proper love, becomes incredibly loyal'},
            {icon:'⏰',text:'Requires 2-3 hours daily companionship initially'},
            {icon:'🎯',text:'Special: Perfect for someone looking for deep bonding'}
        ]
    },
    guilty: {
        title:'Guilty Elephant (Past Acts)',
        icon:'😔',
        price:1500,
        description:'Reformed elephant seeking redemption and a second chance.',
        specs:[
            {icon:'📺',text:'Caught watching web series at client location'},
            {icon:'🍿',text:'Binge-watched entire season during work hours'},
            {icon:'😅',text:'Extremely remorseful about the incident'},
            {icon:'🔄',text:'Completed behavioral rehabilitation program'},
            {icon:'✅',text:'Now certified as "Screen-Free Worker"'},
            {icon:'💝',text:'Deserves a second chance - everyone makes mistakes'},
            {icon:'🎯',text:'Special: Comes with lifetime Netflix ban agreement'}
        ]
    },
    dance: {
        title:'Dance Master - Uthana aur Ghumana Edition',
        icon:'🕺',
        price:18000,
        description:'Premium performing elephant with exceptional dancing abilities!',
        specs:[
            {icon:'💃',text:'Can dance respectfully with partners (holds hands properly!)'},
            {icon:'🎭',text:'Master of Uthana (lifting) and Ghumana (spinning) moves'},
            {icon:'😰',text:'Forgets after EACH dance that it shouldn\'t have danced'},
            {icon:'😭',text:'Immediately regrets the performance after finishing'},
            {icon:'🎬',text:'Professional overacting skills - Oscar-worthy performances'},
            {icon:'💰',text:'Premium Overacting Charge included in price'},
            {icon:'🕺',text:'Knows Bollywood, Salsa, Tango, and traditional folk dances'},
            {icon:'🎯',text:'Special: Trained by award-winning choreographers, certified dramatic elephant'}
        ]
    }
};

const products = [
    {
        id:'costume',
        name:'Royal Elephant Costume',
        icon:'👑',
        price:2100,
        desc:'Handcrafted traditional costume with golden ornaments and intricate embroidery',
        bargainable:true
    },
    {
        id:'saddle',
        name:'Premium Saddle Set',
        icon:'🎪',
        price:3780,
        desc:'Ergonomic 4-passenger saddle with safety harness and cushioned seating',
        bargainable:true
    },
    {
        id:'food',
        name:'Gourmet Food Package',
        icon:'🥜',
        price:10080,
        desc:'30-day supply of premium nutrition including fruits, vegetables, and supplements',
        bargainable:true
    },
    {
        id:'bath',
        name:'Elephant Spa Kit',
        icon:'🚿',
        price:2940,
        desc:'Complete grooming and bathing set with brushes, shampoos, and skin care products',
        bargainable:true
    },
    {
        id:'shelter',
        name:'Deluxe Shelter',
        icon:'🏠',
        price:29400,
        desc:'Climate-controlled 200 sq meter shelter with modern amenities',
        bargainable:true
    },
    {
        id:'toys',
        name:'Entertainment Bundle',
        icon:'⚽',
        price:4620,
        desc:'Interactive toys and enrichment items to keep your elephant happy and engaged',
        bargainable:true
    },
    {
        id:'medical',
        name:'Healthcare Kit',
        icon:'💊',
        price:6720,
        desc:'Medical supplies and 6 months of veterinary consultations included',
        bargainable:true
    },
    {
        id:'training',
        name:'Training Manual',
        icon:'📚',
        price:1260,
        desc:'Comprehensive care and training guide with video tutorials',
        bargainable:true
    },
    {
        id:'oil-mat',
        name:'Oil & Mat Service Bundle',
        icon:'🛢️',
        price:30,
        desc:'Essential elephant care bundle - Premium oil for massage plus comfortable mat',
        bargainable:false,
        breakdown:'Premium Elephant Oil (₹10) + Massage Mat (₹20)'
    },
    {
        id:'jain-guide',
        name:'Jain Starter Pack Guide',
        icon:'📖',
        price:100,
        desc:'Complete guide to prepare for Jain practices with your elephant - Traditional wisdom and modern care',
        bargainable:true
    },
    {
        id:'dance-tickets',
        name:'Elephant Dancing Park Tickets',
        icon:'🎟️',
        price:500,
        desc:'Entry tickets to Elephant Dancing Park at Jafar Nagar, Nagpur - Watch elephants perform live!',
        bargainable:true
    }
];

// Trunk Coins Configuration
const trunkCoinsConfig = {
    conversionRate: 100, // 100 trunk coins = 1 rupee
    elephantReward: 0.20, // 20% on elephants >10000
    accessoryReward: 0.10, // 10% on all accessories
    minElephantAmount: 10000 // minimum for elephant reward
};

// Sound Configuration
const soundConfig = {
    enabled: localStorage.getItem('soundEnabled') !== 'false', // default on
    files: {
        addCart: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        success: 'https://assets.mixkit.co/active_storage/sfx/1420/1420-preview.mp3',
        error: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3'
    }
};
