import { NetworkProvider } from '@ton/blueprint';
import { Address, toNano } from '@ton/core';
import { Purchase } from '../wrappers/Purchase';

export async function run(provider: NetworkProvider) {
    const purchase = provider.open(
        await Purchase.fromInit(
            Address.parse('EQDcFi9MwpBujzUCFxx5d291KG_CkYBQSpYr01HMroaKlFLw'),
            Address.parse('EQBdyZo6fpzRokWc3K95-TdPa1580Ylxbp4Y9AUIEzGY4svj'),
            Address.parse('EQDcFi9MwpBujzUCFxx5d291KG_CkYBQSpYr01HMroaKlFLw'),
        ),
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
