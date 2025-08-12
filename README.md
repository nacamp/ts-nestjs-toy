# case

## case: cors설정

```
  app.enableCors({
    origin: origins.length ? origins : '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    // maxAge: 600, // 프리플라이트(Preflight) 10분
    exposedHeaders: ['Content-Disposition'],
  });
```

-vi index.html

```html
jimmy@gimjinmin-ui-Macmini test % cat index.html <!doctype html>
<meta charset="utf-8" />
<button id="ok">call API (allowed)</button>
<script>
  document.getElementById('ok').onclick = async () => {
    try {
      const r = await fetch('http://localhost:3000/', {
        headers: { Authorization: 'Bearer DUMMY' }, // JWT 헤더 시뮬
      });
      console.log('status', r.status, 'text:', await r.text());
    } catch (e) {
      console.error('CORS blocked?', e);
    }
  };
</script>
```

- env.development에서 CORS_ORIGINS ="http://test.com,http://localhost:5173" 변경하면서 테스트

```bash
python -m http.server 5173
```

## case: providers에 Service 클래스 대신 직접 객체를 주입하는 방식 예제

- 정의

```
@Module({
  providers: [
    {
      provide: 'DEMO_CONFIG',
      useValue: { demo1: 'demo1 value', demo2: 2222 },
    },
  ],
  exports: ['DEMO_CONFIG'],
})
```

- 사용

```
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject('DEMO_CONFIG')
    private readonly config: { demo1: string; demo2: number },
```

## case: global guards

```
// in auth.module.ts
providers: [
  {
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
  },
]
```

## case: prisma db setup

```bash
npm install @nestjs/config

// prisma db 설정
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }
```

## case: orm using prisma

```bash
npm install @prisma/client
npm install --save-dev prisma
npx prisma init


vi .env
DATABASE_URL="file:../db/dev.db"


vi schema.prisma
generator client {
  provider = "prisma-client-js"
  //output   = "../src/generated/prisma" => nestjs에서 제거하자. 실행이 안된다.
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}


// schema.prisma -> DB
npx prisma migrate dev --name init
npx prisma generate

// DB -> schema.prisma
npx prisma db pull
npx prisma generate

// 코드생성
nest g service prisma
nest g module prisma
```

## case: bcrypt

```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

## case: bypass guards using decorator

```
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
  ...

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Public()
@Post()
create(@Body() createUserDto: CreateUserDto) {
```

## case: another module use

```typescript
@Module({
  ...
  exports: [UsersService],
})
export class UsersModule {}
////////////
@Module({
  imports: [
    UsersModule,
    ...
  ]
})
export class AuthModule {}
```

## case: jwt

```bash
npm install @nestjs/passport passport passport-jwt @nestjs/jwt
npm install --save-dev @types/passport-jwt
```

## operation

### case: create ...

```
nest g resource users
or
nest g service users
nest g module users
nest g controller users
```

# setup

## init

- https://docs.nestjs.com/first-steps

```bash
npm i -g @nestjs/cli
nest new nestjs-toy
```

## after git clone

- 주의 아래문장은 table을 삭제후 생성시킨다.
- npx prisma migrate dev --name init

## eslint, prettier

- vi .vscode/settings.json
- 저장시 format 자동적용, 포맷터는 prettier 사용

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## vscode debugging

- vi .vscode/launch.json
- launch F5

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "program": "${workspaceFolder}/src/main.ts",
      "runtimeExecutable": "/Users/jimmy/.n/bin/node",
      "runtimeArgs": ["-r", "ts-node/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

## extensions

- TypeScript Importer
- ESLint
- Prettier - Code formatter
- REST Client
- sqlite viewer

## site

- https://docs.nestjs.com/
- https://nestjs.burt.pe.kr/
