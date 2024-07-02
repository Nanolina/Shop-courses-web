import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';
import { Purchase } from '../wrappers/Purchase';

export async function run(provider: NetworkProvider) {
    const purchase = provider.open(
        await Purchase.fromInit('02959e9b-0c30-46a1-961a-fe144ebce033', toNano('5'), 5075565141n, 143153285n),
    );

    await purchase.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(purchase.address);

    // run methods on `customer`
}
