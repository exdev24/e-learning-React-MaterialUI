import { commonRoutes, Topic } from 'cl-common';

export const CLASSES = 'classes';
export const fontFamily = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
].join(',');

export const passwordResetTokenTTL = 30; // in minutes

export const routePrefixes = {
  enrollClass: '/enroll/class/',
  enrollPackage: '/enroll/package/',
  myClasses: '/my-classes/',
  myProjects: '/my-projects/',
  maker: '/mp/',
  ref: '/ref/',
  topic: '/topic/',
  classroom: '/classroom/',
  project: '/project/'
};

export const routeIds = {
  signin: commonRoutes.signin,
  signout: commonRoutes.signout,
  signup: commonRoutes.signup,
  tos: commonRoutes.terms,
  privacy: commonRoutes.privacy,
  forgotPassword: commonRoutes.forgotPassword,
  refer: commonRoutes.refer,
  classroom: routePrefixes.classroom + '[cid]/[sid]',
  project: routePrefixes.project + '[id]',
  maker: routePrefixes.maker + '[id]',
  enrollClass: routePrefixes.enrollClass + '[cid]',
  enrollPackage: routePrefixes.enrollPackage + '[cid]',
  ref: routePrefixes.ref + '[code]',
  topic: routePrefixes.topic + '[id]',
  about: '/about',
  account: '/account',
  accountSettings: '/account/settings',
  payments: '/account/payments',
  technews: '/technews-for-kids',
  camp: '/camp',
  catalog: '/catalog',
  career: '/career',
  vschool: '/vschool'
};

export const Pdfs = {
  Catalog2020: 'https://cdn.create-learn.us/Catalog+2020+Create+%26+Learn.pdf',
  TeacherBrochure: 'https://cdn.create-learn.us/Teacher+Brochure.pdf',
  TeacherCatalog: 'https://cdn.create-learn.us/Teacher+Catalog.pdf'
};

export const listedTopics = [
  Topic.SN,
  Topic.JROBO,
  Topic.AI,
  Topic.MOBILE,
  Topic.DS,
  Topic.MC,
  Topic.AS,
  Topic.ROBO,
  Topic.DESIGN,
  Topic.WEB,
  Topic.PY,
  Topic.JAVA,
  Topic.BIO,
  Topic.WEBINARS
];

export const scratchJuniorId = 'scratch_junior';

export const trialList = [
  scratchJuniorId,
  'scratch_0',
  'ai-explorers_0',
  'data-science_0',
  'design_0',
  'minecraft_0',
  'python_0',
  'ascratch_0'
];

export const salesList = [
  'scratch_1',
  'ai-explorers_1',
  'mobile_1',
  'robots_1',
  'design_1',
  'minecraft_1',
  'python_1',
  'ascratch_1'
];

export const mediaTypes = {
  'image/jpeg': ['jpeg', 'jpg', 'jpe'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'video/mp4': ['mp4', 'mp4v', 'mpg4'],
  'video/quicktime': ['qt', 'mov'],
  'video/webm': ['webm']
};

export const contactEmail = 'info@createandlearn.us';
export const twitterHandle = 'CreateLearnSTEM';

export const defaultCoverUrl = 'https://cdn.create-learn.us/images/robot-banner.png';
export const defaultBannerUrl = 'https://cdn.create-learn.us/images/home-banner.jpg';
export const preferenceFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSc-ipOk2q6uyAMm30L6UTRo3Lz4bNbz_oDiIz_ukkCOqUKahg/viewform';
export const blogUrlForYoungChild =
  'https://blog.create-learn.us/2019/11/23/top-5-free-sites-to-help-elementary-and-middle-schoolers-learn-to-code-recommended-by-create-and-learn/';

export const sampleQuestions = [
  'How long did it talke you to make this project?',
  'What was your inspiration?',
  'What technologies do you use in this project?'
];
