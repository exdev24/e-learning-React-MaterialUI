import { Step, StepLabel, Stepper, Typography } from '@material-ui/core';
import { ApolloError } from 'apollo-client';
import React from 'react';
import { useAlert } from 'react-alert';
import { getPriceBreakdown, PriceBreakdown } from '../../shared/pricing';
import { Promotion } from '../../types/common';
import { parseErrorMessage } from '../graphql/apollo';
import { ClassWithCourse, Student } from '../graphql/data-models';
import { GetUserWithClassResponse } from '../graphql/enrollment-queries';
import { logEvent } from '../lib/analytics';

interface InputProps extends GetUserWithClassResponse {
  wholePackage?: boolean;
  children: React.ReactNode;
}

interface ContextProps {
  activeStep: number;
  handleGoNext: () => void;
  handleGoBack: () => void;
  coupon?: Promotion;
  resetCoupon: () => void;
  setCoupon: (coupon?: Promotion) => void;
  student: Student;
  selectStudent: (student: Student) => void;
  handleError: (err: ApolloError) => void;
  klasses: ClassWithCourse[];
  toggleAddon: (klass: ClassWithCourse, checked: boolean) => void;
  priceBreakdown: PriceBreakdown;
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

  let defaultStudent: Student = null;
  for (const child of user.children) {
    if (klass.studentIds.indexOf(child.id) < 0) {
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
      ? ['Confirm student', 'Make Payment', 'Complete']
      : ['Confirm student', 'Complete'];

  const title = wholePackage
    ? `${klass.course.subject.name} (Units 1 - ${klass.course.subject.exitLevel})`
    : `${klass.course.name} Class`;

  const klasses = [klass, ...addons];

  return (
    <>
      <Typography color="primary" variant="h5" align="center">
        {title}
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
            if (activeStep > 0) {
              setActiveStep(activeStep - 1);
            }
          },
          handleGoNext() {
            if (activeStep < steps.length - 1) {
              setActiveStep(activeStep + 1);
            }
          },
          coupon,
          setCoupon,
          resetCoupon() {
            setCoupon(klass.offer);
          },
          student,
          selectStudent,
          handleError(err) {
            alert.error(parseErrorMessage(err), {
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
          klasses,
          priceBreakdown:
            klass.course.price === 0
              ? {
                  listingPrice: 0,
                  price: 0,
                  usedCredit: 0,
                  promoDiscount: 0,
                  courseDiscount: 0
                }
              : getPriceBreakdown(klasses, {
                  balanceInCents: user.balanceInCents,
                  promotion: coupon,
                  wholePackage
                })
        }}
      >
        {children}
      </CheckoutContext.Provider>
    </>
  );
}
