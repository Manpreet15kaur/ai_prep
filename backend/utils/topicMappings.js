// Topic to Sub-topics mapping for dynamic question generation
export const TOPIC_SUBTOPICS = {
  'Frontend Development': [
    'HTML', 'CSS', 'JavaScript', 'React', 'Responsive Design', 
    'DOM Manipulation', 'ES6+', 'Hooks', 'State Management'
  ],
  'Backend Development': [
    'Node.js', 'Express.js', 'REST APIs', 'Authentication', 'Python',
    'Django', 'Flask', 'Java', 'Spring Boot', 'Database Integration'
  ],
  'DevOps': [
    'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git',
    'Cloud Platforms', 'Monitoring', 'Infrastructure as Code'
  ],
  'DBMS': [
    'SQL Queries', 'Normalization', 'Transactions', 'Indexing',
    'ACID Properties', 'Joins', 'Query Optimization', 'NoSQL'
  ],
  'Operating System': [
    'Process Management', 'Memory Management', 'File Systems',
    'Scheduling', 'Deadlocks', 'Threads', 'Synchronization'
  ],
  'Computer Networks': [
    'OSI Model', 'TCP/IP', 'HTTP/HTTPS', 'DNS', 'Routing',
    'Network Security', 'Protocols', 'IP Addressing'
  ],
  'DSA': [
    'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues',
    'Trees', 'Graphs', 'Sorting', 'Searching', 'Dynamic Programming'
  ],
  'Cloud Computing': [
    'AWS', 'Azure', 'GCP', 'EC2', 'S3', 'Lambda',
    'Serverless', 'Cloud Storage', 'Auto Scaling'
  ],
  'AI & ML': [
    'Machine Learning', 'Neural Networks', 'Deep Learning',
    'NLP', 'Python', 'TensorFlow', 'PyTorch', 'Model Training'
  ]
};

// Topics that require programming language selection
export const CODING_TOPICS = [
  'DSA',
  'Frontend Development',
  'Backend Development'
];

// Programming languages available
export const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C'
];

// Question types
export const QUESTION_TYPES = [
  'MCQ',
  'Conceptual'
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Entry',
  'Mid-Level',
  'Senior'
];
