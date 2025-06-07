
const ERROR = {
    SEEDING_DATA_NOT_FOUND: 'No JSON data found',
    SEEDING_DATA_FAILED: 'Failed to seed data',
    INVALID_DATA: 'Invalid data',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_VERIFIED: 'User already verified',
    INVALID_CODE: 'Invalid code',
    SESSION_NOT_FOUND: 'Session not found',
    CODE_NOT_PROVIDED: "Couldn't find code in request body",
    PASSWORD_NOT_PROVIDED: "Couldn't find password in request body",
    EMAIL_NOT_PROVIDED: "Couldn't find email in request body",
    INCORRECT_EMAIL: 'Incorrect email',
    INCORRECT_PASSWORD: 'Incorrect Password',
    MATRIC_NUMBER_NOT_PROVIDED: 'Matric number not provided',
    PASSWORD_ALREADY_SET: 'Password already set',
    DATA_MISMATCH: 'There is a mismatch between the provided data and your current session',
    UNAUTHORIZED_ADMIN_ACCESS: 'Unauthorized. This is an admin only route',
    UNAUTHORIZED_SUPER_ADMIN_ACCESS: 'Unauthorized. This is a super admin only route',
    UNAUTHORIZED: 'Unauthorized',
}

export default ERROR