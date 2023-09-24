export interface IFit {
    _id?: string;
    userId?: string;
    loanPurpose: string,
    paybackTime: string,
    howToPayback: string,
    amount: string,
    collateral: string,
    surety: string,
    contingencyPlan: string,
    loanAlternative: string,
    whySwiftlynx: string,
    usefulToYou: string
    branch: string;
    status: string;
    delete: Boolean;
  }
  
  export interface IFitInputDTO {
    userId?: string;
    loanPurpose: string,
    paybackTime: string,
    howToPayback: string,
    amount: string,
    collateral: string,
    surety: string,
    contingencyPlan: string,
    loanAlternative: string,
    whySwiftlynx: string,
    usefulToYou: string
    branch: string;
  }
  
  export interface IFitUpdateDTO {
    userId?: string;
    loanPurpose: string,
    paybackTime: string,
    howToPayback: string,
    amount: string,
    collateral: string,
    surety: string,
    contingencyPlan: string,
    loanAlternative: string,
    whySwiftlynx: string,
    usefulToYou: string
    branch: string;
  }
  