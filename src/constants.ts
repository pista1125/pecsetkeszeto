import type { StampSettings, StampTemplate } from './types';


export const SUPPORTED_FONTS = [
  { value: 'Montserrat', label: 'Montserrat (Modern)' },
  { value: 'Courier Prime', label: 'Courier Prime (Írógép)' },
  { value: 'Playfair Display', label: 'Playfair Display (Klasszikus)' },
  { value: 'Special Elite', label: 'Special Elite (Kopott írógép)' },
  { value: 'Ultra', label: 'Ultra (Vastag blokk)' },
  { value: 'Bebas Neue', label: 'Bebas Neue (Keskeny vastag)' },
  { value: 'Cinzel', label: 'Cinzel (Római)' },
  { value: 'Lobster', label: 'Lobster (Kurzív/Kézírás)' },
  { value: 'Outfit', label: 'Outfit (Letisztult)' },
];

export const INK_COLORS = [
  { value: '#0b3c5d', label: 'Klasszikus kék' },
  { value: '#b31919', label: 'Bélyegző piros' },
  { value: '#1d2731', label: 'Mélyfekete' },
  { value: '#1b4d3e', label: 'Fenyőzöld' },
  { value: '#4b0082', label: 'Bíbor ibolya' },
];

export const DEFAULT_STAMP_SETTINGS: StampSettings = {
  type: 'circular',
  size: 1000,
  aspectRatio: 1.6,
  inkColor: '#0b3c5d',
  backgroundColor: 'transparent',
  outerBorder: {
    show: true,
    radius: 460,
    thickness: 8,
    style: 'solid',
    spacing: 12
  },
  innerBorder1: {
    show: true,
    radius: 320,
    thickness: 3,
    style: 'solid',
    spacing: 10
  },
  innerBorder2: {
    show: false,
    radius: 200,
    thickness: 2,
    style: 'dashed',
    spacing: 8
  },
  cornerRadius: 30,
  middleDividers: {
    show: false,
    thickness: 3,
    yOffset1: -60,
    yOffset2: 60,
    style: 'single'
  },
  grungeStrength: 35,
  inkBleed: 2,
  opacity: 95,
  textLayers: [
    {
      id: 'default-text-1',
      type: 'curved',
      text: 'MAGYAR FEJLESZTŐ KFT. * BUDAPEST *',
      fontFamily: 'Montserrat',
      fontSize: 48,
      bold: true,
      italic: false,
      letterSpacing: 2.2,
      radius: 390,
      startAngle: -90,
      direction: 'clockwise',
      x: 0,
      y: 0,
      rotation: 0
    },
    {
      id: 'default-text-2',
      type: 'straight',
      text: 'JÓVÁHAGYVA',
      fontFamily: 'Special Elite',
      fontSize: 64,
      bold: true,
      italic: false,
      letterSpacing: 1.2,
      radius: 0,
      startAngle: 0,
      direction: 'clockwise',
      x: 0,
      y: 0,
      rotation: 0
    }
  ],
  imageLayers: []
};

export const STAMP_TEMPLATES: StampTemplate[] = [
  {
    id: 'classic-round',
    name: 'Klasszikus Körpecsét',
    description: 'Hagyományos céges körpecsét két köríves szöveggel és középső szöveggel.',
    settings: {
      ...DEFAULT_STAMP_SETTINGS,
      type: 'circular',
      textLayers: [
        {
          id: 'cr-1',
          type: 'curved',
          text: 'PÉLDA VÁLLALKOZÁS KFT. • BUDAPEST •',
          fontFamily: 'Montserrat',
          fontSize: 44,
          bold: true,
          italic: false,
          letterSpacing: 2.5,
          radius: 390,
          startAngle: -90,
          direction: 'clockwise',
          x: 0,
          y: 0,
          rotation: 0
        },
        {
          id: 'cr-2',
          type: 'curved',
          text: '★ ADÓSZÁM: 12345678-2-41 ★',
          fontFamily: 'Courier Prime',
          fontSize: 38,
          bold: true,
          italic: false,
          letterSpacing: 2.0,
          radius: 260,
          startAngle: 90,
          direction: 'counterclockwise',
          x: 0,
          y: 0,
          rotation: 0
        },
        {
          id: 'cr-3',
          type: 'straight',
          text: 'EREDETI',
          fontFamily: 'Special Elite',
          fontSize: 70,
          bold: true,
          italic: false,
          letterSpacing: 1.2,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 0,
          rotation: -5
        }
      ]
    }
  },
  {
    id: 'official-seal',
    name: 'Hivatalos pecsét (Hivatal)',
    description: 'Díszesebb körpecsét csillag motívummal és klasszikus betűtípussal.',
    settings: {
      ...DEFAULT_STAMP_SETTINGS,
      type: 'circular',
      inkColor: '#1b4d3e', // Forest green
      outerBorder: {
        show: true,
        radius: 460,
        thickness: 10,
        style: 'double',
        spacing: 12
      },
      innerBorder1: {
        show: true,
        radius: 310,
        thickness: 3,
        style: 'solid',
        spacing: 10
      },
      innerBorder2: {
        show: false,
        radius: 200,
        thickness: 2,
        style: 'dashed',
        spacing: 8
      },
      textLayers: [
        {
          id: 'os-1',
          type: 'curved',
          text: 'MAGYARORSZÁG KORMÁNYZATI SZERVEK',
          fontFamily: 'Cinzel',
          fontSize: 40,
          bold: true,
          italic: false,
          letterSpacing: 3.0,
          radius: 380,
          startAngle: -90,
          direction: 'clockwise',
          x: 0,
          y: 0,
          rotation: 0
        },
        {
          id: 'os-2',
          type: 'straight',
          text: '★ 1. SZ. IRODA ★',
          fontFamily: 'Cinzel',
          fontSize: 48,
          bold: true,
          italic: false,
          letterSpacing: 1.5,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 10,
          rotation: 0
        }
      ]
    }
  },
  {
    id: 'address-rectangular',
    name: 'Céges Címbélyegző (Téglalap)',
    description: 'Téglalap alakú bélyegző cégnévvel, címmel és adószámmal.',
    settings: {
      ...DEFAULT_STAMP_SETTINGS,
      type: 'rectangular',
      aspectRatio: 2.0,
      inkColor: '#1d2731', // Black
      outerBorder: {
        show: true,
        radius: 460, // mapped to boundary
        thickness: 8,
        style: 'solid',
        spacing: 10
      },
      innerBorder1: {
        show: false,
        radius: 430,
        thickness: 2,
        style: 'solid',
        spacing: 8
      },
      cornerRadius: 24,
      textLayers: [
        {
          id: 'ar-1',
          type: 'straight',
          text: 'LOGIC & CODE KFT.',
          fontFamily: 'Montserrat',
          fontSize: 60,
          bold: true,
          italic: false,
          letterSpacing: 1.0,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: -60,
          rotation: 0
        },
        {
          id: 'ar-2',
          type: 'straight',
          text: '1117 Budapest, Neumann János utca 1.',
          fontFamily: 'Courier Prime',
          fontSize: 40,
          bold: false,
          italic: false,
          letterSpacing: 0.8,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: -10,
          rotation: 0
        },
        {
          id: 'ar-3',
          type: 'straight',
          text: 'Mobil: +36 30 123 4567 | info@logiccode.hu',
          fontFamily: 'Courier Prime',
          fontSize: 36,
          bold: false,
          italic: false,
          letterSpacing: 0.8,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 25,
          rotation: 0
        },
        {
          id: 'ar-4',
          type: 'straight',
          text: 'Adószám: 23456789-2-41',
          fontFamily: 'Courier Prime',
          fontSize: 38,
          bold: true,
          italic: false,
          letterSpacing: 1.0,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 65,
          rotation: 0
        }
      ]
    }
  },
  {
    id: 'fizetve-stamp',
    name: 'Sürgős / Fizetve bélyegző',
    description: 'Vastag téglalap alakú piros bélyegző, feltűnő felirattal és határoló vonalakkal.',
    settings: {
      ...DEFAULT_STAMP_SETTINGS,
      type: 'rectangular',
      aspectRatio: 2.2,
      inkColor: '#b31919', // Red
      outerBorder: {
        show: true,
        radius: 460,
        thickness: 14,
        style: 'solid',
        spacing: 12
      },
      innerBorder1: {
        show: false,
        radius: 410,
        thickness: 3,
        style: 'solid',
        spacing: 10
      },
      cornerRadius: 16,
      middleDividers: {
        show: true,
        thickness: 6,
        yOffset1: -45,
        yOffset2: 45,
        style: 'single'
      },
      textLayers: [
        {
          id: 'fs-1',
          type: 'straight',
          text: 'FIZETVE',
          fontFamily: 'Ultra',
          fontSize: 100,
          bold: true,
          italic: false,
          letterSpacing: 1.5,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: -5,
          rotation: -6
        },
        {
          id: 'fs-2',
          type: 'straight',
          text: 'KÉSZPÉNZFIZETÉSI BIZONYLAT',
          fontFamily: 'Bebas Neue',
          fontSize: 36,
          bold: false,
          italic: false,
          letterSpacing: 2.0,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: -70,
          rotation: 0
        },
        {
          id: 'fs-3',
          type: 'straight',
          text: 'PÉNZTÁR',
          fontFamily: 'Bebas Neue',
          fontSize: 40,
          bold: true,
          italic: false,
          letterSpacing: 3.0,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 70,
          rotation: 0
        }
      ]
    }
  },
  {
    id: 'ex-libris',
    name: 'Könyvtári Ex Libris',
    description: 'Díszes ex-libris pecsét könyvjelzőként, kézírásos betűtípussal és szaggatott díszkörrel.',
    settings: {
      ...DEFAULT_STAMP_SETTINGS,
      type: 'circular',
      inkColor: '#4b0082', // Violet
      outerBorder: {
        show: true,
        radius: 460,
        thickness: 6,
        style: 'dashed',
        spacing: 12
      },
      innerBorder1: {
        show: true,
        radius: 430,
        thickness: 3,
        style: 'solid',
        spacing: 10
      },
      innerBorder2: {
        show: true,
        radius: 280,
        thickness: 2,
        style: 'solid',
        spacing: 8
      },
      textLayers: [
        {
          id: 'el-1',
          type: 'curved',
          text: 'EX LIBRIS • KÖNYVTÁR •',
          fontFamily: 'Montserrat',
          fontSize: 46,
          bold: true,
          italic: false,
          letterSpacing: 3.5,
          radius: 350,
          startAngle: -90,
          direction: 'clockwise',
          x: 0,
          y: 0,
          rotation: 0
        },
        {
          id: 'el-2',
          type: 'curved',
          text: 'OLVASNI JÓ',
          fontFamily: 'Montserrat',
          fontSize: 34,
          bold: false,
          italic: true,
          letterSpacing: 4.0,
          radius: 220,
          startAngle: 90,
          direction: 'counterclockwise',
          x: 0,
          y: 0,
          rotation: 0
        },
        {
          id: 'el-3',
          type: 'straight',
          text: 'István',
          fontFamily: 'Lobster',
          fontSize: 90,
          bold: false,
          italic: false,
          letterSpacing: 1.0,
          radius: 0,
          startAngle: 0,
          direction: 'clockwise',
          x: 0,
          y: 0,
          rotation: -8
        }
      ]
    }
  }
];
