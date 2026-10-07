/**
 * Burul Blue Star Club (BBSC) API Service
 * Standardized service layer supporting both Static Mock Data (default)
 * and seamless dynamic Node.js / Express REST API integration.
 */

// Toggle between Static Mock Data and live Node.js REST API
export const USE_MOCK_DATA = false;

export const getApiBaseUrl = () => {
  return 'https://bbsc-api.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Static Data Store matching exact UI specifications & backend JSON schemas
const MOCK_DATA = {
  clubStats: {
    yearsOfService: 35,
    membersCount: 500,
    eventsOrganized: 120,
    annualVisitors: 10000
  },

  festivals: [
    {
      id: 'kali-puja',
      title: 'KALI PUJA',
      subtitle: 'Grand Celebration, Cultural Programs & Community Unity',
      date: 'November 2024',
      image: '/images/kali_puja.jpg',
      description: 'Our flagship festival celebration spanning 4 days with magnificent lighting, traditional rituals, cultural events, bhog distribution, and famous artists performance.',
      highlights: ['Splendid Mandap Illumination', 'Cultural Programs & Musical Nights', 'Grand Bhog & Prasad Distribution', 'Youth Volunteer Operations']
    },
    {
      id: 'saraswati-puja',
      title: 'SARASWATI PUJA',
      subtitle: 'Knowledge, Culture & Creativity Come Together',
      date: 'February 2025',
      image: '/images/saraswati_puja.jpg',
      description: 'A celebration dedicated to Goddess Saraswati focusing on students, youth talent showcase, drawing competitions, and educational awards distribution.',
      highlights: ['Sit-and-Draw Competition', 'Academic Excellence Awards', 'Art Exhibition', 'Prasad Distribution']
    },
    {
      id: 'independence-day',
      title: 'INDEPENDENCE DAY',
      subtitle: 'Pride, Unity & Celebration of Our Nation',
      date: 'August 15',
      image: '/images/independence_day.jpg',
      description: 'Annual National celebration marked by flag hoisting, national anthem recital, march past, tree plantation, and sweet distribution to local school children.',
      highlights: ['Tricolor Flag Hoisting Ceremony', 'Patriotic Songs & Performances', 'Social Service & Tree Plantation', 'Felicitation of Freedom Fighter Families']
    }
  ],

  competitions: [
    { id: 1, title: 'Painting Competition', icon: 'Palette', ageGroup: 'Under 15 Years', category: 'Arts' },
    { id: 2, title: 'Dance Competition', icon: 'Sparkles', ageGroup: 'All Age Groups', category: 'Performing Arts' },
    { id: 3, title: 'Singing Competition', icon: 'Music', ageGroup: 'Junior & Senior', category: 'Music' },
    { id: 4, title: 'Abriti (Recitation)', icon: 'BookOpen', ageGroup: 'Open Category', category: 'Literature' },
    { id: 5, title: 'Alpona Competition', icon: 'Flower2', ageGroup: 'Women & Youth', category: 'Traditional Art' },
    { id: 6, title: 'Fancy Dress Competition', icon: 'Smile', ageGroup: 'Children (3-10 Yrs)', category: 'Fun' },
    { id: 7, title: 'Children\'s Games', icon: 'Gamepad2', ageGroup: 'Under 12 Years', category: 'Sports' },
    { id: 8, title: 'Quiz Competition', icon: 'HelpCircle', ageGroup: 'High School & Open', category: 'Academics' },
    { id: 9, title: 'Photography Competition', icon: 'Camera', ageGroup: 'Open for All', category: 'Visual Arts' },
    { id: 10, title: 'Essay Competition', icon: 'FileText', ageGroup: 'Students & Adults', category: 'Literature' }
  ],

  events: [
    {
      id: 'e1',
      month: 'AUG',
      day: '15',
      title: 'Drawing Competition',
      fullDate: 'August 15, 2024',
      status: 'upcoming',
      category: 'Competitions',
      location: 'Club Premises & Auditorium',
      time: '09:00 AM IST',
      description: 'Annual Independence Day Sit-and-Draw contest for children divided into 3 age groups. Drawing sheets provided by the club.',
      image: '/images/saraswati_puja.jpg'
    },
    {
      id: 'e2',
      month: 'SEP',
      day: '10',
      title: 'Dance Competition',
      fullDate: 'September 10, 2024',
      status: 'upcoming',
      category: 'Competitions',
      location: 'BBSC Open Stage',
      time: '05:00 PM IST',
      description: 'Classical, Folk, and Modern Creative Solo & Group dance contest judged by renowned external choreographers.',
      image: '/images/bbsc_hero_seamless_correct.jpg'
    },
    {
      id: 'e3',
      month: 'OCT',
      day: '01',
      title: 'Kali Puja Registration',
      fullDate: 'October 01, 2024',
      status: 'upcoming',
      category: 'Festivals',
      location: 'Club Office & Online Portal',
      time: '10:00 AM IST',
      description: 'Opening of delegate passes, souvenir advertisement bookings, and volunteer sign-ups for the upcoming Kali Puja.',
      image: '/images/kali_puja.jpg'
    },
    {
      id: 'e4',
      month: 'NOV',
      day: '12',
      title: 'Grand Kali Puja',
      fullDate: 'November 12 - 15, 2024',
      status: 'upcoming',
      category: 'Festivals',
      location: 'Burul Central Ground',
      time: '07:00 PM IST',
      description: 'The mega annual festival featuring traditional rituals, famous artist musical evening, illumination show, and community feast.',
      image: '/images/kali_puja.jpg'
    },
    {
      id: 'e5',
      month: 'DEC',
      day: '25',
      title: 'Prize Distribution',
      fullDate: 'December 25, 2024',
      status: 'upcoming',
      category: 'Ceremony',
      location: 'BBSC Main Stage',
      time: '04:00 PM IST',
      description: 'Annual awards ceremony honoring competition winners, academic toppers of Burul area, and community leaders.',
      image: '/images/saraswati_puja.jpg'
    },
    {
      id: 'e6',
      month: 'JAN',
      day: '26',
      title: 'Blood Donation Camp',
      fullDate: 'January 26, 2024',
      status: 'past',
      category: 'Social Work',
      location: 'Community Hall',
      time: '08:30 AM IST',
      description: 'Social welfare drive organized in association with Rotary Blood Bank. 140+ donors participated successfully.',
      image: '/images/independence_day.jpg'
    }
  ],

  gallery: [
    {
      id: 1,
      title: 'Kali Puja Mandap Illumination',
      category: 'Kali Puja',
      image: '/images/kali_puja.jpg'
    },
    {
      id: 2,
      title: 'Traditional Temple & Decor',
      category: 'Kali Puja',
      image: '/images/bbsc_hero_seamless_correct.jpg'
    },
    {
      id: 3,
      title: 'Goddess Saraswati Murti',
      category: 'Saraswati Puja',
      image: '/images/saraswati_puja.jpg'
    },
    {
      id: 4,
      title: 'Alpona Floor Art Competition',
      category: 'Competitions',
      image: '/images/saraswati_puja.jpg'
    },
    {
      id: 5,
      title: 'Cultural Stage Performance',
      category: 'Events',
      image: '/images/bbsc_hero_seamless_correct.jpg'
    },
    {
      id: 6,
      title: 'Youth Sit & Draw Contest',
      category: 'Competitions',
      image: '/images/saraswati_puja.jpg'
    },
    {
      id: 7,
      title: 'Independence Day Flag Hoisting',
      category: 'Events',
      image: '/images/independence_day.jpg'
    },
    {
      id: 8,
      title: 'Tree Plantation & Environmental Drive',
      category: 'Social Work',
      image: '/images/independence_day.jpg'
    },
    {
      id: 9,
      title: 'Social Service Relief Work',
      category: 'Social Work',
      image: '/images/independence_day.jpg'
    }
  ],

  committee: [
    {
      id: 1,
      role: 'President',
      name: 'Rintu Das',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543210'
    },
    {
      id: 2,
      role: 'Secretary',
      name: 'Amlan Mondal',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543211'
    },
    {
      id: 3,
      role: 'Treasurer',
      name: 'Subhankar Dey',
      photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543212'
    },
    {
      id: 4,
      role: 'Vice President',
      name: 'Suman Mondal',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543213'
    },
    {
      id: 5,
      role: 'Cultural Secretary',
      name: 'Sourav Halder',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543214'
    },
    {
      id: 6,
      role: 'Sports Secretary',
      name: 'Bappa Das',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543215'
    },
    {
      id: 7,
      role: 'Joint Secretary',
      name: 'Arijit Saha',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543216'
    },
    {
      id: 8,
      role: 'Executive Member',
      name: 'Tapan Mondal',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      contact: '+91 9876543217'
    }
  ],

  contactInfo: {
    address: 'Burul, South 24 Parganas, West Bengal - 743318',
    phones: ['+91 9876543210', '+91 1234567890'],
    emails: ['info@burulbluestarclub.org', 'support@burulbluestarclub.org'],
    social: {
      facebook: 'https://facebook.com/burulbluestarclub',
      instagram: 'https://instagram.com/burulbluestarclub',
      youtube: 'https://youtube.com/burulbluestarclub',
      whatsapp: 'https://wa.me/919876543210'
    }
  },

  competitionWinners: [
    // 2024 Winners - Dance Competition
    { id: 'w_d24_a1', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Riya Mondal', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', remarks: 'Classical Solo Performance' },
    { id: 'w_d24_a2', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Sneha Sarkar', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Creative Folk Dance' },
    { id: 'w_d24_a3', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Ananya Biswas', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Kathak Basics Routine' },
    { id: 'w_d24_a4', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 4, rankLabel: 'Special Recognition 🏅', winnerName: 'Tiyasha Sen', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Special Jury Mention' },

    { id: 'w_d24_b1', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Priya Halder', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', remarks: 'Rabindra Nritya Expressive' },
    { id: 'w_d24_b2', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Aditi Mukhopadhyay', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Semi-Classical Fusion' },
    { id: 'w_d24_b3', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Debolina Dutta', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Manipuri Dance Performance' },
    { id: 'w_d24_b4', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 4, rankLabel: 'Consolation Award 🏅', winnerName: 'Megha Majumdar', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Folk Rhythm Award' },

    { id: 'w_d24_c1', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category C (Senior - 16+ Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Tanushree Paul', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Contemporary Classical Stage Art' },
    { id: 'w_d24_c2', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category C (Senior - 16+ Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Sujata Majumdar', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Traditional Bharatnatyam' },
    { id: 'w_d24_c3', year: '2024', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category C (Senior - 16+ Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Mousumi Das', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Odissi Solo Choreography' },

    // 2024 Winners - Painting Competition
    { id: 'w_p24_a1', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category A (Junior - Under 8 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Aarohi Das', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Landscape Oil Pastel' },
    { id: 'w_p24_a2', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category A (Junior - Under 8 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Rishav Kar', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', remarks: 'Color Pencil Village Sketch' },
    { id: 'w_p24_a3', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category A (Junior - Under 8 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Ananya Biswas', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Nature Drawing' },

    { id: 'w_p24_b1', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category B (Mid Group - 9 to 14 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Sohan Roy', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', remarks: 'Water Color Temple Art' },
    { id: 'w_p24_b2', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category B (Mid Group - 9 to 14 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Vikramjit Paul', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', remarks: 'Durga Puja Festival Canvas' },
    { id: 'w_p24_b3', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category B (Mid Group - 9 to 14 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Soumik Nandy', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', remarks: 'Rural Bengal Scenery' },
    { id: 'w_p24_b4', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category B (Mid Group - 9 to 14 Yrs)', rank: 4, rankLabel: 'Special Recognition 🏅', winnerName: 'Tiyasha Sen', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Promising Young Artist Award' },

    { id: 'w_p24_c1', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category C (Senior Group - 15+ Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Koushik Sen', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80', remarks: 'Acrylic Heritage Painting' },
    { id: 'w_p24_c2', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category C (Senior Group - 15+ Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Rahul Ghosh', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', remarks: 'Oil Color Canvas' },
    { id: 'w_p24_c3', year: '2024', competitionId: 1, competitionTitle: 'Painting Competition', subCategory: 'Category C (Senior Group - 15+ Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Subhajit Banerjee', ageGroup: 'Senior - Group C', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', remarks: 'Charcoal Sketch Portrait' },

    // 2024 Winners - Singing Competition
    { id: 'w_s24_a1', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category A (Rabindra Sangeet)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Debolina Dutta', ageGroup: 'Rabindra Sangeet', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Anandadhara Bahiche Bhubane' },
    { id: 'w_s24_a2', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category A (Rabindra Sangeet)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Aarohi Das', ageGroup: 'Rabindra Sangeet', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Purano Shei Diner Kotha' },
    { id: 'w_s24_a3', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category A (Rabindra Sangeet)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Priya Halder', ageGroup: 'Rabindra Sangeet', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', remarks: 'Esho Hey Boishakh' },

    { id: 'w_s24_b1', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category B (Classical & Folk)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Subhajit Banerjee', ageGroup: 'Classical & Folk', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', remarks: 'Indian Classical Raaga' },
    { id: 'w_s24_b2', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category B (Classical & Folk)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Rahul Ghosh', ageGroup: 'Classical & Folk', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', remarks: 'Traditional Baul Song' },
    { id: 'w_s24_b3', year: '2024', competitionId: 3, competitionTitle: 'Singing Competition', subCategory: 'Category B (Classical & Folk)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Sohan Roy', ageGroup: 'Classical & Folk', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80', remarks: 'Bhatiali Folk Tune' },

    // 2023 Winners - Dance Competition
    { id: 'w_d23_a1', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Riya Mondal', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', remarks: 'Creative Solo Dance' },
    { id: 'w_d23_a2', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Sneha Sarkar', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Folk Beat Dance' },
    { id: 'w_d23_a3', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Aarohi Das', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Rhythmic Move' },

    { id: 'w_d23_b1', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Priya Halder', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', remarks: 'Manipuri Classical Solo' },
    { id: 'w_d23_b2', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Debolina Dutta', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', remarks: 'Semi Classical Solo' },
    { id: 'w_d23_b3', year: '2023', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category B (Sub-Senior - 10 to 15 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Aditi Mukhopadhyay', ageGroup: 'Mid - Group B', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Fusion Dance' },

    // 2022 Winners - Dance Competition
    { id: 'w_d22_a1', year: '2022', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 1, rankLabel: '1st Prize 🥇', winnerName: 'Sneha Sarkar', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', remarks: 'Tribal Folk Dance' },
    { id: 'w_d22_a2', year: '2022', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 2, rankLabel: '2nd Prize 🥈', winnerName: 'Riya Mondal', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', remarks: 'Patriotic Dance' },
    { id: 'w_d22_a3', year: '2022', competitionId: 2, competitionTitle: 'Dance Competition', subCategory: 'Category A (Junior - Under 10 Yrs)', rank: 3, rankLabel: '3rd Prize 🥉', winnerName: 'Ananya Biswas', ageGroup: 'Junior - Group A', photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', remarks: 'Classical Step' }
  ]
};

/**
 * Service API Methods
 */
export const apiService = {
  getClubStats: async () => {
    if (USE_MOCK_DATA) return Promise.resolve({ success: true, data: MOCK_DATA.clubStats });
    const res = await fetch(`${getApiBaseUrl()}/stats`);
    return res.json();
  },

  getFestivals: async () => {
    if (USE_MOCK_DATA) return Promise.resolve({ success: true, data: MOCK_DATA.festivals });
    try {
      const res = await fetch(`${getApiBaseUrl()}/events`);
      if (res.ok) {
        const json = await res.json();
        const rawItems = json.data || (Array.isArray(json) ? json : []);
        const items = rawItems.map(item => ({
          id: item._id || item.id,
          title: item.title,
          subtitle: item.shortTitle || item.subtitle || item.description || '',
          date: item.fullDate || (item.month && item.day ? `${item.month} ${item.day}` : '') || item.date || '',
          image: item.image || '/images/kali_puja.jpg',
          description: item.description || '',
          highlights: item.highlights || [
            'Splendid Illumination & Mandap Decor',
            'Cultural Programs & Musical Evenings',
            'Grand Bhog & Prasad Distribution',
            'Youth & Community Participation'
          ]
        }));
        if (items.length > 0) {
          return { success: true, count: items.length, data: items };
        }
      }
    } catch (e) {
      console.warn('[apiService] Could not fetch live festivals/events from backend NestJS server', e);
    }
    return Promise.resolve({ success: true, data: MOCK_DATA.festivals });
  },

  getCompetitions: async () => {
    if (USE_MOCK_DATA) return Promise.resolve({ success: true, data: MOCK_DATA.competitions });
    try {
      const res = await fetch(`${getApiBaseUrl()}/competitions`);
      if (res.ok) {
        const json = await res.json();
        const rawItems = json.data || (Array.isArray(json) ? json : []);
        const items = rawItems.map(item => ({
          id: item._id || item.id,
          title: item.title,
          icon: item.icon || 'Sparkles',
          ageGroup: item.ageGroup || 'Open Category',
          category: item.category || 'Arts'
        }));
        if (items.length > 0) {
          return { success: true, count: items.length, data: items };
        }
      }
    } catch (e) {
      console.warn('[apiService] Could not fetch live competitions from backend NestJS server', e);
    }
    return Promise.resolve({ success: true, data: MOCK_DATA.competitions });
  },

  getEvents: async (status = 'all') => {
    if (USE_MOCK_DATA) {
      const filtered = status === 'all' 
        ? MOCK_DATA.events 
        : MOCK_DATA.events.filter(e => e.status === status);
      return Promise.resolve({ success: true, data: filtered });
    }
    try {
      const url = status && status !== 'all' 
        ? `${getApiBaseUrl()}/events?status=${encodeURIComponent(status)}`
        : `${getApiBaseUrl()}/events`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const rawItems = json.data || (Array.isArray(json) ? json : []);
        const items = rawItems.map(item => ({
          id: item._id || item.id,
          month: item.month || 'NOV',
          day: item.day || '12',
          title: item.title,
          shortTitle: item.shortTitle || item.title,
          fullDate: item.fullDate || item.date || `${item.month || ''} ${item.day || ''}`,
          status: item.status || 'upcoming',
          category: item.category || 'Festivals',
          location: item.location || 'Burul, South 24 Parganas',
          time: item.time || '10:00 AM IST',
          description: item.description || '',
          image: item.image || '/images/kali_puja.jpg'
        }));
        return { success: true, count: items.length, data: items };
      }
    } catch (e) {
      console.warn('[apiService] Could not fetch live events from backend NestJS server', e);
    }
    const filtered = status === 'all' 
      ? MOCK_DATA.events 
      : MOCK_DATA.events.filter(e => e.status === status);
    return Promise.resolve({ success: true, data: filtered });
  },

  getGallery: async (category = 'All') => {
    if (USE_MOCK_DATA) {
      const filtered = category === 'All' 
        ? MOCK_DATA.gallery 
        : MOCK_DATA.gallery.filter(g => g.category === category);
      return Promise.resolve({ success: true, data: filtered });
    }
    try {
      const url = category && category !== 'All'
        ? `${getApiBaseUrl()}/gallery?category=${encodeURIComponent(category)}`
        : `${getApiBaseUrl()}/gallery`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const rawItems = json.data || (Array.isArray(json) ? json : []);
        const items = rawItems.map(item => ({
          id: item._id || item.id,
          title: item.title,
          category: item.category || 'Events',
          image: item.image || '/images/kali_puja.jpg',
          description: item.shortDescription || item.description || ''
        }));
        return { success: true, count: items.length, data: items };
      }
    } catch (e) {
      console.warn('[apiService] Could not fetch live gallery items from backend NestJS server', e);
    }
    const filtered = category === 'All' 
      ? MOCK_DATA.gallery 
      : MOCK_DATA.gallery.filter(g => g.category === category);
    return Promise.resolve({ success: true, data: filtered });
  },

  getCommittee: async () => {
    try {
      const res = await fetch(`${getApiBaseUrl()}/committee`);
      if (res.ok) {
        const json = await res.json();
        const items = (json.data || []).map(m => ({
          id: m._id || m.id,
          name: m.name,
          role: m.role || m.position || 'Executive Member',
          position: m.role || m.position || 'Executive Member',
          photo: m.photo || m.image || '',
          image: m.photo || m.image || '',
          contact: m.contact || m.phone || ''
        }));
        return { success: true, count: items.length, data: items };
      }
    } catch (e) {
      console.warn('[apiService] Could not fetch live committee members from backend NestJS server', e);
    }
    return Promise.resolve({ success: true, data: MOCK_DATA.committee });
  },

  getContactInfo: async () => {
    if (USE_MOCK_DATA) return Promise.resolve({ success: true, data: MOCK_DATA.contactInfo });
    const res = await fetch(`${getApiBaseUrl()}/contact-info`);
    return res.json();
  },

  submitContactForm: async (formData) => {
    if (USE_MOCK_DATA) {
      console.log('[API MOCK] Contact Form Submitted:', formData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Thank you! Your message has been received. We will get back to you shortly.' });
        }, 600);
      });
    }
    const res = await fetch(`${getApiBaseUrl()}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return res.json();
  },

  submitJoinClub: async (memberData) => {
    const saveLocalMembership = (data) => {
      try {
        const key = 'bbsc_admin_memberships';
        const existingStr = localStorage.getItem(key);
        const existing = existingStr ? JSON.parse(existingStr) : [
          { id: 'm1', fullName: 'Subhajit Roy', email: 'subhajit.roy@example.com', phone: '+91 9871122334', age: 24, occupation: 'Software Developer', address: 'Burul Bazar, South 24 Parganas', status: 'pending', date: '2024-09-01' },
          { id: 'm2', fullName: 'Priyanka Banerjee', email: 'priyanka.b@example.com', phone: '+91 9832233445', age: 21, occupation: 'College Student', address: 'Main Road, Burul', status: 'approved', date: '2024-08-28' },
          { id: 'm3', fullName: 'Amitabha Ghosh', email: 'aghosh@example.com', phone: '+91 9743344556', age: 32, occupation: 'Teacher', address: 'Station Road, Burul', status: 'pending', date: '2024-09-03' }
        ];

        const newItem = {
          id: data._id || data.id || ('m_' + Date.now()),
          _id: data._id || data.id || ('m_' + Date.now()),
          fullName: data.fullName || 'Anonymous Member',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || 'Burul, South 24 Parganas',
          interest: data.interest || 'General Volunteer',
          age: data.age || null,
          occupation: data.occupation || '',
          status: data.status || 'pending',
          date: data.date || new Date().toISOString().split('T')[0]
        };

        const filtered = existing.filter(m => m.id !== newItem.id && m._id !== newItem._id);
        const updated = [newItem, ...filtered];
        localStorage.setItem(key, JSON.stringify(updated));
        return newItem;
      } catch (e) {
        console.warn('[apiService] Failed to save local membership fallback:', e);
        return data;
      }
    };

    if (USE_MOCK_DATA) {
      console.log('[API MOCK] Join Club Application Submitted:', memberData);
      const saved = saveLocalMembership(memberData);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: 'Congratulations! Your membership application has been submitted successfully.',
            data: saved
          });
        }, 800);
      });
    }

    try {
      const res = await fetch(`${getApiBaseUrl()}/membership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (res.ok) {
        const json = await res.json();
        const saved = saveLocalMembership(json.data || memberData);
        return {
          success: true,
          message: json.message || 'Congratulations! Your membership application has been submitted successfully.',
          data: json.data || saved
        };
      } else {
        const errJson = await res.json().catch(() => ({}));
        console.warn('[apiService] Backend returned non-200 for submitJoinClub, storing locally:', res.status, errJson);
      }
    } catch (e) {
      console.warn('[apiService] Network exception in submitJoinClub, storing locally:', e);
    }

    // Resilient fallback storage: ensure form succeeds and data is stored in local storage for Admin Panel
    const saved = saveLocalMembership(memberData);
    return {
      success: true,
      message: 'Congratulations! Your membership application has been submitted successfully.',
      data: saved
    };
  },

  getCompetitionWinners: async (year = 'All', competitionId = 'All') => {
    if (USE_MOCK_DATA) {
      let filtered = MOCK_DATA.competitionWinners;
      if (year !== 'All') {
        filtered = filtered.filter(w => w.year === year);
      }
      if (competitionId !== 'All') {
        filtered = filtered.filter(w => w.competitionId === Number(competitionId) || w.competitionTitle === competitionId);
      }
      return Promise.resolve({ success: true, data: filtered });
    }
    const res = await fetch(`${getApiBaseUrl()}/competition-winners?year=${year}&competitionId=${competitionId}`);
    return res.json();
  }
};
