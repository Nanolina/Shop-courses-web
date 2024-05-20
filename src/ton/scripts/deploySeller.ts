import { NetworkProvider } from '@ton/blueprint';
import { address, toNano } from '@ton/core';
import { Seller } from '../wrappers/Seller';

export async function run(provider: NetworkProvider) {
    const seller = provider.open(
        await Seller.fromInit(
            address('0:12ee206614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
            'a2153247-21b0-471b-b2ab-11cad1d35d0e',
        ),
    );

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
