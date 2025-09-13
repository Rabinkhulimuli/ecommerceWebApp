import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Img,
  Row,
  Column,
} from '@react-email/components';

interface Item {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationProps {
  orderId: string;
  items: Item[];
  total: Number;
  customerName: string;
}

export default function OrderConfirmationEmail({
  orderId,
  items,
  total,
  customerName,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your PRIVE order #{orderId} is confirmed 🎉</Preview>
      <Body
        style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}
      >
        <Container
          style={{
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '600px',
          }}
        >
          {/* Logo */}
          <Section
            style={{
              textAlign: 'center',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 'full',
            }}
          >
            <Img src={process.env.NEXT_PUBLIC_APP_LOGO} alt='prive' width='120' />
          </Section>

          {/* Header */}
          <Heading style={{ fontSize: '22px', color: '#333' }}>
            Thank you for your order, {customerName}! 🎉
          </Heading>
          <Text style={{ fontSize: '16px', color: '#555' }}>
            We’ve received your order <b>#{orderId}</b>. Here are the details:
          </Text>

          <Hr style={{ margin: '20px 0' }} />

          {/* Items */}
          <Section>
            {items.map((item, idx) => (
              <Row key={idx} style={{ marginBottom: '15px' }}>
                {item.image && (
                  <Column style={{ width: '80px' }}>
                    <Img
                      src={item.image}
                      alt={item.name}
                      width='70'
                      height='70'
                      style={{ borderRadius: '8px' }}
                    />
                  </Column>
                )}
                <Column>
                  <Text style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: '14px', color: '#555', margin: 0 }}>
                    Qty: {item.quantity}
                  </Text>
                </Column>
                <Column style={{ textAlign: 'right' }}>
                  <Text style={{ fontSize: '16px', color: '#333' }}>
                    ${item.price * item.quantity}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={{ margin: '20px 0' }} />

          {/* Total */}
          <Section style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', color: '#111' }}>
              Total: ${Number(total)}
            </Text>
          </Section>

          <Hr style={{ margin: '20px 0' }} />

          {/* Delivery Info */}
          <Text style={{ fontSize: '15px', color: '#555' }}>
            Your order is being prepared. We’ll notify you once it’s shipped 🚚
          </Text>

          {/* Footer */}
          <Section
            style={{ marginTop: '30px', textAlign: 'center', fontSize: '13px', color: '#888' }}
          >
            <Text>prive © {new Date().getFullYear()} – All rights reserved.</Text>
            <Text>
              Need help?{' '}
              <a href='mailto:support@prive.com' style={{ color: '#0070f3' }}>
                Contact Support
              </a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
