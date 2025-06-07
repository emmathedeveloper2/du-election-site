import db from "~/database";
import {sessionsTable, usersTable} from "~/database/schemas";
import {eq} from "drizzle-orm";
import jwt from 'jsonwebtoken'
import {JWT_EXPIRES_IN, JWT_SECRET} from "~/.server/config/env.config";
import {authCookie} from "~/.server/config/cookies.config";
import {safeTry} from "~/lib/helpers";
import {sendVerificationEmail} from "~/.server/config/email.config";
import {ERRORS} from "~/lib/types";
import bcrypt, {genSalt, hash} from "bcryptjs";

