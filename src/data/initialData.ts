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

export const HERO_IMAGE = '/src/assets/images/hero_bridal_glam_1793361569176.jpg';
export const MAKEOVER_BEFORE = '/src/assets/images/makeover_before_1793361570978.jpg';
export const MAKEOVER_AFTER = '/src/assets/images/makeover_after_1793361571014.jpg';
export const RECEPTION_GLAM = '/src/assets/images/reception_glam_1793361571725.jpg';
export const HALDI_MEHENDI = '/src/assets/images/haldi_mehendi_look_1793361571698.jpg';
export const STUDIO_LOGO = '/src/assets/images/deepika_sharma_logo_1793364726025.jpg';
export const ACADEMY_CERTIFICATE_SAMPLE = '/src/assets/images/academy_certificate_sample_1793441955191.jpg';

// Studio Contact & Address Info (Extracted directly from deepikamakeupstudiobbk.github.io & Barabanki location)
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
  googleMapsUrl: 'https://maps.google.com/?cid=12181048821735179863&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF',
  googleMapsDirections: 'https://maps.google.com/?cid=12181048821735179863&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF',
  googleReviewsUrl: 'https://maps.google.com/?cid=12181048821735179863&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF'
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
  },
  {
    id: 'BK-BBK-202',
    clientName: 'Priya Verma',
    phone: '+91 98391 22445',
    email: 'priya.verma@outlook.com',
    serviceId: 'srv-2',
    serviceName: 'Royale 4K Airbrush Bridal Masterpiece',
    date: '2026-11-18',
    timeSlot: '01:30 PM',
    artistId: 'emp-1',
    artistName: 'Deepika Sharma',
    locationType: 'venue',
    venueAddress: 'Hotel Sagar Grand, Awas Vikas, Barabanki',
    totalAmount: 31000,
    advancePaid: 16000,
    balanceDue: 15000,
    paymentStatus: 'partially_paid',
    bookingStatus: 'confirmed',
    paymentMethod: 'card',
    transactionId: 'TXN-HDFC-5519028',
    notes: '4K cinematography wedding filming. Extra hydrating primer required.',
    createdAt: '2026-10-26',
    partPayments: [
      {
        id: 'PAY-BBK-102-1',
        partNumber: 1,
        title: 'Part 1: Initial Booking Advance (Temptu Kit Reservation)',
        serviceName: 'Royale 4K Airbrush Bridal Masterpiece',
        date: '2026-10-26',
        amount: 6000,
        paymentMethod: 'card',
        transactionId: 'TXN-HDFC-5519028',
        receivedBy: 'Deepika Sharma (Owner)',
        status: 'paid',
        notes: 'Card payment online'
      },
      {
        id: 'PAY-BBK-102-2',
        partNumber: 2,
        title: 'Part 2: Hair Couture & Real Flower Adornment Advance',
        serviceName: 'Royale 4K Airbrush Bridal Masterpiece',
        date: '2026-11-05',
        amount: 10000,
        paymentMethod: 'upi',
        transactionId: 'UPI-GPAY-772190',
        receivedBy: 'Pooja Verma (Senior Artist)',
        status: 'paid',
        notes: 'GPay advance transfer'
      },
      {
        id: 'PAY-BBK-102-3',
        partNumber: 3,
        title: 'Part 3: Final Balance on Hotel Sagar Grand Reception',
        serviceName: 'Royale 4K Airbrush Bridal Masterpiece',
        date: '2026-11-18',
        amount: 15000,
        paymentMethod: 'cash',
        transactionId: 'PENDING-SETTLEMENT',
        receivedBy: 'Deepika Sharma',
        status: 'pending',
        notes: 'Due upon venue makeover completion'
      }
    ]
  },
  {
    id: 'BK-BBK-203',
    clientName: 'Dr. Archana Shukla',
    phone: '+91 94150 33882',
    email: 'archana.shukla@yahoo.co.in',
    serviceId: 'srv-3',
    serviceName: 'Couture Reception & Sangeet Glam',
    date: '2026-11-05',
    timeSlot: '04:30 PM',
    artistId: 'emp-2',
    artistName: 'Pooja Verma',
    locationType: 'studio',
    venueAddress: 'Deepika Sharma Studio, Lakhpedabagh',
    totalAmount: 15000,
    advancePaid: 15000,
    balanceDue: 0,
    paymentStatus: 'fully_paid',
    bookingStatus: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI-GPAY-4491028',
    notes: 'Regular VIP client; soft mauve tones with Hollywood waves.',
    createdAt: '2026-10-28',
    partPayments: [
      {
        id: 'PAY-BBK-103-1',
        partNumber: 1,
        title: 'Part 1: Slot Token Advance',
        serviceName: 'Couture Reception & Sangeet Glam',
        date: '2026-10-20',
        amount: 5000,
        paymentMethod: 'upi',
        transactionId: 'UPI-GPAY-112039',
        receivedBy: 'Pooja Verma',
        status: 'paid',
        notes: 'GPay Token'
      },
      {
        id: 'PAY-BBK-103-2',
        partNumber: 2,
        title: 'Part 2: Studio Clearance Full Balance',
        serviceName: 'Couture Reception & Sangeet Glam',
        date: '2026-10-28',
        amount: 10000,
        paymentMethod: 'upi',
        transactionId: 'UPI-GPAY-4491028',
        receivedBy: 'Deepika Sharma',
        status: 'paid',
        notes: 'Full balance settled prior to event'
      }
    ]
  },
  {
    id: 'BK-BBK-204',
    clientName: 'Kritika Awasthi',
    phone: '+91 98890 11223',
    email: 'kritika.awasthi@gmail.com',
    serviceId: 'srv-4',
    serviceName: 'Dewy Pastel Haldi & Mehendi Look',
    date: '2026-11-08',
    timeSlot: '09:30 AM',
    artistId: 'emp-2',
    artistName: 'Pooja Verma',
    locationType: 'studio',
    venueAddress: 'Deepika Sharma Studio, Lakhpedabagh',
    totalAmount: 12000,
    advancePaid: 2500,
    balanceDue: 9500,
    paymentStatus: 'advance_paid',
    bookingStatus: 'confirmed',
    paymentMethod: 'upi',
    transactionId: 'UPI-PHONEPE-102948',
    notes: 'Real jasmine and baby breath floral jewelry styling.',
    createdAt: '2026-10-29',
    partPayments: [
      {
        id: 'PAY-BBK-104-1',
        partNumber: 1,
        title: 'Part 1: Advance Token to Lock Haldi Date',
        serviceName: 'Dewy Pastel Haldi & Mehendi Look',
        date: '2026-10-29',
        amount: 2500,
        paymentMethod: 'upi',
        transactionId: 'UPI-PHONEPE-102948',
        receivedBy: 'Pooja Verma',
        status: 'paid',
        notes: 'Token received via PhonePe'
      },
      {
        id: 'PAY-BBK-104-2',
        partNumber: 2,
        title: 'Part 2: Final Payment on Haldi Morning',
        serviceName: 'Dewy Pastel Haldi & Mehendi Look',
        date: '2026-11-08',
        amount: 9500,
        paymentMethod: 'cash',
        transactionId: 'PENDING-SETTLEMENT',
        receivedBy: 'Pooja Verma',
        status: 'pending',
        notes: 'To be settled at studio after session'
      }
    ]
  },
  {
    id: 'BK-BBK-198',
    clientName: 'Sunita Mishra',
    phone: '+91 94500 88776',
    email: 'sunita.mishra@gmail.com',
    serviceId: 'srv-6',
    serviceName: 'Pre-Bridal 7-Day Radiance Ritual',
    date: '2026-10-20',
    timeSlot: '11:00 AM',
    artistId: 'emp-4',
    artistName: 'Simran Kaur',
    locationType: 'studio',
    venueAddress: 'Deepika Sharma Studio, Lakhpedabagh',
    totalAmount: 18000,
    advancePaid: 18000,
    balanceDue: 0,
    paymentStatus: 'fully_paid',
    bookingStatus: 'completed',
    paymentMethod: 'card',
    transactionId: 'TXN-ICICI-994821',
    notes: 'All 3 sessions successfully completed. Client skin texture noticeably improved.',
    createdAt: '2026-10-10',
    partPayments: [
      {
        id: 'PAY-BBK-198-1',
        partNumber: 1,
        title: 'Part 1: Session 1 (Hydra-Glow Vitamin C)',
        serviceName: 'Pre-Bridal 7-Day Radiance Ritual',
        date: '2026-10-05',
        amount: 6000,
        paymentMethod: 'card',
        transactionId: 'TXN-ICICI-994821',
        receivedBy: 'Simran Kaur',
        status: 'paid'
      },
      {
        id: 'PAY-BBK-198-2',
        partNumber: 2,
        title: 'Part 2: Session 2 (Kesar Body Polish & Detan)',
        serviceName: 'Pre-Bridal 7-Day Radiance Ritual',
        date: '2026-10-12',
        amount: 6000,
        paymentMethod: 'cash',
        transactionId: 'CASH-REC-112',
        receivedBy: 'Simran Kaur',
        status: 'paid'
      },
      {
        id: 'PAY-BBK-198-3',
        partNumber: 3,
        title: 'Part 3: Session 3 (Keratin Spa & Bridal Manicure)',
        serviceName: 'Pre-Bridal 7-Day Radiance Ritual',
        date: '2026-10-20',
        amount: 6000,
        paymentMethod: 'card',
        transactionId: 'TXN-ICICI-994823',
        receivedBy: 'Deepika Sharma',
        status: 'paid'
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
  },
  {
    id: 'LD-602',
    name: 'Ritu Chaudhary',
    phone: '+91 97950 11223',
    email: 'ritu.c@gmail.com',
    weddingDate: '2026-11-25',
    serviceInterest: 'Royale 4K Airbrush Bridal',
    venueCity: 'Lakhpedabagh Lawn, Barabanki',
    status: 'trial_booked',
    notes: 'Booked in-studio trial for Sunday 3 PM with Deepika Sharma.',
    createdAt: '2026-10-28',
    lastContactedAt: '2026-10-29'
  },
  {
    id: 'LD-603',
    name: 'Pallavi Rawat',
    phone: '+91 98380 44556',
    email: 'pallavi.rawat@gmail.com',
    weddingDate: '2026-12-14',
    serviceInterest: 'Bridal & HD Makeup Master Course Inquiry',
    venueCity: 'Barabanki',
    status: 'new',
    notes: 'Inquired about Professional Makeup Academy batch starting next month.',
    createdAt: '2026-10-30'
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
    photos: [
      {
        id: 'cp-1',
        url: MAKEOVER_AFTER,
        title: 'Bridal Trial Approved Look',
        date: '2026-10-24',
        category: 'Trial Session',
        verifiedConsent: true
      }
    ]
  },
  {
    id: 'CL-BBK-02',
    name: 'Dr. Archana Shukla',
    phone: '+91 94150 33882',
    email: 'archana.shukla@yahoo.co.in',
    clientType: 'regular_vip',
    weddingDate: undefined,
    totalBookings: 5,
    totalSpent: 52000,
    skinType: 'Normal / Glowing',
    undertone: 'Neutral Olive',
    allergies: 'None',
    lastVisit: '2026-10-15',
    notes: 'VIP Regular Client in Barabanki. Loves soft glam waves and nude velvet lips.',
    photos: [
      {
        id: 'cp-2',
        url: RECEPTION_GLAM,
        title: 'Reception Glam Hair & Makeup',
        date: '2026-10-15',
        category: 'Reception',
        verifiedConsent: true
      }
    ]
  },
  {
    id: 'CL-BBK-03',
    name: 'Sunita Mishra',
    phone: '+91 94500 88776',
    email: 'sunita.mishra@gmail.com',
    clientType: 'regular_vip',
    totalBookings: 4,
    totalSpent: 38000,
    skinType: 'Dry / Mature',
    undertone: 'Warm Peach',
    allergies: 'Avoid harsh chemical scrubs',
    lastVisit: '2026-10-20',
    notes: 'Regular client for monthly Kesar skin polishing and salon hair spa.',
    photos: []
  },
  {
    id: 'CL-BBK-04',
    name: 'Priya Verma',
    phone: '+91 98391 22445',
    email: 'priya.verma@outlook.com',
    clientType: 'bride',
    weddingDate: '2026-11-18',
    totalBookings: 1,
    totalSpent: 31000,
    skinType: 'Dry / Dehydrated',
    undertone: 'Fair Warm',
    allergies: 'Latex glue allergy (use hypoallergenic)',
    lastVisit: '2026-10-26',
    notes: 'Airbrush bridal makeover on location.',
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
  },
  {
    id: 'EXP-BBK-102',
    date: '2026-10-05',
    category: 'cosmetics_purchase',
    title: 'Temptu Airbrush Pods & Huda Beauty Eyeshadows',
    amount: 21000,
    vendorOrStaff: 'Temptu India Distributors',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-TMP-3301'
  },
  {
    id: 'EXP-BBK-103',
    date: '2026-10-01',
    category: 'studio_rent',
    title: 'Studio Commercial Rent (Lakhpedabagh, Barabanki)',
    amount: 35000,
    vendorOrStaff: 'Property Owner (Lakhpedabagh Complex)',
    paymentMethod: 'NEFT Transfer',
    invoiceNumber: 'RENT-OCT-2026'
  },
  {
    id: 'EXP-BBK-104',
    date: '2026-10-10',
    category: 'utilities',
    title: 'Electricity, High-Speed Broadband & Salon AC',
    amount: 6800,
    vendorOrStaff: 'UPPCL Barabanki & Airtel Fiber',
    paymentMethod: 'Auto Debit'
  },
  {
    id: 'EXP-BBK-105',
    date: '2026-10-25',
    category: 'equipment',
    title: 'Dyson Styling Tool Attachments & Ring Lights',
    amount: 11500,
    vendorOrStaff: 'Dyson Lucknow / Authorized Partner',
    paymentMethod: 'UPI'
  },
  {
    id: 'EXP-BBK-106',
    date: '2026-10-28',
    category: 'salary',
    title: 'Monthly Staff Salary & Commissions (Advance Release)',
    amount: 100000,
    vendorOrStaff: 'Staff Payroll (Pooja, Neha, Simran)',
    paymentMethod: 'Salary Direct Deposit'
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
  },
  {
    id: 'port-2',
    title: 'Modern Rose Gold Reception Elegance',
    category: 'reception',
    imageAfter: RECEPTION_GLAM,
    artistName: 'Pooja Verma',
    tags: ['Hollywood Waves', 'Rose Gold Shimmer', 'Plump Nude Lip', 'Gown Draping'],
    description: 'Sculpted evening glam designed for crystal chandeliers and dramatic photography.'
  },
  {
    id: 'port-3',
    title: 'Floral Sunlight Haldi & Mehendi Look',
    category: 'haldi_mehendi',
    imageAfter: HALDI_MEHENDI,
    artistName: 'Deepika Sharma & Neha Sen',
    tags: ['Glass Skin', 'Fresh Floral Jewelry', 'Textured Braid', 'Dewy Peach Flush'],
    description: 'Fresh daytime celebration glow with sweat-resistant hydrating formulas and fresh jasmine hair ornamentation.'
  },
  {
    id: 'port-4',
    title: 'Traditional Royal Red Bride',
    category: 'bridal',
    imageAfter: HERO_IMAGE,
    artistName: 'Deepika Sharma',
    tags: ['Traditional Bridal', 'Champagne Glow', 'Mathapatti Setting', 'Velvet Finish'],
    description: 'Iconic crimson and antique gold bridal styling crafted for unforgettable wedding pheras in Barabanki.'
  },
  {
    id: 'port-5',
    title: 'Cut-Crease Champagne Engagement Glam',
    category: 'engagement',
    imageAfter: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800',
    artistName: 'Deepika Sharma',
    tags: ['Champagne Glitter', 'Soft Textured Curls', 'Peach Nude Lips', 'Ring Ceremony'],
    description: 'Bespoke ring ceremony makeover featuring sparkling diamond pigment eyelids, soft contoured cheekbones, and romantic wavy hair styling.'
  },
  {
    id: 'port-6',
    title: 'Vogue Haute Editorial Beauty Spread',
    category: 'editorial',
    imageAfter: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800',
    artistName: 'Deepika Sharma & Studio Team',
    tags: ['High Fashion', 'Glass Skin Base', 'Sculpted Cheeks', 'Magazine Cover'],
    description: 'High-concept avant-garde editorial session demonstrating contemporary editorial textures, luminous skin priming, and runway aesthetics.'
  },
  {
    id: 'port-7',
    title: 'Academy Masterclass Hands-on Workshop',
    category: 'academy',
    imageAfter: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=800',
    artistName: 'Deepika Sharma (Master Trainer)',
    tags: ['Academy Internship', '4K Airbrush Technique', 'Skin Tone Color Theory', 'Batch Demo'],
    description: 'Live hands-on bridal cosmetology and airbrushing masterclass conducted for aspiring makeup artists at Deepika Sharma Studio & Academy.'
  },
  {
    id: 'port-8',
    title: 'Certified Cosmetology Student Showcase',
    category: 'academy',
    imageAfter: ACADEMY_CERTIFICATE_SAMPLE,
    artistName: 'Deepika Sharma Academy Graduates',
    tags: ['Academy Certification', 'ISO Verified Standard', 'Diploma Showcase', 'Barabanki Academy'],
    description: 'Certified student bridal makeover evaluation with authentic Deepika Sharma Makeup Studio & Academy professional certification sample.'
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
    review: 'Deepika di and her team are absolute artists! I wanted an authentic royal bridal look without looking over-done or chalky. My makeup stayed glowing through 6 hours of pheras and crying during vidaai! Everyone in Barabanki praised my look.',
    image: MAKEOVER_AFTER
  },
  {
    id: 't-2',
    brideName: 'Priya Verma',
    eventDate: 'Wedding at Sagar Grand · Sep 2026',
    location: 'Awas Vikas, Barabanki',
    makeoverType: 'Royale 4K Airbrush Bridal',
    rating: 5,
    review: 'The airbrush makeup felt featherweight and looked stunning in our 4K wedding video! The advance booking and payment process on the website gave complete peace of mind.',
    image: HERO_IMAGE
  },
  {
    id: 't-3',
    brideName: 'Dr. Archana Shukla',
    eventDate: 'Family Reception · Oct 2026',
    location: 'Barabanki Club',
    makeoverType: 'Couture Reception Glam',
    rating: 5,
    review: 'Deepika Sharma Studio is undoubtedly the finest salon and academy in Barabanki. Neha’s hair styling and Pooja’s eye makeup are top-notch. Highly recommend to all brides and students!',
    image: RECEPTION_GLAM
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'studio',
    text: 'Namaste! Welcome to Deepika Sharma Makeup Studio & Academy, Lakhpedabagh, Barabanki ✨ How can our team assist you today?',
    timestamp: '10:00 AM',
    status: 'read'
  },
  {
    id: 'msg-2',
    sender: 'studio',
    text: 'You can check wedding date availability, explore our bridal packages, book an in-studio consultation, or inquire about our Professional Makeup Academy courses!',
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
  },
  {
    id: 'notif-2',
    title: 'Upcoming Appointment: Makeup Trial & Draping',
    message: 'Hi Ritu, reminder for your bridal trial tomorrow at 03:00 PM at Lakhpedabagh Studio with Deepika Sharma.',
    type: 'reminder',
    scheduledFor: '2026-11-01 10:00 AM',
    targetClientPhone: '+91 97950 11223',
    targetClientName: 'Ritu Chaudhary',
    status: 'scheduled'
  },
  {
    id: 'notif-3',
    title: 'Advance Payment Token Acknowledged',
    message: 'Booking #BK-BBK-204 confirmed! Token advance of ₹2,500 received via PhonePe. Receipt generated.',
    type: 'payment',
    scheduledFor: '2026-10-29 02:15 PM',
    sentAt: '2026-10-29 02:15 PM',
    targetClientPhone: '+91 98890 11223',
    targetClientName: 'Kritika Awasthi',
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
  },
  {
    id: 'att-20261102-02',
    employeeId: 'emp-2',
    employeeName: 'Pooja Verma',
    role: 'Senior Makeup Specialist & Academy Trainer',
    date: '2026-11-02',
    clockInTime: '09:15 AM',
    status: 'clocked_in',
    stationOrDuty: 'Bridal Station 2 & Academy Floor',
    notes: 'Morning bridal trial session & Academy demonstration'
  },
  {
    id: 'att-20261102-03',
    employeeId: 'emp-3',
    employeeName: 'Neha Sen',
    role: 'Master Hair Couturier & Saree Draping Specialist',
    date: '2026-11-02',
    clockInTime: '09:30 AM',
    status: 'clocked_in',
    stationOrDuty: 'Hair Couture & Draping Station',
    notes: 'Textured Hollywood waves and can-can saree draping'
  },
  {
    id: 'att-20261102-04',
    employeeId: 'emp-4',
    employeeName: 'Simran Kaur',
    role: 'Senior Aesthetician & Skin Care Specialist',
    date: '2026-11-02',
    clockInTime: '09:50 AM',
    status: 'on_break',
    stationOrDuty: 'Aesthetics & Hydra-facial Suite',
    notes: 'Pre-bridal Kesar polishing; 15 min tea break'
  },
  {
    id: 'att-20261101-01',
    employeeId: 'emp-2',
    employeeName: 'Pooja Verma',
    role: 'Senior Makeup Specialist & Academy Trainer',
    date: '2026-11-01',
    clockInTime: '09:30 AM',
    clockOutTime: '06:45 PM',
    totalHours: 9.25,
    status: 'clocked_out',
    stationOrDuty: 'Bridal Station 2',
    notes: 'Completed 2 reception looks and evening party glam'
  },
  {
    id: 'att-20261101-02',
    employeeId: 'emp-3',
    employeeName: 'Neha Sen',
    role: 'Master Hair Couturier & Saree Draping Specialist',
    date: '2026-11-01',
    clockInTime: '09:45 AM',
    clockOutTime: '06:15 PM',
    totalHours: 8.5,
    status: 'clocked_out',
    stationOrDuty: 'Hair Couture Station',
    notes: 'Wedding hairstyle trials completed'
  },
  {
    id: 'att-20261031-01',
    employeeId: 'emp-1',
    employeeName: 'Deepika Sharma',
    role: 'Founder & Master Makeup Artist',
    date: '2026-10-31',
    clockInTime: '08:30 AM',
    clockOutTime: '07:30 PM',
    totalHours: 11,
    status: 'clocked_out',
    stationOrDuty: 'VIP Master Bridal Suite',
    notes: 'Peak weekend wedding makeover day (Shalini Srivastava trial)'
  },
  {
    id: 'att-20261031-02',
    employeeId: 'emp-4',
    employeeName: 'Simran Kaur',
    role: 'Senior Aesthetician & Skin Care Specialist',
    date: '2026-10-31',
    clockInTime: '10:00 AM',
    clockOutTime: '06:30 PM',
    totalHours: 8.5,
    status: 'clocked_out',
    stationOrDuty: 'Aesthetics Suite',
    notes: 'Completed 7-day radiance ritual session'
  }
];
