import { address, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Seller } from '../wrappers/Seller';

describe('Seller', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let seller: SandboxContract<Seller>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        seller = blockchain.openContract(
            await Seller.fromInit(
                address('0:13ee106614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
                'a3253247-21b0-471b-b2ab-11cad1d35d0e',
            ),
        );

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
