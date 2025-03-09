export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
  reward: number;
  difficulty: 'easy' | 'medium' | 'hard';
  endDate: Date;
  sponsorId: string;
  sponsorName: string;
  participantCount: number;
}

export const difficultyOrder = {
  easy: 1,
  medium: 2,
  hard: 3,
}; 