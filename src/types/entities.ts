export enum Role {
    PROFESSOR = "PROFESSOR",
    STUDENT = "STUDENT",
    ADMIN = "ADMIN"
}

export enum EvaluationType {
    POO_JAVA = "POO_JAVA",
    C_LANGUAGE = "C_LANGUAGE",
    SQL = "SQL",
    PYTHON = "PYTHON",
    ALGORITHMS = "ALGORITHMS",
    DATA_STRUCTURES = "DATA_STRUCTURES"
}

export type User = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
    subjects?: Subject[];
    submissions?: Submission[];
    classroom?: Classroom;
    classroomId?: number;
    teaching?: Classroom[];
}

export type Subject = {
    id: number;
    title: string;
    description?: string;
    fileUrl: string;
    startDate: Date;
    endDate: Date;
    evaluationType: EvaluationType;
    teacher: User;
    teacherId: number;
    createdAt: Date;
    updatedAt: Date;
    submissions?: Submission[];
}

export type Submission = {
    id: number;
    fileUrl: string;
    submittedAt: Date;
    student: User;
    studentId: number;
    subject: Subject;
    subjectId: number;
    correction?: Correction;
}

export type Correction = {
    id: number;
    score?: number;
    correctedAt: Date;
    notes?: string;
    evaluationType: EvaluationType;
    submission: Submission;
    submissionId: number;
}

export type Classroom = {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    students?: User[];
    teacher?: User | null;
    teacherId?: number | null;
} 