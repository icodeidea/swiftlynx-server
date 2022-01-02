  import { Service, Inject } from 'typedi';
  import jwt from 'jsonwebtoken';
  import { MailerService } from '../mailer';
  import config from '../../config';
  import { nanoid } from 'nanoid';
  import argon2 from 'argon2';
  import slugify from 'slugify';
  import { randomBytes } from 'crypto';
  import { IFeed, IFeedInputDTO } from '../../interfaces';
  import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
  import events from '../../subscribers/events';
  import { SystemError } from '../../utils';
  import { Document } from 'mongoose';

  @Service()
  export class FeedService {
    constructor(
      @Inject('feedModel') private feedModel: Models.FeedModel,
      private mailer: MailerService,
      @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
      @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}

    public async Write(feedInputDTO: IFeedInputDTO, author: String): Promise<{} | String> {
      try {

        const feedRecord = await this.feedModel.create({
          ...feedInputDTO,
          slug: slugify(feedInputDTO.title),
          author,
        });

        return feedRecord.toJSON();
      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async Read(slug: any ): Promise<( IFeed & Document ) | any> {
      try{

        this.logger.silly('reading newsfeed...');
        if (slug) {
          return await this.feedModel.findOne({ slug });
        } else {
          return await this.feedModel.find().populate({
            path: "reaction",

          });
        }

      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async FeaturedFeed(): Promise<( IFeed & Document ) | any> {
      try{

        this.logger.silly('reading featured feed...');
        return await this.feedModel.find().sort('createdAt');

      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async TrendingFeed(): Promise<( IFeed & Document ) | any> {
      try{

        this.logger.silly('reading trending feed...');
        return await this.feedModel.find().sort('createdAt');

      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async Update(feedInputDTO: IFeedInputDTO, feed: String): Promise<{} | String> {
      try {
        let feedRecord = await this.feedModel.findById(feed);
      if (!feedRecord) {
        this.logger.silly('feed not found');
        throw new SystemError(200, 'invalid feed-id');
      }

      for (const property in feedInputDTO) {
        feedRecord[property] = feedInputDTO[property];
      }

        return feedRecord.save();
      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async AddReaction(feed: String, author: string): Promise<{} | String> {
      try {
        let feedRecord = await this.feedModel.findById(feed);
        if (!feedRecord) {
          this.logger.silly('feed not found');
          throw new SystemError(200, 'feed not found');
        }
        // feedRecord.reaction.includes(author)
        if(feedRecord.reaction.includes(author)){
          const index = feedRecord.reaction.indexOf(author);
          if (index > -1) {
            feedRecord.reaction.splice(index, 1);
          }
          feedRecord.kpi.reaction = feedRecord.kpi.reaction.valueOf() - 1;
        }else{
          feedRecord.reaction.push(author);
          feedRecord.kpi.reaction = feedRecord.kpi.reaction.valueOf() + 1;
        }     
        return feedRecord.save();
      } catch (e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }

    public async Delete({
      feedId,
    }: {
      feedId: string;
    }): Promise<string> {
      this.logger.silly('Deleting Feed...');

      
      try {
        const feedDeleted = await this.feedModel.findByIdAndDelete(feedId);
        if(feedDeleted) {
          this.logger.silly('Feed deleted!');
          return 'Your feed is permanently deleted';
        }else{
          throw new Error('this feed is unable to delete at the moment, please try again later');
        }
        
      } catch(e) {
        this.logger.error(e);
        throw new SystemError(e.statusCode || 500, e.message);
      }
    }
  }
