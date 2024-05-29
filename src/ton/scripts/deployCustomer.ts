import { NetworkProvider } from '@ton/blueprint';
import { address, toNano } from '@ton/core';
import { Customer } from '../wrappers/Customer';

export async function run(provider: NetworkProvider) {
    const customer = provider.open(
        await Customer.fromInit(
            'a2153247-21b0-471b-b2ab-11cad1d35d0e',
            address('0:24ee186614c0d755460d0728d875c6ce46065c138b1d2ce5d1524b5f74715d61'),
            23n,
        ),
    );

    await customer.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(customer.address);

    // run methods on `customer`
}
