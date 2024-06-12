import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./purchase";

contract Course with Deployable, Ownable {
    const deployFee: Int = ton("0.05");
    owner: Address; // Seller
    courseId: String;
    coursePrice: Int as coins;
    init(courseId: String, coursePrice: Int){
        self.owner = sender();
        self.courseId = courseId;
        self.coursePrice = coursePrice;
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
                body: "Create".asComment(),
                bounce: false,
                code: init.code,
                data: init.data
            }
        );
        self.reply("Сourse activated".asComment());
    }

    receive("Create"){}

    receive("New purchase"){
        let totalFee: Int = (self.deployFee + self.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        let init: StateInit = initOf Purchase(sender(), self.owner, self.courseId);
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
        self.reply("purchased".asComment());
    }

    get fun address(courseId: String, coursePrice: Int): Address {
        let init: StateInit = initOf Course(courseId, coursePrice);
        return contractAddress(init);
    }

    get fun addressPurchase(customer: Address, seller: Address, courseId: String): Address {
        let init: StateInit = initOf Purchase(customer, seller, courseId);
        return contractAddress(init);
    }

    get fun balance(): Int {
        return myBalance();
    }
}
