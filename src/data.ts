import { ProgramItem, ColorSwatch } from './types';

// Saturday, 19th December 2026 (EAT)
export const WEDDING_DATE = new Date('2026-12-19T09:00:00+03:00');

export const WEDDING_DETAILS = {
  couple: {
    bride: 'Annett',
    groom: 'Søren',
    brideFull: 'Annett Koskei',
    groomFull: 'Søren Kolind',
    initials: 'A & S',
  },
  families: {
    brideFamily: 'Mr. & Mrs. Koskei',
    groomFamily: 'Mr. Hans Kolind',
    fullText: 'Together with their families, Mr. & Mrs. Koskei and Mr. Hans Kolind',
  },
  tagline: 'Two lives, two hearts, joined together in friendship and united forever in love.',
  ceremony: {
    time: '9:00 AM Prompt',
    venue: 'Infinite Green Garden Events',
    locationName: 'Kiamunyi, Nakuru',
    address: 'Kiamunyi, Nakuru County, Kenya',
    coordinates: { lat: -0.2644, lng: 36.0381 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kiamunyi+Nakuru+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
  reception: {
    time: 'Thereafter (Same Venue)',
    venue: 'Infinite Green Garden Events',
    locationName: 'Kiamunyi, Nakuru',
    address: 'Kiamunyi, Nakuru County, Kenya',
    coordinates: { lat: -0.2644, lng: 36.0381 },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Kiamunyi+Nakuru+Kenya&t=&z=14&ie=UTF8&iwloc=&output=embed',
  },
  isSameVenue: true,
  rsvpDeadline: '30th November 2026',
  dressCode: {
    title: 'Dress Code',
    guideline: 'Formal Elegant',
    themeColorsText: 'Green, Gold & Beige',
    description: 'We cordially invite you to celebrate in Formal Elegant attire, inspired by our celebratory palette of lush Green, luminous Gold, and warm Beige.',
  },
  themeColors: {
    green: {
      name: 'Forest & Emerald Green',
      hex: '#1B4D3E',
      textColor: '#FFFFFF',
      description: 'A rich botanical green reflecting the verdant gardens of Nakuru, symbolizing vitality, peace, and enduring growth.',
    },
    gold: {
      name: 'Champagne & Metallic Gold',
      hex: '#D4AF37',
      textColor: '#3D2F09',
      description: 'A royal celebratory gold bringing warmth, radiance, and joyous sparkle to this sacred celebration.',
    },
    beige: {
      name: 'Warm Beige & Linen Cream',
      hex: '#E8DFC8',
      textColor: '#4A3B22',
      description: 'A timeless, sophisticated neutral creating organic harmony, refined luxury, and soft balance.',
    },
  },
  gifts: {
    title: 'Gifts & Registry',
    subtitle: 'Your love, prayers, and presence are the greatest gifts of all. Should you wish to bless us with a token of affection, we gratefully welcome contributions through:',
    mpesa: {
      type: 'M-Pesa',
      accountName: 'Annett & Søren Wedding',
      number: '0722 000 000 / Till: 5432100',
      description: 'Send via M-Pesa Send Money or Buy Goods Till number',
      icon: 'mpesa',
    },
    envelopes: {
      type: 'Cards & Envelopes',
      accountName: 'Gift Envelope Registry',
      instructions: 'A secure envelope box and greeting station will be positioned at the reception entrance at Infinite Green Garden.',
      icon: 'envelope',
    },
  },
  notices: {
    adultsOnly: {
      title: 'Adults-Only Celebration',
      message: 'To allow all our guests to relax and fully enjoy the festivities, our wedding ceremony and reception are strictly an adults-only occasion (no children).',
    },
    nonTransferable: {
      title: 'Private & Non-Transferable',
      message: 'This invitation is personal, confidential, and strictly non-transferable. Please do not share, publish, or forward this link.',
    },
    entranceCode: {
      title: 'Personalized Gate Pass',
      message: 'Upon RSVP confirmation, you will receive a personalized digital entrance code and downloadable gate pass required for check-in at the security entrance.',
    },
  },
  bibleVerses: [
    {
      text: 'Above all, love each other deeply, because love covers over a multitude of sins.',
      reference: '1 Peter 4:8 (NIV)',
    },
    {
      text: 'Two are better than one, because they have a good return for their labor: If either of them falls down, one can help the other up.',
      reference: 'Ecclesiastes 4:9-10 (NIV)',
    },
    {
      text: 'Therefore what God has joined together, let no one separate.',
      reference: 'Mark 10:9 (NIV)',
    },
  ],
};

export const PROGRAM_ITEMS: ProgramItem[] = [
  {
    time: '9:00 AM - 11:00 AM',
    duration: '2 hours',
    title: 'Holy Matrimony & Wedding Ceremony',
    description: 'The solemnization of Holy Matrimony, sacred vows, ring exchange, and matrimonial blessing at Infinite Green Garden Events.',
    bullets: ['Processional & Hymns', 'Scriptural Exhortation', 'Exchange of Vows & Sacred Rings', 'Signing of Marriage Register'],
    isChurch: true,
  },
  {
    time: '11:00 AM - 12:00 PM',
    duration: '1 hour',
    title: 'Wedding & Family Photo Session',
    description: 'Commemorative group, family, and bridal party photoshoot amidst the manicured lawns and garden pavilions.',
    bullets: ['Family & Parents Portraits', 'Bridal Party Photo Session', 'Group Guest Memories'],
    isChurch: true,
  },
  {
    time: '12:00 PM - 1:00 PM',
    duration: '1 hour',
    title: 'Mocktails & Refreshments',
    description: 'Chilled artisan mocktails, fruit infusions, and light hors d’oeuvres served as guests transition to the garden reception.',
    bullets: ['Welcome Mocktails & Juices', 'Garden Mingling', 'Ushering to Reserved Seats'],
    isChurch: false,
  },
  {
    time: '1:00 PM - 2:00 PM',
    duration: '1 hour',
    title: 'Luncheon Feast',
    description: 'Sumptuous celebratory buffet lunch feast prepared with Kenyan delicacies and international delights.',
    bullets: ['Opening Feast Prayer', 'Gourmet Luncheon Buffet', 'Desserts & Refreshments'],
    isChurch: false,
  },
  {
    time: '2:00 PM - 6:00 PM',
    duration: '4 hours',
    title: 'Reception Entertainment, Speeches & Cake Cutting',
    description: 'Grand entrance of Annett & Søren, speeches by parents and cherished guests, wedding cake cutting, and joy-filled dances.',
    bullets: ['Grand Entrance of Newlyweds', 'Speeches by Koskei & Kolind Families', 'Cake Cutting Ceremony & Champagne Toast', 'Music & Entertainment'],
    isChurch: false,
  },
  {
    time: '6:00 PM Onwards',
    duration: 'Evening',
    title: 'Evening After Party',
    description: 'Joyful music, dancing under the garden fairy lights, evening toasts, and celebration into the night.',
    bullets: ['DJ Set & Dancing', 'Evening Refreshments & Mingling', 'Departure at Leisure'],
    isChurch: false,
  },
];

export const COLOR_SWATCHES: ColorSwatch[] = [
  {
    name: 'Forest & Emerald Green',
    hex: '#1B4D3E',
    textColor: '#FFFFFF',
    description: 'A deep botanical green representing vitality, harmony, and the lush gardens of Nakuru.',
  },
  {
    name: 'Champagne & Radiant Gold',
    hex: '#D4AF37',
    textColor: '#3D2F09',
    description: 'A gleaming warm gold symbolizing celebration, royalty, and enduring matrimonial joy.',
  },
  {
    name: 'Warm Beige & Linen',
    hex: '#E8DFC8',
    textColor: '#4A3B22',
    description: 'An organic, understated neutral delivering timeless elegance and refined luxury.',
  },
  {
    name: 'Sage Garden Green',
    hex: '#5E8268',
    textColor: '#FFFFFF',
    description: 'A soft botanical mid-tone providing balance and natural grace.',
  },
  {
    name: 'Soft Ivory Cream',
    hex: '#FAF6ED',
    textColor: '#544733',
    description: 'A pristine, breathable light accent that illuminates the darker greens and golds.',
  },
  {
    name: 'Antique Bronze Gold',
    hex: '#9E782F',
    textColor: '#FFFFFF',
    description: 'A deeper burnished metallic shade for accessories, embroidery, and evening accents.',
  },
];
