import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";

contract MarketplaceFee with Deployable, Ownable {
    const minTonForStorage: Int = ton("0.01"); // 1KB for 2.5 years
    const marketplaceFee: Int = ton("0.5");
    const gas: Int = ton("0.03");
    owner: Address;
    walletAlina: Address;
    walletSnezhanna: Address;
    init(walletAlina: Address, walletSnezhanna: Address){
        self.owner = sender();
        self.walletAlina = walletAlina;
        self.walletSnezhanna = walletSnezhanna;
    }

    receive(msg: TransferToMarketplace){
        let halfAmount: Int = self.marketplaceFee / 2;
        // Create comment
        let commentBuilder: StringBuilder = beginString();
        commentBuilder.append(msg.courseActionType);
        commentBuilder.append(": ");
        commentBuilder.append(msg.courseId);
        let comment: String = commentBuilder.toString();
        // Verify the amount of money sent
        require(context().value >= (self.marketplaceFee + self.gas), "Insufficient funds");
        // Send money to Alina
        send(SendParameters{
                to: self.walletAlina,
                value: halfAmount,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: comment.asComment(),
                bounce: false
            }
        );
        // Send money to Snezhanna
        send(SendParameters{
                to: self.walletSnezhanna,
                value: halfAmount,
                mode: SendPayGasSeparately | SendIgnoreErrors,
                body: comment.asComment(),
                bounce: false
            }
        );
    }

    receive("Withdraw"){
        require(sender() == self.owner, "Only owner is allowed to withdraw");
        send(SendParameters{
                to: sender(),
                value: ((myBalance() - context().value) - self.minTonForStorage),
                mode: (SendIgnoreErrors + SendRemainingValue)
            }
        );
    }

    get fun balance(): Int {
        return myBalance();
    }
}
