import { FinancialEvent } from './events';
import { createPlugin } from './plugins';
import { processEventPipeline } from './pipeline';

// Step 4: Define plugins with strict event type safety

// Plugin that rejects withdrawals over a certain threshold
const largeWithdrawalCensor = createPlugin({
    name: 'LargeWithdrawalCensor',
    kinds: ['withdraw'],
    handlers: {
        withdraw(event) {
            if (event.payload.amount > 10000) {
                // Silently filter out the event (e.g. produce no output)
                return;
            }
            return event;
        }
    }
});

// Plugin that splits large deposits into chunks
const depositChunker = createPlugin({
    name: 'DepositChunker',
    kinds: ['deposit'],
    handlers: {
        deposit(event) {
            if (event.payload.amount > 5000) {
                const half = event.payload.amount / 2;
                return [
                    { ...event, payload: { ...event.payload, amount: half } },
                    { ...event, payload: { ...event.payload, amount: half } }
                ];
            }
            return event;
        }
    }
});

// Plugin that logs all transfers
const transferLogger = createPlugin({
    name: 'TransferLogger',
    kinds: ['transfer'],
    handlers: {
        transfer(event) {
            console.log('Transfer:', event);
            return event;
        }
    }
});

const allPlugins = [largeWithdrawalCensor, depositChunker, transferLogger] as const;

// Step 5: Demonstration
const inputEvents: FinancialEvent[] = [
    { kind: 'deposit', payload: { accountId: 'a1', amount: 12000 } },
    { kind: 'deposit', payload: { accountId: 'a2', amount: 1200 } },
    { kind: 'withdraw', payload: { accountId: 'a1', amount: 9900 } },
    { kind: 'withdraw', payload: { accountId: 'a2', amount: 22000 } },
    { kind: 'transfer', payload: { fromAccountId: 'a1', toAccountId: 'a3', amount: 123 } },
];

for (const evt of inputEvents) {
    const resultEvents = processEventPipeline(allPlugins, evt);
    for (const outEvt of resultEvents) {
        console.log('output:', outEvt);
    }
}
