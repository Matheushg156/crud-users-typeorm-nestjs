import {
  BadRequestException,
  Body,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthForgotPasswordDTO } from './dto/auth-forgot-password.dto';
import { AuthResetPasswordDTO } from './dto/auth-resete-password.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/decorators/user.decoretor';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { FileService } from 'src/file/file.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly fileService: FileService
  ) {}

  @Post('login')
  async login(@Body() body: AuthLoginDTO) {
    return await this.authService.login(body.email, body.password);
  }

  @Post('register')
  async register(@Body() body: AuthRegisterDTO) {
    return await this.authService.register(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: AuthForgotPasswordDTO) {
    return await this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: AuthResetPasswordDTO) {
    return await this.authService.resetPassword(body.password, body.token);
  }

  @UseGuards(AuthGuard)
  @Post('check-token')
  async checkToken(@User() user) {
    return { user };
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('send-file')
  async uploadFile(
    @User() user,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }),
        new MaxFileSizeValidator({ maxSize: 1024 * 50 })
      ]
    })) file: Express.Multer.File
  ) {

    const path = join(__dirname, '..', '..', 'storage', 'photos', `photo-${user.id}.jpeg`)

    try {
      await this.fileService.uploadFile(file, path);

      return { 'sucess': 'Photo uploaded with sucess!' }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Rota para enviar vários arquivos
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('send-files')
  async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {

    return files

  }

  // Rota para enviar vários arquivos com campos específicos
  @UseInterceptors(FileFieldsInterceptor([{
    name: 'photo',
    maxCount: 1
  }, {
    name: 'documents',
    maxCount: 10
  }]))
  @UseGuards(AuthGuard)
  @Post('send-files-fields')
  async uploadFilesFields(@User() user, @UploadedFiles() files: { photo: Express.Multer.File, documents: Express.Multer.File[] }) {

    return { user, files }

  }
}