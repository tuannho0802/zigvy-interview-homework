/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'tuan@example.com' },
                password: { type: 'string', example: '123456' },
            },
        },
    })
    async signUp(@Body() dto: { email: string; password: string }) {
        return this.authService.signup(dto);
    }

    @Post('signin')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'tuan@example.com' },
                password: { type: 'string', example: '123456' },
            },
        },
    })
    async signIn(@Body() dto: { email: string; password: string }) {
        return this.authService.signin(dto);
    }

    @Post('forgot-password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'hoangtuanft0802@gmail.com' },
            },
        },
    })
    async forgotPassword(@Body() dto: { email: string }) {
        return this.authService.sendResetPassword(dto.email);
    }

    @Post('reset-password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'your-jwt-token' },
                newPassword: { type: 'string', example: '123456' },
            },
        },
    })
    async resetPassword(@Body() dto: { token: string; newPassword: string }) {
        return this.authService.resetPassword(dto.token, dto.newPassword);
    }

}
