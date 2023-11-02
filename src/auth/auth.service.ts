import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { UserEntity } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private issuer = 'login'
  private audience = 'users'


  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
    ) {}

    createToken(user: UserEntity) {
      return {
        accessToken: this.jwtService.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, {
          expiresIn: '7d',
          subject: user.id.toString(),
          issuer: this.issuer,
          audience: this.audience
        })
      }
    }

    checkToken(token: string) {
      try {
        const data = this.jwtService.verify(token, {
          issuer: this.issuer,
          audience: this.audience
        });

        return data;
      } catch (error) {
        throw new UnauthorizedException('Token invalid');
      }
    }

    isValideToken(token: string) {
      try {
        this.checkToken(token);

        return true;
      } catch (error) {
        return false;
      }
    }

    async login(email: string, password: string) {
      const user = await this.usersRepository.findOne({
        where: { email }
      })

      if (!user) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new UnauthorizedException('Email or password incorrect');
      }

      return this.createToken(user);
    }

    async forgotPassword(email: string) {
      const user = await this.usersRepository.findOne({
        where: { email }
      })

      if (!user) {
        throw new UnauthorizedException('Email incorrect');
      }

      const token = this.jwtService.sign({
        id: user.id,
      }, {
        expiresIn: '30 minutes',
        subject: user.id.toString(),
        issuer: 'forgot-password',
        audience: this.audience
      });

      await this.mailerService.sendMail({
        subject: 'Forgot password',
        to: email,
        template: 'forgot',
        context: {
          name: user.name,
          token,
        }
      })

      return true
    }

    async resetPassword(password: string, token: string) {
      try {
        const data = this.jwtService.verify(token, {
          issuer: 'forgot-password',
          audience: this.audience
        });

        if (isNaN(Number(data.id))) {
          throw new UnauthorizedException('Token invalid');
        }

        const id = Number(data.id);

        const salt = await bcrypt.genSalt();

        password = await bcrypt.hash(password, salt);

        await this.usersRepository.update(
          id,
          { password }
        )

        const user = await this.userService.readOne(id);

        return this.createToken(user);
      } catch (error) {
        throw new UnauthorizedException('Token invalid');
      }
    }

    async register (body: AuthRegisterDTO) {
      const user = await this.userService.create(body);
      return this.createToken(user);
    }
}