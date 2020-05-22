import Boom from 'boom';
import { CreditType, defaultTimezone, ReferralCredits } from 'common';
import {
  AffiliateModel,
  ClassModel,
  CourseModel,
  CreditModel,
  EnrollmentModel,
  StudentModel,
  UserModel
} from 'models';
import { addBreadcrumb } from 'sentry';
import { Request } from 'express';
import { IANAZone } from 'luxon';
import { nanoid } from 'nanoid';
import requestIP from 'request-ip';
import { Op } from 'sequelize';
import { MutationArgs } from '../../../types';
import { validateEmail } from '../../emails/sendgrid';
import { emitExpressSignupEvent, emitSignupEvent } from '../../lib/event-bus';
import { createLogger } from '../../lib/logger';
import { normalizeName } from '../../lib/name-parser';
import { setIdentity } from '../../middlewares/auth';
import sequelize from '../../sequelize';

interface UserProps
  extends Pick<
    UserModel,
    | 'email'
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

async function getUserProps(args: MutationArgs.SignUp, req: Request) {
  const sources: string[] = [];
  if (args.campaign) {
    sources.push(args.campaign);
  }
  if (args.source) {
    sources.push(args.source);
  }

  const userProps: UserProps = {
    email: args.email,
    password: args.password,
    ...normalizeName(args.name),
    referralCode: nanoid(8),
    details: {
      source: sources.join(' '),
      lastLogin: new Date(),
      landing: args.landing || req.path,
      clientIp: requestIP.getClientIp(req),
      timezone: IANAZone.isValidZone(args.timezone) ? args.timezone : defaultTimezone
    }
  };

  if (args.childName) {
    userProps.children = [
      {
        name: args.childName,
        year: args.year > 0 ? args.year : null
      }
    ];
  }

  const [affiliate, referer] = await Promise.all([
    getAffiliate(req, args),
    getReferer(req, args)
  ]);

  if (affiliate) {
    userProps.affiliateId = affiliate.id;
  } else if (referer) {
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

  return userProps;
}

export async function signUp(root: any, args: MutationArgs.SignUp, req: Request) {
  const fLogger = createLogger('signUp', {});

  const { rejected, errorMessage } = await validateEmail({
    email: args.email,
    source: 'signup'
  });

  if (rejected) {
    fLogger.warn({ payload: args }, errorMessage);
    throw Boom.badRequest('fail to signup', {
      email: errorMessage
    });
  }

  let user: UserModel;
  let enrollment: EnrollmentModel;

  const userProps = await getUserProps(args, req);
  const tx = await sequelize.transaction();

  try {
    user = await UserModel.create(userProps, {
      include: [CreditModel, { model: StudentModel, as: 'children' }],
      transaction: tx
    });

    fLogger.info({ userId: user.id }, '%s signed up an account', user.email);

    if (user.children && user.children.length > 0 && args.classId) {
      const student = user.children[0];
      const klass = await ClassModel.findByPk(args.classId, {
        rejectOnEmpty: true,
        include: [CourseModel]
      });

      if (!klass.course.isTrial) {
        throw Boom.badRequest(
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

      fLogger.info(
        { classId: args.classId, userId: user.id },
        '%s enrolled class %s',
        user.email,
        klass.course.name
      );
    }

    await tx.commit();

    if (enrollment) {
      await emitExpressSignupEvent(user, enrollment);
    } else {
      await emitSignupEvent(user);
    }

    setIdentity(req, user);
    return user;
  } catch (err) {
    await tx.rollback();

    addBreadcrumb({
      message: 'signup failed',
      data: args
    });

    throw err;
  }
}

async function getAffiliate(req: Request, args: MutationArgs.SignUp) {
  const ref = args.inviter || req.session.ref;
  if (ref) {
    return AffiliateModel.findOne({
      where: {
        code: ref.trim()
      }
    });
  }
}

async function getReferer(req: Request, args: MutationArgs.SignUp) {
  const ref = args.inviter || req.session.ref;
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
