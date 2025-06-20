/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config'; 

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
  private usersService: UsersService,
  private configService: ConfigService,
) {
  super({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.get('JWT_SECRET'),
  });
}


  async validate(payload: any) {
    // Attach the user to request.user
    const user = await this.usersService.findById(payload.sub);
    return user;
  }
}
