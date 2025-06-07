import { getTableColumns } from "drizzle-orm";
import { pgTable, uuid, varchar , boolean, integer } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
    id: uuid().primaryKey().defaultRandom(), // generated
    fullname: varchar({ length: 255 }).notNull(), // provided
    matricNumber: varchar('matric_number' , { length: 255 }).notNull().unique(), //provided
    email: varchar({ length: 255 }).notNull().unique(),//provided
    phoneNumber: varchar('phone_number' , { length: 255 }).notNull(),//provided
    level: varchar('level' , { length: 255 }).notNull(),//provided
    programme: varchar('programme' , { length: 255 , enum: ["computer science" , "software engineering" , "cyber security"] }).notNull(),//provided
    password: varchar({ length: 255 }),//provided
    verified: boolean('is_verified').notNull().default(false),//generated
    admin: boolean('is_admin').notNull().default(false),//generated
    gender: varchar({ length: 255 , enum: ["male" , "female"]}),//generated
});


const {
    password ,
    ...excludePasswordSchema
} = getTableColumns(usersTable)

export {usersTable, excludePasswordSchema }