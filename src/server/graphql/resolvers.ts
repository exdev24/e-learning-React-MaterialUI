import { defaultAvatarUrl } from 'cl-common';
import { CourseModel, SubjectModel, TeacherModel } from 'cl-models';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';
import fetchFutureClasses from '../lib/class-query-helper';
import { catalogStore } from '../lib/dataloader';
import ClassQuery from './class-query';
import ClassroomQuery from './classroom-query';
import editProfile from './mutation/edit-profile';
import { enrollClass, enrollTrial } from './mutation/enroll-class';
import { generateCertificate } from './mutation/generate-certificate';
import {
  addComment,
  addProjectThread,
  addThread,
  deleteComment,
  deleteThread
} from './mutation/manage-classroom';
import { inviteFriend } from './mutation/manage-contacts';
import {
  cancelEnrollment,
  rescheduleEnrollment
} from './mutation/manage-enrollments';
import { forgotPassword, resetPassword } from './mutation/manage-passwords';
import {
  addProject,
  addReaction,
  deleteProject,
  deleteReaction,
  editProject
} from './mutation/manage-projects';
import { addStudent, editStudent, removeStudent } from './mutation/manage-students';
import signIn from './mutation/sign-in';
import { signUp } from './mutation/sign-up';
import ProjectQuery from './project-query';
import RootQuery from './root-query';
import StudentQuery from './student-query';
import UserQuery from './user-query';

export default {
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  Query: RootQuery,
  Class: ClassQuery,
  Classroom: ClassroomQuery,
  Project: ProjectQuery,
  Student: StudentQuery,
  User: UserQuery,

  Subject: {
    courses(s: SubjectModel) {
      return s.courses.filter(c => c.level >= 0);
    }
  },

  Course: {
    subject(c: CourseModel) {
      return catalogStore.getSubjectById(c.subjectId);
    },

    upcomingClasses(c: CourseModel, args: { camps: boolean }) {
      return fetchFutureClasses({ courseId: c.id, camps: args.camps });
    }
  },

  Teacher: {
    avatar(t: TeacherModel) {
      return t.avatar || defaultAvatarUrl;
    }
  },

  Mutation: {
    signIn,
    signUp,
    editProfile,
    addStudent,
    editStudent,
    removeStudent,
    enrollClass,
    enrollTrial,
    cancelEnrollment,
    rescheduleEnrollment,
    resetPassword,
    forgotPassword,
    inviteFriend,
    addProject,
    editProject,
    deleteProject,
    addReaction,
    deleteReaction,
    addThread,
    addProjectThread,
    deleteThread,
    addComment,
    deleteComment,
    generateCertificate
  }
};
