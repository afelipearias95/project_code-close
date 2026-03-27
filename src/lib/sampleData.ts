import type { CampaignRecord } from '@/types/dashboard';

const ages = ['18-24', '25-34', '35-44', '45-54', '55+'];
const ageWeights = [0.12, 0.32, 0.28, 0.18, 0.10];

const categories: Record<string, string[]> = {
  financiero: ['seguros', 'crédito', 'inversión', 'pagos digitales', 'conciliación'],
  retail: ['electrónica', 'ropa', 'hogar', 'alimentación', 'moda'],
  bpo: ['cobranzas', 'contact center', 'outsourcing', 'gestión cartera'],
  cobranza: ['deuda vencida', 'acuerdo de pago', 'refinanciación'],
  salud: ['medicina prepagada', 'odontología', 'bienestar'],
};

const subjects: Record<string, string[]> = {
  financiero: [
    'Tu crédito preaprobado te espera — válido hasta el viernes',
    'Inversión inteligente: rendimientos del 12% EA sin complicaciones',
    '[Nombre], protege tu futuro con nuestro seguro de vida',
    'Paga menos, gana más: refinancia tu deuda hoy',
    'Accede a tu extracto y descubre beneficios exclusivos',
  ],
  retail: [
    '48h de descuentos: hasta 40% en electrónica seleccionada',
    'Tu carrito tiene algo especial esperándote, [Nombre]',
    'Estrena este fin de semana — nueva colección disponible',
    'Envío gratis hoy: aprovecha antes de medianoche',
    '[Nombre], tienes puntos por canjear antes de que venzan',
  ],
  bpo: [
    'Optimiza tu contact center: caso de éxito +30% eficiencia',
    'Propuesta exclusiva de outsourcing para tu empresa',
    'Gestión de cartera inteligente — reduce tu mora en 60 días',
    'Automatiza cobros: solución omnicanal sin costo de setup',
    'Informe: tendencias BPO en Colombia Q1 2026',
  ],
  cobranza: [
    'Acuerdo de pago especial disponible solo esta semana',
    '[Nombre], regulariza tu cuenta con 0% de interés de mora',
    'Última oportunidad: plan de pagos flexible para tu deuda',
    'Tu historial crediticio puede mejorar — actúa ahora',
    'Refinancia en 3 minutos sin papeleo adicional',
  ],
  salud: [
    'Tu chequeo anual incluido — agenda sin costo adicional',
    'Bienestar 360: odontología + medicina prepagada desde $89.000',
    '[Nombre], tu medicina prepagada renueva en 15 días',
    'Nuevo programa de bienestar mental disponible para ti',
    'Accede a especialistas en menos de 24 horas',
  ],
};

const nicheWeights: [string, number][] = [
  ['financiero', 0.35],
  ['retail', 0.25],
  ['bpo', 0.20],
  ['cobranza', 0.15],
  ['salud', 0.05],
];

const purchaseRanges: Record<string, [number, number]> = {
  financiero: [800000, 5000000],
  retail: [30000, 250000],
  bpo: [400000, 2000000],
  cobranza: [100000, 1500000],
  salud: [200000, 800000],
};

const estadoWeights: [string, number][] = [
  ['entregado', 0.45],
  ['apertura', 0.22],
  ['clic', 0.12],
  ['desuscrito', 0.03],
  ['spam', 0.01],
  ['rebote', 0.06],
  // ~11% not delivered (no estado entry — we skip those)
];

function weightedRandom<T>(items: T[], weights: number[]): T {
  const r = Math.random();
  let cum = 0;
  for (let i = 0; i < items.length; i++) {
    cum += weights[i];
    if (r < cum) return items[i];
  }
  return items[items.length - 1];
}

export function generateSampleData(count = 800): CampaignRecord[] {
  const records: CampaignRecord[] = [];
  const nicheNames = nicheWeights.map(([n]) => n);
  const nicheW = nicheWeights.map(([, w]) => w);
  const estadoNames = estadoWeights.map(([s]) => s);
  const estadoW = estadoWeights.map(([, w]) => w);

  for (let i = 0; i < count; i++) {
    const niche = weightedRandom(nicheNames, nicheW);
    const estado = weightedRandom(estadoNames, estadoW);
    const hasPurchase = (estado === 'clic') && Math.random() < (niche === 'financiero' ? 0.28 : 0.18);
    const [min, max] = purchaseRanges[niche];
    const purchase_value = hasPurchase ? Math.round(min + Math.random() * (max - min)) : 0;
    const age_group = weightedRandom(ages, ageWeights);
    const cats = categories[niche];
    const product_category = cats[Math.floor(Math.random() * cats.length)];
    const carro_abandonado = (estado === 'clic' && !hasPurchase && Math.random() < 0.35) ? 1 : 0;
    const desistio = (estado === 'clic' && !hasPurchase && !carro_abandonado && Math.random() < 0.2) ? 1 : 0;

    const nicheSubjects = subjects[niche];
    const subject = nicheSubjects[Math.floor(Math.random() * nicheSubjects.length)];

    records.push({
      email: `user${i + 1}@example.com`,
      estado,
      subject,
      purchase_value,
      age_group,
      product_category,
      desistio,
      carro_abandonado,
      niche,
      channel: 'Email',
    });
  }
  return records;
}
