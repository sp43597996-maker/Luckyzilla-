export type Language = 'en' | 'hi';

export interface PrizeItem {
  id: string;
  rankRange: string;
  rankStart: number;
  rankEnd: number;
  count: number;
  title: string;
  titleHi: string;
  category: 'Luxury Car' | 'Supercar' | 'Premium SUV' | 'Superbike' | 'Electric SUV' | 'Classic Motorcycle';
  estimatedValueINR: number;
  specs: string;
  specsHi: string;
  deliveryTerms: string;
  tdsApplicable: string;
  verifiedOwnershipDoc: boolean;
  docStatus: 'Documentation Pending Regulatory Inspection' | 'Procurement Escrow Verified' | 'Manufacturer Allocation Letter';
  accentColor: string;
}

export interface UserAccount {
  id: string;
  mobile: string;
  maskedMobile: string;
  email?: string;
  dob: string;
  age: number;
  state: string;
  status: 'ACTIVE_SIMULATED' | 'SUSPICIOUS_DUPLICATE' | 'RESTRICTED_JURISDICTION';
  registeredAt: string;
  lastLoginAt: string;
  termsAccepted: boolean;
  tickets: string[];
  walletBalance: number;
  simulatedDeviceHash: string;
}

export interface TicketEntry {
  ticketId: string;
  userId: string;
  maskedUserId: string;
  registeredAt: string;
  amountPaid: number;
  currency: string;
  status: 'ELIGIBLE_FOR_DRAW' | 'EXCLUDED_DUPLICATE' | 'EXCLUDED_JURISDICTION';
}

export interface DrawWinner {
  rank: number;
  prizeId: string;
  prizeTitle: string;
  prizeCategory: string;
  prizeValueINR: number;
  ticketId: string;
  userId: string;
  maskedUserId: string;
  state: string;
  acceptanceStatus: 'PENDING_DOCUMENTATION' | 'KYC_VERIFIED' | 'DISPATCH_IN_TRANSIT' | 'HANDOVER_COMPLETED';
  cashAlternativeRequested: boolean;
}

export interface DrawRecord {
  drawId: string;
  executedAt: string;
  snapshotId: string;
  snapshotSha256: string;
  drawSeed: string;
  drawSha256: string;
  algorithmVersion: string;
  totalEligibleCount: number;
  totalWinnersCount: number;
  officersApproved: string[];
  winners: DrawWinner[];
  nonWinnerRewardCoinsAwarded: number;
  verificationReportUrl: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  timestamp: string;
  type: 'DRAW_PARTICIPATION_REWARD' | 'PROMOTIONAL_SIMULATION_CREDIT' | 'REDEMPTION_REQUEST_BLOCKED';
  amountCoins: number;
  valueINR: number;
  balanceAfter: number;
  description: string;
  descriptionHi: string;
  status: 'SETTLED' | 'BLOCKED_STATUTORY_REQUIREMENT';
  auditHash: string;
}

export interface JurisdictionRule {
  code: string;
  name: string;
  nameHi: string;
  status: 'PERMITTED_PROMOTIONAL' | 'RESTRICTED_PENDING_REVIEW' | 'PROHIBITED_STATE_GAMING_ACT';
  statute: string;
  lastAudited: string;
  eligibleForDraw: boolean;
}

export interface SystemStatus {
  appName: string;
  version: string;
  environment: string;
  system: {
    mode: string;
    legalApprovalStatus: string;
    realMoneyCollectionBlocked: boolean;
    cashRedemptionBlocked: boolean;
    registrationFeeINR: number;
    targetCapacity: number;
    currentRegistrations: number;
    twoPersonApprovalEnabled: boolean;
  };
  totalRegistrations: number;
  targetCapacity: number;
  targetReached: boolean;
  totalPrizesValueINR: number;
  legalNotice: string;
}
