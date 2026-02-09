// Topic to Sub-topics mapping for dynamic question generation
export const TOPIC_SUBTOPICS = {
  'DSA': [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Hashing',
    'Sorting',
    'Searching',
    'Dynamic Programming',
    'Greedy Algorithms',
    'Backtracking',
    'Recursion',
    'Bit Manipulation'
  ],
  'DBMS': [
    'Normalization',
    'Indexing',
    'Transactions',
    'SQL Joins',
    'ACID Properties',
    'Concurrency Control',
    'Database Design',
    'Query Optimization',
    'Stored Procedures',
    'Triggers',
    'Views',
    'NoSQL Databases'
  ],
  'Java': [
    'OOP Concepts',
    'Collections Framework',
    'Multithreading',
    'Exception Handling',
    'Java 8 Features',
    'Spring Framework',
    'Hibernate',
    'JVM Internals',
    'Design Patterns',
    'JDBC',
    'Servlets & JSP',
    'Maven/Gradle'
  ],
  'React': [
    'Components',
    'Hooks',
    'State Management',
    'Props',
    'Context API',
    'Redux',
    'React Router',
    'Lifecycle Methods',
    'Performance Optimization',
    'Testing',
    'Next.js',
    'Custom Hooks'
  ],
  'JavaScript': [
    'ES6+ Features',
    'Closures',
    'Promises',
    'Async/Await',
    'Event Loop',
    'Prototypes',
    'DOM Manipulation',
    'Array Methods',
    'Object Methods',
    'Error Handling',
    'Modules',
    'TypeScript'
  ],
  'Python': [
    'Data Structures',
    'OOP',
    'Decorators',
    'Generators',
    'List Comprehensions',
    'File Handling',
    'Exception Handling',
    'Libraries (NumPy, Pandas)',
    'Django/Flask',
    'Multithreading',
    'Regular Expressions',
    'Virtual Environments'
  ],
  'Node.js': [
    'Express.js',
    'Middleware',
    'REST APIs',
    'Authentication',
    'Database Integration',
    'File System',
    'Streams',
    'Event Emitters',
    'NPM',
    'Error Handling',
    'Testing',
    'Deployment'
  ],
  'System Design': [
    'Scalability',
    'Load Balancing',
    'Caching',
    'Database Sharding',
    'Microservices',
    'API Design',
    'Message Queues',
    'CAP Theorem',
    'Distributed Systems',
    'High Availability',
    'Rate Limiting',
    'CDN'
  ],
  'Operating Systems': [
    'Process Management',
    'Memory Management',
    'File Systems',
    'Deadlocks',
    'Scheduling Algorithms',
    'Virtual Memory',
    'Threads',
    'Synchronization',
    'IPC',
    'System Calls',
    'Disk Management',
    'Security'
  ],
  'Computer Networks': [
    'OSI Model',
    'TCP/IP',
    'HTTP/HTTPS',
    'DNS',
    'Routing',
    'Switching',
    'Network Security',
    'Firewalls',
    'VPN',
    'Load Balancers',
    'Protocols',
    'Network Topologies'
  ],
  'Machine Learning': [
    'Supervised Learning',
    'Unsupervised Learning',
    'Neural Networks',
    'Deep Learning',
    'Feature Engineering',
    'Model Evaluation',
    'Regression',
    'Classification',
    'Clustering',
    'NLP',
    'Computer Vision',
    'TensorFlow/PyTorch'
  ],
  'Cloud Computing': [
    'AWS Services',
    'Azure Services',
    'GCP Services',
    'Docker',
    'Kubernetes',
    'Serverless',
    'CI/CD',
    'Infrastructure as Code',
    'Cloud Security',
    'Monitoring',
    'Auto Scaling',
    'Cloud Storage'
  ],
  'DevOps': [
    'CI/CD Pipelines',
    'Docker',
    'Kubernetes',
    'Jenkins',
    'Git',
    'Monitoring Tools',
    'Infrastructure as Code',
    'Configuration Management',
    'Cloud Platforms',
    'Scripting',
    'Security',
    'Automation'
  ],
  'Web Development': [
    'HTML/CSS',
    'JavaScript',
    'Responsive Design',
    'REST APIs',
    'GraphQL',
    'Authentication',
    'Security',
    'Performance Optimization',
    'SEO',
    'Accessibility',
    'Testing',
    'Deployment'
  ],
  'Mobile Development': [
    'React Native',
    'Flutter',
    'iOS Development',
    'Android Development',
    'UI/UX Design',
    'State Management',
    'API Integration',
    'Push Notifications',
    'App Store Deployment',
    'Performance',
    'Testing',
    'Native Modules'
  ]
};

// Topics that require programming language selection
export const CODING_TOPICS = [
  'DSA',
  'Java',
  'Python',
  'JavaScript',
  'Node.js',
  'React',
  'Web Development',
  'Mobile Development'
];

// Programming languages available
export const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'C++',
  'C',
  'C#',
  'Go',
  'Rust',
  'TypeScript',
  'Swift',
  'Kotlin',
  'PHP',
  'Ruby'
];

// Answer style options
export const ANSWER_STYLES = [
  { value: 'short', label: 'Short & Concise' },
  { value: 'detailed', label: 'Detailed Explanation' },
  { value: 'with-examples', label: 'With Examples & Code' },
  { value: 'interview-focused', label: 'Interview-Focused' }
];

// Question types
export const QUESTION_TYPES = [
  'MCQ',
  'Coding',
  'Conceptual',
  'Scenario-based',
  'HR/Behavioral'
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];
