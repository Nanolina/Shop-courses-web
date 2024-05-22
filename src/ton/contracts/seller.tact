import "@stdlib/deploy";
import "./messages";

contract Seller with Deployable {
    seller: Address;
    courseId: String;
    coursePrice: Int as coins = 0;
    init(seller: Address, courseId: String){
        self.seller = seller;
        self.courseId = courseId;
    }

    receive(msg: InternalNewSeller){
        self.coursePrice = msg.coursePrice;
    }

    get fun balance(): Int {
        return myBalance();
    }
}
