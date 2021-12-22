import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import React from 'react';
import Layout from '../../client/components/layout';
import MainSection from '../../client/components/main-section';

interface Section {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
}
interface Job {
  role: string;
  location: string;
  sections: Section[];
}

const openings: Job[] = [
  {
    role: 'Lead Curriculum Designer (Computer Science)',
    location: 'Full time/Part Time, Bay Area Preferred',
    sections: [
      {
        paragraphs: [
          'Are you passionate about STEM education? Do you want to inspire young students with opportunities of the future while leading them through fun and rigorous learning? Do you enjoy learning yourself and want to expand your own horizon? If so, this could be the perfect opportunity for you.',
          'We are looking for a candidate with strong K-12 STEM education background to lead our curriculum design efforts. Our portfolio of classes already include AI, Data Science, and Coding. We would like to expand it significantly to cover more discipline areas and more grade levels. The lead curriculum designer will play the critical role of identifying and working closely with domain experts and bringing in her/his own education and curriculum expertise to create these curriculum.',
          'As the lead curriculum designer, you will be responsible for the end to end process of creating top-quality curricula. Your responsibilities include, but are not limited to'
        ],
        bullets: [
          'Refine curriculum strategy, identify key areas to expand, and prioritize.',
          'Seek domain/industrial experts to form core teams for each curriculum.',
          'Work with experts to create draft curriculum.',
          'Iterate with teacher and user community to test and refine the curriculum.',
          'Develop materials for teacher training.',
          'Work with teacher leads to identify and train teachers to roll out the curriculum.'
        ]
      },
      {
        title: 'Requirements',
        bullets: [
          'Passionate about education and STEM',
          'Good conceptual understanding of computer science and solid foundational coding skills (understanding of at least 1 programming languages such as Python, JS, …)',
          'Previous experiences in working with students of grades 4-9',
          'Strong prior experiences in curriculum design (5+ years required for the senior role)',
          'Great communication and interpersonal skills. Ability to work with diverse groups of teachers, domain experts effectively',
          'Highly motivated, creative, and great problem solving skills'
        ]
      },
      {
        title: ' Nice to Have',
        bullets: [
          'Background in art and design, professional development, and program management'
        ]
      }
    ]
  },
  {
    role: 'Senior Strategic Partnership Manager (Education)',
    location: 'Full Time, San Francisco Bay Area',
    sections: [
      {
        paragraphs: [
          'Are you passionate about STEM education, relationship building, and breaking new ground? If so, this is a great opportunity for you.',
          'We are seeking a senior partnership manager with tremendous partnership and project management skills to take a lead on our partnership development. This may include a variety of organizations, businesses, and nonprofits that could work with us to create better content and learning experiences for our students.',
          'As a Senior Strategic Partnership Manager, some of your key responsibilities are'
        ],
        bullets: [
          'Take a lead in defining the partnership strategy and execution.',
          'Establish, manage, and continue to grow partnership relationships with a wide range of ecosystem players.',
          'Continue to refine and codify the processes for all stages of the partner lifecycle.',
          "Identify market trends and growth potential for each potential partnership, allocating the appropriate amount of resources needed to realize each partnership's promise.",
          'Shore up the cross functional relationships and concretize responsibilities necessary to execute on every aspect of the partnership lifecycle.',
          'Analyze various data sets in order to surface trends and insights, telling a clear story of ROI to our partner organizations.'
        ]
      },
      {
        title: 'Requirements',
        bullets: [
          'Experiences in developing, launching, and managing the success of critical partnerships.',
          'Experiences in education products/programs are required. Would be ideal to have worked with both tech companies and schools.',
          'Strategize, implement, improve, and manage both new and existing ideas and tactics.',
          'A strong relationship builder and communicator.',
          'An exceptional strategic thinker with strong planning, organization, and detail-driven implementation skills.',
          'Comfortable doing high-level, high-stakes work in a fast-paced environment (with thought partnership and collaboration) and proper attention to details.',
          'A minimum of 5 years of professional experiences.'
        ]
      }
    ]
  },
  {
    role: 'Content Marketing Manager / User Researcher',
    location: '(Full time/Part time/Intern)',
    sections: [
      {
        paragraphs: [
          'We are seeking a talented Content Creator/Marketer who is passionate about k12 STEM education to join our team. This position will work with business leaders and stakeholders to turn strategic and technical information into content for use in marketing, business development collateral, web content, multimedia, PR and other communications.',
          'An ideal candidate should be passionate about communicating with users, creative, constantly seeking to engage new audiences, and proactively invests themselves into creative content projects and understanding customer needs.',
          'Familiarity with STEM learning in K12 is a plus.'
        ],
        bullets: [
          'Create original and/or edit content, articles and press releases. Including creating content for blogs, email campaigns, social media, and other content marketing channels.',
          'Continue to seek new and existing channels to promote our content and mission.',
          'Identify customers’ needs and create new topics.',
          'Work closely with the team on content generation ideas and campaigns.',
          'Write clear, persuasive, informative and compelling copy that drives education and awareness to a variety of audiences.',
          'Analyze existing content and identify ways to improve impact and optimize effectiveness.',
          'Understand customers needs and interests through a number of user research channels and methodologies.',
          'Built a network of strong cross-disciplinary influencers and contributors.'
        ]
      },
      {
        title: 'Requirements',
        bullets: [
          'Excellent written and verbal communication skills.',
          'Demonstrates a positive, can-do attitude, thrives in a collaborative and transparent environment, can give and take constructive feedback on a consistent basis.',
          'Experienced in creating compelling social content that appeal to the user base. Previous experiences for products related to kids or teens a plus.',
          'Experiences with coding classes (candidates do not need to code for the role) and covering technologies would be a plus as well.'
        ]
      }
    ]
  },
  {
    role: 'Senior Software Engineer, Full-Stack',
    location: 'Bay Area preferred, remote ok for the right candidate.',
    sections: [
      {
        title: 'The Role',
        paragraphs: [
          'We are looking for a highly motivated engineer to be an early memeber of a team of tech and education experts.'
        ],
        bullets: [
          'Build services and APIs to drive existing and new features for the online teaching platform.',
          'Evolving and optimizing the system to match the best teacher with the student efficiently.',
          'Enable 3rd party to offer quality online education with Create & Learn platform easily and securely, at scale.'
        ]
      },
      {
        title: 'Requirements',
        bullets: [
          '3+ years of industry experience in Frontend, Backend, or Full-Stack Engineering (does not include internships)',
          'Work experience, open-source code, or coursework in any of the following languages: Java, Python, JavaScript/TypeScript, or similar',
          'Evidence of exposure to architectural patterns of a large, high-scale web application (e.g., well-designed APIs, high volume data pipelines, efficient algorithms)',
          'Experience with web development best practices such as A/B testing, continuous integration',
          'Understanding of data structures and problem solving approaches, and ability to articulate trade offs'
        ]
      },
      {
        title: 'Bonus Point',
        bullets: [
          'You are passionate about bringing state of art computer science education to every child around the world.',
          'Past experiences working at early stage startup, comfortable managing your own schedules and delivering quality results.'
        ]
      }
    ]
  },
  {
    role: 'Online Coding Teacher for Kids',
    location: 'Part Time, Anywhere in North America',
    sections: [
      {
        paragraphs: [
          'Are you passionate about computer science education, love teaching kids and being creative? If so, this is for you.',
          'We are looking for multiple passionate, enthusiastic part-time coding teachers who want to share their love of coding with kids. We teach online computer coding classes to grades 3-9.',
          "If you have experience working with children in schools, camps or an after-school environment, and have a background in computer science, we would love to work with you. You don't have to be an expert in computer science, but need to be very comfortable with coding and have the desire and ability to learn. Familiarity with at least one programming language (Python or JavaScripts) is preferred. We will provide training and support for you to learn new skills and succeed in teaching our classes."
        ]
      },
      {
        title: 'Teacher Duties',
        bullets: [
          'Lead small groups of students in the online classroom using onlineclassroom software to teach the curriculum provided by Create & Learn',
          'Ability to adapt curriculum and lesson structure to support any technical or social demands that may arise during program',
          'This is a part-time job: classes are 1.5-2 hours each. Time requirements are flexible.'
        ]
      },
      {
        title: 'Teaching Style Requirements',
        bullets: [
          'Passionated interactive teaching using online audio and video',
          'Hands-on demonstration of projects and exercises',
          'Teaching with inspiration and empowering students'
        ]
      },
      {
        title: 'Qualifications',
        bullets: [
          'Confident, energetic, creative',
          'Effective class management skills to lead a class of high energy students',
          '3+ year of teaching experiences (middle school & high school preferred)',
          'College degree (doesn’t need to be in computer science)',
          'At least one year of teaching coding or having taken college-level computer science classes',
          'Experience in afterschool/camp setting/leading a classroom preferable',
          'Able to work independently and communicate via emails and phone on a regular basis',
          'Access to reliable high-speed Internet access and computer that can support video conferencing',
          'Valid background check'
        ]
      },
      {
        title: 'Pay',
        paragraphs: ['Competitive hourly pay based on experience and qualifications']
      }
    ]
  }
];

export default class Career extends React.PureComponent {
  renderSection(sec: Section, secId: number) {
    if (!sec.bullets && !sec.paragraphs) {
      return null;
    }

    return (
      <section key={secId}>
        {sec.title && (
          <Typography variant="subtitle1" gutterBottom>
            <strong>{sec.title}</strong>
          </Typography>
        )}
        {sec.paragraphs &&
          sec.paragraphs.map((text, idx) => (
            <Typography key={idx} paragraph>
              {text}
            </Typography>
          ))}
        {sec.bullets && (
          <Typography component="ul" variant="body1" gutterBottom>
            {sec.bullets.map((text, idx) => (
              <li key={idx}>{text}</li>
            ))}
          </Typography>
        )}
      </section>
    );
  }

  renderRole(job: Job, jobId: string) {
    return (
      <Card key={jobId} id={jobId} style={{ marginBottom: 40 }}>
        <CardHeader title={job.role} subheader={job.location} />
        <Divider />
        <CardContent>{job.sections.map(this.renderSection, this)}</CardContent>
      </Card>
    );
  }
  render() {
    const jobIdPrefix = 'job';

    return (
      <Layout basic title="Careers">
        <MainSection
          maxWidth="md"
          header={
            <Typography variant="h5" color="primary">
              About Create & Learn
            </Typography>
          }
        >
          <Typography paragraph>
            {`As the pace of innovation accelerates, it is imperative for students to start learning technologies that power our world at an early age. At Create & Learn, we address this urgent need by teaching students state-of-art technologies such as AI and data science. Moreover, we place a strong focus on real world applications and problem solving, as well as developing students' creativity and critical thinking skills.`}
          </Typography>
          <Typography paragraph>
            {`We are headquartered in the Bay Area and our students join us from all over the United States and around the world. Founded by former Google Product Management Director and early Tech Lead at Uber, we are a portfolio company of GSV Ventures - a leader in education investment and also a Stanford StartX company, which supports Stanford's best Tech and MedTech entrepreneurs.`}
          </Typography>
          <Typography paragraph>
            Interested? We love hearing from you. Please email your resume and a
            short description of your interest to hiring@createandlearn.us.
          </Typography>
        </MainSection>
        <MainSection
          maxWidth="md"
          header={
            <Typography variant="h5" color="primary">
              Current Openings
            </Typography>
          }
        >
          <List disablePadding component="div">
            {openings.map((job, idx) => (
              <ListItem
                key={idx}
                button
                component="a"
                href={'#' + jobIdPrefix + idx}
              >
                <ListItemText
                  primary={job.role}
                  primaryTypographyProps={{ color: 'secondary' }}
                />
              </ListItem>
            ))}
          </List>
        </MainSection>
        <MainSection maxWidth="md">
          {openings.map((role, idx) => this.renderRole(role, jobIdPrefix + idx))}
        </MainSection>
      </Layout>
    );
  }
}
