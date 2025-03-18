import { Role } from './entities';

export type CreateUserDto = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    classroomId?: number;
}

export type UpdateUserDto = Partial<CreateUserDto>;

export type CreateSubjectDto = {
    title: string;
    description?: string;
    fileUrl: string;
    startDate: Date;
    endDate: Date;
    teacherId: number;
}

export type UpdateSubjectDto = Partial<CreateSubjectDto>;

export type CreateSubmissionDto = {
    fileUrl: string;
    studentId: number;
    subjectId: number;
}

export type CreateCorrectionDto = {
    score?: number;
    notes?: string;
    submissionId: number;
}

export type UpdateCorrectionDto = Partial<Omit<CreateCorrectionDto, 'submissionId'>>;

export type CreateClassroomDto = {
    name: string;
    description?: string;
}

export type UpdateClassroomDto = Partial<CreateClassroomDto>; 