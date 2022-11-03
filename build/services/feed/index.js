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
exports.FeedService = void 0;
const typedi_1 = require("typedi");
const mailer_1 = require("../mailer");
const slugify_1 = __importDefault(require("slugify"));
const eventDispatcher_1 = require("../../decorators/eventDispatcher");
const utils_1 = require("../../utils");
let FeedService = class FeedService {
    constructor(feedModel, mailer, logger, eventDispatcher) {
        this.feedModel = feedModel;
        this.mailer = mailer;
        this.logger = logger;
        this.eventDispatcher = eventDispatcher;
    }
    async Write(feedInputDTO, author) {
        try {
            const feedRecord = await this.feedModel.create(Object.assign(Object.assign({}, feedInputDTO), { slug: (0, slugify_1.default)(feedInputDTO.title), author }));
            return feedRecord.toJSON();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Read(slug) {
        try {
            this.logger.silly('reading newsfeed...');
            if (slug) {
                return await this.feedModel.findOne({ slug });
            }
            else {
                return await this.feedModel.find().populate({
                    path: "reaction",
                });
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async FeaturedFeed() {
        try {
            this.logger.silly('reading featured feed...');
            return await this.feedModel.find().sort('createdAt');
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async TrendingFeed() {
        try {
            this.logger.silly('reading trending feed...');
            return await this.feedModel.find().sort('createdAt');
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Update(feedInputDTO, feed) {
        try {
            let feedRecord = await this.feedModel.findById(feed);
            if (!feedRecord) {
                this.logger.silly('feed not found');
                throw new utils_1.SystemError(200, 'invalid feed-id');
            }
            for (const property in feedInputDTO) {
                feedRecord[property] = feedInputDTO[property];
            }
            return feedRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async AddReaction(feed, author) {
        try {
            let feedRecord = await this.feedModel.findById(feed);
            if (!feedRecord) {
                this.logger.silly('feed not found');
                throw new utils_1.SystemError(200, 'feed not found');
            }
            // feedRecord.reaction.includes(author)
            if (feedRecord.reaction.includes(author)) {
                const index = feedRecord.reaction.indexOf(author);
                if (index > -1) {
                    feedRecord.reaction.splice(index, 1);
                }
                feedRecord.kpi.reaction = feedRecord.kpi.reaction.valueOf() - 1;
            }
            else {
                feedRecord.reaction.push(author);
                feedRecord.kpi.reaction = feedRecord.kpi.reaction.valueOf() + 1;
            }
            return feedRecord.save();
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
    async Delete({ feedId, }) {
        this.logger.silly('Deleting Feed...');
        try {
            const feedDeleted = await this.feedModel.findByIdAndDelete(feedId);
            if (feedDeleted) {
                this.logger.silly('Feed deleted!');
                return 'Your feed is permanently deleted';
            }
            else {
                throw new Error('this feed is unable to delete at the moment, please try again later');
            }
        }
        catch (e) {
            this.logger.error(e);
            throw new utils_1.SystemError(e.statusCode || 500, e.message);
        }
    }
};
FeedService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)('feedModel')),
    __param(2, (0, typedi_1.Inject)('logger')),
    __param(3, (0, eventDispatcher_1.EventDispatcher)()),
    __metadata("design:paramtypes", [Object, mailer_1.MailerService, Object, eventDispatcher_1.EventDispatcherInterface])
], FeedService);
exports.FeedService = FeedService;
//# sourceMappingURL=index.js.map