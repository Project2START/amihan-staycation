export const bookingTypeDefs = `#graphql
    type CheckPeriod {
        check_in: String
        check_out: String
    }

    type User {
        first_name: String
        last_name: String
    }

    type Booking {
        contact_number: String
        name: String
        check_period: CheckPeriod
        status: String
        user: User
    }

    extend type Query {
        bookingsByAdmin: [Booking]
    }
    `;
