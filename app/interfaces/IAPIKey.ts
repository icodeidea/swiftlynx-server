export interface IAPIKey {
  _id: string;
  user: string;
  plan?: 'BASIC' | 'PRO' | 'ENTERPRISE' | 'PROMO';
  apis: Array<{
    key: string;
    expires?: string;
    name: string;
    active?: boolean;
    account: string;
  }>;
}

export interface IAPIKeyInputDTO {
  name: string;
  api: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
}
