// Create a new course
message NewSeller {
    courseId: String;
    coursePrice: Int as coins;
}
// FactoryContract => SellerContract
message InternalNewSeller {
    coursePrice: Int as coins;
}
