import { pgTable, serial, text, timestamp, integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  donorName: text('donor_name').notNull(),
  donorEmail: text('donor_email'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('USD'),
  localAmount: decimal('local_amount', { precision: 12, scale: 2 }),
  localCurrency: text('local_currency'),
  paypalOrderId: text('paypal_order_id'),
  campaignId: integer('campaign_id'),
  status: text('status').notNull().default('completed'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const contacts = pgTable('contacts', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  status: text('status').notNull().default('new'),
});

export const campaigns = pgTable('campaigns', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  goalAmount: decimal('goal_amount', { precision: 12, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 12, scale: 2 }).notNull().default('0'),
  startDate: timestamp('start_date').notNull().defaultNow(),
  endDate: timestamp('end_date'),
  isActive: boolean('is_active').notNull().default(true),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const pendingOrders = pgTable('pending_orders', {
  id: serial('id').primaryKey(),
  paypalOrderId: text('paypal_order_id').notNull().unique(),
  donorName: text('donor_name').notNull(),
  donorEmail: text('donor_email'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  localAmount: decimal('local_amount', { precision: 12, scale: 2 }),
  localCurrency: text('local_currency'),
  campaignId: integer('campaign_id'),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
});

export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [donations.campaignId],
    references: [campaigns.id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  donations: many(donations),
}));

export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;
export type PendingOrder = typeof pendingOrders.$inferSelect;
export type InsertPendingOrder = typeof pendingOrders.$inferInsert;
