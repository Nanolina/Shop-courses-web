import "@stdlib/deploy";
import "./messages";
import "./seller";
import "./customer";

contract Factory with Deployable {
    const gasFee: Int = ton("0.2");
    const storageFee: Int = ton("0.1");
    const marketplaceFee: Int = ton("0.4");
    const owner: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh");
    init(){}

    // Create new seller contract
    // Factory => Seller
    receive(msg: NewSeller){
        let sellerInit: StateInit = self.sellerInit(sender(), msg.courseId);
        let deployFee: Int = self.deployFee();
        let totalFee: Int = self.totalFee();
        require(context().value >= totalFee, "Insufficient funds to create new course");
        send(SendParameters{
                to: contractAddress(sellerInit),
                value: deployFee,
                mode: SendIgnoreErrors,
                body: InternalNewSeller{coursePrice: msg.coursePrice}.toCell(),
                code: sellerInit.code,
                data: sellerInit.data
            }
        );
        // Sending marketplaceFee to the address of the FactoryContract owner
        send(SendParameters{to: self.owner, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
        self.reply("Course created".asComment());
    }

    // Create Customer contract
    // Factory => Customer
    receive(msg: NewCustomer){
        let customerInit: StateInit = self.customerInit(sender(), msg.courseId);
        let deployFee: Int = self.deployFee();
        // gas + storage + marketplace + course price
        let totalFee: Int = (self.totalFee() + msg.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        send(SendParameters{
                to: contractAddress(customerInit),
                value: deployFee,
                mode: SendIgnoreErrors,
                body: InternalNewCustomer{seller: msg.seller, coursePrice: msg.coursePrice}.toCell(),
                code: customerInit.code,
                data: customerInit.data
            }
        );
        dump(msg.coursePrice);
        // Sending money to seller
        send(SendParameters{to: msg.seller, value: msg.coursePrice, mode: SendIgnoreErrors});
        // Sending marketplaceFee to the address of the FactoryContract owner
        send(SendParameters{to: self.owner, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
        self.reply("Course purchased successfully".asComment());
    }

    fun deployFee(): Int {
        return (self.gasFee + self.storageFee);
    }

    fun totalFee(): Int {
        return (self.deployFee() + self.marketplaceFee);
    }

    get fun sellerInit(seller: Address, courseId: String): StateInit {
        return initOf Seller(seller, courseId);
    }

    get fun customerInit(customer: Address, courseId: String): StateInit {
        return initOf Customer(customer, courseId);
    }

    get fun balance(): Int {
        return myBalance();
    }

    get fun sellerAddress(seller: Address, courseId: String): Address {
        return contractAddress(initOf Seller(seller, courseId));
    }

    get fun customerAddress(customer: Address, courseId: String): Address {
        return contractAddress(initOf Customer(customer, courseId));
    }
}
