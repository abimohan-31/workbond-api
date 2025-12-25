import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Provider from '../src/models/Provider.js';
import Customer from '../src/models/Customer.js';
import Subscription from '../src/models/Subscription.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function runVerification() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const testEmail = 'test_trial_user@example.com';
    
    // Clean up
    await Provider.deleteMany({ email: testEmail });
    await Customer.deleteMany({ email: testEmail });
    await Subscription.deleteMany({ userId: { $exists: true }, userType: 'Provider' });

    console.log('\n--- Testing Provider Trial ---');
    const provider = await Provider.create({
      name: 'Test Provider',
      email: testEmail,
      password: 'password123',
      phone: '1234567890',
      address: 'Test Address',
      fullAddress: 'Test Full Address',
      skills: ['Plumbing'],
      experience_years: 5
    });

    console.log(`Provider created at: ${provider.createdAt}`);
    
    // Logic check for trial (within 30 days)
    const isTrialActive = (date) => {
      const now = new Date();
      const diff = now.getTime() - new Date(date).getTime();
      return diff < (30 * 24 * 60 * 60 * 1000);
    };

    console.log('Checking trial status (should be true):', isTrialActive(provider.createdAt));

    // Manually expire trial
    const thirtyOneDaysAgo = new Date();
    thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31);
    
    await Provider.findOneAndUpdate(
      { _id: provider._id }, 
      { $set: { createdAt: thirtyOneDaysAgo } },
      { timestamps: false }
    );
    const updatedProvider = await Provider.findById(provider._id);
    
    console.log(`Manually set createdAt to: ${updatedProvider.createdAt}`);
    console.log('Checking trial status (should be false):', isTrialActive(updatedProvider.createdAt));

    console.log('\n--- Testing Subscription Activation ---');
    const subscription = await Subscription.create({
      userId: provider._id,
      userType: 'Provider',
      plan_name: 'Standard',
      start_date: new Date(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'Active',
      amount: 29.99,
      paymentStatus: 'paid'
    });

    provider.currentSubscriptionId = subscription._id;
    await provider.save();

    console.log('Subscription created and linked.');
    
    const activeSub = await Subscription.findOne({
      userId: provider._id,
      status: 'Active',
      paymentStatus: 'paid',
      end_date: { $gt: new Date() }
    });

    console.log('Checking active subscription (should be found):', !!activeSub);

    console.log('\n--- Verification Summary ---');
    if (isTrialActive(provider.createdAt) === false && !!activeSub === true) {
      console.log('SUCCESS: Trial expiration and subscription activation logic verified.');
    } else {
      console.log('FAILURE: Logic check failed.');
    }

    // Final Clean up
    await Provider.deleteMany({ email: testEmail });
    await Subscription.deleteMany({ userId: provider._id });

    await mongoose.connection.close();
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  }
}

runVerification();
