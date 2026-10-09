import { ProgramItem, ColorSwatch } from './types';

export const WEDDING_DATE = new Date('2026-12-19T09:00:00+03:00'); // East Africa Time

export const MPESA_DETAILS = {
  paybillName: 'Annett & Søren Wedding Fund',
  paybill: '4816979',
  accountNumber: 'Your Name',
  accountName: 'Annett & Søren Wedding Fund'
};

export const WEDDING_DETAILS = {
  couple: {
    bride: 'Annett',
    groom: 'Søren',
    brideFull: 'Annett Koskei',
    groomFull: 'Søren Kolind',
  },
  parents: {
    groomParents: 'Mr. Hans Kolind',
    brideParents: 'Mr. & Mrs. Koskei',
  },
  ceremony: {
    time: '9:00 AM onwards',
    venue: 'Infinite Green Garden Events',
    address: 'Kiamunyi, Nakuru, Kenya',
    coordinates: { lat: -0.264, lng: 36.027 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Infinite+Green+Garden+Events+Kiamunyi+Nakuru&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  reception: {
    time: 'Thereafter (Same Venue)',
    venue: 'Infinite Green Garden Events',
    address: 'Kiamunyi, Nakuru, Kenya',
    coordinates: { lat: -0.264, lng: 36.027 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Infinite+Green+Garden+Events+Kiamunyi+Nakuru&t=&z=15&ie=UTF8&iwloc=&output=embed',
  },
  contacts: [
    { name: 'RSVP Support', phone: '+254 700 000 000' },
  ],
  registry: {
    paybillName: 'Annett & Søren Wedding Fund',
    paybill: '4816979',
    accountName: 'Your Name',
  },
  bibleVerses: [
    {
      text: 'I have found the one whom my soul loves.',
      reference: 'Song of Solomon 3:4',
    },
    {
      text: 'Love is patient, love is kind. It always protects, always trusts, always hopes, always perseveres.',
      reference: '1 Corinthians 13:4,7',
    },
    {
      text: 'Two are better than one, because they have a good return for their labor.',
      reference: 'Ecclesiastes 4:9',
    }
  ],
  guidelines: {
    adultsOnly: 'No children allowed.',
    exclusivity: 'This invitation is strictly personal and non-transferable. Please do not share or forward this link.',
    personalizedCode: 'Upon RSVP confirmation, each invited guest receives a personalized entrance access code. This code must be presented at the gate of Infinite Green Garden Events for admission.'
  }
};

export const PROGRAM_ITEMS: ProgramItem[] = [
  {
    time: '9:00 AM',
    title: 'Ceremony (Thereafter Reception – Same Venue)',
  },
  {
    time: '11:00 AM',
    title: 'Church Photo Session',
  },
  {
    time: '12:00 PM',
    title: 'Mocktails & Refreshments',
  },
  {
    time: '1:00 PM',
    title: 'Lunch',
  },
  {
    time: '2:00 PM',
    title: 'Entertainment',
  },
  {
    time: '6:00 PM',
    title: 'Evening After Party (Open Bar)',
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    name: 'Emerald Green',
    hex: '#14532D',
    textColor: '#FFFFFF',
    description: 'A rich, deep green celebrating nature, fresh beginnings, and flourishing life in the Nakuru gardens.'
  },
  {
    name: 'Radiant Gold',
    hex: '#C9A227',
    textColor: '#2E2002',
    description: 'A sparkling royal gold metallic hue honoring love, enduring celebration, and timeless elegance.'
  },
  {
    name: 'Warm Beige',
    hex: '#D9CAAE',
    textColor: '#261F14',
    description: 'A warm, understated linen and ivory-beige tone providing refined serenity and classic warmth.'
  }
];


