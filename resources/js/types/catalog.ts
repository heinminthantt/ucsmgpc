export interface User {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    role: 'USER' | 'SUPERVISOR' | 'ADMIN';
    is_active?: boolean;
}

export interface Department {
    id: number;
    name: string;
}

export interface Course {
    id: number;
    name: string;
    code?: string;
    department_id: number;
    department?: Department;
}

export interface Project {
    id: number;
    title: string;
    description: string;
    benefits?: string;
    body?: string;
    excerpt?: string;
    contentFormat?: string;
    githubLink?: string;
    coverImageUrl?: string;
    academic_year?: string;
    student_year?: string;
    objectives?: string;
    membersJson?: string;
    userId: number;
    submittedByName?: string;
    departmentId?: number;
    departmentName?: string;
    courseId?: number;
    courseName?: string;
    courseCode?: string;
    supervisorId?: number;
    supervisorName?: string;
    approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    approvedAt?: string;
    approvedById?: number;
    approvedByName?: string;
    projectFiles: string[];
    tags: string[];
    createdAt?: string;
    reactionCount?: number;
}

export interface MemberDTO {
    name: string;
    rollNumber?: string;
}

export interface Comment {
    id: number;
    userId: number;
    userName?: string;
    userAvatar?: string;
    comment: string;
    createdAt: string;
}

export interface ProjectNotification {
    id: number;
    message: string;
    project_id: number;
    project_title?: string;
    notification_type: string;
    comment_text?: string;
    commenter_name?: string;
    approver_name?: string;
    rejection_reason?: string;
    is_read: boolean;
    created_at: string;
}

export interface Filters {
    keyword: string;
    departmentId: string;
    courseId: string;
    academicYear: string;
    studentYear: string;
    tags: string;
    supervisor: string;
    members: string;
    page: number;
    size: number;
    sortBy: string;
    sortDirection: string;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    number: number;
    first: boolean;
    last: boolean;
    totalElements?: number;
}
