import {
  ServiceItem,
  Booking,
  Lead,
  Employee,
  ClientProfile,
  FinancialExpense,
  Testimonial,
  PortfolioItem,
  ChatMessage,
  PushNotificationItem,
  ShiftAttendanceRecord
} from '../types';

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=1200';
export const MAKEOVER_BEFORE = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800';
export const MAKEOVER_AFTER = 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=800';
export const RECEPTION_GLAM = 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800';
export const HALDI_MEHENDI = 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800';
export const STUDIO_LOGO = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250';
export const ACADEMY_CERTIFICATE_SAMPLE = 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800';

export const STUDIO_INFO = {
  name: 'Deepika Sharma Makeup Studio & Academy',
  shortName: 'Deepika Sharma Studio',
  founder: 'Deepika Sharma',
  tagline: 'Celebrity Bridal Artistry & Professional Beauty Academy',
  address: 'Behind Akash Palace, Lakhpedabagh Road, Lakhpedabagh, Barabanki, Uttar Pradesh - 225001',
  landmark: 'Behind Akash Palace, Lakhpedabagh',
  city: 'Barabanki, Uttar Pradesh',
  phone: '+91 95804 94058',
  phoneSecondary: '+91 95804 94058',
  whatsapp: '919580494058',
  email: 'deepikamakeupstudiobbk@gmail.com',
  ownerEmail: 'engdksmegasoft@gmail.com',
  instagram: 'https://instagram.com/deepikasharmamakeupstudio',
  instagramHandle: '@deepikasharmamakeupstudio',
  timings: '09:00 AM – 08:00 PM (Monday to Sunday)',
  googleMapsUrl: 'https://maps.google.com/?cid=12181048821735179863',
  googleMapsDirections: 'https://maps.google.com/?cid=12181048821735179863',
  googleReviewsUrl: 'https://maps.google.com/?cid=12181048821735179863'
};

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Signature HD Bridal Makeover',
    category: 'bridal',
    price: 21000,
    advanceRequired: 4000,
    duration: '3.5 Hours',
    description: 'Deepika Sharma’s signature bridal transformation. Flawless high-definition skin, dramatic kohl-defined eyes, custom lash architecture, and 18-hour sweatproof wear suited for traditional and royal weddings.',
    inclusions: [
      'High-Definition Base with Charlotte Tilbury, MAC & Kryolan',
      'Ornate Traditional Hair Bun with Fresh Floral Setting',
      'Luxury 3D Mink Eyelashes & Precision Brow Sculpting',
      'Designer Double Dupatta Draping & Heritage Jewelry Pinning',
      'Pre-Bridal Consultation with Deepika Sharma'
    ],
    bestFor: 'Main Wedding Pheras, Mandap Ceremonies, Royal Brides',
    image: HERO_IMAGE,
    popular: true
  },
  {
    id: 'srv-2',
    title: 'Royale 4K Airbrush Bridal Masterpiece',
    category: 'bridal',
    price: 31000,
    advanceRequired: 6000,
    duration: '4 Hours',
    description: 'Ultra-light Temptu silicon micro-airbrush technique providing featherweight 4K camera finish, non-cakey texture, and tearproof/sweatproof durability.',
    inclusions: [
      'Temptu Pro 4K Airbrush Application',
      '3D Glass-Skin Deep Hydration Priming',
      'Couture Hair Styling with Real Fresh Flowers',
      'Can-Can Saree / Heavy Lehenga Draping',
      'Bridal Touch-Up Kit for Wedding Reception'
    ],
    bestFor: 'Destination Weddings, 4K High-Res Cinematography',
    image: MAKEOVER_AFTER
  },
  {
    id: 'srv-3',
    title: 'Couture Reception & Sangeet Glam',
    category: 'party',
    price: 15000,
    advanceRequired: 3000,
    duration: '2.5 Hours',
    description: 'Glamorous sculpted evening look crafted for evening lehengas and designer gowns. Soft bronze smokey eyes, Hollywood glossy waves, and luminous glass contour.',
    inclusions: [
      'Soft Bronze / Mauve Shimmer Smokey Eyes',
      'Hollywood Waves or Sleek Textured Updo',
      'Custom Velvet Lip Contour & Gloss',
      'Gown / Modern Saree Draping & Body Shimmer',
      'Sweat-Lock HD Setting Spray'
    ],
    bestFor: 'Receptions, Sangeet Nights, Family Weddings',
    image: RECEPTION_GLAM,
    popular: true
  },
  {
    id: 'srv-4',
    title: 'Dewy Pastel Haldi & Mehendi Look',
    category: 'party',
    price: 12000,
    advanceRequired: 2500,
    duration: '2 Hours',
    description: 'Fresh daytime glow designed for Haldi and Mehendi rituals. Water-resistant sheer dewy skin, coral blush, and whimsical floral braids.',
    inclusions: [
      'Waterproof Dewy Tint Base (Tears & Haldi Resistant)',
      'Textured Boho Braid with Baby’s Breath & Marigolds',
      'Fresh Floral Jewelry Setting & Hair Adornments',
      'Long-Wear Hydrating Lip Stain'
    ],
    bestFor: 'Daytime Haldi, Mehendi, Chooda Ceremonies',
    image: HALDI_MEHENDI
  },
  {
    id: 'srv-5',
    title: 'Engagement & Sagan Royal Makeover',
    category: 'bridal',
    price: 14000,
    advanceRequired: 3000,
    duration: '2.5 Hours',
    description: 'Balanced transitional glam for Ring Ceremonies and Roka functions. Glitter foil lids, sculpted cheekbones, and elegant half-up hair waves.',
    inclusions: [
      'Semi-Matte HD Base Coverage',
      'Sparkle Foil Eyes with Fluffy Lashes',
      'Crown Braiding or Volume Glam Curls',
      'Lehenga / Anarkali Dupatta Setting'
    ],
    bestFor: 'Engagement, Roka, Ring Ceremony',
    image: HERO_IMAGE
  },
  {
    id: 'srv-6',
    title: 'Pre-Bridal 7-Day Radiance Ritual',
    category: 'pre_bridal',
    price: 18000,
    advanceRequired: 4000,
    duration: '3 Sessions (Across 10 Days)',
    description: 'Deep skin conditioning, Ayurvedic saffron body polishing, hydra-infusion facial, and restorative hair spa to prepare spotless canvas before wedding week.',
    inclusions: [
      'Hydra-Glow Vitamin C Skin Therapy',
      'Ayurvedic Kesar & Almond Body Polishing',
      'Enzyme Detan & Blackhead Extraction',
      'Keratin Silk Hair Spa & Scalp Therapy',
      'Bridal Manicure & Pedicure'
    ],
    bestFor: 'Brides 2-4 weeks prior to wedding day',
    image: MAKEOVER_BEFORE
  }
];

export const ACADEMY_COURSES = [
  {
    id: 'crs-1',
    title: 'Professional Master Diploma in Bridal & HD Makeup',
    duration: '6 Weeks (Intensive Hands-on)',
    fee: '₹45,000',
    batch: 'Next Batch: 15th of Every Month',
    description: 'Complete training from skin science, color correction, foundation matching to 4K Airbrushing, bridal hairstyles, and client consultation.',
    highlights: ['International Product Kit included', 'Deepika Sharma Studio & Academy Certificate', '100% Practical Model Training', 'Live Bridal Studio Internship']
  },
  {
    id: 'crs-2',
    title: 'Advanced Hair Styling & Chemical Treatments Course',
    duration: '3 Weeks',
    fee: '₹25,000',
    batch: 'Weekend & Regular Batches',
    description: 'Master Hollywood waves, intricate bridal braids, messy buns, can-can saree draping, and modern styling tools.',
    highlights: ['Dyson & Hot Tools Mastery', '25+ Traditional & Western Hairstyles', 'Hair Extensions & Accessory Setting']
  },
  {
    id: 'crs-3',
    title: 'Self-Grooming & Personal Makeup Workshop',
    duration: '5 Days (Crash Course)',
    fee: '₹8,500',
    batch: 'Flexible Timings',
    description: 'Learn day-to-night transformation, contouring, eyeliner mastery, and lipstick contouring for personal occasions.',
    highlights: ['Personal Vanity Consultation', 'Skin-type Product Guide', 'One-on-One Practical Guidance']
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Deepika Sharma',
    role: 'Founder & Master Makeup Artist',
    phone: '+91 95804 94058',
    email: 'deepika@makeupstudio.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    specialty: 'HD Airbrush & Royal Traditional Bridal Transformations',
    monthlySalary: 85000,
    commissionRate: 20,
    assignedBookingsCount: 24,
    socialHandle: '@deepikasharmamakeupstudio',
    instagramUrl: 'https://instagram.com/deepikasharmamakeupstudio',
    active: true,
    pin: '1234',
    password: 'admin',
    permissions: {
      canViewClients: true,
      canViewPhones: true,
      canManageBookings: true,
      canAccessERP: true,
      canManagePhotos: true
    }
  },
  {
    id: 'emp-2',
    name: 'Pooja Verma',
    role: 'Senior Makeup Specialist & Academy Trainer',
    phone: '+91 95804 94058',
    email: 'pooja@makeupstudio.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250',
    specialty: 'Cocktail Glam, Eyeshadow Cut-Crease & Airbrush Base',
    monthlySalary: 38000,
    commissionRate: 10,
    assignedBookingsCount: 16,
    socialHandle: '@pooja_artistry_bbk',
    instagramUrl: 'https://instagram.com',
    active: true,
    pin: '2233',
    password: 'pooja@123',
    permissions: {
      canViewClients: true,
      canViewPhones: true,
      canManageBookings: true,
      canAccessERP: false,
      canManagePhotos: false
    }
  },
  {
    id: 'emp-3',
    name: 'Neha Sen',
    role: 'Master Hair Couturier & Saree Draping Specialist',
    phone: '+91 95804 94058',
    email: 'neha@makeupstudio.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    specialty: 'Textured Braids, Hollywood Waves & Can-Can Draping',
    monthlySalary: 34000,
    commissionRate: 8,
    assignedBookingsCount: 18,
    socialHandle: '@neha_haircouture_bbk',
    instagramUrl: 'https://instagram.com',
    active: true,
    pin: '3344',
    password: 'neha@123',
    permissions: {
      canViewClients: true,
      canViewPhones: false,
      canManageBookings: true,
      canAccessERP: false,
      canManagePhotos: false
    }
  },
  {
    id: 'emp-4',
    name: 'Simran Kaur',
    role: 'Aesthetician & Pre-Bridal Specialist',
    phone: '+91 95804 94058',
    email: 'simran@makeupstudio.com',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=250',
    specialty: 'Hydra Facials & Kesar Body Polishing',
    monthlySalary: 28000,
    commissionRate: 5,
    assignedBookingsCount: 10,
    socialHandle: '@simran_beauty_bbk',
    instagramUrl: 'https://instagram.com',
    active: true,
    pin: '4455',
    password: 'simran@123',
    permissions: {
      canViewClients: true,
      canViewPhones: false,
      canManageBookings: true,
      canAccessERP: false,
      canManagePhotos: false
    }
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'BK-BBK-201',
    clientName: 'Shalini Srivastava',
    phone: '+91 95804 94058',
    email: 'shalini.srivastava@gmail.com',
    serviceId: 'srv-1',
    serviceName: 'Signature HD Bridal Makeover',
    date: '2026-11-12',
    timeSlot: '02:00 PM',
    artistId: 'emp-1',
    artistName: 'Deepika Sharma',
    locationType: 'venue',
    venueAddress: 'Near Akash Palace, Lakhpedabagh, Barabanki',
    totalAmount: 21000,
    advancePaid: 9000,
    balanceDue: 12000,
    paymentStatus: 'partially_paid',
    bookingStatus: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI-RAZ-98821034',
    notes: 'Bride desires royal red lehenga look with heritage polki jewelry setting.',
    createdAt: '2026-10-24',
    partPayments: [
      {
        id: 'PAY-BBK-101-1',
        partNumber: 1,
        title: 'Part 1: Advance Token to Lock Wedding Date',
        serviceName: 'Signature HD Bridal Makeover',
        date: '2026-10-24',
        amount: 4000,
        paymentMethod: 'upi',
        transactionId: 'UPI-PHONEPE-988210',
        receivedBy: 'Deepika Sharma (Owner)',
        status: 'paid',
        notes: 'Token received via PhonePe'
      },
      {
        id: 'PAY-BBK-101-2',
        partNumber: 2,
        title: 'Part 2: Pre-Bridal Makeup Trial & Hair Draping Consultation',
        serviceName: 'Signature HD Bridal Makeover',
        date: '2026-11-02',
        amount: 5000,
        paymentMethod: 'cash',
        transactionId: 'CASH-STUDIO-049',
        receivedBy: 'Deepika Sharma (Owner)',
        status: 'paid',
        notes: 'Cash received during in-studio trial'
      },
      {
        id: 'PAY-BBK-101-3',
        partNumber: 3,
        title: 'Part 3: Final Settlement on Wedding Pheras Ceremony',
        serviceName: 'Signature HD Bridal Makeover',
        date: '2026-11-12',
        amount: 12000,
        paymentMethod: 'upi',
        transactionId: 'PENDING-SETTLEMENT',
        receivedBy: 'Deepika Sharma',
        status: 'pending',
        notes: 'Due on event day before vidaai'
      }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LD-601',
    name: 'Anamika Tiwari',
    phone: '+91 95804 94058',
    email: 'anamika.tiwari@gmail.com',
    weddingDate: '2026-12-08',
    serviceInterest: 'Signature HD Bridal + Engagement Look',
    venueCity: 'Barabanki City Club Banquet',
    status: 'contacted',
    notes: 'Inquired on studio WhatsApp. Sent bridal catalog with quotation. Trial scheduled.',
    createdAt: '2026-10-27',
    lastContactedAt: '2026-10-28'
  }
];

export const INITIAL_CLIENTS: ClientProfile[] = [
  {
    id: 'CL-BBK-01',
    name: 'Shalini Srivastava',
    phone: '+91 95804 94058',
    email: 'shalini.srivastava@gmail.com',
    clientType: 'bride',
    weddingDate: '2026-11-12',
    totalBookings: 2,
    totalSpent: 33000,
    skinType: 'Combination / Sensitive',
    undertone: 'Warm Golden',
    allergies: 'Fragrance-free primers only',
    lastVisit: '2026-10-24',
    notes: 'Bride prefers matte crimson lip; heavy polki maang tikka setup.',
    photos: []
  }
];

export const INITIAL_EXPENSES: FinancialExpense[] = [
  {
    id: 'EXP-BBK-101',
    date: '2026-10-02',
    category: 'cosmetics_purchase',
    title: 'MAC Pro, Charlotte Tilbury & Kryolan Restock',
    amount: 32500,
    vendorOrStaff: 'Nykaa Pro / Authorized Distributor',
    paymentMethod: 'Corporate Credit Card',
    invoiceNumber: 'INV-NYK-88192'
  }
];

export const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Heritage Royal Bridal Makeover',
    category: 'bridal',
    imageBefore: MAKEOVER_BEFORE,
    imageAfter: MAKEOVER_AFTER,
    artistName: 'Deepika Sharma (Founder)',
    tags: ['HD Airbrush', 'Kohl Defined Eyes', 'Ruby Matte Lip', 'Heritage Polki'],
    description: 'Deepika Sharma’s signature bride makeover: flawless complexion, sculpted contours, dramatic elongated liner, and ornate red dupatta draping.'
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    brideName: 'Shalini Srivastava',
    eventDate: 'Wedding in Barabanki · Oct 2026',
    location: 'Lakhpedabagh, Barabanki',
    makeoverType: 'Signature HD Bridal',
    rating: 5,
    review: 'Deepika di and her team are absolute artists! I wanted an authentic royal bridal look without looking over-done or chalky. My makeup stayed glowing through 6 hours of pheras and crying during vidaai!',
    image: MAKEOVER_AFTER
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'studio',
    text: 'Namaste! Welcome to Deepika Sharma Makeup Studio & Academy, Lakhpedabagh, Barabanki ✨ How can our team assist you today?',
    timestamp: '10:00 AM',
    status: 'read'
  }
];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Pre-Bridal Skincare Hydration Reminder',
    message: 'Dear Shalini, your wedding day is in 12 days! Drink 3L of water daily, moisturize nightly, and avoid new chemical treatments. - Deepika Sharma Studio',
    type: 'prep',
    scheduledFor: '2026-10-30 09:00 AM',
    sentAt: '2026-10-30 09:00 AM',
    targetClientPhone: '+91 95804 94058',
    targetClientName: 'Shalini Srivastava',
    status: 'sent'
  }
];

export const INITIAL_ATTENDANCE: ShiftAttendanceRecord[] = [
  {
    id: 'att-20261102-01',
    employeeId: 'emp-1',
    employeeName: 'Deepika Sharma',
    role: 'Founder & Master Makeup Artist',
    date: '2026-11-02',
    clockInTime: '08:45 AM',
    status: 'clocked_in',
    stationOrDuty: 'VIP Master Bridal Suite',
    notes: 'Royal Pheras Bridal makeover & client consultation'
  }
];
