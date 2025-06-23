/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailService } from '../mail/mail.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';




@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly mailService: MailService,

    ) { }

    async signup(dto: { email: string; password: string }) {
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.create({
            email: dto.email,
            password: hashedPassword,
        });
        return { id: user.id, email: user.email };
    }

    async signin(dto: { email: string; password: string }) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const payload = { sub: user.id, email: user.email };
        const access_token = this.jwtService.sign(payload);

        // Return token + basic user info
        return {
            access_token,
            user: {
                id: user.id,
                email: user.email,
            },
        };
    }

    async sendResetPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const token = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: '1h' } // Optional: reset token validity
        );

        await this.mailService.sendResetLink(email, token);

        return { message: 'Password reset link sent' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepo.findOneBy({ id: payload.sub });

            if (!user) throw new NotFoundException("User not found");

            user.password = await bcrypt.hash(newPassword, 10);
            await this.userRepo.save(user);

            return { message: "Password reset successful" };
        } catch (err) {
            console.error('Reset password error:', err);
            throw new UnauthorizedException("Invalid or expired token");
        }

    }


}
