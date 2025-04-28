#

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