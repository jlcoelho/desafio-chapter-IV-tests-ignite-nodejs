enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export interface ICreateTransferAccountDTO {
  user_id: string;
  description: string;
  amount: number;
  sender_id: string;
  type: OperationType
}
