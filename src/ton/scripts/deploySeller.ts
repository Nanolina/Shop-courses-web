import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';
import { Seller } from '../wrappers/Seller';

export async function run(provider: NetworkProvider) {
    const seller = provider.open(await Seller.fromInit('a2153247-21b0-471b-b2ab-11cad1d35d0e'));

    await seller.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(seller.address);

    // run methods on `seller`
}
