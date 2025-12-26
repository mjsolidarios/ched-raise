import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';

export default function RegistrationEmail({ ticketCode }: { ticketCode: string }) {
    return (
        <Html>
            <Head />
            <Preview>CHED RAISE 2026 Registration Confirmation</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={{ paddingBottom: '20px' }}>
                        <Heading style={h1}>CHED RAISE 2026 Registration</Heading>
                        <Text style={text}>
                            Thank you for registering for CHED RAISE 2026! We are excited to have you join us.
                        </Text>
                        <Section style={codeContainer}>
                            <Text style={codeTitle}>Your Ticket Code</Text>
                            <Text style={code}>{ticketCode}</Text>
                        </Section>
                        <Text style={footer}>
                            Please present this code or your ID at the venue entrance.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
    width: '580px',
};

const h1 = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    padding: '17px 0 0',
    margin: '0',
};

const text = {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
};

const codeContainer = {
    background: 'rgba(0,0,0,.05)',
    borderRadius: '4px',
    margin: '16px auto 14px',
    verticalAlign: 'middle',
    width: '280px',
    padding: '12px',
};

const codeTitle = {
    color: '#666',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    margin: '0 0 4px',
};

const code = {
    color: '#000',
    display: 'inline-block',
    fontSize: '32px',
    fontWeight: 'bold',
    letterSpacing: '6px',
    lineHeight: '40px',
    paddingBottom: '8px',
    paddingTop: '8px',
    textAlign: 'center' as const,
    width: '100%',
};

const footer = {
    color: '#898989',
    fontSize: '14px',
    lineHeight: '22px',
    marginTop: '12px',
};