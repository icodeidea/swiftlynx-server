"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const typedi_1 = require("typedi");
const wallet_1 = require("../wallet");
const activity_1 = require("../activity");
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const utils_1 = require("../../utils");
const slugify_1 = __importDefault(require("slugify"));
let CommentService = class CommentService {
    constructor(userModel, commentModel, feedModel, transactionModel, logger, eventDispatcher, wallet, activity) {
        this.userModel = userModel;
        this.commentModel = commentModel;
        this.feedModel = feedModel;
        this.transactionModel = transactionModel;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
        this.wallet = wallet;
        this.activity = activity;
    }
    async addComment(commentInputDTO, author) {
        try {
            const commentRecord = await this.commentModel.create(Object.assign(Object.assign({}, commentInputDTO), { slug: (0, slugify_1.default)(commentInputDTO.content), User: author }));
            return await this.commentModel.findById(commentRecord.id).populate('User', 'username picture');
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Write(commentInput, author) {
        try {
            if (commentInput.subjectRef === 'Feed') {
                const feedRecord = await this.feedModel.findById(commentInput.subject);
                if (!feedRecord) {
                    throw new utils_1.SystemError(404, "feed is no longer available");
                }
                const userRecord = await this.userModel.findById(author);
                if (!userRecord) {
                    throw new utils_1.SystemError(404, "User account not found");
                }
                const commentRecord = await this.addComment(commentInput, author);
                if (!commentRecord) {
                    throw new utils_1.SystemError(500, "comment failed, please try again");
                }
                feedRecord.kpi.comments = feedRecord.kpi.comments.valueOf() + 1;
                feedRecord.comment.push(commentRecord._id);
                feedRecord.save();
                const earnFromFeed = await this.transactionModel.findOne({ user: author, subject: feedRecord.id });
                if (!earnFromFeed && userRecord.oneTimeSetup) {
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
                    });
                    userRecord.kpi.feedsEarned = userRecord.kpi.feedsEarned.valueOf() + 1;
                    await userRecord.save();
                }
                return {
                    comment: commentRecord,
                    earned: !earnFromFeed && userRecord.oneTimeSetup,
                };
            }
            if (commentInput.subjectRef === 'Comment') {
                const commentRecord = await this.feedModel.findById(commentInput.subject);
                if (!commentRecord) {
                    throw new utils_1.SystemError(404, "comment is no longer available");
                }
                const comment = await this.addComment(commentInput, author);
                return {
                    comment: comment,
                    earned: false,
                };
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Read(feed) {
        try {
            this.logger.silly('reading comment...');
            return await this.commentModel.find({ subject: feed }).populate('User', 'username picture');
            // if (feed) {
            //   return await this.commentModel.findOne({ slug });
            // } else {
            //   return await this.commentModel.find({ subject });
            // }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Delete({ commentId, }) {
        this.logger.silly('Deleting Comment...');
        try {
            const commentDeleted = await this.commentModel.findByIdAndDelete(commentId);
            if (commentDeleted) {
                this.logger.silly('Comment deleted!');
                return 'Your feed is permanently deleted';
            }
            else {
                throw new Error('this comment is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
CommentService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('userModel')),
    __param(1, (0, typedi_1.Inject)('commentModel')),
    __param(2, (0, typedi_1.Inject)('feedModel')),
    __param(3, (0, typedi_1.Inject)('transactionModel')),
    __param(4, (0, typedi_1.Inject)('logger')),
    __param(5, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, eventDispatcher_1.EventDispatcherInterface,
        wallet_1.WalletService,
        activity_1.ActivityService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=index.js.map