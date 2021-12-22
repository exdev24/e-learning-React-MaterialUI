import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import React from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from '../../shared/i18n';
import { Promotion } from '../../types/common';
import { parseErrorMessage } from '../graphql/apollo';
import { ClassWithCourse } from '../graphql/data-models';
import {
  ChildWithEnrollStats,
  GetUserWithClassResponse
} from '../graphql/enrollment-queries';
import { logEvent } from '../lib/analytics';
import { getUserTraits } from '../lib/user-source';

interface InputProps extends GetUserWithClassResponse {
  wholePackage?: boolean;
  children: React.ReactNode;
}

interface ContextProps {
  activeStep: number;
  source?: string;
  campaign?: string;
  handleGoNext: () => void;
  handleGoBack: () => void;
  coupon?: Promotion;
  resetCoupon: () => void;
  setCoupon: (coupon?: Promotion) => void;
  student: ChildWithEnrollStats;
  selectStudent: (student: ChildWithEnrollStats) => void;
  klasses: ClassWithCourse[];
  toggleAddon: (klass: ClassWithCourse, checked: boolean) => void;
  handleError: (data: string | Error) => void;
}

const defaultState: any = {};
export const CheckoutContext = React.createContext<ContextProps>(defaultState);

export function CheckoutProvider({
  user,
  wholePackage,
  klass,
  children
}: InputProps) {
  const alert = useAlert();
  const { t } = useTranslation('checkout');
  const userTraits = getUserTraits();

  let defaultStudent: ChildWithEnrollStats = null;
  for (const child of user.children) {
    if (!child.enrollStats.hasEnrolled) {
      defaultStudent = child;
      break;
    }
  }

  const [activeStep, setActiveStep] = React.useState(0);
  const [student, selectStudent] = React.useState(defaultStudent);
  const [coupon, setCoupon] = React.useState<Promotion>();
  const [addons, setAddons] = React.useState(
    wholePackage && klass.series ? klass.series : []
  );

  React.useEffect(() => {
    const courseIds = [klass.courseId];
    if (wholePackage && klass.series) {
      logEvent('InitiateCheckout', {
        content_name: klass.course.subject.name,
        content_ids: courseIds.concat(klass.series.map(k => k.courseId)),
        content_type: 'product_group'
      });
    } else {
      logEvent('InitiateCheckout', {
        content_name: klass.course.name,
        content_ids: courseIds,
        content_type: 'product'
      });
    }

    if (klass.offer) {
      setCoupon(klass.offer);
    }
  }, [klass, wholePackage]);

  const steps =
    klass.course.price > 0
      ? [t('step.confirm'), t('step.purchase'), t('step.complete')]
      : [t('step.confirm'), t('step.complete')];

  const klasses = [klass, ...addons];

  return (
    <>
      <Typography color="primary" variant="h5" align="center">
        {wholePackage
          ? t('title.package', klass.course.subject)
          : t('title.class', klass.course)}
      </Typography>
      <Stepper activeStep={activeStep} style={{ margin: '2em 0' }} alternativeLabel>
        {steps.map((step, idx) => (
          <Step key={idx}>
            <StepLabel>{step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <CheckoutContext.Provider
        value={{
          activeStep,
          handleGoBack() {
            setActiveStep(activeStep - 1);
          },
          handleGoNext() {
            setActiveStep(activeStep + 1);
          },
          source: userTraits.source,
          campaign: userTraits.campaign,
          coupon,
          setCoupon,
          resetCoupon() {
            setCoupon(klass.offer);
          },
          student,
          selectStudent,
          handleError(err) {
            alert.error(typeof err === 'string' ? err : parseErrorMessage(err), {
              timeout: 8000
            });
          },
          toggleAddon(klass, checked) {
            const filtered = addons.filter(cls => cls.id !== klass.id);
            if (checked) {
              filtered.push(klass);
            }
            setAddons(filtered);
          },
          klasses
        }}
      >
        {children}
      </CheckoutContext.Provider>
    </>
  );
}
