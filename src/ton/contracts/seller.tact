import "@stdlib/deploy";
import "./messages";

contract Seller with Deployable {
    seller: Address;
    courseId: String;
    numCustomers: Int as uint256 = 0;
    coursePrice: Int as coins = 0;
    init(seller: Address, courseId: String){
        self.seller = seller;
        self.courseId = courseId;
    }

    receive(msg: InternalNewSeller){
        // require(self.seller == sender(), "Only the course creator");
        self.coursePrice = msg.coursePrice;
        self.numCustomers = (self.numCustomers + 1);
    }

    get fun numCustomers(): Int {
        return self.numCustomers;
    }
}
