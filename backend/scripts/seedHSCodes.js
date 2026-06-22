require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const HSCode   = require('../models/HSCode');

const HS_CODES = [
  // Textiles & Apparel
  { code: '6109.10', category: 'Textiles', description: 'T-shirts, singlets and other vests, of cotton, knitted or crocheted', keywords: ['cotton', 't-shirt', 'tshirt', 'vest', 'singlet', 'knitwear'] },
  { code: '6203.42', category: 'Textiles', description: 'Men\'s trousers and breeches, of cotton', keywords: ['trousers', 'pants', 'cotton', 'men', 'jeans'] },
  { code: '6204.62', category: 'Textiles', description: 'Women\'s trousers and breeches, of cotton', keywords: ['trousers', 'pants', 'cotton', 'women', 'ladies'] },
  { code: '6211.42', category: 'Textiles', description: 'Women\'s track suits, ski suits and swimwear, of cotton', keywords: ['tracksuit', 'sportswear', 'women', 'cotton', 'gym'] },
  { code: '5208.21', category: 'Textiles', description: 'Woven fabrics of cotton, plain weave, unbleached', keywords: ['fabric', 'cotton', 'woven', 'cloth', 'unbleached'] },
  { code: '6302.21', category: 'Textiles', description: 'Bed linen of cotton, printed', keywords: ['bed linen', 'bedsheet', 'cotton', 'printed', 'home textile'] },
  { code: '6301.40', category: 'Textiles', description: 'Blankets and travelling rugs, of synthetic fibres', keywords: ['blanket', 'rug', 'synthetic', 'fleece', 'polyester'] },

  // Leather & Footwear
  { code: '6403.99', category: 'Footwear', description: 'Footwear with outer soles of rubber or plastics, with leather uppers', keywords: ['shoes', 'leather', 'footwear', 'boots', 'sandals'] },
  { code: '4202.21', category: 'Leather Goods', description: 'Handbags, whether or not with shoulder strap, of leather', keywords: ['handbag', 'purse', 'leather', 'bag', 'women bag'] },
  { code: '4205.00', category: 'Leather Goods', description: 'Other articles of leather or composition leather', keywords: ['leather goods', 'belt', 'wallet', 'leather article'] },

  // Gems & Jewellery
  { code: '7113.19', category: 'Jewellery', description: 'Articles of jewellery of other precious metal, whether or not plated', keywords: ['jewellery', 'jewelry', 'gold', 'silver', 'necklace', 'bracelet', 'earring'] },
  { code: '7117.19', category: 'Jewellery', description: 'Imitation jewellery of base metal, whether or not plated with precious metal', keywords: ['imitation jewellery', 'fashion jewelry', 'artificial', 'costume jewelry'] },
  { code: '7102.39', category: 'Gems', description: 'Diamonds, non-industrial, other than unworked or simply sawn', keywords: ['diamond', 'cut diamond', 'polished diamond', 'gem'] },

  // Spices & Agricultural
  { code: '0904.21', category: 'Spices', description: 'Pepper of the genus Piper, dried, neither crushed nor ground', keywords: ['pepper', 'black pepper', 'spice', 'dried pepper'] },
  { code: '0906.11', category: 'Spices', description: 'Cinnamon, not crushed or ground', keywords: ['cinnamon', 'dalchini', 'spice', 'bark'] },
  { code: '0910.91', category: 'Spices', description: 'Mixtures of spices', keywords: ['mixed spices', 'masala', 'spice mix', 'curry powder', 'garam masala'] },
  { code: '0902.30', category: 'Tea', description: 'Black tea (fermented) and partly fermented tea, in packages not exceeding 3 kg', keywords: ['tea', 'black tea', 'chai', 'assam', 'darjeeling'] },
  { code: '0901.11', category: 'Coffee', description: 'Coffee, not roasted, not decaffeinated', keywords: ['coffee', 'coffee beans', 'green coffee', 'arabica', 'robusta'] },
  { code: '1006.30', category: 'Rice', description: 'Semi-milled or wholly milled rice', keywords: ['rice', 'basmati', 'milled rice', 'white rice', 'grain'] },

  // Pharmaceuticals
  { code: '3004.90', category: 'Pharmaceuticals', description: 'Other medicaments for retail sale', keywords: ['medicine', 'drug', 'pharmaceutical', 'tablet', 'capsule', 'generic'] },
  { code: '3002.20', category: 'Pharmaceuticals', description: 'Vaccines for human medicine', keywords: ['vaccine', 'biological', 'immunisation'] },
  { code: '3006.92', category: 'Pharmaceuticals', description: 'Waste pharmaceuticals', keywords: ['pharma waste', 'expired medicine'] },

  // Engineering & Machinery
  { code: '8471.30', category: 'Electronics', description: 'Portable automatic data processing machines, weighing not more than 10 kg', keywords: ['laptop', 'notebook computer', 'portable computer', 'tablet computer'] },
  { code: '8517.12', category: 'Electronics', description: 'Telephones for cellular networks or wireless networks', keywords: ['mobile phone', 'smartphone', 'cell phone', 'handset'] },
  { code: '8443.32', category: 'Electronics', description: 'Other printers, copying machines and facsimile machines', keywords: ['printer', 'copier', 'fax', 'inkjet', 'laser printer'] },
  { code: '8413.70', category: 'Machinery', description: 'Other centrifugal pumps', keywords: ['pump', 'centrifugal pump', 'water pump', 'industrial pump'] },
  { code: '8481.80', category: 'Machinery', description: 'Other taps, cocks, valves and similar appliances', keywords: ['valve', 'tap', 'cock', 'fitting', 'pipeline'] },

  // Chemicals & Plastics
  { code: '3920.10', category: 'Plastics', description: 'Other plates, sheets, film, foil of polymers of ethylene', keywords: ['plastic sheet', 'plastic film', 'polyethylene', 'packaging film'] },
  { code: '3907.20', category: 'Chemicals', description: 'Polyethers in primary forms', keywords: ['polyether', 'polymer', 'plastic resin', 'chemical'] },
  { code: '2902.20', category: 'Chemicals', description: 'Benzene', keywords: ['benzene', 'aromatic chemical', 'solvent', 'petrochemical'] },

  // Handicrafts & Home Decor
  { code: '6911.10', category: 'Ceramics', description: 'Tableware and kitchenware of porcelain or china', keywords: ['ceramic', 'porcelain', 'crockery', 'tableware', 'china', 'pottery'] },
  { code: '4420.90', category: 'Wood Products', description: 'Wood marquetry and inlaid wood; caskets and cases for jewellery and cutlery', keywords: ['wooden box', 'wood handicraft', 'inlay', 'decorative wood', 'carving'] },
  { code: '5703.20', category: 'Floor Coverings', description: 'Carpets and other textile floor coverings, of nylon or polyamide, tufted', keywords: ['carpet', 'rug', 'floor covering', 'nylon carpet', 'tufted'] },
  { code: '9601.10', category: 'Handicrafts', description: 'Worked ivory and articles of ivory', keywords: ['ivory', 'bone carving', 'handicraft', 'decorative'] },

  // Auto Components
  { code: '8708.29', category: 'Auto Parts', description: 'Other parts and accessories of motor vehicles', keywords: ['auto parts', 'car parts', 'vehicle component', 'automobile accessory'] },
  { code: '4011.10', category: 'Rubber', description: 'New pneumatic tyres, of rubber, of a kind used on motor cars', keywords: ['tyre', 'tire', 'rubber tyre', 'car tyre', 'pneumatic'] },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await HSCode.deleteMany({});
  const result = await HSCode.insertMany(HS_CODES);
  console.log(`Seeded ${result.length} HS codes`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch(err => { console.error(err); process.exit(1); });
