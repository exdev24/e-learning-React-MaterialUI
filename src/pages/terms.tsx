import React from 'react';
import Article from '../client/components/article';
import Layout from '../client/components/layout';
import NextMUILink from '../client/components/next-mui-link';
import { contactEmail, routeIds } from '../shared/constants';

const title = 'Terms and Conditions';

export default function TermOfUse() {
  return (
    <Layout basic title={title}>
      <Article title={title}>
        <h4>
          PLEASE READ THESE TERMS OF USE (&#34;AGREEMENT&#34;) CAREFULLY BEFORE USING
          THE SERVICES OFFERED BY CREATE &amp; LEARN Inc. (&#34;COMPANY&#34;).
        </h4>
        <p>
          THESE TERMS EXPLAIN HOW YOU ARE PERMITTED TO USE THE WEBSITE LOCATED AT THE
          URL: WWW.CREATE-LEARNL.COM AS WELL AS ALL ASSOCIATED SITES LINKED TO
          WWW.CREATE-LEARNL.COM BY THE COMPANY, ITS SUBSIDIARIES AND AFFILIATED
          COMPANIES (COLLECTIVELY, THE &#34;Site&#34;) AND THE SERVICES MADE
          AVAILABLE ON OR THROUGH THIS SITE (COLLECTIVELY, THE &#34;Services&#34;).
          BY VISITING THE WEBSITES OR USING THE SERVICES IN ANY MANNER, YOU AGREE
          THAT YOU HAVE READ AND AGREE TO BE BOUND BY AND A PARTY TO THE TERMS AND
          CONDITIONS OF THIS AGREEMENT TO THE EXCLUSION OF ALL OTHER TERMS. IF YOU DO
          NOT UNCONDITIONALLY AGREE TO ALL THE TERMS AND CONDITIONS OF THIS
          AGREEMENT, YOU HAVE NO RIGHT TO USE THE WEBSITE OR SERVICES. ACCESS TO THE
          WEBSITE AND USE OF COMPANY&#39;S SERVICES IS EXPRESSLY CONDITIONED UPON
          YOUR ASSENT TO ALL THE TERMS AND CONDITIONS OF THIS AGREEMENT, TO THE
          EXCLUSION OF ALL OTHER TERMS.
        </p>
        <p>
          This Agreement applies to schools, school districts, and related entities
          and organizations, including but not limited to administrators,
          instructors, and teachers who access or use the Services on their behalf
          (each an &#34;Educational Institution&#34;), as well as all non-
          Educational Institution visitors, users, and others, including students,
          their parents and legal guardians, who use the Services (such individuals
          and Educational Institution, collectively, &#34;you&#34;).
        </p>
        <h4>ACCESS TO THE SERVICES.</h4>
        <p>
          The <strong>create-learn.com</strong> website and domain name and any other
          linked pages, features, content, or application services (including without
          limitation any mobile application services) offered from time to time by
          Company in connection therewith (collectively, the &#34;Website&#34;) are
          owned and operated by Company. Subject to the terms and conditions of this
          Agreement, Company may offer to provide certain services, as described more
          fully on the Website, and that have been selected by you (together with the
          Website, the &#34;Services&#34;), solely for your own use, and not for the
          use or benefit of any third party. The term &#34;Services&#34; includes,
          without limitation, use of the Website, any service Company performs for
          you and the Content (as defined below) offered by Company on the Website.
          Company may change, suspend or discontinue the Services at any time,
          including the availability of any feature, database, or Content. Company
          may also impose limits on certain features and services or restrict your
          access to parts or all of the Services without notice or liability.
        </p>
        <p>
          <strong>
            Company reserves the right, in its sole discretion, to modify this
            Agreement at any time by posting a notice on the Website, or by sending
            you a notice. You shall be responsible for reviewing and becoming
            familiar with any such modifications. Your use of the Services following
            such notification constitutes your acceptance of the terms and conditions
            of this Agreement as modified.
          </strong>
        </p>
        <p>
          <strong>Personal Information</strong>
        </p>
        <p>
          COPPA (Children&#39;s Online Privacy and Protection Act) requires that
          online service providers obtain parental consent before they knowingly
          collect personally identifiable information online from children who are
          under 13. Therefore, we only collect personal information through the
          Services from a child under 13 where that student&#39;s school, district,
          and/or teacher has agreed (via the terms described in the following
          paragraph) to obtain parental consent for that child to use the Services
          and disclose personal information to us or where the parent or legal
          guardian of a child has signed the child up to use the Services. If you are
          a student under 13, please do not send any personal information about
          yourself to us if your school, district, and/or teacher has not obtained
          this prior consent from your parent or guardian or if your parent or
          guardian has not signed you up to use the Service, and please do not send
          any personal information other than what we request from you in connection
          with the Services. If we learn we have collected personal information from
          a student under 13 without parental consent being obtained by his or her
          parent, guardian, school, district, and/or teacher, or if we learn a
          student under 13 has provided us personal information beyond what we
          request from him or her, we will delete that information as quickly as
          possible. If you believe that a student under 13 may have provided us
          personal information in violation of this paragraph, please contact us
          at&nbsp;{contactEmail}
        </p>
        <p>
          <strong>
            If you are signing up for this service and creating accounts on behalf of
            student(s), you represent and warrant that you are either (a) a teacher
            or school administrator or otherwise authorized by a school or district
            to sign up on behalf of students or (b) the parent of such student(s). If
            you are a school, district, or teacher, you represent and warrant that
            you are solely responsible for complying with COPPA, meaning that you
            must obtain advance written consent from all parents or guardians whose
            children under 13 will be accessing the Services. When obtaining consent,
            you must provide parents and guardians with these Terms and our Privacy
            Policy. You must keep all consents on file and provide them to us if we
            request them. If you are a teacher, you represent and warrant that you
            have permission and authorization from your school and/or district to use
            the Services as part of your curriculum, and for purposes of COPPA
            compliance, you represent and warrant that you are entering into these
            Terms on behalf of your school and/or district.
          </strong>
        </p>
        <p>
          <strong>Verification of Identity</strong>
        </p>
        <p>
          You acknowledge that we may make any inquiries, either directly or through
          third parties, that we deem necessary to validate any user&#39;s
          registration information, including without limitation engaging third
          parties to provide identity or other verification services with regard to
          any School (including teacher&#39;s administrators or other personnel
          thereof). The Company reserves all rights to take legal action against
          anyone who misrepresents personal information or is otherwise untruthful
          about their identity in connection with their use of the Services.
          NOTWITHSTANDING THE FOREGOING, YOU ACKNOWLEDGE THAT THE COMPANY CANNOT
          GUARANTEE THE ACCURACY OF ANY INFORMATION SUBMITTED BY ANY USER, OR THE
          IDENTITY OF ANY USER WHO CHOOSES TO USE THE SERVICES.
        </p>
        <h4>Age Restrictions.</h4>
        <p>
          You represent and warrant that you are of legal age to form a binding
          contract (or if not, you&#39;ve received your parent&#39;s or
          guardian&#39;s permission to use the Services and gotten your parent or
          guardian to agree to these Terms on your behalf, as we described earlier,
          and also to agree to these Terms and their own behalf). If you&#39;re
          agreeing to these Terms on behalf of an organization or entity (for
          example, if you&#39;re an administrator agreeing to these Terms on behalf
          of your district), you represent and warrant that you are authorized to
          agree to these Terms on that organization or entity&#39;s behalf and bind
          them to these Terms. You also certify that you are legally permitted to use
          and access the Services and take full responsibility for the selection and
          use of and access to the Services. This Agreement is void where prohibited
          by law, and the right to access the Services is revoked in such
          jurisdictions.
        </p>
        <h4>PRIVACY POLICY.</h4>
        <h3>
          For information regarding Company&#39;s treatment of personally
          identifiable information, please review Company&#39;s current{' '}
          <NextMUILink next={{ href: routeIds.privacy }} title="Privacy Policy">
            Privacy Policy
          </NextMUILink>
          , which is hereby incorporated by reference; your acceptance of this
          Agreement constitutes your acceptance and agreement to be bound by
          Company&#39;s Privacy Policy. Particularly, records that are: (1) directly
          related to a student, and (2) maintained by an educational agency or
          institution or by a party acting for the agency or institution are
          &#34;Education Records&#34; protected by the Family Educational Rights and
          Privacy Act (&#34;FERPA&#34;). FERPA provides that an Educational
          Institution may disclose personally identifiable information from Education
          Records to a provider, like Create &amp; Learn Inc., to perform an
          institutional service or function with a legitimate educational interest in
          the Education Records if certain conditions have been met.
        </h3>
        <h4>Proprietary Rights</h4>
        <h3>
          The Services and its contents are intended solely for the personal,
          non-commercial use of Services by users and may only be used in accordance
          with the terms of this Agreement. All materials displayed or performed on
          the Services (including, but not limited to text, graphics, articles,
          photographs, images, illustrations (also known as the &#34;Content,&#34;
          and which includes User Submissions (as defined below) are protected by
          copyright. You shall abide by all copyright notices, trademark rules,
          information, and restrictions contained in any Content accessed through the
          Services, and shall not use, copy, reproduce, modify, translate, publish,
          broadcast, transmit, distribute, perform, upload, display, license, sell or
          otherwise exploit for any purposes whatsoever any Content or third party
          submissions or other proprietary rights not owned by you: (i) without the
          express prior written consent of the respective owners, and (ii) in any way
          that violates any third party right.
        </h3>
        <h3>
          The Services are protected by copyright as a collective work and/or
          compilation, pursuant to U.S. copyright laws, international conventions,
          and other intellectual property laws. You may not modify, publish,
          transmit, participate in the transfer or sale of, reproduce (except as
          expressly provided in this Section), create derivative works based on,
          distribute, perform, display, or in any way exploit, any of the Content,
          software, materials, or Services in whole or in part.
        </h3>
        <h3>
          You may download or copy the Content (and other items displayed on the
          Services for download) for personal non-commercial use only, provided that
          you maintain all copyright and other notices contained in such Content. You
          shall not store any significant portion of any Content in any form. Copying
          or storing of any Content other than personal, noncommercial use is
          expressly prohibited without prior written permission from Company or from
          the copyright holder identified in such Content&#39;s copyright notice.
        </h3>
        <h4>User Submission</h4>
        <h3>
          In the course of using the Services, you and other users may provide
          information which may be used by Company in connection with the Services
          and which may be visible to certain other users. Anything you post, upload,
          share, store, or otherwise provide through the Services is your &#34;User
          Submission.&#34; Some User Submissions are viewable by other users. In
          order to display your User Submissions on the Services, and to allow other
          users to enjoy them (where applicable), you grant us certain rights in
          those User Submissions. Please note that all of the following licenses are
          subject to our Privacy Policy to the extent they relate to User Submissions
          that are also your personally-identifiable information.
        </h3>
        <h3>
          For all User Submissions, you hereby grant Company a license to translate,
          modify (for technical purposes, for example making sure your content is
          viewable on your iPhone as well as your computer) and reproduce such User
          Submission, in each case to enable us to operate the Services, as described
          in more detail below. This is a license only &ndash; your ownership in User
          Submissions is not affected.
        </h3>
        <h3>
          If you store a User Submission in your own personal Company account, in a
          manner that is not viewable by any other user except you (a &#34;Personal
          User Submission&#34;), you grant Company the license above, as well as a
          license to display, perform, and distribute your Personal User Submission
          for the sole purpose of displaying that Personal User Submission to you and
          providing you the Services necessary to do so.
        </h3>
        <h3>
          If you share a User Submission only within a Limited Access Group, or
          otherwise in a manner that only certain specified users can view (each, a
          &#34;Limited Access User Submission&#34;), then you grant Company the
          license above, as well as a license to display, perform, and distribute
          your Limited Access User Submission for the purpose of displaying that
          Limited Access User Submission to other members of that Limited Access
          Group (or to such specified users, as applicable) and providing you the
          Services necessary to do so. Also, you grant the other members of that
          Limited Access Group (or such specified users, as applicable) a license to
          access that Limited Access User Submission, and to use and exercise all
          rights in it, as permitted by the functionality of the Services. For
          example, if you share a project in your Limited Access Group, you grant the
          other members of the Limited Access Group the rights necessary to view that
          project and to create derivative works by adding to and modifying it.
        </h3>
        <h3>
          If you share a User Submission in a public &#34;community&#34; on the
          Services or in a manner that more than just you or your Limited Access
          Group can view (a &#34;Public User Submission&#34;), then you grant Company
          the license above, as well as a license to display, perform, and distribute
          your Public User Submission for the purpose of displaying that Public User
          Submission to all Company users and providing you the Services necessary to
          do so, as well as all other rights necessary to use and exercise all rights
          in that Public User Submission in connection with Company and the Services,
          provided that Company will try to notify you if it uses your Public User
          Submission for any reason other than displaying it on the Services. Also,
          you grant all other users of the Services a license to access that Public
          User Submission, and to use and exercise all rights in it, as permitted by
          the functionality of the Services. For example, if you share a project in a
          public &#34;community&#34;, you grant the other members of the
          &#34;community&#34; the rights necessary to view that project and to create
          derivative works by adding to and modifying it.
        </h3>
        <h3>
          Any user and Company may use, modify, reproduce, display, perform,
          distribute or create derivative works of a Public User Submission or a
          Limited Access User Submission (for which they have permission to access),
          provided that such user or Company must provide attribution to the original
          author(s).
        </h3>
        <h3>
          You agree that the licenses you grant are perpetual, royalty-free,
          irrevocable, sublicenseable, transferable and worldwide. Finally, you
          understand and agree that Company, in performing the required technical
          steps to provide the Services to our users (including you), may need to
          make changes to your User Submissions to conform and adapt those User
          Submissions to the technical requirements of connection networks, devices,
          services, or media.
        </h3>
        <h3>
          You understand that all information publicly posted or privately
          transmitted through the Services is the sole responsibility of the person
          from which such content originated and that Company will not be liable for
          any errors or omissions in any content. You understand that Company cannot
          guarantee the identity of any other users with whom you may interact in the
          course of using the Services. Additionally, Company cannot guarantee the
          authenticity of any data which users or merchants may provide about
          themselves. You acknowledge that all Content accessed by you using the
          Services is at your own risk and you will be solely responsible for any
          damage or loss to any party resulting therefrom.
        </h3>
        <h3>
          Under no circumstances will Company be liable in any way for any Content,
          including, but not limited to, any errors or omissions in any Content, or
          any loss or damage of any kind incurred in connection with use of or
          exposure to any Content posted, emailed, accessed, transmitted, or
          otherwise made available via the Services.
        </h3>
        <p>
          You are responsible for the information, opinions, messages, comments,
          photos, videos, graphics, sounds, lessons, educational materials and other
          content that you submit, upload, post, send or otherwise make available on
          or through the Site and Services. You may not upload, post, send or
          otherwise make available on this Site or through the Services, any material
          protected by copyright, trademark or any other intellectual property or
          other proprietary right without the express permission of the owner of such
          copyright, trademark or other intellectual property or other proprietary
          right, and the burden of determining whether any material is protected by
          any such right is on you. You agree to pay for all royalties, fees, damages
          and any other monies owing to any person and/or entity by reason of any
          Submissions posted by you to or through this Site and the Services. Without
          limiting the foregoing, you shall be solely liable for any and all claims,
          damage and loss resulting from any infringement and/or misappropriation of
          copyrights, trademarks and/or other proprietary rights, violation of
          contract, privacy or publicity rights or any other harm resulting from any
          Submission that you make. You have full responsibility for each User
          Submission you make, including its legality, reliability and
          appropriateness. Without limiting the foregoing, you are only permitted to
          make Submissions that are consistent with the educational purposes for
          which the Company makes the Site and Services available.
        </p>
        <p>
          When you provide Submissions you agree that those Submissions shall not be
          in violation of the &#34;Unauthorized Activities&#34; paragraph below.
          THOSE PROHIBITIONS DO NOT REQUIRE THE COMPANY TO MONITOR, POLICE OR REMOVE
          ANY SUBMISSIONS OR OTHER INFORMATION SUBMITTED BY YOU OR ANY OTHER USER.
        </p>
        <p>
          <strong>FEES AND PAYMENT.</strong>.
        </p>
        <p>
          You shall pay all applicable fees, as described on the Website and/or your
          account settings in connection with the Services selected by you. You shall
          be responsible for all taxes associated with your use of such Services,
          including, without limitation any federal, state, local or foreign taxes or
          any sales or use taxes. Company reserves the right to change its price list
          and to institute new charges at any time, upon notice to you, which may be
          sent by email or posted on the Website. Your use of the Services following
          such notification constitutes your acceptance of any new or increased
          charges. Any fees paid hereunder are non-refundable.
        </p>
        <p>
          We may suspend or terminate Your account and/or access to our Services and
          the Site if your payment is late and/or your offered payment method (e.g.,
          credit card) cannot be processed. By providing a payment method, you
          expressly authorize us to charge the applicable fees on said payment method
          as well as taxes and other charges incurred thereto at regular intervals,
          all of which depend on your utilized services.We understand that you might
          cancel your account, but please know that we will not provide any refund(s)
          and you will be responsible for paying any balance due on the account for
          the entire term to which you agreed. To make things less complicated, you
          agree that we may charge any unpaid fees to your provided payment method
          and/or send you a bill for such unpaid fees. To the extent you have paid
          any fees to the Company prior to termination of your account, you will not
          be entitled to any refund of such fees.
        </p>
        <p>
          <strong>Electronic Communications</strong>.
        </p>
        <p>
          By using the Site and Services provided on or through the Site, you hereby
          consent to receive electronic communications from the Company. These
          electronic communications may include notices about applicable fees, taxes
          and other charges, transactional information and other information
          concerning or related to the Site and Services. These electronic
          communications are part of your relationship with the Company. You agree
          that any notices, agreements, disclosures or other communications that we
          send you electronically will satisfy any legal communication requirements,
          including that such communications be in writing.
        </p>
        <p>
          <strong>Links to Third Party Sites.</strong>
        </p>
        <p>
          This Site may be linked to other websites that are not Company sites,
          including, without limitation, social networking, blogging and similar
          websites through which you may be able to log into this Site using your
          existing account and log-in credentials for such third party websites,
          including without limitation, Google and Facebook (any and all of which of
          the foregoing listed websites may change from time-to-time) and websites
          that provide educational content and question-and-answer forum
          functionality (collectively, &#34;Third Party Sites&#34;). Certain areas
          and features of the Site may allow you to interact and/or conduct
          transactions with such Third Party Sites, and, if applicable, allow you to
          configure your privacy settings in your Third Party Site account to permit
          your activities on this Site to be shared with your contacts in your Third
          Party Site account and, in certain situations, you may be transferred to a
          Third Party Site through a link but it may appear that you are still on
          this Site. You acknowledge and agree that the Third Party Sites may have
          different privacy policies and terms and conditions and/or user guides and
          business practices than the Company, and you further acknowledge and agree
          that your use of such Third Party Sites is governed by the respective Third
          Party Site privacy policy and terms and conditions and/or user guides. You
          hereby agree to comply with any and all terms and conditions, users guides
          and privacy policies of any of Third Party Sites. The Company is providing
          links to the Third Party Sites to you as a convenience, and the Company
          does not verify, make any representations or take responsibility for such
          Third Party Sites, including, without limitation, the truthfulness,
          accuracy, quality or completeness of the content, services, links displayed
          and/or any other activities conducted on or through such Third Party Sites.
          YOU AGREE THAT NEITHER THE COMPANY NOR THE OTHER COMPANY PARTIES, SHALL
          UNDER ANY CIRCUMSTANCES, BE RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY
          TO YOU OR ANY THIRD PARTY, FOR ANY GOODS, SERVICES, INFORMATION, RESOURCES,
          MATERIALS AND/OR CONTENT AVAILABLE ON OR THROUGH ANY THIRD PARTY SITES
          AND/OR THIRD PARTY DEALINGS OR COMMUNICATIONS, OR FOR ANY HARM RELATED
          THERETO, OR FOR ANY DAMAGES OR LOSS CAUSED OR ALLEGED TO BE CAUSED BY OR IN
          CONNECTION WITH YOUR USE OR RELIANCE ON THE PRODUCTS, SERVICES, CONTENT OR
          BUSINESS PRACTICES OF ANY THIRD PARTY.
        </p>
        <p>
          <strong>Interactive Features.</strong>
        </p>
        <p>
          The Company may make message boards, discussion boards, blogs, messaging
          and other interactive features (collectively, &#34;Interactive
          Features&#34;) available to users of the Services to promote and encourage
          open, honest and respectful education-related communication between users.
          All Submissions, whether publicly or privately posted or transmitted
          through the Interactive Features shall be the sole responsibility of the
          posting user and the posting user shall be fully liable for his or her
          submissions. You acknowledge and agree that the Company does not control
          the Submissions posted or transmitted through any Interactive Features, and
          does not guarantee the accuracy, integrity, quality or suitability of such
          posted or transmitted Submissions. The Company does not pre-screen
          Submissions posted or transmitted through any Interactive Features. The
          Company may, but is not obligated to, monitor the posting activities of
          users and may in its sole discretion, edit or remove any Submission and/or
          restrict a user&#39;s ability to post or transmit Submissions through the
          Interactive Features. BY USING ANY INTERACTIVE FEATURE, YOU UNDERSTAND THAT
          YOU MAY BE EXPOSED TO SUBMISSIONS THAT ARE OFFENSIVE, INDECENT OR
          OBJECTIONABLE, AND YOU USE SUCH INTERACTIVE FEATURES SOLELY AT YOUR OWN
          RISK AND THE COMPANY HAS NO RESPONSIBILITY OR LIABILITY TO YOU IN
          CONNECTION THEREWITH.
        </p>
        <p>
          You should exercise common sense and appropriate caution before posting or
          transmitting any of your own personally identifiable information or other
          confidential information on or through any Interactive Feature, as such
          information will be viewable by any user accessing or otherwise using such
          Interactive Features, and the Company has no responsibility or liability to
          you or any other person in respect of your decision to make your personally
          identifiable information or other confidential information publicly
          available through the Services. To the extent permitted by applicable law:
          (i) the Company may in its sole discretion record any or all communications
          between users; and (ii) each Student acknowledges and agrees that his or
          her Teacher(s) may be able to view such Student&#39;s communications (both
          sent and received) without any prior notice to Student.
        </p>
        <p>
          <strong>Unauthorized Activities.</strong>
        </p>
        <p>
          When using this Site and/or the Services, you agree not to: &bull; Defame,
          abuse, harass, stalk, threaten or otherwise violate the legal rights (such
          as the rights of privacy and publicity) of others. &bull; Use racially,
          ethnically, or otherwise offensive language. &bull; Discuss or incite
          illegal activity. &bull; Use explicit/obscene language or solicit/post
          sexually explicit images (actual or simulated). &bull; Post anything that
          exploits children or minors or that depicts cruelty to animals. &bull; Post
          any materials that violate the copyright rights, trademark rights or other
          intellectual property rights of any person without the express permission
          from the owner. &bull; Disseminate any unsolicited or unauthorized
          advertising, promotional materials, junk mail, spam, chain letters, pyramid
          schemes, or any other form of such solicitations. &bull; Use any robot,
          spider, scraper or other automated means to access the Site or Services.
          &bull; Take any action that imposes an unreasonable or disproportionately
          large load on our or our third party service providers&#39; infrastructure.
          &bull; Alter the opinions, comments, messages or other Submissions posted,
          sent or otherwise communicated by others on this Site or through the
          Services. &bull; Post, send or otherwise communicate any Submission or
          other information contrary to our public image, goodwill or reputation, as
          determined by us in our sole discretion. This list of prohibitions provides
          examples and is not complete or exclusive. The Company reserves the right
          to: (i) terminate access to your account, your ability to post to this Site
          (or use the Services); and (ii) refuse, modify, delete or remove any
          Submissions; with or without cause and with or without notice, for any
          reason or no reason, or for any action that the Company determines is
          inappropriate or disruptive to this Site and/or the Services or to any
          other user of this Site and/or Services. In addition to violating these
          Terms, any unauthorized use of any Materials may violate applicable laws,
          rules and/or regulations. You will be responsible for withholding, filing,
          and reporting all taxes, duties and other governmental assessments
          associated with your activity in connection with the Services.
        </p>
        <p>
          You, not Company, remain solely responsible for all Content that you
          upload, post, email, transmit, or otherwise disseminate using, or in
          connection with, the Services, and you warrant that you possess all rights
          necessary to provide such content to Company and to grant Company the
          rights to use such information in connection with the Services and as
          otherwise provided herein.
        </p>
        <p>
          THE COMPANY MAY REPORT TO LAW ENFORCEMENT AUTHORITIES, OR OTHER THIRD
          PARTIES, ANY ACTIONS THAT MAY BE ILLEGAL, AND ANY REPORTS IT RECEIVES OF
          SUCH CONDUCT. WHEN LEGALLY REQUIRED OR AT THE COMPANY&#39;S DISCRETION, THE
          COMPANY WILL COOPERATE WITH LAW ENFORCEMENT AUTHORITIES IN ANY
          INVESTIGATION OF ALLEGED ILLEGAL ACTIVITY IN CONNECTION WITH THE SITE,
          SERVICES OR ON THE INTERNET, WITH OR WITHOUT NOTICE TO YOU.
        </p>
        <p>
          <strong>Indemnification</strong>.
        </p>
        <p>
          You hereby agree to indemnify, defend and hold harmless, the Company, its
          parents, affiliates, subsidiaries, suppliers, licensors and business
          partners, and its and their respective officers, directors, employees and
          agents (collectively, the &#34;Company Parties&#34;) from and against any
          and all costs, damages, liabilities, losses and expenses (including without
          limitation, attorneys&#39; fees and costs of defense) any Company Party
          suffers in relation to, arising from, or for the purpose of avoiding, any
          claim or demand from a third party that your use of this Site and/or the
          Services, or the use of this Site and/or the Services, by any person using
          your user name (or if you are a Student, your avatar) and/or Password
          (including without limitation, your participation in the Interactive
          Features and your Submissions) violates any applicable law, rule or
          regulation, or the copyrights, trademark rights or other rights of any
          third party, including without limitation, the intellectual property,
          privacy and/or publicity rights of any third party.
        </p>
        <p>
          <strong>Disclaimer of Warranties.</strong>
        </p>
        <p>
          Your use of this Site and/or the Services is entirely at your own risk. The
          Materials have not been verified or authenticated in whole or in part by
          the Company, and they may include inaccuracies or typographical or other
          errors. You release Company from all liability for you having acquired or
          not acquired Content through the Services. The Services may contain, or
          direct you to websites containing, information that some people may find
          offensive or inappropriate. Company makes no representations concerning any
          content contained in or accessed through the Services, and Company will not
          be responsible or liable for the accuracy, copyright compliance, legality
          or decency of material contained in or accessed through the Services. The
          Company has no liability for any errors or omissions in the Materials,
          whether provided by the Company, our licensors or suppliers or other users.
          YOU ACKNOWLEDGE AND AGREE THAT THE COMPANY AND THE OTHER COMPANY PARTIES DO
          NOT REPRESENT, WARRANT, COVENANT OR GUARANTEE THAT USING THE SITE AND/OR
          SERVICES WILL RESULT IN ANY IMPROVED PERFORMANCE BY ANY STUDENT OR WILL
          RESULT IN ANY PARTICULAR STUDENT ADVANCEMENT OR ATTAINMENT. THE COMPANY,
          FOR ITSELF AND THE OTHER COMPANY PARTIES, MAKES NO EXPRESS, IMPLIED OR
          STATUTORY REPRESENTATIONS, WARRANTIES, COVENANTS OR GUARANTEES IN
          CONNECTION WITH THIS SITE OR THE SERVICES RELATING TO THE QUALITY,
          SUITABILITY, TRUTH, ACCURACY OR COMPLETENESS OF ANY INFORMATION OR CONTENT
          CONTAINED OR PRESENTED ON OR THROUGH THIS SITE AND/OR THE SERVICES,
          INCLUDING WITHOUT LIMITATION, THE MATERIALS AND SUBMISSIONS. THIS SITE, THE
          SERVICES, AND MATERIALS, AND ANY INFORMATION OR CONTENT CONTAINED OR
          PRESENTED BY THE COMPANY ARE PROVIDED TO YOU ON AN &#34;AS IS,&#34; &#34;AS
          AVAILABLE&#34; AND &#34;WHERE-IS&#34; BASIS WITH NO WARRANTY OR IMPLIED
          WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR
          NON-INFRINGEMENT OF THIRD PARTY RIGHTS. THE COMPANY DOES NOT PROVIDE ANY
          WARRANTIES AGAINST VIRUSES, SPYWARE OR MALWARE THAT MAY BE INSTALLED ON
          YOUR COMPUTER. Some jurisdictions do not allow certain disclaimers and/or
          limitations of warranties and similar protections, so the foregoing may not
          apply to you; in such case, the Company&#39;s warranties shall be limited
          to the greatest extent permitted under the applicable laws of such
          jurisdiction.
        </p>
        <p>
          <strong>Limitation of Liability.</strong>
        </p>
        <p>
          IN NO EVENT SHALL THE COMPANY OR THE OTHER COMPANY PARTIES BE LIABLE TO YOU
          OR ANY THIRD PARTY FOR ANY INDIRECT, EXTRAORDINARY, EXEMPLARY, PUNITIVE,
          SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES (INCLUDING BUT NOT LIMITED
          TO, LOSS OF BUSINESS, REVENUE, PROFITS, USE, DATA OR OTHER ECONOMIC
          ADVANTAGE), HOWEVER IT ARISES, WHETHER IN AN ACTION OF CONTRACT,
          NEGLIGENCE, STRICT LIABILITY OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
          CONNECTION WITH THE USE OF THE SITE, SERVICES AND/OR MATERIALS, INCLUDING
          WITHOUT LIMITATION, LIABILITY ASSOCIATED WITH ANY VIRUSES WHICH MAY INFECT
          YOUR COMPUTER EQUIPMENT OR DATA, EVEN IF THE COMPANY KNOWS THERE IS A
          POSSIBILITY OF SUCH DAMAGE. IN ADDITION, IN NO EVENT SHALL THE
          COMPANY&#39;S OR THE OTHER COMPANY PARTIES&#39; TOTAL CUMULATIVE LIABILITY
          ARISING UNDER OR IN CONNECTION WITH THESE TERMS, EXCEED THE GREATER OF: (I)
          ONE HUNDRED US DOLLARS (US$100); OR (II) THE TOTAL AMOUNT OF ANY FEES YOU
          HAVE PAID THE COMPANY FOR THE SERVICES DURING THE ONE (1) YEAR PERIOD
          IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE RELEVANT COMPANY
          PARTY&#39;S LIABILITY. Some jurisdictions do not allow certain limitations
          of liability, so the foregoing may not apply to you; in such case, the
          Company Parties&#39; liability will be limited to the greatest extent
          permitted under the applicable laws of such jurisdiction.
        </p>
        <h4>REGISTRATION AND SECURITY.</h4>
        <h3>
          As a condition to using some aspects of the Services, you may be required
          to register with Company and select a password and user name (&#34;Company
          User ID&#34;). If you are accessing the Services through a third party site
          or service (such as &#34;Facebook Connect&#34;), Company may require that
          your Company User ID be the same as your user name for such third party
          site or service. You shall provide Company with accurate, complete, and
          updated registration information. Failure to do so shall constitute a
          breach of this Agreement, which may result in immediate termination of your
          account. In certain situations, your Company User ID may be selected for
          you by your school or district; the same rules apply to them when they
          select a Company User ID for you. You may not (i) select or use as a
          Company User ID a name of another person with the intent to impersonate
          that person; or (ii) use as a Company User ID a name subject to any rights
          of a person other than you without appropriate authorization. Company
          reserves the right to refuse registration of or cancel a Company User ID in
          its discretion. You shall be responsible for maintaining the
          confidentiality of your password. If you access the Service through a third
          party site or service, you will provide your third party account
          credentials to Company, and you are consenting to have the information in
          those accounts transmitted into your Company account, and you agree that
          you shall only use accounts owned by you, and not by any other person or
          entity.
        </h3>
        <h4>INTERACTION WITH THIRD PARTIES.</h4>
        <h3>
          The Services may contain links to third party websites or services
          (&#34;Third Party Services&#34;) that are not owned or controlled by
          Company, or the Services may be accessible by logging in through a Third
          Party Service, as described more fully in our Privacy Policy. When you
          access Third Party Services, you do so at your own risk. You hereby
          represent and warrant that you have read and agree to be bound by all
          applicable policies of any Third Party Services relating to your use of the
          Services and that you will act in accordance with those policies, in
          addition to your obligations under this Agreement. Company has no control
          over, and assumes no responsibility for, the content, accuracy, privacy
          policies, or practices of or opinions expressed in any Third Party
          Services. In addition, Company will not and cannot monitor, verify, censor
          or edit the content of any Third Party Service. By using the Services, you
          expressly relieve and hold harmless Company from any and all liability
          arising from your use of any Third Party Service.
        </h3>
        <p>
          Your interactions with organizations and/or individuals found on or through
          the Services, including payment and delivery of goods or services, and any
          other terms, conditions, warranties or representations associated with such
          dealings, are solely between you and such organizations and/or individuals.
          You should make whatever investigation you feel necessary or appropriate
          before proceeding with any online or offline transaction with any of these
          third parties. You agree that Company shall not be responsible or liable
          for any loss or damage of any sort incurred as the result of any such
          dealings. If there is a dispute between participants on this site, or
          between users and any third party, you understand and agree that Company is
          under no obligation to become involved. In the event that you have a
          dispute with one or more other users or third parties, you hereby release
          Company, its officers, employees, agents, and successors in rights from
          claims, demands, and damages (actual and consequential) of every kind or
          nature, known or unknown, suspected or unsuspected, disclosed or
          undisclosed, arising out of or in any way related to such disputes. If you
          are a California resident, you shall and hereby do waive California Civil
          Code Section 1542, which says:
          <strong>
            &#34;A general release does not extend to claims which the creditor does
            not know or suspect to exist in his favor at the time of executing the
            release, which, if known by him must have materially affected his
            settlement with the debtor.&#34;
          </strong>
        </p>
        <h4>TERMINATION.</h4>
        <p>
          This Agreement shall remain in full force and effect while you use the
          Services. You may terminate your use of the Services at any time. Company
          may terminate or suspend your access to the Services or your membership at
          any time, for any reason, and without warning, which may result in the
          forfeiture and destruction of all information associated with your
          membership. Company may also terminate or suspend any and all Services and
          access to the Website immediately, without prior notice or liability, if
          you breach any of the terms or conditions of this Agreement. Upon
          termination of your account, your right to use the Services, access the
          Website, and any Content will immediately cease. All provisions of this
          Agreement which, by their nature, should survive termination, shall survive
          termination, including, without limitation, ownership provisions, warranty
          disclaimers, and limitations of liability.
        </p>
        <h4>MISCELLANEOUS.</h4>
        <p>
          The failure of either party to exercise, in any respect, any right provided
          for herein shall not be deemed a waiver of any further rights hereunder.
          Company shall not be liable for any failure to perform its obligations
          hereunder where such failure results from any cause beyond Company&#39;s
          reasonable control, including, without limitation, mechanical, electronic
          or communications failure or degradation (including &#34;line-noise&#34;
          interference). If any provision of this Agreement is found to be
          unenforceable or invalid, that provision shall be limited or eliminated to
          the minimum extent necessary so that this Agreement shall otherwise remain
          in full force and effect and enforceable. This Agreement is not assignable,
          transferable or sublicensable by you except with Company&#39;s prior
          written consent. Company may transfer, assign or delegate this Agreement
          and its rights and obligations without consent. Both parties agree that
          this Agreement is the complete and exclusive statement of the mutual
          understanding of the parties and supersedes and cancels all previous
          written and oral agreements, communications and other understandings
          relating to the subject matter of this Agreement, and that all
          modifications must be in a writing signed by both parties, except as
          otherwise provided herein. No agency, partnership, joint venture, or
          employment is created as a result of this Agreement and you do not have any
          authority of any kind to bind Company in any respect whatsoever. Headings
          for each section have been included above for your convenience, but such
          headings do not have any legal meaning, and may not accurately reflect the
          content of the provisions they precede. Except as expressly set forth in
          Section &#34;APPLE DEVICE AND APPLICATION TERMS&#34; below, you and Company
          agree there are no third party beneficiaries intended under this Agreement.
        </p>
        <h4>ARBITRATION; GOVERNING LAW.</h4>
        <p>
          This Agreement shall be governed by and construed in accordance with the
          laws of the State of California without regard to the conflict of laws
          provisions thereof. Any dispute arising from or relating to the subject
          matter of this Agreement shall be finally settled by arbitration in San
          Francisco County, California, using the English language in accordance with
          the Streamlined Arbitration Rules and Procedures of Judicial Arbitration
          and Mediation Services, Inc. (&#34;JAMS&#34;) then in effect, by one
          commercial arbitrator with substantial experience in resolving intellectual
          property and commercial contract disputes, who shall be selected from the
          appropriate list of JAMS arbitrators in accordance with the Streamlined
          Arbitration Rules and Procedures of JAMS. Judgment upon the award so
          rendered may be entered in a court having jurisdiction, or application may
          be made to such court for judicial acceptance of any award and an order of
          enforcement, as the case may be. Notwithstanding the foregoing, each party
          shall have the right to institute an action in a court of proper
          jurisdiction for injunctive or other equitable relief at any time. For all
          purposes of this Agreement, the parties consent to exclusive jurisdiction
          and venue in the United States Federal Courts located in the Northern
          District of California.
        </p>
        <h4>COPYRIGHT DISPUTE POLICY.</h4>
        <p>
          Company has adopted the following general policy toward copyright
          infringement in accordance with the Digital Millennium Copyright Act or
          DMCA (posted at www.lcweb.loc.gov/copyright/legislation/dmca.pdf). The
          address of Company&#39;s Designated Agent to Receive Notification of
          Claimed Infringement (&#34;Designated Agent&#34;) is listed at the end of
          this Section. It is Company&#39;s policy to (1) block access to or remove
          material that it believes in good faith to be copyrighted material that has
          been illegally copied and distributed by any of our advertisers,
          affiliates, content providers, members or users; and (2) remove and
          discontinue service to repeat offenders.
        </p>
        <ol>
          <ol>
            <li>
              <h4>Procedure for Reporting Copyright Infringements:</h4>
            </li>
            <li>
              <h4>
                If you believe that material or content residing on or accessible
                through the Services infringes a copyright, please send a notice of
                copyright infringement containing the following information to the
                Designated Agent listed below:
              </h4>
            </li>
            <ol>
              <li>
                <h4>
                  A physical or electronic signature of a person authorized to act on
                  behalf of the owner of the copyright that has been allegedly
                  infringed;
                </h4>
              </li>
              <li>
                <h4>Identification of works or materials being infringed;</h4>
              </li>
              <li>
                <h4>
                  Identification of the material that is claimed to be infringing
                  including information regarding the location of the infringing
                  materials that the copyright owner seeks to have removed, with
                  sufficient detail so that Company is capable of finding and
                  verifying its existence;
                </h4>
              </li>
              <li>
                <h4>
                  Contact information about the notifier including address, telephone
                  number and, if available, email address;
                </h4>
              </li>
              <li>
                <h4>
                  A statement that the notifier has a good faith belief that the
                  material identified in (3) is not authorized by the copyright
                  owner, its agent, or the law; and
                </h4>
              </li>
              <li>
                <h4>
                  A statement made under penalty of perjury that the information
                  provided is accurate and the notifying party is authorized to make
                  the complaint on behalf of the copyright owner.
                </h4>
              </li>
            </ol>
            <li>
              <h4>
                Once Proper Bona Fide Infringement Notification is Received by the
                Designated Agent:
              </h4>
            </li>
            <li>
              <h4>It is Company&#39;s policy:</h4>
            </li>
            <ol>
              <li>
                <h4>to remove or disable access to the infringing material;</h4>
              </li>
              <li>
                <h4>
                  to notify the content provider, member or user that it has removed
                  or disabled access to the material; and
                </h4>
              </li>
              <li>
                <h4>
                  that repeat offenders will have the infringing material removed
                  from the system and that Company will terminate such content
                  provider&#39;s, member&#39;s or user&#39;s access to the Services.
                </h4>
              </li>
            </ol>
            <li>
              <h4>Procedure to Supply a Counter-Notice to the Designated Agent:</h4>
            </li>
            <li>
              <h4>
                If the content provider, member or user believes that the material
                that was removed (or to which access was disabled) is not infringing,
                or the content provider, member or user believes that it has the
                right to post and use such material from the copyright owner, the
                copyright owner&#39;s agent, or, pursuant to the law, the content
                provider, member, or user, must send a counter-notice containing the
                following information to the Designated Agent listed below:
              </h4>
            </li>
            <ol>
              <li>
                <h4>
                  A physical or electronic signature of the content provider, member
                  or user;
                </h4>
              </li>
              <li>
                <h4>
                  Identification of the material that has been removed or to which
                  access has been disabled and the location at which the material
                  appeared before it was removed or disabled;
                </h4>
              </li>
              <li>
                <h4>
                  A statement that the content provider, member or user has a good
                  faith belief that the material was removed or disabled as a result
                  of mistake or misidentification of the material; and
                </h4>
              </li>
              <li>
                <h4>
                  Content provider&#39;s, member&#39;s or user&#39;s name, address,
                  telephone number, and, if available, email address, and a statement
                  that such person or entity consents to the jurisdiction of the
                  Federal Court for the judicial district in which the content
                  provider&#39;s, member&#39;s or user&#39;s address is located, or,
                  if the content provider&#39;s, member&#39;s or user&#39;s address
                  is located outside the United States, for any judicial district in
                  which Company is located, and that such person or entity will
                  accept service of process from the person who provided notification
                  of the alleged infringement.
                </h4>
              </li>
            </ol>
            <li>
              <h4>
                If a counter-notice is received by the Designated Agent, Company may
                send a copy of the counter-notice to the original complaining party
                informing that person that Company may replace the removed material
                or cease disabling it in 10 business days. Unless the copyright owner
                files an action seeking a court order against the content provider,
                member or user, the removed material may be replaced or access to it
                restored in 10 to 14 business days or more after receipt of the
                counter-notice, at Company&#39;s discretion.
              </h4>
            </li>
            <li>
              <h4>
                Please contact Company&#39;s Designated Agent to Receive Notification
                of Claimed Infringement at the following address: Email us at{' '}
                {contactEmail}.
              </h4>
            </li>
          </ol>
        </ol>
        <h4>CONTACT.</h4>
        <p>
          If you have any questions, complaints, or claims with respect to the
          Services, you may contact us at {contactEmail}.
        </p>
        <p>Effective: September, 2017</p>
      </Article>
    </Layout>
  );
}
