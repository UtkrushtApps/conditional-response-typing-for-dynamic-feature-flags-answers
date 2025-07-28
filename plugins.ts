import { FinancialEvent, FinancialEventKind, FinancialEventMap } from './events';

// Step 2: Define the Plugin interface with type safety enforcement

// A Plugin can register handlers for a subset of event kinds
export type PluginHandlers<SupportedKinds extends FinancialEventKind> = {
    [K in SupportedKinds]: (event: FinancialEventMap[K]) => FinancialEvent | FinancialEvent[] | void;
};

export interface Plugin<SupportedKinds extends FinancialEventKind = FinancialEventKind> {
    name: string;
    kinds: SupportedKinds[];
    handlers: PluginHandlers<SupportedKinds>;
}

// Helper to create plugins with strict event typing
export function createPlugin<K extends FinancialEventKind>(plugin: Plugin<K>): Plugin<K> {
    return plugin;
}