import { address, toNano } from '@ton/core';
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
            await Purchase.fromInit(
                address('0QBW7iBmFMDXVUYNByjYdcbORgZcE4sdLOXRUktfdHFdYSiK'),
                address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'),
                '123',
            ),
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
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

    it('should send money to seller', async () => {
        const message: NewPurchase = {
            $$type: 'NewPurchase',
            coursePrice: toNano('12'),
        };
        const result = await purchase.send(
            deployer.getSender(),
            {
                value: toNano('13'),
            },
            message,
        );

        expect(result.transactions).toHaveTransaction({
            from: purchase.address,
            to: address('EQCkaRROu1Vk0sIgV7Z5CLJBNtCokgiBMeOg4Ddmv3X3sd_u'),
            value: toNano('12'),
        });
    });
});
