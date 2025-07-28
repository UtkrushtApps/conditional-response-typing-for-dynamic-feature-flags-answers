import { FinancialEvent, FinancialEventKind } from './events';
import { Plugin } from './plugins';

// Step 3: Enforce exhaustiveness in the processing pipeline

// Exhaustive check utility
function assertNever(x: never): never {
    throw new Error(`Unhandled event kind: ${(x as any)?.kind}`);
}

// Applies a list of plugins (in order) to an incoming event
// Ensures each plugin only sees event types it supports
export function processEventPipeline<AllPlugins extends Plugin<any>[] = Plugin<any>[]>
    (plugins: AllPlugins, event: FinancialEvent): FinancialEvent[] {
    let resultEvents: FinancialEvent[] = [event];
    for (const plugin of plugins) {
        const nextEvents: FinancialEvent[] = [];
        for (const e of resultEvents) {
            if (plugin.kinds.includes(e.kind)) {
                // e is now properly typed according to the handler
                const handler = plugin.handlers[e.kind as typeof plugin.kinds[number]] as (ev: any) => any;
                if (!handler) {
                    // Compile-time: impossible, all kinds[] must be present in handlers
                    throw new Error(`Plugin '${plugin.name}' missing handler for ${e.kind}`);
                }
                const out = handler(e as any);
                if (Array.isArray(out)) {
                    nextEvents.push(...out);
                } else if (out) {
                    nextEvents.push(out);
                } // else filtered
            } else {
                // Plugin ignores this event
                nextEvents.push(e);
            }
        }
        resultEvents = nextEvents;
    }
    return resultEvents;
}

// Utility for exhaustive switch/case event handling
export function exhaustiveEventHandler<T extends FinancialEvent, R>(
    event: T,
    handlers: { [K in T['kind']]: (ev: Extract<T, { kind: K }>) => R }
): R {
    switch (event.kind) {
        case 'deposit': return handlers['deposit'](event as any);
        case 'withdraw': return handlers['withdraw'](event as any);
        case 'transfer': return handlers['transfer'](event as any);
        default: return assertNever(event);
    }
}