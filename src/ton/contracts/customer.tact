import "@stdlib/deploy";
import "./messages";

contract Customer with Deployable {
    const gasFee: Int = ton("0.1");
    const storageFee: Int = ton("0.1");
    const marketplaceFee: Int = ton("0.3");
    const marketplaceWallet: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh");
    customer: Address;
    courseId: String;
    coursePrice: Int as coins = 0;
    seller: Address = address("0:0000000000000000000000000000000000000000000000000000000000000000");
    init(customer: Address, courseId: String){
        self.customer = customer;
        self.courseId = courseId;
    }

    receive(msg: NewCustomer){
        let customerInit: StateInit = initOf Customer(sender(), msg.courseId);
        let customerAddress: Address = contractAddress(customerInit);
        let deployFee: Int = self.deployFee(); // 0.2
        let totalFee: Int = self.totalFee(msg.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        send(SendParameters{
                to: customerAddress,
                value: 0,
                mode: (SendRemainingValue + SendIgnoreErrors),
                body: Deploy{queryId: 0}.toCell(),
                code: customerInit.code,
                data: customerInit.data
            }
        );
        dump(myBalance());
        // Sending money to seller
        send(SendParameters{to: msg.seller, value: msg.coursePrice, mode: SendIgnoreErrors});
        // Sending marketplaceFee
        send(SendParameters{to: self.marketplaceWallet, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
        self.reply("Course purchased successfully".asComment());
    }

    fun deployFee(): Int {
        return (self.gasFee + self.storageFee);
    }

    fun totalFee(coursePrice: Int): Int {
        return ((self.deployFee() + self.marketplaceFee) + coursePrice);
    }

    get fun balance(): Int {
        return myBalance();
    }
}
