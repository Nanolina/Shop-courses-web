import "@stdlib/deploy";
import "./messages";
import "./purchase";

contract Course with Deployable {
    const deployFee: Int = ton("0.05");
    courseId: String;
    coursePrice: Int as coins;
    seller: Address;
    init(courseId: String, coursePrice: Int){
        self.courseId = courseId;
        self.coursePrice = coursePrice;
        self.seller = newAddress(0, 0);
    }

    receive(msg: NewCourse){
        require(context().value >= self.deployFee, "Insufficient funds to create a course");
        let init: StateInit = initOf Course(msg.courseId, msg.coursePrice);
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

    receive("New purchase"){
        let totalFee: Int = (self.deployFee * 3 + self.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        let init: StateInit = initOf Purchase(sender(), self.seller, self.courseId);
        let purchaseAddress: Address = contractAddress(init);
        // Create Purchase contract
        send(SendParameters{
                to: purchaseAddress,
                value: 0,
                mode: SendIgnoreErrors | SendRemainingValue,
                body: NewPurchase{coursePrice: self.coursePrice}.toCell(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
    }

    get fun address(courseId: String, coursePrice: Int): Address {
        let init: StateInit = initOf Course(courseId, coursePrice);
        return contractAddress(init);
    }

    get fun addressPurchase(customer: Address, seller: Address, courseId: String): Address {
        let init: StateInit = initOf Purchase(customer, seller, courseId);
        return contractAddress(init);
    }
}
