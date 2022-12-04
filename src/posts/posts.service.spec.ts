import { Test, TestingModule } from '@nestjs/testing';
import { JwtPayload } from 'src/auth/JwtPayload.interface';
import { CreatePostDto } from './dto';
import { PostsService } from './posts.service';

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('can create an instance of', async () => {
    const fakePostsService = {
      find: () => Promise.resolve([]),
      create: (createPostDto: CreatePostDto, user: JwtPayload) =>
        Promise.resolve({
          createPostDto: {
            title: 'Title',
            description: 'desc',
            authorId: 1,
          },
          user: (user.sub = 1),
        }),
    };

    const module = await Test.createTestingModule({
      providers: [PostsService, { provide: PostsService, useValue: fakePostsService }],
    }).compile();

    const service = module.get(PostsService);

    expect(service).toBeDefined();

    it('can create an instance of auth service', async () => {
      expect(service).toBeDefined();
    });
  });
});
