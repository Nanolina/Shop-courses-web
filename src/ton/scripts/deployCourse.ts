import { NetworkProvider } from '@ton/blueprint';
import { toNano } from '@ton/core';
import { Course } from '../wrappers/Course';

export async function run(provider: NetworkProvider) {
    const course = provider.open(
        await Course.fromInit('02959e9b-0c30-46a1-961a-fe144ebce033', toNano('1'), 5075565141n),
    );

    await course.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(course.address);

    // run methods on `course`
}
