import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract Purchase with Deployable, Ownable {
    const deployFee: Int = ton("0.01");
    owner: Address; // parent - Course contract
    customer: Address;
    seller: Address;
    courseId: String;
    init(customer: Address, seller: Address, courseId: String){
        self.owner = sender();
        self.customer = customer;
        self.seller = seller;
        self.courseId = courseId;
    }

    receive(msg: NewPurchase){
        require(sender() == self.owner, "Data available only for parent Course");
        // Send money to seller
        send(SendParameters{to: self.seller, value: (msg.coursePrice + self.deployFee), mode: SendIgnoreErrors});
        self.reply(self.courseId.asComment());
    }

    get fun balance(): Int {
        return myBalance();
    }
}
