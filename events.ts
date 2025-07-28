// Step 1: Define all event types as a discriminated union

// Base event type for extension
export interface BaseEvent<K extends string, P> {
    kind: K;
    payload: P;
}

// Define distinct event types
export interface DepositEvent extends BaseEvent<'deposit', { accountId: string; amount: number; }> {}
export interface WithdrawEvent extends BaseEvent<'withdraw', { accountId: string; amount: number; }> {}
export interface TransferEvent extends BaseEvent<'transfer', { fromAccountId: string; toAccountId: string; amount: number; }> {}

// Union type of all events
export type FinancialEvent = DepositEvent | WithdrawEvent | TransferEvent;

// All valid event kind literals
export type FinancialEventKind = FinancialEvent['kind'];

// Map event kind to event type
export type FinancialEventMap = {
  deposit: DepositEvent;
  withdraw: WithdrawEvent;
  transfer: TransferEvent;
};
