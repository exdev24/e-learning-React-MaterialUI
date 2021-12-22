import { useMutation } from '@apollo/react-hooks';
import {
  Box,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import { EmailOutlined } from '@material-ui/icons';
import { canonicalUrl, ReferralCredits } from 'cl-common';
import React from 'react';
import { useAlert } from 'react-alert';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import CLTextInput from '../client/components/cl-text-input';
import ContainerWrapper from '../client/components/container-wrapper';
import Flash from '../client/components/flash';
import Layout from '../client/components/layout';
import TextToCopy from '../client/components/text-to-copy';
import { AccountContext } from '../client/context/account';
import { transformGraphqlError } from '../client/graphql/apollo';
import { InviteFriendMutation } from '../client/graphql/user-queries';
import { logEvent, logPageView } from '../client/lib/analytics';
import { getReferralUrl } from '../client/lib/url-utils';
import { twitterHandle } from '../shared/constants';
import { MutationArgs } from '../types';

const shareMessage = `Checkout ${canonicalUrl}, tech classes your children will love`;
const shareAction = 'Invite Friends';
const totalCredit =
  '$' + (ReferralCredits.attendance + ReferralCredits.purchase) / 100;

export default function ReferFriendPage() {
  const alert = useAlert();
  const { user } = React.useContext(AccountContext);

  const [email, setEmail] = React.useState('');
  const [errors, setErrors] = React.useState({});

  const [inviteFriend, inviteState] = useMutation<string, MutationArgs.InviteFriend>(
    InviteFriendMutation,
    {
      onCompleted() {
        logEvent('Share', {
          label: shareAction,
          variant: 'email'
        });
        alert.info(
          'Thanks for sharing. We will message you when your friend signs up for a class.',
          { timeout: 5000 }
        );
      },
      onError(err) {
        setErrors(transformGraphqlError(err).details);
        setEmail('');
      }
    }
  );

  React.useEffect(() => logPageView('ReferFriend'), []);

  const referralUrl = getReferralUrl(user ? user.referralCode : '');
  const description = `Earn Up to ${totalCredit} Create & Learn Credits`;

  return (
    <Layout
      title="Invite Friends"
      description={description}
      links={[
        {
          key: 'font',
          rel: 'stylesheet',
          href: ' https://fonts.googleapis.com/css?family=Fredoka+One&display=swap'
        }
      ]}
    >
      <ContainerWrapper>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Flash
              title="INVITE FRIENDS!"
              subtitle={description}
              fontFamily="'Fredoka One', cursive"
            />
            <Box p={3} mb={3} style={{ backgroundColor: '#f4f4f4' }}>
              <Typography variant="overline">GIVE THE GIFT OF LEARNING</Typography>
              <Typography variant="h6" style={{ fontWeight: 500 }}>
                Invite Friends and Earn {totalCredit}
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <ul>
                  <li>
                    ${ReferralCredits.attendance / 100} in credit after a friend
                    completes an introductory class
                  </li>
                  <li>
                    ${ReferralCredits.purchase / 100} in credit when a friend enrolls
                    a paid class
                  </li>
                  <li>
                    And, your friends get ${ReferralCredits.signup / 100} toward
                    their first paid class
                  </li>
                </ul>
                <img
                  src="/images/gift-2960891_960_720.jpg"
                  style={{ width: 80, marginLeft: 16, flex: 0 }}
                  alt="Refer a friend"
                />
              </Box>
              <form
                style={{ marginBottom: 40 }}
                onSubmit={evt => {
                  evt.preventDefault();
                  if (email) {
                    return inviteFriend({
                      variables: { email }
                    });
                  }
                }}
              >
                <CLTextInput
                  type="email"
                  name="email"
                  required
                  label="Enter your friend's email address"
                  disabled={inviteState.loading}
                  value={email}
                  errors={errors}
                  onChange={evt => setEmail(evt.target.value)}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton color="secondary" type="submit">
                          <EmailOutlined />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </form>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm>
                  <TextToCopy
                    label="Share Your Invite Link"
                    content={referralUrl}
                    onCopy={() => {
                      logEvent('Share', {
                        label: shareAction,
                        variant: 'CopyCode'
                      });

                      alert.success('Copied', {
                        timeout: 4000
                      });
                    }}
                  />
                </Grid>
                <Grid item xs="auto">
                  <a
                    onClick={() =>
                      logEvent('Share', {
                        label: shareAction,
                        variant: 'Facebook'
                      })
                    }
                  >
                    <FacebookShareButton url={referralUrl} quote={shareMessage}>
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>
                  </a>
                </Grid>
                <Grid item xs="auto">
                  <a
                    onClick={() =>
                      logEvent('Share', {
                        label: shareAction,
                        variant: 'Twitter'
                      })
                    }
                  >
                    <TwitterShareButton
                      url={referralUrl}
                      title={shareMessage}
                      via={twitterHandle}
                    >
                      <TwitterIcon size={40} round />
                    </TwitterShareButton>
                  </a>
                </Grid>
                <Grid item xs="auto">
                  <a
                    onClick={() =>
                      logEvent('Share', {
                        label: shareAction,
                        variant: 'Whatsapp'
                      })
                    }
                  >
                    <WhatsappShareButton url={referralUrl} title={shareMessage}>
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                  </a>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <List dense>
              <ListItem disableGutters>
                <ListItemText
                  primary="How do I increase my credit balance?"
                  secondary="Credit will be automatically applied to your account when"
                />
              </ListItem>
              <ListItem>
                <ListItemText secondary="You sign up for one of our promotions" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="a friend signs up for a trial or paid class" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="and these credits can be combined to increase your balance." />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary="What are some of the restrictions to consider?" />
              </ListItem>
              <ListItem>
                <ListItemText secondary="Credits can only be used for classes at Create & Learn. They cannot be converted into cash." />
              </ListItem>
              <ListItem>
                <ListItemText secondary="Credits expire after 6 months from the date of issue." />
              </ListItem>
              <ListItem>
                <ListItemText secondary="Credits can only be used by the individual for his/own own children and are not transferable to other individuals." />
              </ListItem>
              <ListItem>
                <ListItemText secondary="Friends and families are considered at the household level:  Accounts held separately by parents and children in the same household are not eligible to invite each other to earn credits." />
              </ListItem>
              <ListItem>
                <ListItemText secondary="Any credits received under fraud will be removed from the credit balance." />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </ContainerWrapper>
    </Layout>
  );
}
