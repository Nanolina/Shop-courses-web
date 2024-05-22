import "@stdlib/deploy";
import "./messages";

contract Customer with Deployable {
    customer: Address;
    courseId: String;
    coursePrice: Int as coins = 0;
    seller: Address = address("0:0000000000000000000000000000000000000000000000000000000000000000");
    init(customer: Address, courseId: String){
        self.customer = customer;
        self.courseId = courseId;
    }

    receive(msg: InternalNewCustomer){
        self.seller = msg.seller;
        self.coursePrice = msg.coursePrice;
    }

    get fun balance(): Int {
        return myBalance();
    }
}
