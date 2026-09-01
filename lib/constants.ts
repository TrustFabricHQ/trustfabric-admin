export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Closed"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-500", "500+"] as const;

export interface Lead {
  id: number;
  name: string;
  company: string;
  email: string;
  phone: string;
  size: string | null;
  message: string | null;
  status: LeadStatus;
  consent_marketing: boolean;
  consent_data: boolean;
  created_at: string;
  updated_at: string;
}
