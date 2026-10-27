import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import config from '../config';
import { User } from '../models/User';

async function seed() {
  try {
    const mongoUri = config.mongodb.uri;
    console.log('Connecting to MongoDB:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Clearing existing admin/vendor users if any...');
    await User.deleteMany({ email: { $in: ['admin@shita.com', 'vendor@shita.com'] } });

    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const vendorPasswordHash = await bcrypt.hash('vendor123', salt);

    const admin = await User.create({
      name: 'Super Admin',
      email: 'admin@shita.com',
      password: adminPasswordHash,
      phone: '+1234567890',
      phoneVerified: true,
      emailVerified: true,
      role: 'ADMIN',
      isActive: true,
      isOrderNotification: true,
    });
    console.log('✅ Admin user created:', admin.email);

    const vendor = await User.create({
      name: 'Demo Vendor',
      email: 'vendor@shita.com',
      password: vendorPasswordHash,
      phone: '+1987654321',
      phoneVerified: true,
      emailVerified: true,
      role: 'VENDOR',
      isActive: true,
      isOrderNotification: true,
    });
    console.log('✅ Vendor user created:', vendor.email);

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seed();
