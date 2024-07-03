import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { NewPurchase, Purchase } from '../wrappers/Purchase';

describe('Purchase', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let purchase: SandboxContract<Purchase>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        purchase = blockchain.openContract(
            await Purchase.fromInit('02959e9b-0c30-46a1-961a-fe144ebce033', toNano('1'), 5075565141n, 2341674627n),
        );

        deployer = await blockchain.treasury('deployer');

        const deployPurchaseResult = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployPurchaseResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: purchase.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and customer are ready to use
    });

    it('should create new purchase contract with new data', async () => {
        const newPurchaseAddress = await purchase.getAddress('345', toNano('3'), 6015565141n, 3856305638n);
        const message: NewPurchase = {
            $$type: 'NewPurchase',
            courseId: '345',
            coursePrice: toNano('3'),
            sellerId: 6015565141n,
            customerId: 3856305638n,
        };
        const result = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.07'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: purchase.address,
            to: newPurchaseAddress,
            deploy: true,
            success: true,
        });
    });

    it('should throw an error if there is not enough money when purchasing a course', async () => {
        const message: NewPurchase = {
            $$type: 'NewPurchase',
            courseId: '345',
            coursePrice: toNano('5'),
            sellerId: 6015565141n,
            customerId: 3856305638n,
        };
        const result = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.03'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: deployer.address,
            to: purchase.address,
            deploy: false,
            success: false,
        });
    });

    it('should withdraw money to customer', async () => {
        const result = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Withdraw',
        );

        expect(result.transactions).toHaveTransaction({
            from: purchase.address,
            to: deployer.address,
            success: true,
        });
    });

    it('should throw an error if the withdrawal is not made by the customer', async () => {
        const result: any = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Withdraw',
        );

        expect(result.events[1].from).toEqualAddress(purchase.address);
        expect(result.events[1].to).toEqualAddress(deployer.address);
        expect(result.events[1].bounced).toBe(true);
    });
});
