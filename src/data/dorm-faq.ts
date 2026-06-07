export interface DormFaqItem {
    id: string;
    question: string;
    answer: string;
    category: 'Fees' | 'Dormitory';
}

export const dormFaq: DormFaqItem[] = [
    {
        id: 'electricity',
        question: 'What is the electricity fee?',
        answer: 'Electricity costs 3,500 VND per kWh. The payment deadline is the 10th of every month.',
        category: 'Fees',
    },
    {
        id: 'water',
        question: 'What is the water fee?',
        answer: 'Water costs 15,000 VND per cubic meter.',
        category: 'Fees',
    },
    {
        id: 'internet',
        question: 'What is the internet fee?',
        answer: 'Dormitory Wi-Fi costs 100,000 VND per room each month.',
        category: 'Fees',
    },
    {
        id: 'room-fee',
        question: 'When is the monthly room fee due?',
        answer: 'The monthly room fee is due on the 25th. Students can review their amount in the Room section.',
        category: 'Fees',
    },
    {
        id: 'quiet-hours',
        question: 'What are the dormitory quiet hours?',
        answer: 'Quiet hours are from 22:00 to 06:00 every day.',
        category: 'Dormitory',
    },
    {
        id: 'visitor',
        question: 'What is the visitor policy?',
        answer: 'Visitors must register with security and leave the dormitory before 21:00.',
        category: 'Dormitory',
    },
    {
        id: 'support',
        question: 'How do I report a room problem?',
        answer: 'Create an Issue request in the app and include the room location, description, and attachments when available.',
        category: 'Dormitory',
    },
];

export const updateDormFaq = (items: DormFaqItem[]) => {
    dormFaq.splice(0, dormFaq.length, ...items);
};

export const findDormFaqAnswer = (message: string) => {
    const normalized = message.toLowerCase();
    const keywords: Record<string, string[]> = {
        electricity: ['electricity', 'electric', 'power'],
        water: ['water'],
        internet: ['internet', 'wifi', 'wi-fi'],
        'room-fee': ['room fee', 'rent', 'monthly fee'],
        'quiet-hours': ['quiet', 'noise', 'quiet hours'],
        visitor: ['visitor', 'guest'],
        support: ['report', 'problem', 'issue', 'broken'],
    };

    const keywordMatch = dormFaq.find((item) =>
        keywords[item.id]?.some((keyword) => normalized.includes(keyword))
    );

    if (keywordMatch) return keywordMatch.answer;

    const messageWords = normalized
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/\s+/)
        .filter((word) => word.length > 3);
    const questionMatch = dormFaq.find((item) => {
        const question = item.question.toLowerCase();
        return messageWords.some((word) => question.includes(word));
    });

    return questionMatch?.answer;
};
