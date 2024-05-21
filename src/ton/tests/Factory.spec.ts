import { fromNano, toNano } from '@ton/core';
import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import '@ton/test-utils';
import { Factory } from '../wrappers/Factory';
import { Seller } from '../wrappers/Seller';

interface ExtendedEvent extends Event {
    type: 'message_sent';
    account?: any;
    from?: any;
    to?: any;
    value?: bigint;
    body?: any;
    bounced?: boolean;
}

describe('Factory', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let factory: SandboxContract<Factory>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        factory = blockchain.openContract(await Factory.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResultFactory = await factory.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResultFactory.transactions).toHaveTransaction({
            from: deployer.address,
            to: factory.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and factoryCotract are ready to use
    });

    it('should create new seller contract', async () => {
        // Factory
        const result = await factory.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'NewSeller',
                courseId: 'a3253247-21b0-471b-b2ab-11cad1d35d0e',
                coursePrice: 12n,
            },
        );
        const factoryBalance = parseFloat(fromNano(await factory.getBalance()));

        // New seller
        const sellerAddress = await factory.getSellerAddress(
            await deployer.getSender().address,
            'a3253247-21b0-471b-b2ab-11cad1d35d0e',
        );
        const seller = blockchain.openContract(Seller.fromAddress(sellerAddress));
        const sellerBalance = parseFloat(fromNano(await seller.getBalance()));

        expect(factoryBalance).toBeGreaterThan(0.6);
        expect(factoryBalance).toBeLessThan(0.7);
        expect(sellerBalance).toBeGreaterThan(0.2);
        expect(sellerBalance).toBeLessThan(0.3);
        expect((result.events[0] as ExtendedEvent).bounced).toEqual(false);
        expect((result.events[1] as ExtendedEvent).bounced).toEqual(false);
        expect((result.events[3] as ExtendedEvent).type).toEqual('account_created');
    });
});
