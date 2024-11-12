export const attacks = [
  {
    id: 1,
    txHash:
      '0x3b6e1a8ef8d3c946d93f4ab17339fa1a8e1f8b2c4c5d6f7a8e9b1c3d4e5f6a7b',
    attackTime: '2023-10-01T14:23:00Z',
    isFlashLoan: true,
    attackerAddress: '0x9a67efc3b4f9b8d5c1e0f7a9a8b4c1f3d9a0b8e1',
    victimAddress: '0x7e91c6b2d1a3f4e5d8f9a8c4b3e0d1f7c2a6b4e3',
    amountLostInDollars: 50000.75,
    severity: 'high',
  },
  {
    id: 2,
    txHash:
      '0x4c5f7d8e1a2b3c9e0d1f7a9b6e1d8c7a9f3b5a2e4d7c8b9f2a1e0d3b6c5f4e2a',
    attackTime: '2023-10-03T09:15:00Z',
    isFlashLoan: false,
    attackerAddress: '0x8d5a3b6e1c9f2a0b7a9e4f6d8b3c7e1f5a2c9b8f',
    victimAddress: '0x5c2e1b7a3f4d8c9e1a0b6d3e7f9b5a2d6c1f8b3a',
    amountLostInDollars: 12000.5,
    severity: 'moderate',
  },
  {
    id: 3,
    txHash:
      '0x5b7f8c9e3d4a1b2f6c3e8d1f0a7c9b4e6a1f2d3e7b8a5c1d0e3f6c9a7e2b4f1d',
    attackTime: '2023-10-04T16:42:00Z',
    isFlashLoan: true,
    attackerAddress: '0x3a6c5e1b9d7a2f8e4c0b3f1d7e9a0b5f4c2e1a9b',
    victimAddress: null,
    amountLostInDollars: 7000.0,
    severity: 'low',
  },
  {
    id: 4,
    txHash:
      '0x9e2a7b1f6c3d0b5a4f1e8c7d9a0b2e5c3f6a1b7d8c9f0e3d4b2a1f8c6e9d4b7f',
    attackTime: '2023-10-05T21:05:00Z',
    isFlashLoan: false,
    attackerAddress: '0x1f8c7d9a0b3c2a4e5d6b7f8e9c0a1b5d7e4c6f9e',
    victimAddress: '0x5b8c7e9d3a1f4c2e5f6d8b0a7c9e2d1f3b5a9f6a',
    amountLostInDollars: 200000.0,
    severity: 'critical',
  },
];
