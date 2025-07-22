import z from 'zod';
import { Media, Tenant } from '@/payload-types';
import { TRPCError } from '@trpc/server';
import { Where } from 'payload';
import type Stripe from 'stripe';
import {
  baseProcedure,
  protectedProcedure,
  createTRPCRouter
} from '@/trpc/init';
import { stripe } from '@/lib/stripe';
import { getTenantUrl } from '@/lib/tenants';
import { PLATFORM_FEE_PERCENTAGE } from '@/constants/biz';
import {
  CheckoutSessionMetadata,
  ProductMetadata
} from '@/modules/checkout/types';

export const checkoutRouter = createTRPCRouter({
  verify: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.payloadcms.findByID({
      collection: 'users',
      id: ctx.session.user.id,
      depth: 0 // related collections are only id (string)
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found'
      });
    }

    const tenantId = user.tenants?.[0]?.tenant as string;

    const tenant = await ctx.payloadcms.findByID({
      collection: 'tenants',
      id: tenantId
    });

    if (!tenant) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Tenant not found'
      });
    }

    const stripeAccount = await stripe.accountLinks.create({
      account: tenant.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
      type: 'account_onboarding'
    });

    if (!stripeAccount.url) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create Stripe account link'
      });
    }

    return { url: stripeAccount.url };
  }),
  purchase: protectedProcedure
    .input(
      z.object({
        cartItems: z
          .array(z.string())
          .min(1, 'Cart must have at least one item'),
        tenantSlug: z.string().min(1, 'Tenant slug is required')
      })
    )
    .mutation(async ({ ctx, input }) => {
      const where: Where = {
        and: [
          { id: { in: input.cartItems } },
          { 'tenant.slug': { equals: input.tenantSlug } },
          { isArchive: { not_equals: true } }
        ]
      };

      const products = await ctx.payloadcms.find({
        collection: 'products',
        depth: 2,
        where
      });

      if (products.totalDocs !== input.cartItems.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some products were not found'
        });
      }

      const tenants = await ctx.payloadcms.find({
        collection: 'tenants',
        limit: 1,
        pagination: false,
        where: { slug: { equals: input.tenantSlug } }
      });

      const tenant = tenants.docs?.[0];

      if (!tenant) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Tenant not found'
        });
      }

      if (!tenant.stripeDetailsSubmitted) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Tenant not allowed to sell products'
        });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          quantity: 1,
          price_data: {
            unit_amount: product.price * 100, // Stripe uses cents
            currency: 'usd',
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                id: product.id,
                name: product.name,
                price: product.price
              } as ProductMetadata
            }
          }
        }));

      const totalAmount = lineItems.reduce(
        (acc, item) => acc + (item.price_data?.unit_amount ?? 0),
        0
      );

      const platformFee = Math.round(
        totalAmount * (PLATFORM_FEE_PERCENTAGE / 100)
      );

      const domain = getTenantUrl(input.tenantSlug);

      const checkoutState = await stripe.checkout.sessions.create(
        {
          customer_email: ctx.session.user.email,
          success_url: `${domain}/checkout?success=true`,
          cancel_url: `${domain}/checkout?cancel=true`,
          mode: 'payment',
          line_items: lineItems,
          invoice_creation: {
            enabled: true
          },
          metadata: {
            userId: ctx.session.user.id
          } as CheckoutSessionMetadata,
          payment_intent_data: {
            application_fee_amount: platformFee
          }
        },
        {
          stripeAccount: tenant.stripeAccountId
        }
      );

      if (!checkoutState.url) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create checkout session'
        });
      }

      return { url: checkoutState.url };
    }),
  getProducts: baseProcedure
    .input(z.object({ productIds: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      const products = await ctx.payloadcms.find({
        collection: 'products',
        where: {
          id: { in: input.productIds },
          isArchive: { not_equals: true }
        }
      });

      if (products.totalDocs !== input.productIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Some products were not found'
        });
      }

      return {
        ...products,
        docs: products.docs.map((product) => ({
          ...product,
          images: product.images as Media[] | null,
          tenant: product.tenant as Tenant & {
            logo: Media | null;
          }
        }))
      };
    })
});
