import { List, ListItem, ListItemText } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import React from 'react';

interface Bullet {
  title: string;
  icon: string;
  description: string;
}

export const AlternativeBullets: Bullet[] = [
  {
    title: 'Interesting and fun',
    icon: '/images/fun-exciting.png',
    description:
      "Your kids will be jumping out of their skin in excitement to discover the amazing wonders of STEM—guaranteed! That's why we offer a <strong>100% money-back satisfaction guarantee!</strong>"
  },
  {
    title: 'Develop grown up skills',
    icon: '/images/life-long-skills.png',
    description:
      "Our classes nurture creativity, critical thinking and problem solving—the most important skills for the future according to the <a href='https://www.weforum.org/agenda/2016/01/the-10-skills-you-need-to-thrive-in-the-fourth-industrial-revolution/' target='_blank'>World Economic Forum</a>. We won't just give your kids a list of instructions to follow, we'll guide them through the process of finding solutions on their own!"
  },
  {
    title: 'More free time for parents',
    icon: '/images/great-teachers.png',
    description:
      "Full-time working parent? Our 50-minute long sessions can be taken from anywhere you want so traffic won't get in the way of your kids' education and you won't have to deplete your 'me time' funds."
  },
  {
    title: 'Curriculum built by experts',
    icon: '/images/cutting-edge.png',
    description:
      "All classes have been designed by industry experts (PhD's from top American Universities) to make STEM fun and interesting for kids <u>even if they think it is the most boring thing on Earth</u>"
  }
];

export const keyBullets: Bullet[] = [
  {
    title: 'Cutting-edge Curriculum',
    icon: '/images/cutting-edge.png',
    description:
      'Developed by tech and education experts, your children will learn state-of-art computer technologies in age appropriate ways.'
  },
  {
    title: 'Great Teachers',
    icon: '/images/great-teachers.png',
    description:
      "Your children's future is important. So why learn with machines, videos, or apps? Learn with great teachers with live instruction, the most effective way of learning."
  },
  {
    title: 'Fun & Exciting',
    icon: '/images/fun-exciting.png',
    description:
      'Your child will have some of the most joyful and exciting learning experiences. You know they learn best when it is fun and motivating.'
  },
  {
    title: 'Lifelong Skills',
    icon: '/images/life-long-skills.png',
    description:
      'Our classes are designed for the ground up to nurture creativity, critical thinking, and problem solving—the most important skills for the future.'
  }
];

const Icon = styled('div')({
  flex: '0 auto',
  textAlign: 'center',
  paddingRight: 16,
  minWidth: 80
});

export default function TalkingPoints(props: { bullets: Bullet[] }) {
  return (
    <List disablePadding>
      {props.bullets.map((bullet, idx) => (
        <ListItem key={idx} disableGutters>
          <Icon>
            <img
              src={bullet.icon}
              style={{ height: 48, width: 'auto' }}
              alt={bullet.title}
            />
          </Icon>
          <ListItemText
            primary={
              <>
                <strong>{bullet.title} - </strong>
                <span dangerouslySetInnerHTML={{ __html: bullet.description }} />
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
