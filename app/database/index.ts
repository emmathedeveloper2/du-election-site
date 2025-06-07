import {DATABASE_URL} from "~/.server/config/env.config";

import { drizzle } from 'drizzle-orm/neon-http';

const db = drizzle(DATABASE_URL!);

export default db

