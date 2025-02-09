import { relations } from "drizzle-orm";
import { pgTable, uuid, varchar, date, timestamp, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstname: varchar("firstname", { length: 255 }).notNull(),
  lastname: varchar("lastname", { length: 255 }).notNull(),
  birthdate: date("birthdate").notNull(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  address: one(addresses),
  todos: many(todos)
}))

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }).notNull(),
  province: varchar("province", { length: 255 }).notNull(),
  postal_code: varchar("postal_code", { length: 10 }).notNull(),
  updated_at: timestamp(),
  created_at: timestamp().defaultNow(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.user_id],
    references: [users.id],
  }),
}))


export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow(),
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.user_id],
    references: [users.id],
  }),
}))