import { AccessChecker, AccessCheckerArgs } from './AccessChecker';
import { ethers } from "ethers";

// Mappa le modalità ACL stringa all'enum Solidity
const accessModeMap: Record<string, number> = {
  'http://www.w3.org/ns/auth/acl#Read': 0,
  'http://www.w3.org/ns/auth/acl#Write': 1,
  'http://www.w3.org/ns/auth/acl#Append': 2,
  'http://www.w3.org/ns/auth/acl#Create': 3,
  'http://www.w3.org/ns/auth/acl#Delete': 4,
};

export class SmartContractAccessChecker extends AccessChecker {
  private contract: any;

  constructor(contractAddress: string, abi: any, provider: any) {
    super();
    this.contract = new ethers.Contract(contractAddress, abi, provider);
  }

  public async handle({ credentials, rule }: AccessCheckerArgs): Promise<boolean> {
    const walletAddress = credentials.agent?.walletAddress;
    if (!walletAddress) {
      return false;
    }

    // Estrai resource e mode
    const resource = (rule as any).subject?.value || rule.value;
    const modeUri = (rule as any).predicate?.value || '';
    const mode = accessModeMap[modeUri];

    if (mode === undefined) {
      console.error('SmartContractAccessChecker: Unsupported access mode', modeUri);
      return false;
    }

    try {
      const hasAccess: boolean = await this.contract.isAuthorized(walletAddress, resource, mode);
      return hasAccess;
    } catch (error) {
      console.error('SmartContractAccessChecker error:', error);
      return false;
    }
  }
}