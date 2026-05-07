// Dummy user data for UI development
export const dummyUsers = [
  {
    id: "usr_001",
    name: "John Smith",
    email: "john.smith@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-12-01T14:20:00Z",
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-12-05T09:15:00Z",
    totalLogins: 45,
    enrolledCourses: 3,
    completedCourses: 2,
    totalSpent: 299.99,
    status: "active"
  },
  {
    id: "usr_002",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-02-20T08:45:00Z",
    updatedAt: "2024-11-28T16:30:00Z",
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-12-04T11:20:00Z",
    totalLogins: 89,
    enrolledCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    status: "active",
    coursesCreated: 5
  },
  {
    id: "usr_003",
    name: "Mike Wilson",
    email: "mike.wilson@example.com",
    emailVerified: false,
    image: null,
    createdAt: "2024-03-10T14:20:00Z",
    updatedAt: "2024-10-15T12:00:00Z",
    role: "student",
    banned: true,
    banReason: "Violation of community guidelines",
    banExpires: "2024-12-31T23:59:59Z",
    lastLogin: "2024-10-15T12:00:00Z",
    totalLogins: 12,
    enrolledCourses: 1,
    completedCourses: 0,
    totalSpent: 49.99,
    status: "banned"
  },
  {
    id: "usr_004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-01-05T09:10:00Z",
    updatedAt: "2024-12-06T08:45:00Z",
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-12-06T08:45:00Z",
    totalLogins: 156,
    enrolledCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    status: "active"
  },
  {
    id: "usr_005",
    name: "Alex Chen",
    email: "alex.chen@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-04-12T16:30:00Z",
    updatedAt: "2024-11-20T13:15:00Z",
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-11-20T13:15:00Z",
    totalLogins: 23,
    enrolledCourses: 4,
    completedCourses: 3,
    totalSpent: 399.99,
    status: "active"
  },
  {
    id: "usr_006",
    name: "Lisa Brown",
    email: "lisa.brown@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-05-08T11:25:00Z",
    updatedAt: "2024-06-15T10:30:00Z",
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-06-15T10:30:00Z",
    totalLogins: 5,
    enrolledCourses: 1,
    completedCourses: 0,
    totalSpent: 79.99,
    status: "inactive"
  },
  {
    id: "usr_007",
    name: "David Lee",
    email: "david.lee@example.com",
    emailVerified: false,
    image: null,
    createdAt: "2024-06-01T07:00:00Z",
    updatedAt: "2024-06-01T07:00:00Z",
    role: "student",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: null,
    totalLogins: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    status: "inactive"
  },
  {
    id: "usr_008",
    name: "Maria Garcia",
    email: "maria.garcia@example.com",
    emailVerified: true,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop&crop=face",
    createdAt: "2024-02-28T13:45:00Z",
    updatedAt: "2024-12-03T15:20:00Z",
    role: "admin",
    banned: false,
    banReason: null,
    banExpires: null,
    lastLogin: "2024-12-03T15:20:00Z",
    totalLogins: 67,
    enrolledCourses: 0,
    completedCourses: 0,
    totalSpent: 0,
    status: "active",
    coursesCreated: 3
  }
];

export type UserType = typeof dummyUsers[0];

// Date formatting utility
export function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";

  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "Today";
  } else if (diffInDays === 1) {
    return "Yesterday";
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}