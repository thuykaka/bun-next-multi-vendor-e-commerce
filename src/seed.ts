import { getPayload } from 'payload';
import payloadConfig from './payload.config';

const categories = [
  {
    name: 'All',
    slug: 'all'
  },
  {
    name: 'Business & Money',
    color: '#FFB347',
    slug: 'business-money',
    subCategories: [
      { name: 'Accounting', slug: 'accounting' },
      {
        name: 'Entrepreneurship',
        slug: 'entrepreneurship'
      },
      { name: 'Gigs & Side Projects', slug: 'gigs-side-projects' },
      { name: 'Investing', slug: 'investing' },
      { name: 'Management & Leadership', slug: 'management-leadership' },
      {
        name: 'Marketing & Sales',
        slug: 'marketing-sales'
      },
      { name: 'Networking, Careers & Jobs', slug: 'networking-careers-jobs' },
      { name: 'Personal Finance', slug: 'personal-finance' },
      { name: 'Real Estate', slug: 'real-estate' }
    ]
  },
  {
    name: 'Software Development',
    color: '#7EC8E3',
    slug: 'software-development',
    subCategories: [
      { name: 'Web Development', slug: 'web-development' },
      { name: 'Mobile Development', slug: 'mobile-development' },
      { name: 'Game Development', slug: 'game-development' },
      { name: 'Programming Languages', slug: 'programming-languages' },
      { name: 'DevOps', slug: 'devops' }
    ]
  },
  {
    name: 'Writing & Publishing',
    color: '#D8B5FF',
    slug: 'writing-publishing',
    subCategories: [
      { name: 'Fiction', slug: 'fiction' },
      { name: 'Non-Fiction', slug: 'non-fiction' },
      { name: 'Blogging', slug: 'blogging' },
      { name: 'Copywriting', slug: 'copywriting' },
      { name: 'Self-Publishing', slug: 'self-publishing' }
    ]
  },
  {
    name: 'Other',
    slug: 'other'
  },
  {
    name: 'Education',
    color: '#FFE066',
    slug: 'education',
    subCategories: [
      { name: 'Online Courses', slug: 'online-courses' },
      { name: 'Tutoring', slug: 'tutoring' },
      { name: 'Test Preparation', slug: 'test-preparation' },
      { name: 'Language Learning', slug: 'language-learning' }
    ]
  },
  {
    name: 'Self Improvement',
    color: '#96E6B3',
    slug: 'self-improvement',
    subCategories: [
      { name: 'Productivity', slug: 'productivity' },
      { name: 'Personal Development', slug: 'personal-development' },
      { name: 'Mindfulness', slug: 'mindfulness' },
      { name: 'Career Growth', slug: 'career-growth' }
    ]
  },
  {
    name: 'Fitness & Health',
    color: '#FF9AA2',
    slug: 'fitness-health',
    subCategories: [
      { name: 'Workout Plans', slug: 'workout-plans' },
      { name: 'Nutrition', slug: 'nutrition' },
      { name: 'Mental Health', slug: 'mental-health' },
      { name: 'Yoga', slug: 'yoga' }
    ]
  },
  {
    name: 'Design',
    color: '#B5B9FF',
    slug: 'design',
    subCategories: [
      { name: 'UI/UX', slug: 'ui-ux' },
      { name: 'Graphic Design', slug: 'graphic-design' },
      { name: '3D Modeling', slug: '3d-modeling' },
      { name: 'Typography', slug: 'typography' }
    ]
  },
  {
    name: 'Drawing & Painting',
    color: '#FFCAB0',
    slug: 'drawing-painting',
    subCategories: [
      { name: 'Watercolor', slug: 'watercolor' },
      { name: 'Acrylic', slug: 'acrylic' },
      { name: 'Oil', slug: 'oil' },
      { name: 'Pastel', slug: 'pastel' },
      { name: 'Charcoal', slug: 'charcoal' }
    ]
  },
  {
    name: 'Music',
    color: '#FFD700',
    slug: 'music',
    subCategories: [
      { name: 'Songwriting', slug: 'songwriting' },
      { name: 'Music Production', slug: 'music-production' },
      { name: 'Music Theory', slug: 'music-theory' },
      { name: 'Music History', slug: 'music-history' }
    ]
  },
  {
    name: 'Photography',
    color: '#FF6B6B',
    slug: 'photography',
    subCategories: [
      { name: 'Portrait', slug: 'portrait' },
      { name: 'Landscape', slug: 'landscape' },
      { name: 'Street Photography', slug: 'street-photography' },
      { name: 'Nature', slug: 'nature' },
      { name: 'Macro', slug: 'macro' }
    ]
  }
];

const seed = async () => {
  const payload = await getPayload({
    config: payloadConfig
  });

  // Create admin tenant
  const adminTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'admin',
      slug: 'admin',
      stripeAccountId: 'test_account_id'
    }
  });

  // Create super admin user
  await payload.create({
    collection: 'users',
    data: {
      username: 'thuykaka',
      email: 'thuykaka@funroad.com',
      password: '25251325',
      roles: ['super-admin'],
      tenants: [{ tenant: adminTenant.id }]
    }
  });

  for (const category of categories) {
    const { subCategories, ...data } = category;

    const parent = await payload.create({
      collection: 'categories',
      data: {
        ...data,
        parent: null
      }
    });

    for (const subCategory of subCategories ?? []) {
      await payload.create({
        collection: 'categories',
        data: {
          ...subCategory,
          parent: parent.id
        }
      });
    }
  }
};

try {
  await seed();
  console.log('Seed completed');
  process.exit(0);
} catch (error) {
  console.error('Seed failed', error);
  process.exit(1);
}
