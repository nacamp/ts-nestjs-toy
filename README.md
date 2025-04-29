#

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

## setup
- https://docs.nestjs.com/first-steps
```bash
npm i -g @nestjs/cli
nest new nestjs-toy
```