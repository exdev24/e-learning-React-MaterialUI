import { CreditType, ReferralCredits } from 'cl-common';
import {
  ClassModel,
  CourseModel,
  CreditModel,
  EnrollmentModel,
  StudentModel,
  UserModel
} from 'cl-models';
import { nanoid } from 'nanoid';
import requestIP from 'request-ip';
import { Op, UniqueConstraintError } from 'sequelize';
import { MutationArgs } from '../../../types';
import { emitExpressSignupEvent, emitSignupEvent } from '../../lib/event-bus';
import { normalizeName } from '../../lib/name-parser';
import {
  getValidTimezone,
  validateEmail,
  validatePhoneNumber
} from '../../lib/validator';
import sequelize from '../../sequelize';
import { GraphqlContext } from '../index';

interface UserProps
  extends Pick<
    UserModel,
    | 'email'
    | 'phoneNumber'
    | 'password'
    | 'firstName'
    | 'lastName'
    | 'referralCode'
    | 'details'
    | 'affiliateId'
    | 'refererId'
  > {
  children?: Pick<StudentModel, 'name' | 'year'>[];
  credits?: Pick<CreditModel, 'cents' | 'type' | 'details'>[];
}

async function buildUser(args: MutationArgs.SignUp, ctx: GraphqlContext) {
  const userProps: UserProps = {
    email: args.email.trim(),
    password: args.password,
    ...normalizeName(args.name),
    referralCode: nanoid(8),
    details: getUserDetails(args, ctx)
  };

  const [isValidEmail, errorMessage] = await validateEmail(userProps.email);
  if (!isValidEmail) {
    ctx.badRequest('Signup Failed', {
      email: errorMessage
    });
  }

  if (args.phoneNumber) {
    const [isValidPhoneNumber, phoneNumber] = validatePhoneNumber(
      args.phoneNumber,
      args.countryCode
    );
    if (isValidPhoneNumber) {
      userProps.phoneNumber = phoneNumber;
    } else {
      ctx.badRequest('Signup Failed', {
        phoneNumber: 'Not a valid mobile phone number'
      });
    }
  }

  if (args.childName) {
    userProps.children = [
      {
        name: args.childName,
        year: args.year > 0 ? args.year : null
      }
    ];
  }

  const referer = await getReferer(args, ctx);
  if (referer) {
    userProps.refererId = referer.id;
    userProps.credits = [
      {
        cents: ReferralCredits.signup,
        type: CreditType.Welcome,
        details: {
          reason: 'Referral bonus for new user',
          createdBy: 'signup',
          attribution: {
            userId: referer.id,
            classId: args.classId
          }
        }
      }
    ];
  }

  return new UserModel(userProps, {
    include: [CreditModel, { model: StudentModel, as: 'children' }]
  });
}

export async function signUp(
  root: any,
  args: MutationArgs.SignUp,
  ctx: GraphqlContext
) {
  const user = await buildUser(args, ctx);
  const logger = ctx.logger.child({ mutation: 'signUp', userId: user.id });

  let enrollment: EnrollmentModel;

  const tx = await sequelize.transaction();

  try {
    await user.save({ transaction: tx });

    if (user.children && user.children.length > 0 && args.classId) {
      const student = user.children[0];
      const klass = await ClassModel.findByPk(args.classId, {
        rejectOnEmpty: true,
        include: [CourseModel]
      });

      if (!klass.course.isTrial) {
        ctx.badRequest(
          'express checkout only supports introductory class',
          klass.details
        );
      }

      enrollment = await EnrollmentModel.create(
        {
          classId: args.classId,
          studentId: student.id,
          source: args.source,
          campaign: args.campaign
        },
        {
          transaction: tx
        }
      );
    }

    await tx.commit();

    logger.info(
      { userId: user.id, classId: args.classId, success: true },
      'account created'
    );

    if (enrollment) {
      await emitExpressSignupEvent(user, enrollment);
    } else {
      await emitSignupEvent(user);
    }

    ctx.setIdentity(user);

    return user;
  } catch (err) {
    await tx.rollback();

    if (err instanceof UniqueConstraintError) {
      if ('email' in err.fields) {
        ctx.badRequest('Email already taken', {
          email: 'This email address is already taken, try login instead'
        });
      }

      if ('phoneNumber' in err.fields) {
        ctx.badRequest('Phone number already taken', {
          phoneNumber: 'This phone number is already taken, try login instead'
        });
      }
    }

    throw err;
  }
}

function getUserDetails(
  args: MutationArgs.SignUp,
  ctx: GraphqlContext
): UserModel['details'] {
  const sources: string[] = [];
  if (args.campaign) {
    sources.push(args.campaign);
  }
  if (args.source) {
    sources.push(args.source);
  }

  return {
    lastLogin: new Date(),
    landing: args.landing || ctx.req.path,
    clientIp: requestIP.getClientIp(ctx.req),
    timezone: getValidTimezone(args.timezone),
    source: sources.join(' ')
  };
}

async function getReferer(args: MutationArgs.SignUp, ctx: GraphqlContext) {
  const ref = args.inviter || ctx.req.session.ref;
  if (ref) {
    return UserModel.findOne({
      where: {
        [Op.or]: {
          email: ref.trim().toLowerCase(),
          referralCode: ref.trim()
        }
      }
    });
  }
}
