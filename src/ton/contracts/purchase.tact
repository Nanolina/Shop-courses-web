import "@stdlib/deploy";
import "./messages";

contract Purchase with Deployable {
    const deployFee: Int = ton("0.05");
    courseId: String;
    coursePrice: Int as coins;
    sellerId: Int as uint64;
    customerId: Int as uint64;
    customer: Address;
    init(courseId: String, coursePrice: Int, sellerId: Int, customerId: Int){
        self.courseId = courseId;
        self.coursePrice = coursePrice;
        self.sellerId = sellerId;
        self.customerId = customerId;
        self.customer = newAddress(0, 0);
    }

    receive(msg: NewPurchase){
        require(context().value >= self.deployFee, "Insufficient funds to buy a course");
        let init: StateInit = initOf Purchase(msg.courseId, msg.coursePrice, msg.sellerId, msg.customerId);
        let address: Address = contractAddress(init);
        // Create new purchase contract with new data
        send(SendParameters{
                to: address,
                value: 0,
                mode: SendIgnoreErrors | SendRemainingValue,
                body: CreatePurchase{customer: sender()}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }

    receive(msg: CreatePurchase){
        self.customer = msg.customer;
    }

    receive("Withdraw"){
        require(sender() == self.customer, "Only customer is allowed to withdraw");
        send(SendParameters{to: sender(), value: 0, mode: (SendIgnoreErrors + SendRemainingBalance)});
    }

    get fun address(courseId: String, coursePrice: Int, sellerId: Int, customerId: Int): Address {
        let init: StateInit = initOf Purchase(courseId, coursePrice, sellerId, customerId);
        return contractAddress(init);
    }

    get fun balance(): Int {
        return myBalance();
    }
}
