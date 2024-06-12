import "@stdlib/deploy";
import "./messages";

contract MarketplaceFee with Deployable {
    const marketplaceFee: Int = ton("0.8");
    walletAlina: Address;
    walletSnezhanna: Address;
    init(walletAlina: Address, walletSnezhanna: Address){
        self.walletAlina = walletAlina;
        self.walletSnezhanna = walletSnezhanna;
    }

    receive(msg: TransferToMarketplace){
        let halfAmount: Int = self.marketplaceFee / 2;
        require(context().value >= self.marketplaceFee, "Insufficient funds");
        // Send money to Alina
        send(SendParameters{
                to: self.walletAlina,
                value: halfAmount,
                mode: SendIgnoreErrors,
                body: msg.courseId.asComment()
            }
        );
        // Send money to Snezhanna
        send(SendParameters{
                to: self.walletSnezhanna,
                value: halfAmount,
                mode: SendIgnoreErrors,
                body: msg.courseId.asComment()
            }
        );
        // Send money back
        self.reply("sent".asComment());
    }
}
