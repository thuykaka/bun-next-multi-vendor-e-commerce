import { NextResponse } from 'next/server';
import { BasePayload } from 'payload';
import type Stripe from 'stripe';
import { getPayload } from '@/lib/payloadcms';
import { stripe } from '@/lib/stripe';
import { ExpandedLineItem } from '@/modules/checkout/types';

const PERMITTED_EVENTS: Stripe.Event.Type[] = [
  'checkout.session.completed',
  'account.updated'
];
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const validateWebhookSignature = async (
  request: Request
): Promise<Stripe.Event> => {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    throw new Error('Missing Stripe signature');
  }

  try {
    return stripe.webhooks.constructEvent(
      await (await request.blob()).text(),
      signature,
      WEBHOOK_SECRET
    );
  } catch (er) {
    const errorMessage = er instanceof Error ? er.message : 'Unknown error';
    console.error(`validateWebhookSignature -> error message: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

const validateUser = async (
  userId: string | undefined,
  payload: BasePayload
) => {
  if (!userId) {
    throw new Error('No user ID found in metadata');
  }

  const user = await payload.findByID({
    collection: 'users',
    id: userId
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const getExpandedCheckoutSession = async (
  sessionId: string,
  event: Stripe.Event
): Promise<Stripe.Checkout.Session> => {
  const expandedSession = await stripe.checkout.sessions.retrieve(
    sessionId,
    {
      expand: ['line_items.data.price.product']
    },
    {
      stripeAccount: event.account
    }
  );

  if (
    !expandedSession.line_items?.data ||
    !expandedSession.line_items.data.length
  ) {
    throw new Error('No line items found in checkout session');
  }

  return expandedSession;
};

const createOrdersFromLineItems = async (
  lineItems: ExpandedLineItem[],
  sessionId: string,
  userId: string,
  payload: BasePayload,
  event: Stripe.Event
): Promise<void> => {
  const orderPromises = lineItems.map(async (lineItem) => {
    return payload.create({
      collection: 'orders',
      data: {
        stripeCheckoutSessionId: sessionId,
        user: userId,
        name: lineItem.price.product.name,
        product: lineItem.price.product.metadata.id,
        quantity: Number(lineItem.quantity),
        stripeAccountId: event.account
      }
    });
  });

  await Promise.all(orderPromises);

  console.log(`createOrdersFromLineItems -> orders created`);
};

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  payload: BasePayload,
  event: Stripe.Event
): Promise<void> {
  const user = await validateUser(session.metadata?.userId, payload);

  let expandedSession;
  try {
    expandedSession = await getExpandedCheckoutSession(session.id, event);
  } catch (error) {
    console.error(`handleCheckoutSessionCompleted -> error: ${error}`);
    throw new Error('Failed to get expanded checkout session');
  }

  const lineItems = expandedSession.line_items!.data as ExpandedLineItem[];
  await createOrdersFromLineItems(
    lineItems,
    session.id,
    user.id,
    payload,
    event
  );
}

async function handleAccountUpdated(
  account: Stripe.Account,
  payload: BasePayload
): Promise<void> {
  await payload.update({
    collection: 'tenants',
    where: {
      stripeAccountId: {
        equals: account.id
      }
    },
    data: {
      stripeDetailsSubmitted: account.details_submitted
    }
  });
}

async function processWebhookEvent(
  event: Stripe.Event,
  payload: BasePayload
): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session, payload, event);
      break;

    case 'account.updated':
      const account = event.data.object as Stripe.Account;
      await handleAccountUpdated(account, payload);
      break;

    default:
      throw new Error(`Unhandled event type: ${event.type}`);
  }
}

export const POST = async (request: Request) => {
  try {
    const event = await validateWebhookSignature(request);
    console.log(`Webhook received: ${event.type}`);

    if (!PERMITTED_EVENTS.includes(event.type)) {
      console.log(`Ignoring unpermitted event: ${event.type}`);
      return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
    }

    const payload = await getPayload();

    await processWebhookEvent(event, payload);

    return NextResponse.json(
      { message: 'Webhook processed successfully' },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook error:', errorMessage);

    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }
};
