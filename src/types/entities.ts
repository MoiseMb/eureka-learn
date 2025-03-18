export enum Role {
    PROFESSOR = "PROFESSOR",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN"
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    classroomId?: number;
    subjects?: Subject[];
    submissions?: Submission[];
    classroom?: Classroom;
}

export type Subject = {
    id: number;
    title: string;
    description?: string;
    fileUrl: string;
    startDate: Date;
    endDate: Date;
    teacherId: number;
    createdAt: Date;
    updatedAt: Date;
    teacher?: User;
    submissions?: Submission[];
}

export type Submission = {
    id: number;
    fileUrl: string;
    submittedAt: Date;
    studentId: number;
    subjectId: number;
    student?: User;
    subject?: Subject;
    correction?: Correction;
}

export type Correction = {
    id: number;
    score?: number;
    correctedAt: Date;
    notes?: string;
    submissionId: number;
    submission?: Submission;
}

export type Classroom = {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    students?: User[];
} 