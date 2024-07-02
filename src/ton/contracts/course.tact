import "@stdlib/deploy";
import "./messages";
import "./purchase";

contract Course with Deployable {
    const deployFee: Int = ton("0.05");
    courseId: String;
    coursePrice: Int as coins;
    seller: Address;
    sellerId: Int as uint64;
    init(courseId: String, coursePrice: Int, sellerId: Int){
        self.courseId = courseId;
        self.coursePrice = coursePrice;
        self.seller = newAddress(0, 0);
        self.sellerId = sellerId;
    }

    receive(msg: NewCourse){
        require(context().value >= self.deployFee, "Insufficient funds to create a course");
        let init: StateInit = initOf Course(msg.courseId, msg.coursePrice, msg.sellerId);
        let address: Address = contractAddress(init);
        // Create new course contract with new data
        send(SendParameters{
                to: address,
                value: 0,
                mode: SendIgnoreErrors | SendRemainingValue,
                body: CreateCourse{seller: sender()}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }

    receive(msg: CreateCourse){
        self.seller = msg.seller;
    }

    receive(msg: NewPurchase){
        let totalFee: Int = (self.deployFee * 3 + self.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        let init: StateInit = initOf Purchase(msg.customerId, myAddress());
        let purchaseAddress: Address = contractAddress(init);
        // Create Purchase contract
        send(SendParameters{
                to: purchaseAddress,
                value: 0,
                mode: SendIgnoreErrors | SendRemainingValue,
                body: CreatePurchase{seller: self.seller, coursePrice: self.coursePrice, courseId: self.courseId}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }

    get fun address(courseId: String, coursePrice: Int, sellerId: Int): Address {
        let init: StateInit = initOf Course(courseId, coursePrice, sellerId);
        return contractAddress(init);
    }

    get fun addressPurchase(customerId: Int, parent: Address): Address {
        let init: StateInit = initOf Purchase(customerId, parent);
        return contractAddress(init);
    }
}
