import React from 'react';
import { Container } from '@material-ui/core';
import EmbedVideo from '../client/components/embed-video';
import PressRelease from '../client/components/press-release';

const article = `
<p>(Palo Alto) June 24, 2020 -- <a href="https://www.create-learn.us/">Create & Learn</a>, the first company to teach computer science in small online groups, today announces raising its seed round of funding to hire more instructors and take on more students and expand across the US and, eventually, worldwide. Built from the ground up on small group, project based online learning, Create & Learn has a 2.5 year head-start with its <a href="https://www.youtube.com/watch?v=LygU_bXX9zg&feature=emb_logo">innovative approach</a> to teaching online in the COVID-19 era.  Led by one of the founding members of the Google Cloud Platform, computer science Ph.d and Stanford MBA, <a href="https://www.linkedin.com/in/jessie-jiang-81879/">Jessie Jiang</a> was first inspired to develop Create & Learn's curriculum by teaching computer science to her six-year-old daughter and seeing the enormous gaps between innovation in the real world and what was being taught in K-12 computer science.</p>
<p>"We saw the huge potential of live online interactive learning 2.5 years ago," said Jessie Jiang, CEO and founder of Create & Learn. "COVID-19 has accelerated online learning 10 years in the last three months and we're excited to be leading the innovation in online learning combined with project and inquiry based learning. They keep kids motivated while at the same time build well rounded skills in creativity and critical thinking. We're thrilled to be supported by GSV Ventures, a truly visionary fund focused on the future of education. Instead of simply teaching kids to code, we provide our students with a holistic tech education so they can understand where innovation fits into their future regardless of their career path."</p>
<p>"The Coronavirus has instantly forced 1.6B students and teachers, more than 90% of learners and educators around the world, to go online. It has forever changed the landscape of digital learning, which will reach ~$1 Trillion by 2027," said Michael Moe from GSV Ventures."We're excited to help grow Create & Learn, which with its head start has created one of the truly unique and effective approaches to online learning available to today's student."</p>
<h4>What sets Create & Learn apart</h4>
<p>Create & Learn is not another learn-to-code factory. "We're teaching state of the art technology, we're teaching students how things are done in the real world, as well as the aspect of being interdisciplinary, nobody does that," Jiang said. "Our AI Explorers program is the first to teach 4-6 graders AI comprehensively with an age appropriate approach.  We've been doing that since day one two and a half years ago." Create & Learn's value proposition is more appealing to forward thinking parents whose goal is not to have their child become another coder, but rather to become a leader in his/her respective career with a deep understanding of technology. "Parents can sign up their child for a number of free introductory classes to nurture their child's interests and get a feel of the broad computer science space. We also believe teachers have a crucial role in great education, that's why we decided to only offer small, live classes from the day we launched." Create & Learn instructors are highly experienced teachers from K-12 schools, top universities like Stanford, and Teach for America, all of whom are very passionate about computer science and do not consider teaching as a temporary summer job. "Our program has been taught in top public and private schools in California, which are also indicative of the high quality learning we offer." Jiang said.</p>
<h4>About Create & Learn</h4>
<p>Started by Jessie Jiang, Ph.D from UCLA (with Internet pioneer and National Medal of Science winner Dr. Kleinrock), Stanford MBA,  and a founding member of the Google Cloud Platform, Create & Learn launched in 2017 to change the way STEM is taught online.  Focusing on small group, project based learning, Create & Learn focuses on teaching K-12 students with a holistic approach to make innovations like A.I., data science and animation applicable to wherever their future takes them.</p>
`;

export default function RaisesSeedFounding() {
  return (
    <PressRelease
      hero={
        <Container maxWidth="sm" style={{ marginBottom: 40 }}>
          <EmbedVideo src="https://www.youtube.com/watch?v=LygU_bXX9zg" />
        </Container>
      }
      title="Create & Learn Raises $1.7M Led By GSV Ventures Teaching STEM To Kids"
      subtitle="Former Google Cloud founding member focuses on project based, small group learning"
      article={article}
    />
  );
}
