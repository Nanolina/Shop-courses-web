message NewSeller {
    courseId: String;
}
message NewCustomer {
    courseId: String;
    seller: Address;
    coursePrice: Int as coins;
}
