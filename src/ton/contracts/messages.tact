message NewCourse {
    courseId: String;
    coursePrice: Int as coins;
    sellerId: Int as uint64;
}
message NewPurchase {
    customerId: Int as uint64;
}
message CreateCourse {
    seller: Address;
}
message CreatePurchase {
    seller: Address;
    coursePrice: Int as coins;
    courseId: String;
}
message TransferToMarketplace {
    courseId: String;
}
