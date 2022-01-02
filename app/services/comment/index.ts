import { Service, Inject } from 'typedi';
import { IComment, ICommentInputDTO, IFeed } from '../../interfaces';
import { WalletService } from '../wallet';
import { ActivityService } from '../activity';
import { EventDispatcher, EventDispatcherInterface } from '../../decorators/eventDispatcher';
import events from '../../subscribers/events';
import { SystemError } from '../../utils';
import { Document } from 'mongoose';
import slugify from 'slugify';

@Service()
export class CommentService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('commentModel') private commentModel: Models.CommentModel,
    @Inject('feedModel') private feedModel: Models.FeedModel,
    @Inject('transactionModel') private transactionModel: Models.TransactionModel,
    @Inject('logger') private logger: { silly(arg0: string): void; error(arg0: unknown): void },
    @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    private wallet: WalletService,
    private activity: ActivityService,
  ) {}

  private async addComment(commentInputDTO: ICommentInputDTO, author: String): Promise<IComment> {
    try {

      const commentRecord = await this.commentModel.create({
        ...commentInputDTO,
        slug: slugify(commentInputDTO.content),
        User: author,
      });

      return await this.commentModel.findById(commentRecord.id).populate('User', 'username picture');
    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async Write(commentInput: ICommentInputDTO, author: string): Promise<{} | String> {
    try {

      if(commentInput.subjectRef === 'Feed'){

        const feedRecord = await this.feedModel.findById(commentInput.subject);
        if(!feedRecord){
          throw new SystemError(404, "feed is no longer available");
        }

        const userRecord = await this.userModel.findById(author);
        if(!userRecord){
          throw new SystemError(404, "User account not found");
        }

        const commentRecord = await this.addComment(commentInput, author);
        if(!commentRecord){
          throw new SystemError(500, "comment failed, please try again");
        }

        feedRecord.kpi.comments = feedRecord.kpi.comments.valueOf() + 1;
        feedRecord.comment.push(commentRecord._id);
        feedRecord.save();

        const earnFromFeed = await this.transactionModel.findOne({user: author, subject: feedRecord.id});
        if(!earnFromFeed && userRecord.oneTimeSetup){
          await this.wallet.credit({
            walletId: author,
            amount: feedRecord.reward,
            type: 'Credit',
            status: "Completed",
            fee: 0,
            subject: feedRecord.id,
            subjectRef: 'Feed',
            reason: 'Comment reward'
          });

          await this.activity.addActivity({
            User: author,
            subject: feedRecord.id,
            content: `earned ${feedRecord.reward}`
          })

          userRecord.kpi.feedsEarned = userRecord.kpi.feedsEarned.valueOf() + 1;
          await userRecord.save();
        }

        return {
          comment: commentRecord,
          earned: !earnFromFeed && userRecord.oneTimeSetup,
        }
      }

      if(commentInput.subjectRef === 'Comment'){
        const commentRecord = await this.feedModel.findById(commentInput.subject);

        if(!commentRecord){
          throw new SystemError(404, "comment is no longer available");
        }

        const comment = await this.addComment(commentInput, author);

        return {
          comment: comment,
          earned: false,
        }
      }

    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async Read(feed: any ): Promise<( IComment & Document ) | any> {
    try{

      this.logger.silly('reading comment...');
      return await this.commentModel.find({ subject: feed }).populate('User', 'username picture');
      // if (feed) {
      //   return await this.commentModel.findOne({ slug });
      // } else {
      //   return await this.commentModel.find({ subject });
      // }

    } catch (e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }

  public async Delete({
    commentId,
  }: {
    commentId: string;
  }): Promise<string> {
    this.logger.silly('Deleting Comment...');

    
    try {
      const commentDeleted = await this.commentModel.findByIdAndDelete(commentId);
      if(commentDeleted) {
        this.logger.silly('Comment deleted!');
        return 'Your feed is permanently deleted';
      }else{
        throw new Error('this comment is unable to delete at the moment, please try again later');
      }
      
    } catch(e) {
      this.logger.error(e);
      throw new SystemError(e.statusCode || 500, e.message);
    }
  }
}
