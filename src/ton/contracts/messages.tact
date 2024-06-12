message NewCourse {
    courseId: String;
    coursePrice: Int as coins;
}
message NewPurchase {
    coursePrice: Int as coins;
}
message TransferToMarketplace {
    courseId: String;
}
