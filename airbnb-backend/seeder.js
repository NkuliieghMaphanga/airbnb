/**
 * Seeder script — populates the database with a demo admin user, a host user,
 * and sample accommodations so the app has data to show on first run.
 *
 * Usage:
 *   node seeder.js          -> import data
 *   node seeder.js --clear  -> wipe all data
 */

require('dotenv').config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Accommodation = require('./models/Accommodation');
const Reservation = require('./models/Reservation');

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
];

async function seed() {
  await connectDB();

  // ---- Clear database ------------------------------------------------------
  if (process.argv.includes('--clear')) {
    await Promise.all([
      User.deleteMany(),
      Accommodation.deleteMany(),
      Reservation.deleteMany(),
    ]);

    console.log('All data cleared.');
    process.exit(0);
  }

  // ---- Users ---------------------------------------------------------------
  const existingAdmin = await User.findOne({
    email: 'admin@airbnb.demo',
  });

  const existingHost = await User.findOne({
    email: 'host@airbnb.demo',
  });

  const existingUser = await User.findOne({
    email: 'user@airbnb.demo',
  });

  let admin = existingAdmin;
  let host = existingHost;

  // ---- Admin User ----------------------------------------------------------
  // IMPORTANT:
  // Do NOT bcrypt.hash() the password here.
  // UserSchema.pre('save') automatically hashes the password.
  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: 'admin@airbnb.demo',
      password: 'Admin1234!',
      role: 'admin',
    });

    console.log(
      'Admin user created -> admin@airbnb.demo / Admin1234!'
    );
  } else {
    // Reset the existing demo admin password.
    // The User model will hash this plaintext password exactly once.
    admin.username = 'admin';
    admin.password = 'Admin1234!';
    admin.role = 'admin';

    await admin.save();

    console.log(
      'Admin user password reset -> admin@airbnb.demo / Admin1234!'
    );
  }

  // ---- Host User -----------------------------------------------------------
  // The User model automatically hashes the plaintext password.
  if (!host) {
    host = await User.create({
      username: 'demohost',
      email: 'host@airbnb.demo',
      password: 'Host1234!',
      role: 'host',
    });

    console.log(
      'Host user created -> host@airbnb.demo / Host1234!'
    );
  } else {
    // Reset the existing demo host password so it always matches the hint box.
    host.username = 'demohost';
    host.password = 'Host1234!';
    host.role = 'host';
    await host.save();

    console.log(
      'Host user password reset -> host@airbnb.demo / Host1234!'
    );
  }

  // ---- Guest User ----------------------------------------------------------
  if (!existingUser) {
    await User.create({
      username: 'demouser',
      email: 'user@airbnb.demo',
      password: 'User1234!',
      role: 'user',
    });

    console.log(
      'Guest user created -> user@airbnb.demo / User1234!'
    );
  } else {
    console.log('Guest user already exists - skipping.');
  }

  // ---- Accommodations ------------------------------------------------------
  const listings = [
    {
      title: 'Sunny Loft in the Heart of New York',
      description:
        'A bright and airy loft steps from Central Park. High ceilings, exposed brick, and a fully equipped kitchen make this the perfect base for exploring the city.',
      location: 'New York',
      type: 'Entire apartment',
      images: [SAMPLE_IMAGES[0], SAMPLE_IMAGES[1]],
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: [
        'WiFi',
        'Kitchen',
        'Air conditioning',
        'Washer',
        'TV',
      ],
      price: 180,
      weeklyDiscount: 10,
      cleaningFee: 35,
      serviceFee: 28,
      occupancyTaxes: 22,
      enhancedCleaning: true,
      selfCheckIn: true,
      rating: 4.8,
      reviews: 124,
      specificRatings: {
        cleanliness: 4.9,
        communication: 4.8,
        checkIn: 4.9,
        accuracy: 4.7,
        location: 5.0,
        value: 4.6,
      },
    },

    {
      title: 'Cosy Studio near Times Square',
      description:
        'A compact, well-designed studio in Midtown Manhattan. Perfect for solo travellers or couples wanting to explore NYC without breaking the bank.',
      location: 'New York',
      type: 'Entire apartment',
      images: [SAMPLE_IMAGES[2], SAMPLE_IMAGES[3]],
      guests: 2,
      bedrooms: 0,
      bathrooms: 1,
      amenities: [
        'WiFi',
        'Air conditioning',
        'TV',
        'Coffee maker',
      ],
      price: 120,
      weeklyDiscount: 8,
      cleaningFee: 20,
      serviceFee: 18,
      occupancyTaxes: 15,
      enhancedCleaning: false,
      selfCheckIn: true,
      rating: 4.5,
      reviews: 87,
      specificRatings: {
        cleanliness: 4.6,
        communication: 4.7,
        checkIn: 4.8,
        accuracy: 4.5,
        location: 4.9,
        value: 4.4,
      },
    },

    {
      title: 'Beachfront Villa with Ocean Views',
      description:
        'Wake up to the sound of waves in this stunning seafront villa. A private pool, sun deck, and fully equipped kitchen await your arrival.',
      location: 'Cape Town',
      type: 'Entire villa',
      images: [
        SAMPLE_IMAGES[1],
        SAMPLE_IMAGES[4],
        SAMPLE_IMAGES[0],
      ],
      guests: 8,
      bedrooms: 4,
      bathrooms: 3,
      amenities: [
        'WiFi',
        'Pool',
        'Kitchen',
        'BBQ grill',
        'Free parking',
        'Washer',
        'TV',
      ],
      price: 420,
      weeklyDiscount: 15,
      cleaningFee: 80,
      serviceFee: 65,
      occupancyTaxes: 50,
      enhancedCleaning: true,
      selfCheckIn: false,
      rating: 4.95,
      reviews: 62,
      specificRatings: {
        cleanliness: 5.0,
        communication: 4.9,
        checkIn: 4.9,
        accuracy: 5.0,
        location: 5.0,
        value: 4.8,
      },
    },

    {
      title: 'Historic Townhouse in Bo-Kaap',
      description:
        "Stay in one of Cape Town's most photogenic neighbourhoods. This restored heritage home blends colour, culture, and comfort.",
      location: 'Cape Town',
      type: 'Entire house',
      images: [SAMPLE_IMAGES[3], SAMPLE_IMAGES[2]],
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: [
        'WiFi',
        'Kitchen',
        'Washer',
        'Free parking',
        'Garden',
      ],
      price: 210,
      weeklyDiscount: 10,
      cleaningFee: 45,
      serviceFee: 35,
      occupancyTaxes: 28,
      enhancedCleaning: false,
      selfCheckIn: true,
      rating: 4.7,
      reviews: 45,
      specificRatings: {
        cleanliness: 4.8,
        communication: 4.9,
        checkIn: 4.7,
        accuracy: 4.6,
        location: 4.8,
        value: 4.6,
      },
    },

    {
      title: 'Charming Alfama Apartment',
      description:
        "Perched in Lisbon's oldest neighbourhood, this apartment offers sweeping views over the Tagus river and easy access to the city's best fado restaurants.",
      location: 'Lisbon',
      type: 'Entire apartment',
      images: [SAMPLE_IMAGES[4], SAMPLE_IMAGES[0]],
      guests: 3,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        'WiFi',
        'Kitchen',
        'Air conditioning',
        'Balcony',
      ],
      price: 95,
      weeklyDiscount: 12,
      cleaningFee: 25,
      serviceFee: 15,
      occupancyTaxes: 12,
      enhancedCleaning: false,
      selfCheckIn: true,
      rating: 4.85,
      reviews: 201,
      specificRatings: {
        cleanliness: 4.9,
        communication: 5.0,
        checkIn: 4.9,
        accuracy: 4.8,
        location: 4.9,
        value: 4.7,
      },
    },

    {
      title: 'Zen Garden Cottage in Kyoto',
      description:
        'A traditional machiya townhouse with a private moss garden, sliding shoji screens, and a soaking tub. Ideal for those seeking authentic Japanese serenity.',
      location: 'Kyoto',
      type: 'Entire house',
      images: [
        SAMPLE_IMAGES[0],
        SAMPLE_IMAGES[3],
        SAMPLE_IMAGES[2],
      ],
      guests: 4,
      bedrooms: 2,
      bathrooms: 1,
      amenities: [
        'WiFi',
        'Kitchen',
        'Garden',
        'Soaking tub',
        'Washer',
      ],
      price: 155,
      weeklyDiscount: 10,
      cleaningFee: 30,
      serviceFee: 24,
      occupancyTaxes: 18,
      enhancedCleaning: true,
      selfCheckIn: false,
      rating: 4.92,
      reviews: 78,
      specificRatings: {
        cleanliness: 5.0,
        communication: 4.9,
        checkIn: 4.8,
        accuracy: 4.9,
        location: 4.8,
        value: 4.9,
      },
    },

    {
      title: 'Riad Retreat in the Medina',
      description:
        "A beautifully restored riad hidden inside Marrakech's ancient medina. Central courtyard with a fountain, rooftop terrace, and authentic Moroccan decor.",
      location: 'Marrakech',
      type: 'Entire house',
      images: [
        SAMPLE_IMAGES[2],
        SAMPLE_IMAGES[1],
        SAMPLE_IMAGES[4],
      ],
      guests: 6,
      bedrooms: 3,
      bathrooms: 2,
      amenities: [
        'WiFi',
        'Breakfast included',
        'Pool',
        'Rooftop terrace',
        'Air conditioning',
      ],
      price: 185,
      weeklyDiscount: 12,
      cleaningFee: 40,
      serviceFee: 30,
      occupancyTaxes: 25,
      enhancedCleaning: true,
      selfCheckIn: false,
      rating: 4.88,
      reviews: 134,
      specificRatings: {
        cleanliness: 4.9,
        communication: 5.0,
        checkIn: 4.8,
        accuracy: 4.9,
        location: 4.7,
        value: 4.8,
      },
    },

    {
      title: 'Northern Lights Cabin, Reykjavik',
      description:
        'A cosy, architect-designed cabin with floor-to-ceiling glass walls - perfect for watching the aurora borealis from your bed on winter nights.',
      location: 'Reykjavik',
      type: 'Entire house',
      images: [SAMPLE_IMAGES[1], SAMPLE_IMAGES[0]],
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
      amenities: [
        'WiFi',
        'Hot tub',
        'Kitchen',
        'Free parking',
        'Fireplace',
      ],
      price: 260,
      weeklyDiscount: 8,
      cleaningFee: 50,
      serviceFee: 40,
      occupancyTaxes: 35,
      enhancedCleaning: true,
      selfCheckIn: true,
      rating: 4.96,
      reviews: 49,
      specificRatings: {
        cleanliness: 5.0,
        communication: 4.9,
        checkIn: 5.0,
        accuracy: 4.9,
        location: 5.0,
        value: 4.8,
      },
    },
  ];

  // ---- Create accommodations if they don't exist ---------------------------
  let created = 0;

  for (const data of listings) {
    const exists = await Accommodation.findOne({
      title: data.title,
    });

    if (!exists) {
      await Accommodation.create({
        ...data,
        host: host._id,
      });

      created++;
    }
  }

  console.log(
    created +
      ' accommodation(s) created (' +
      (listings.length - created) +
      ' already existed).'
  );

  console.log('\nSeeding complete!');
  console.log(
    '  Admin login ->  admin@airbnb.demo  /  Admin1234!'
  );
  console.log(
    '  Host login  ->  host@airbnb.demo   /  Host1234!'
  );
  console.log(
    '  Guest login ->  user@airbnb.demo   /  User1234!'
  );

  process.exit(0);
}

seed().catch(function (err) {
  console.error('Seeder error:', err);
  process.exit(1);
});