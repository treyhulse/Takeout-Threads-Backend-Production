import { ReactElement } from 'react';
import {
  Html,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Heading,
} from '@react-email/components';

interface WelcomeEmailProps {
  orgName: string;
  userName: string;
}

export const WelcomeEmail = ({
  orgName,
  userName,
}: WelcomeEmailProps): ReactElement => (
  <Html>
    <Preview>Welcome to {orgName}</Preview>
    <Body style={{ backgroundColor: '#ffffff' }}>
      <Container>
        <Heading>Welcome to {orgName}!</Heading>
        <Text>Hi {userName},</Text>
        <Text>
          Your organization has been successfully created. You can now start setting up your store and adding items.
        </Text>
        <Link href="https://www.takeout-threads.com/dashboard">
          Go to Dashboard
        </Link>
      </Container>
    </Body>
  </Html>
); 