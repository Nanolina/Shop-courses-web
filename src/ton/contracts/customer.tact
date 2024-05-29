import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract Customer with Deployable, Ownable {
    const gasFee: Int = ton("0.1");
    const storageFee: Int = ton("0.1");
    const marketplaceFee: Int = ton("0.3");
    const marketplaceWalletAddress: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh");
    owner: Address;
    courseId: String;
    coursePrice: Int as coins;
    seller: Address;
    init(courseId: String, seller: Address, coursePrice: Int){
        self.owner = sender();
        self.courseId = courseId;
        self.seller = seller;
        self.coursePrice = coursePrice;
    }

    receive(msg: NewCustomer){
        let customerInit: StateInit = initOf Customer(msg.courseId, msg.seller, msg.coursePrice);
        let customerAddress: Address = contractAddress(customerInit);
        let deployFee: Int = self.deployFee(); // 0.2
        let totalFee: Int = self.totalFee(msg.coursePrice);
        require(context().value >= totalFee, "Insufficient funds to buy a course");
        // Sending money to seller
        send(SendParameters{to: msg.seller, value: msg.coursePrice, mode: SendIgnoreErrors});
        // Sending marketplaceFee
        send(SendParameters{to: self.marketplaceWalletAddress, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Response about success
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
