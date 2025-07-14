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

  public constructor(store: ResourceStore, resourcesGenerator: ResourcesGenerator) {
    this.store = store;
    this.resourcesGenerator = resourcesGenerator;
  }

  public async createPod(settings: PodSettings, overwrite: boolean): Promise<void> {
    this.logger.info(`Creating pod ${settings.base.path}`);

    if (!overwrite && await this.store.hasResource(settings.base)) {
      throw new ConflictHttpError(`There already is a resource at ${settings.base.path}`);
    }

    const count = await addGeneratedResources(settings, this.resourcesGenerator, this.store);

    this.logger.info(`Added ${count} resources to ${settings.base.path}`);

    // Aggiungere associazione webId a wallet Address
    this.logger.info(`Email:\t ${settings.email}`);
    this.logger.info(`Name:\t ${settings.name}`);
    this.logger.info(`OidcIssuer:\t ${settings.oidcIssuer}`);
    this.logger.info(`Template:\t ${settings.template}`);
    this.logger.info(`WebId:\t ${settings.webId}`);
    this.logger.info(`Wallet:\t ${settings.walletAddress}`);
  }
}
