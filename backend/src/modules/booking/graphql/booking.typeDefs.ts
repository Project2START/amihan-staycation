export const bookingTypeDefs = `#graphql
    type CheckPeriod {
        check_in: String
        check_out: String
    }

    type User {
        first_name: String
        last_name: String
    }

    type Product {
        name: String
        id: String
    }

    type PaymentMethod {
        payment_method: String
        account_name: String
        account_number: String
        image_url: String
        id: String
    }

    type PoolAccess {
        am: Boolean
        pm: Boolean
        date: String
    }

    type Pool {
        hasAccess: Boolean
        access: [PoolAccess]
    }

    type AdditionalGuest {
        age: Int
        name: String
        pool_access: Pool
        with_vehicle: Boolean
        below_three_feet: Boolean
        image_valid_id_url: String
    }

    type AdminBookings {
        contact_number: String
        name: String
        check_period: CheckPeriod
        status: String!
        user: User
        product: Product
        id: String!
    }

    type UserBookings {
        status: String!
        id: String!
    }

    type BookingHistory {
    message: String
    hasUserResponded: Boolean!
    ownerName: String
    }

    type Booking {
        id: String!
        status: String!
        createdAt: String
        product: Product
        check_period: CheckPeriod
        name: String
        age: Int
        nationality: String
        contact_number: String
        pool_access: Pool
        with_vehicle: Boolean
        image_valid_id_url: String
        additional_guests: [AdditionalGuest]
        image_payment_proof_url: String
        userId: String
        paymentMethod: PaymentMethod
        history: [BookingHistory]
    }

    extend type Query {
        bookingsByAdmin: [AdminBookings]
        bookingById(id: String!): Booking
        bookingsByUser: [UserBookings]
    }
    `;
