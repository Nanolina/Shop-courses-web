message NewCourse {
    courseId: String;
    coursePrice: Int as coins;
}
message CreateCourse {
    seller: Address;
}
message NewPurchase {
    coursePrice: Int as coins;
}
message TransferToMarketplace {
    courseId: String;
    courseActionType: String;
}
