import fs from 'fs';
import path from 'path';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import { getLoggerFor } from '../logging/LogUtil';
import type { ResourceStore } from '../storage/ResourceStore';
import { ConflictHttpError } from '../util/errors/ConflictHttpError';
import { addGeneratedResources } from './generate/GenerateUtil';
import type { ResourcesGenerator } from './generate/ResourcesGenerator';
import type { PodManager } from './PodManager';
import type { PodSettings } from './settings/PodSettings';

export class SmartContractPodManager implements PodManager {
  protected readonly logger = getLoggerFor(this);

  private readonly store: ResourceStore;
  private readonly resourcesGenerator: ResourcesGenerator;

  protected readonly contract: any;

  public constructor(store: ResourceStore, resourcesGenerator: ResourcesGenerator) {
    this.store = store;
    this.resourcesGenerator = resourcesGenerator;

    // Caricamento ABI e creazione dell'oggetto contratto
    const abi = JSON.parse(fs.readFileSync(path.resolve('./config/ldp/authorization/abi.json'), 'utf-8'));
    const provider = new JsonRpcProvider('http://localhost:8545');
    const signer = new Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);
    this.contract = new Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', abi, signer);
  }

  public async createPod(settings: PodSettings, overwrite: boolean): Promise<void> {
    this.logger.info(`Creating pod ${settings.base.path}`);

    if (!overwrite && await this.store.hasResource(settings.base)) {
      throw new ConflictHttpError(`There already is a resource at ${settings.base.path}`);
    }

    const count = await addGeneratedResources(settings, this.resourcesGenerator, this.store);

    this.logger.info('Added ${count} resources to ${settings.base.path}');

    // Aggiungere associazione webId a wallet Address
    this.logger.info(`Email:\t ${settings.email}`);
    this.logger.info(`Name:\t ${settings.name}`);
    this.logger.info(`OidcIssuer:\t ${settings.oidcIssuer}`);
    this.logger.info(`Template:\t ${settings.template}`);
    this.logger.info(`WebId:\t ${settings.webId}`);
    this.logger.info(`Wallet:\t ${settings.walletAddress}`);

    // Transazione smart contract per assegnare il WebID al wallet
    this.logger.info(`Registrazione on-chain: wallet ${settings.walletAddress} -> WebID ${settings.webId}`);
    const tx = await this.contract.assignWalletToWebId(settings.walletAddress, settings.webId);
    await tx.wait();
    this.logger.info(`Hash transazione: ${tx.hash}`);
    this.logger.info(`Data transazione: ${tx.data}`);
  }
}
