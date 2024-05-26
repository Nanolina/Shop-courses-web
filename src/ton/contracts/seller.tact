import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract Seller with Deployable, Ownable {
    const gasFee: Int = ton("0.1");
    const storageFee: Int = ton("0.1");
    const marketplaceFee: Int = ton("0.3");
    const marketplaceWalletAddress: Address = address("0QCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sTmh");
    owner: Address;
    courseId: String;
    init(courseId: String){
        self.owner = sender();
        self.courseId = courseId;
    }

    receive(msg: NewSeller){
        let sellerInit: StateInit = initOf Seller(msg.courseId);
        let sellerAddress: Address = contractAddress(sellerInit);
        let deployFee: Int = self.deployFee(); // 0.2
        let totalFee: Int = self.totalFee(); // 0.5
        require(context().value >= totalFee, "Insufficient funds to create new course");
        // Send marketplaceFee
        send(SendParameters{to: self.marketplaceWalletAddress, value: self.marketplaceFee, mode: SendIgnoreErrors});
        // Create new seller contract
        send(SendParameters{
                to: sellerAddress,
                value: 0,
                mode: (SendIgnoreErrors + SendRemainingValue),
                body: Deploy{queryId: 0}.toCell(),
                code: sellerInit.code,
                data: sellerInit.data
            }
        );
        dump(myBalance());
        self.reply("The course has been created successfully".asComment());
    }

    fun deployFee(): Int {
        return (self.gasFee + self.storageFee);
    }

    fun totalFee(): Int {
        return (self.deployFee() + self.marketplaceFee);
    }

    get fun balance(): Int {
        return myBalance();
    }
}
