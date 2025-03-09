import { Challenge } from '@/types/challenge';

/**
 * Mock challenges data for development and testing
 */
export const mockChallenges: Challenge[] = [
  {
    id: 'challenge1',
    title: 'Tower Bridge Sunset',
    description: 'Capture the perfect sunset at Tower Bridge. The iconic Tower Bridge is one of London\'s most recognizable landmarks, and it\'s even more stunning during sunset. Your challenge is to capture the bridge bathed in the golden light of the setting sun, with the Thames reflecting the colorful sky.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?tower,bridge,london',
    location: {
      name: 'Tower Bridge, London',
      lat: 51.5055,
      lng: -0.0754,
    },
    reward: 50,
    difficulty: 'medium',
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    sponsorId: 'sponsor1',
    sponsorName: 'London Tourism Board',
    participantCount: 24,
  },
  {
    id: 'challenge2',
    title: 'Hyde Park Morning Run',
    description: 'Complete a morning run through Hyde Park and capture the serene atmosphere. Hyde Park is a runner\'s paradise, especially in the early morning when the mist hangs over the Serpentine and the park is peaceful. Your challenge is to complete a run through the park and capture the tranquil morning atmosphere.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?hyde,park,london',
    location: {
      name: 'Hyde Park, London',
      lat: 51.5073,
      lng: -0.1657,
    },
    reward: 30,
    difficulty: 'easy',
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    sponsorId: 'sponsor2',
    sponsorName: 'London Fitness Club',
    participantCount: 42,
  },
  {
    id: 'challenge3',
    title: 'Camden Market Food Tour',
    description: 'Sample and photograph 5 different cuisines at Camden Market. Camden Market is a food lover\'s paradise with cuisines from around the world. Your challenge is to sample and photograph dishes from 5 different food stalls, showcasing the diversity of culinary options available.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?camden,market,london',
    location: {
      name: 'Camden Market, London',
      lat: 51.5415,
      lng: -0.1419,
    },
    reward: 75,
    difficulty: 'medium',
    endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    sponsorId: 'sponsor3',
    sponsorName: 'Camden Food Association',
    participantCount: 18,
  },
  {
    id: 'challenge4',
    title: 'Tate Modern Art Challenge',
    description: 'Find and interpret your favorite artwork at the Tate Modern. The Tate Modern houses some of the world\'s most significant modern and contemporary art. Your challenge is to find an artwork that speaks to you, photograph it, and provide your personal interpretation of the piece.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?tate,modern,london',
    location: {
      name: 'Tate Modern, London',
      lat: 51.5076,
      lng: -0.0994,
    },
    reward: 40,
    difficulty: 'easy',
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    sponsorId: 'sponsor4',
    sponsorName: 'London Arts Council',
    participantCount: 31,
  },
  {
    id: 'challenge5',
    title: 'London Eye at Night',
    description: 'Capture the London Eye illuminated against the night sky. The London Eye is spectacular at night when it\'s illuminated with colorful lights. Your challenge is to photograph the London Eye after dark, capturing its reflection in the Thames and the surrounding cityscape.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?london,eye,night',
    location: {
      name: 'London Eye, London',
      lat: 51.5033,
      lng: -0.1195,
    },
    reward: 60,
    difficulty: 'medium',
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    sponsorId: 'sponsor5',
    sponsorName: 'London Eye Experience',
    participantCount: 27,
  },
  {
    id: 'challenge6',
    title: 'Notting Hill Colorful Houses',
    description: 'Find and photograph the most colorful row of houses in Notting Hill. Notting Hill is famous for its colorful, picturesque houses. Your challenge is to explore the area and find the most vibrant and photogenic row of houses, capturing their charm and character.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?notting,hill,london',
    location: {
      name: 'Notting Hill, London',
      lat: 51.5115,
      lng: -0.2057,
    },
    reward: 45,
    difficulty: 'easy',
    endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    sponsorId: 'sponsor6',
    sponsorName: 'Notting Hill Tourism',
    participantCount: 36,
  },
  {
    id: 'challenge7',
    title: 'British Museum Ancient Artifacts',
    description: 'Discover and document three ancient artifacts at the British Museum. The British Museum houses one of the world\'s finest collections of antiquities. Your challenge is to find three artifacts from different ancient civilizations, photograph them, and learn about their historical significance.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?british,museum,london',
    location: {
      name: 'British Museum, London',
      lat: 51.5194,
      lng: -0.1269,
    },
    reward: 80,
    difficulty: 'hard',
    endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    sponsorId: 'sponsor7',
    sponsorName: 'Historical Society of London',
    participantCount: 15,
  },
  {
    id: 'challenge8',
    title: 'Millennium Bridge Perspective',
    description: 'Capture a unique perspective of the Millennium Bridge with St. Paul\'s Cathedral in the background. The Millennium Bridge offers a perfect view of St. Paul\'s Cathedral. Your challenge is to find a creative angle or perspective to photograph the bridge with the cathedral in the background.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?millennium,bridge,london',
    location: {
      name: 'Millennium Bridge, London',
      lat: 51.5095,
      lng: -0.0986,
    },
    reward: 55,
    difficulty: 'medium',
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    sponsorId: 'sponsor8',
    sponsorName: 'London Photography Society',
    participantCount: 22,
  },
  {
    id: 'challenge9',
    title: 'Climb to the Top of The Shard',
    description: 'Reach the observation deck of The Shard and capture the panoramic view of London. The Shard offers unparalleled views of London from its observation deck. Your challenge is to ascend to the top and capture a panoramic photograph of the city, showcasing the Thames and London\'s iconic skyline.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?shard,london',
    location: {
      name: 'The Shard, London',
      lat: 51.5045,
      lng: -0.0865,
    },
    reward: 100,
    difficulty: 'hard',
    endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    sponsorId: 'sponsor9',
    sponsorName: 'The Shard Experience',
    participantCount: 12,
  },
  {
    id: 'challenge10',
    title: 'Covent Garden Street Performers',
    description: 'Capture the energy and talent of Covent Garden\'s street performers. Covent Garden is known for its talented street performers who entertain crowds throughout the day. Your challenge is to photograph these performers in action, capturing the energy, skill, and audience reactions.',
    imageUrl: 'https://source.unsplash.com/random/800x400/?covent,garden,london',
    location: {
      name: 'Covent Garden, London',
      lat: 51.5117,
      lng: -0.1232,
    },
    reward: 65,
    difficulty: 'medium',
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    sponsorId: 'sponsor10',
    sponsorName: 'Covent Garden Market',
    participantCount: 29,
  },
]; 