import axios, { AxiosResponse } from 'axios';
import { Service, Inject } from 'typedi';
import { EventDispatcher, EventDispatcherInterface } from '../../../../decorators/eventDispatcher';
import { prefixQueryParams } from '../../../../utils';
import config from '../../../../config';

@Service()
export default class EtheriumService {
  constructor(
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
  ) {}


  public async GetEndpointsWithPrefix({
    data
  }: {
    data: object;
  }): Promise<AxiosResponse> {
    try {
      this.logger.silly(`Fetching Eth node ...`);
      const url = await prefixQueryParams(config.bscScanUrl, data);
      const result = await axios.get(
        `${url}`,
      );
      return result;
    } catch (e) {
      this.logger.error(e);
      console.log('driver error ', e);
      throw e;
    }
  }
}