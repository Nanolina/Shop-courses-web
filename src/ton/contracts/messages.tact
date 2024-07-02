message NewCourse {
    courseId: String;
    coursePrice: Int as coins;
    sellerId: Int as uint64;
}
message NewPurchase {
    courseId: String;
    coursePrice: Int as coins;
    sellerId: Int as uint64;
    customerId: Int as uint64;
}
message CreateCourse {
    seller: Address;
}
message CreatePurchase {
    customer: Address;
}
message TransferToMarketplace {
    courseId: String;
}
