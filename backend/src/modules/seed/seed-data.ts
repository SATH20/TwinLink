/**
 * Realistic Indian test users for development seeding
 */

export interface SeedUserData {
  name: string
  email: string
  age: number
  gender: 'MALE' | 'FEMALE' | 'NON_BINARY'
  profession: {
    title: string
    industry: string
    company: string
  }
  location: {
    city: string
    state: string
    country: string
  }
  interests: string[]
  personality: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  communicationStyle: string
  values: string[]
  goals: {
    relationship: string
    personal: string[]
  }
  lifestyle: {
    schedule: string
    socialLevel: string
    exercise: string
    diet: string
    smoking: string
    drinking: string
  }
  languages: string[]
  bio?: string
}

export const seedUsers: SeedUserData[] = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma.dev@twinlink.test',
    age: 28,
    gender: 'MALE',
    profession: {
      title: 'Software Engineer',
      industry: 'Technology',
      company: 'Infosys',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    interests: ['Technology', 'Cricket', 'Travel', 'Photography', 'Coding'],
    personality: {
      openness: 85,
      conscientiousness: 78,
      extraversion: 65,
      agreeableness: 80,
      neuroticism: 35,
    },
    communicationStyle: 'thoughtful',
    values: ['Innovation', 'Integrity', 'Growth', 'Family'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Build a successful startup', 'Travel to 30 countries', 'Learn machine learning'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'moderate',
      exercise: 'regular',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Kannada'],
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel.dev@twinlink.test',
    age: 26,
    gender: 'FEMALE',
    profession: {
      title: 'UX Designer',
      industry: 'Design',
      company: 'Flipkart',
    },
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    interests: ['Design', 'Art', 'Yoga', 'Books', 'Cooking'],
    personality: {
      openness: 90,
      conscientiousness: 82,
      extraversion: 70,
      agreeableness: 88,
      neuroticism: 28,
    },
    communicationStyle: 'friendly',
    values: ['Creativity', 'Empathy', 'Balance', 'Authenticity'],
    goals: {
      relationship: 'Dating',
      personal: ['Launch my design studio', 'Practice mindfulness daily', 'Write a design book'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'active',
      exercise: 'daily',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
    },
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    name: 'Arjun Reddy',
    email: 'arjun.reddy.dev@twinlink.test',
    age: 30,
    gender: 'MALE',
    profession: {
      title: 'Data Scientist',
      industry: 'Analytics',
      company: 'Amazon India',
    },
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    },
    interests: ['AI', 'Gaming', 'Fitness', 'Movies', 'Music'],
    personality: {
      openness: 88,
      conscientiousness: 85,
      extraversion: 60,
      agreeableness: 75,
      neuroticism: 30,
    },
    communicationStyle: 'professional',
    values: ['Excellence', 'Learning', 'Honesty', 'Independence'],
    goals: {
      relationship: 'Professional Networking',
      personal: ['Publish research papers', 'Run a marathon', 'Master deep learning'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'moderate',
      exercise: 'regular',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Telugu'],
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya.iyer.dev@twinlink.test',
    age: 27,
    gender: 'FEMALE',
    profession: {
      title: 'Product Manager',
      industry: 'Technology',
      company: 'Google India',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    interests: ['Technology', 'Travel', 'Dance', 'Food', 'Startups'],
    personality: {
      openness: 92,
      conscientiousness: 88,
      extraversion: 80,
      agreeableness: 82,
      neuroticism: 25,
    },
    communicationStyle: 'enthusiastic',
    values: ['Innovation', 'Collaboration', 'Impact', 'Growth'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Lead a product team', 'Learn classical dance', 'Start a mentorship program'],
    },
    lifestyle: {
      schedule: 'busy',
      socialLevel: 'very active',
      exercise: 'moderate',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
    },
    languages: ['English', 'Hindi', 'Tamil', 'Kannada'],
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta.dev@twinlink.test',
    age: 29,
    gender: 'MALE',
    profession: {
      title: 'Investment Banker',
      industry: 'Finance',
      company: 'ICICI Bank',
    },
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    interests: ['Finance', 'Travel', 'Golf', 'Wine', 'Automobiles'],
    personality: {
      openness: 70,
      conscientiousness: 90,
      extraversion: 75,
      agreeableness: 68,
      neuroticism: 40,
    },
    communicationStyle: 'direct',
    values: ['Success', 'Ambition', 'Loyalty', 'Excellence'],
    goals: {
      relationship: 'Dating',
      personal: ['Become VP by 35', 'Own luxury car collection', 'Travel to Europe'],
    },
    lifestyle: {
      schedule: 'very busy',
      socialLevel: 'active',
      exercise: 'moderate',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'regularly',
    },
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    name: 'Diya Singh',
    email: 'diya.singh.dev@twinlink.test',
    age: 25,
    gender: 'FEMALE',
    profession: {
      title: 'Content Creator',
      industry: 'Media',
      company: 'Freelance',
    },
    location: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
    },
    interests: ['Fashion', 'Photography', 'Travel', 'Blogging', 'Makeup'],
    personality: {
      openness: 95,
      conscientiousness: 72,
      extraversion: 90,
      agreeableness: 85,
      neuroticism: 35,
    },
    communicationStyle: 'expressive',
    values: ['Creativity', 'Freedom', 'Authenticity', 'Connection'],
    goals: {
      relationship: 'Friendship',
      personal: ['Reach 1M followers', 'Launch fashion brand', 'Collaborate with brands'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'very active',
      exercise: 'light',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Punjabi'],
  },
  {
    name: 'Vikram Desai',
    email: 'vikram.desai.dev@twinlink.test',
    age: 32,
    gender: 'MALE',
    profession: {
      title: 'Entrepreneur',
      industry: 'E-commerce',
      company: 'Own Startup',
    },
    location: {
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
    },
    interests: ['Business', 'Technology', 'Reading', 'Networking', 'Investing'],
    personality: {
      openness: 82,
      conscientiousness: 92,
      extraversion: 78,
      agreeableness: 70,
      neuroticism: 38,
    },
    communicationStyle: 'strategic',
    values: ['Innovation', 'Leadership', 'Growth', 'Risk-taking'],
    goals: {
      relationship: 'Startup Co-founder',
      personal: ['Scale to 100Cr revenue', 'Mentor young founders', 'Angel invest'],
    },
    lifestyle: {
      schedule: 'very busy',
      socialLevel: 'active',
      exercise: 'regular',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    name: 'Ishita Kapoor',
    email: 'ishita.kapoor.dev@twinlink.test',
    age: 24,
    gender: 'FEMALE',
    profession: {
      title: 'Marketing Executive',
      industry: 'Marketing',
      company: 'Ogilvy India',
    },
    location: {
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
    },
    interests: ['Marketing', 'Social Media', 'Travel', 'Music', 'Events'],
    personality: {
      openness: 86,
      conscientiousness: 80,
      extraversion: 88,
      agreeableness: 90,
      neuroticism: 32,
    },
    communicationStyle: 'friendly',
    values: ['Connection', 'Creativity', 'Fun', 'Growth'],
    goals: {
      relationship: 'Dating',
      personal: ['Become creative director', 'Build personal brand', 'Start podcast'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'very active',
      exercise: 'moderate',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'regularly',
    },
    languages: ['English', 'Hindi'],
  },
  {
    name: 'Aditya Kumar',
    email: 'aditya.kumar.dev@twinlink.test',
    age: 27,
    gender: 'MALE',
    profession: {
      title: 'Civil Engineer',
      industry: 'Construction',
      company: 'L&T',
    },
    location: {
      city: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
    },
    interests: ['Engineering', 'Bike Riding', 'Cricket', 'Movies', 'Gadgets'],
    personality: {
      openness: 68,
      conscientiousness: 88,
      extraversion: 62,
      agreeableness: 78,
      neuroticism: 42,
    },
    communicationStyle: 'practical',
    values: ['Responsibility', 'Hard work', 'Family', 'Stability'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Get project manager role', 'Buy dream bike', 'Build dream home'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'moderate',
      exercise: 'regular',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
    },
    languages: ['English', 'Hindi', 'Tamil'],
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta.dev@twinlink.test',
    age: 26,
    gender: 'FEMALE',
    profession: {
      title: 'HR Manager',
      industry: 'Human Resources',
      company: 'TCS',
    },
    location: {
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
    },
    interests: ['Psychology', 'Reading', 'Yoga', 'Cooking', 'Gardening'],
    personality: {
      openness: 78,
      conscientiousness: 85,
      extraversion: 72,
      agreeableness: 92,
      neuroticism: 28,
    },
    communicationStyle: 'empathetic',
    values: ['Empathy', 'Growth', 'Balance', 'Kindness'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Lead talent development', 'Get HR certification', 'Start wellness blog'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'moderate',
      exercise: 'daily',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'no',
    },
    languages: ['English', 'Hindi'],
  },
  {
    name: 'Karan Verma',
    email: 'karan.verma.dev@twinlink.test',
    age: 31,
    gender: 'MALE',
    profession: {
      title: 'Architect',
      industry: 'Architecture',
      company: 'DLF',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    interests: ['Architecture', 'Art', 'Travel', 'Photography', 'Design'],
    personality: {
      openness: 90,
      conscientiousness: 82,
      extraversion: 65,
      agreeableness: 80,
      neuroticism: 35,
    },
    communicationStyle: 'thoughtful',
    values: ['Creativity', 'Sustainability', 'Beauty', 'Innovation'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Win architecture award', 'Design eco-friendly homes', 'Exhibit artwork'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'moderate',
      exercise: 'moderate',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
    },
    languages: ['English', 'Hindi', 'Kannada'],
  },
  {
    name: 'Shreya Nair',
    email: 'shreya.nair.dev@twinlink.test',
    age: 28,
    gender: 'FEMALE',
    profession: {
      title: 'Doctor',
      industry: 'Healthcare',
      company: 'Apollo Hospital',
    },
    location: {
      city: 'Kochi',
      state: 'Kerala',
      country: 'India',
    },
    interests: ['Medicine', 'Research', 'Travel', 'Books', 'Classical Music'],
    personality: {
      openness: 75,
      conscientiousness: 95,
      extraversion: 58,
      agreeableness: 88,
      neuroticism: 30,
    },
    communicationStyle: 'professional',
    values: ['Compassion', 'Excellence', 'Service', 'Knowledge'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Specialize in cardiology', 'Do medical research', 'Volunteer in rural areas'],
    },
    lifestyle: {
      schedule: 'very busy',
      socialLevel: 'low',
      exercise: 'light',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'no',
    },
    languages: ['English', 'Hindi', 'Malayalam'],
  },
  {
    name: 'Rahul Joshi',
    email: 'rahul.joshi.dev@twinlink.test',
    age: 29,
    gender: 'MALE',
    profession: {
      title: 'Digital Marketer',
      industry: 'Marketing',
      company: 'Dentsu India',
    },
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
    },
    interests: ['Marketing', 'Technology', 'Gaming', 'Travel', 'Food'],
    personality: {
      openness: 88,
      conscientiousness: 78,
      extraversion: 85,
      agreeableness: 80,
      neuroticism: 35,
    },
    communicationStyle: 'casual',
    values: ['Innovation', 'Fun', 'Growth', 'Collaboration'],
    goals: {
      relationship: 'Dating',
      personal: ['Run viral campaigns', 'Start digital agency', 'Travel to Japan'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'very active',
      exercise: 'moderate',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'regularly',
    },
    languages: ['English', 'Hindi', 'Marathi'],
  },
  {
    name: 'Sanya Malhotra',
    email: 'sanya.malhotra.dev@twinlink.test',
    age: 25,
    gender: 'FEMALE',
    profession: {
      title: 'Graphic Designer',
      industry: 'Design',
      company: 'Zomato',
    },
    location: {
      city: 'Gurgaon',
      state: 'Haryana',
      country: 'India',
    },
    interests: ['Design', 'Art', 'Music', 'Travel', 'Photography'],
    personality: {
      openness: 92,
      conscientiousness: 75,
      extraversion: 70,
      agreeableness: 85,
      neuroticism: 38,
    },
    communicationStyle: 'creative',
    values: ['Creativity', 'Expression', 'Freedom', 'Authenticity'],
    goals: {
      relationship: 'Friendship',
      personal: ['Work at international studio', 'Create brand identity', 'Exhibition art'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'active',
      exercise: 'light',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Punjabi'],
  },
  {
    name: 'Abhishek Sinha',
    email: 'abhishek.sinha.dev@twinlink.test',
    age: 30,
    gender: 'MALE',
    profession: {
      title: 'Chartered Accountant',
      industry: 'Finance',
      company: 'Deloitte',
    },
    location: {
      city: 'Kolkata',
      state: 'West Bengal',
      country: 'India',
    },
    interests: ['Finance', 'Cricket', 'Reading', 'Travel', 'Food'],
    personality: {
      openness: 72,
      conscientiousness: 92,
      extraversion: 60,
      agreeableness: 78,
      neuroticism: 35,
    },
    communicationStyle: 'professional',
    values: ['Integrity', 'Excellence', 'Stability', 'Family'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Become partner', 'Financial independence', 'Buy property'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'moderate',
      exercise: 'moderate',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'occasionally',
    },
    languages: ['English', 'Hindi', 'Bengali'],
  },
  {
    name: 'Riya Sharma',
    email: 'riya.sharma.dev@twinlink.test',
    age: 27,
    gender: 'FEMALE',
    profession: {
      title: 'Fashion Designer',
      industry: 'Fashion',
      company: 'FabIndia',
    },
    location: {
      city: 'Jaipur',
      state: 'Rajasthan',
      country: 'India',
    },
    interests: ['Fashion', 'Art', 'Culture', 'Travel', 'Textiles'],
    personality: {
      openness: 94,
      conscientiousness: 80,
      extraversion: 78,
      agreeableness: 82,
      neuroticism: 32,
    },
    communicationStyle: 'expressive',
    values: ['Creativity', 'Heritage', 'Beauty', 'Innovation'],
    goals: {
      relationship: 'Dating',
      personal: ['Launch fashion label', 'Showcase at fashion week', 'Revive traditional crafts'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'active',
      exercise: 'light',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Rajasthani'],
  },
  {
    name: 'Sameer Khan',
    email: 'sameer.khan.dev@twinlink.test',
    age: 28,
    gender: 'MALE',
    profession: {
      title: 'Journalist',
      industry: 'Media',
      company: 'The Times of India',
    },
    location: {
      city: 'Delhi',
      state: 'Delhi',
      country: 'India',
    },
    interests: ['Journalism', 'Politics', 'Writing', 'Travel', 'Photography'],
    personality: {
      openness: 88,
      conscientiousness: 82,
      extraversion: 75,
      agreeableness: 78,
      neuroticism: 40,
    },
    communicationStyle: 'articulate',
    values: ['Truth', 'Justice', 'Freedom', 'Impact'],
    goals: {
      relationship: 'Professional Networking',
      personal: ['Win journalism award', 'Write a book', 'Cover international news'],
    },
    lifestyle: {
      schedule: 'irregular',
      socialLevel: 'active',
      exercise: 'light',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'socially',
    },
    languages: ['English', 'Hindi', 'Urdu'],
  },
  {
    name: 'Meera Reddy',
    email: 'meera.reddy.dev@twinlink.test',
    age: 26,
    gender: 'FEMALE',
    profession: {
      title: 'Biotechnologist',
      industry: 'Science',
      company: 'Biocon',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    interests: ['Science', 'Research', 'Hiking', 'Books', 'Podcasts'],
    personality: {
      openness: 82,
      conscientiousness: 90,
      extraversion: 55,
      agreeableness: 85,
      neuroticism: 30,
    },
    communicationStyle: 'analytical',
    values: ['Knowledge', 'Innovation', 'Integrity', 'Impact'],
    goals: {
      relationship: 'Long-term Relationship',
      personal: ['Publish research', 'PhD in biotech', 'Contribute to medical breakthrough'],
    },
    lifestyle: {
      schedule: 'structured',
      socialLevel: 'low',
      exercise: 'regular',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'no',
    },
    languages: ['English', 'Hindi', 'Telugu', 'Kannada'],
  },
  {
    name: 'Varun Khanna',
    email: 'varun.khanna.dev@twinlink.test',
    age: 29,
    gender: 'MALE',
    profession: {
      title: 'Sales Manager',
      industry: 'Retail',
      company: 'Reliance Retail',
    },
    location: {
      city: 'Ahmedabad',
      state: 'Gujarat',
      country: 'India',
    },
    interests: ['Business', 'Cricket', 'Cars', 'Travel', 'Movies'],
    personality: {
      openness: 75,
      conscientiousness: 85,
      extraversion: 88,
      agreeableness: 80,
      neuroticism: 35,
    },
    communicationStyle: 'persuasive',
    values: ['Success', 'Relationships', 'Growth', 'Achievement'],
    goals: {
      relationship: 'Dating',
      personal: ['Regional manager role', 'Own luxury car', 'Travel internationally'],
    },
    lifestyle: {
      schedule: 'busy',
      socialLevel: 'very active',
      exercise: 'moderate',
      diet: 'vegetarian',
      smoking: 'no',
      drinking: 'regularly',
    },
    languages: ['English', 'Hindi', 'Gujarati'],
  },
  {
    name: 'Tara Bose',
    email: 'tara.bose.dev@twinlink.test',
    age: 24,
    gender: 'FEMALE',
    profession: {
      title: 'Social Media Manager',
      industry: 'Marketing',
      company: 'Swiggy',
    },
    location: {
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
    },
    interests: ['Social Media', 'Content', 'Music', 'Events', 'Fashion'],
    personality: {
      openness: 90,
      conscientiousness: 78,
      extraversion: 92,
      agreeableness: 88,
      neuroticism: 32,
    },
    communicationStyle: 'enthusiastic',
    values: ['Connection', 'Creativity', 'Fun', 'Trends'],
    goals: {
      relationship: 'Friendship',
      personal: ['Lead social campaigns', 'Build influencer network', 'Start creative agency'],
    },
    lifestyle: {
      schedule: 'flexible',
      socialLevel: 'very active',
      exercise: 'light',
      diet: 'non-vegetarian',
      smoking: 'no',
      drinking: 'regularly',
    },
    languages: ['English', 'Hindi', 'Bengali'],
  },
]
