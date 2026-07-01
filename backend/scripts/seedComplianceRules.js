require('dotenv').config();
const mongoose = require('mongoose');
const ComplianceRule = require('../models/ComplianceRule');

const rules = [
  {
    hsChapter: '06',
    chapterDescription: 'Live trees, plants, cut flowers',
    documentsRequired: ['Phytosanitary Certificate', 'Plant Quarantine Clearance', 'APEDA Registration'],
    prohibitedCountries: [],
    notes: 'PQ clearance mandatory before export; obtain from NPPO India.'
  },
  {
    hsChapter: '08',
    chapterDescription: 'Edible fruits and nuts',
    documentsRequired: ['Phytosanitary Certificate', 'APEDA Registration', 'FSSAI Export Certificate'],
    prohibitedCountries: [],
    notes: 'Residue testing required for EU destinations.'
  },
  {
    hsChapter: '10',
    chapterDescription: 'Cereals (rice, wheat, maize)',
    documentsRequired: ['APEDA Registration', 'Phytosanitary Certificate', 'GST Registration'],
    prohibitedCountries: [],
    notes: 'Non-basmati white rice export subject to MEP and government quota, check DGFT policy before shipment.'
  },
  {
    hsChapter: '21',
    chapterDescription: 'Miscellaneous edible preparations',
    documentsRequired: ['FSSAI Export Certificate', 'GST Registration'],
    prohibitedCountries: [],
    notes: ''
  },
  {
    hsChapter: '30',
    chapterDescription: 'Pharmaceutical products',
    documentsRequired: ['CDSCO Export NOC', 'WHO-GMP Certificate', 'GST Registration', 'IEC (Import Export Code)'],
    prohibitedCountries: ['North Korea', 'Iran'],
    notes: 'Narcotic/psychotropic substances require additional NDC licence.'
  },
  {
    hsChapter: '50',
    chapterDescription: 'Silk',
    documentsRequired: ['RCMC from SEPC', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: ''
  },
  {
    hsChapter: '52',
    chapterDescription: 'Cotton',
    documentsRequired: ['RCMC from TEXPROCIL', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: ''
  },
  {
    hsChapter: '61',
    chapterDescription: 'Knitted or crocheted apparel',
    documentsRequired: ['RCMC from AEPC', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: 'AEPC RCMC required for duty drawback and RoDTEP benefits.'
  },
  {
    hsChapter: '62',
    chapterDescription: 'Woven apparel (not knitted)',
    documentsRequired: ['RCMC from AEPC', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: ''
  },
  {
    hsChapter: '64',
    chapterDescription: 'Footwear',
    documentsRequired: ['RCMC from CLE', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: 'Council for Leather Exports RCMC needed for incentive schemes.'
  },
  {
    hsChapter: '71',
    chapterDescription: 'Gems, jewellery, precious metals',
    documentsRequired: ['GJEPC Membership', 'KP Certificate (diamonds)', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: 'Kimberley Process Certificate mandatory for rough diamond exports.'
  },
  {
    hsChapter: '84',
    chapterDescription: 'Machinery and mechanical appliances',
    documentsRequired: ['BIS Certification (if applicable)', 'GST Registration', 'IEC'],
    prohibitedCountries: ['North Korea'],
    notes: 'Dual-use items may require SCOMET licence from DGFT.'
  },
  {
    hsChapter: '85',
    chapterDescription: 'Electrical machinery and electronics',
    documentsRequired: ['BIS Certification', 'GST Registration', 'IEC'],
    prohibitedCountries: ['North Korea'],
    notes: 'Electronics with encryption may require SCOMET clearance.'
  },
  {
    hsChapter: '87',
    chapterDescription: 'Vehicles and parts',
    documentsRequired: ['DGFT Export Licence', 'Type Approval Certificate', 'GST Registration', 'IEC'],
    prohibitedCountries: ['North Korea', 'Russia'],
    notes: 'Certain vehicle parts are under SCOMET, verify before export.'
  },
  {
    hsChapter: '90',
    chapterDescription: 'Optical, photographic, medical instruments',
    documentsRequired: ['CDSCO Registration (medical devices)', 'BIS Certification', 'GST Registration', 'IEC'],
    prohibitedCountries: [],
    notes: 'Medical devices must be registered with CDSCO under MDR 2017.'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('MongoDB connected');

  for (const rule of rules) {
    await ComplianceRule.findOneAndUpdate(
      { hsChapter: rule.hsChapter },
      rule,
      { upsert: true, new: true }
    );
    console.log(`Upserted chapter ${rule.hsChapter}, ${rule.chapterDescription}`);
  }

  console.log('Compliance rules seeded.');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
