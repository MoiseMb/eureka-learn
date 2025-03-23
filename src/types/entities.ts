import {
    FileText,
    FileCode,
    Code2,
    Terminal,
    Database,
    FileCode2,
    Binary,
    Blocks
} from "lucide-react";

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

export enum SubjectType {
    PDF = "PDF",
    TEXT = "TEXT",
    MARKDOWN = "MARKDOWN"
}

export const subjectTypeConfig = {
    PDF: {
        label: "Document PDF",
        icon: FileText,
        color: "text-red-500",
        acceptedTypes: {
            "application/pdf": [".pdf"]
        }
    },
    TEXT: {
        label: "Document Texte",
        icon: FileText,
        color: "text-blue-500",
        acceptedTypes: {
            "text/plain": [".txt"],
            "application/msword": [".doc", ".docx"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
        }
    },
    MARKDOWN: {
        label: "Document Markdown",
        icon: FileCode,
        color: "text-green-500",
        acceptedTypes: {
            "text/markdown": [".md", ".markdown"]
        }
    }
};

export const evaluationTypeConfig = {
    POO_JAVA: {
        label: "POO Java",
        shortLabel: "Java",
        icon: Code2,
        color: "text-red-500",
        description: "Programmation Orientée Objet en Java"
    },
    C_LANGUAGE: {
        label: "Langage C",
        shortLabel: "C",
        icon: Terminal,
        color: "text-blue-500",
        description: "Programmation en C"
    },
    SQL: {
        label: "SQL",
        shortLabel: "SQL",
        icon: Database,
        color: "text-green-500",
        description: "Bases de données SQL"
    },
    PYTHON: {
        label: "Python",
        shortLabel: "Python",
        icon: FileCode2,
        color: "text-yellow-500",
        description: "Programmation Python"
    },
    ALGORITHMS: {
        label: "Algorithmes",
        shortLabel: "Algo",
        icon: Binary,
        color: "text-purple-500",
        description: "Conception d'algorithmes"
    },
    DATA_STRUCTURES: {
        label: "Structures de données",
        shortLabel: "Struct",
        icon: Blocks,
        color: "text-orange-500",
        description: "Structures de données avancées"
    }
};

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
    correctionFileUrl?: string;
    startDate: Date;
    endDate: Date;
    evaluationType: EvaluationType;
    teacher: User;
    type: SubjectType;
    teacherId: number;
    createdAt: Date;
    isCorrecting: boolean;
    isCorrected: boolean;
    classroomId: number;
    classroom: Classroom;
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
    createdAt: Date;
    isCorrecting: boolean;
    isCorrected: boolean;
}

export type Correction = {
    id: number;
    score: number;
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

export type StudentGradesResponse = {
    subject: {
        id: number;
        title: string;
        endDate: Date;
        startDate: Date;
        classroom: {
            id: number;
            name: string;
        };
    };
    students: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        submission: {
            id: number;
            fileUrl: string;
            submittedAt: Date;
            isCorrecting: boolean;
            isCorrected: boolean;
            correction: {
                score: number | null;
                notes: string | null;
                correctedAt: Date;
            } | null;
        } | null;
    }[];
}