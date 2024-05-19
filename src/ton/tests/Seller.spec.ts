import { toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Seller } from '../wrappers/Seller';

describe('Seller', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let seller: SandboxContract<Seller>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        seller = blockchain.openContract(await Seller.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await seller.send(
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
            to: seller.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and sellerCotract are ready to use
    });
});
