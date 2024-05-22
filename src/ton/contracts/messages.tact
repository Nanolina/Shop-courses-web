message NewSeller {
    courseId: String;
}
message NewCustomer {
    seller: Address;
    courseId: String;
    coursePrice: Int as coins;
}
