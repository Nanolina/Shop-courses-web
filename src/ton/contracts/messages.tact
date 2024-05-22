// Create new course
message NewSeller {
    courseId: String;
    coursePrice: Int as coins;
}
// Factory => Seller
message InternalNewSeller {
    coursePrice: Int as coins;
}
// Buy a course
message NewCustomer {
    seller: Address;
    courseId: String;
    coursePrice: Int as coins;
}
// Factory => Customer
message InternalNewCustomer {
    seller: Address;
    coursePrice: Int as coins;
}
