import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../schemas/user.schema';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<{ message: string; user: any }> {
    const { email, password, name, lastname } = registerDto;

    // Check if email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      name,
      lastname,
    });

    const savedUser = await newUser.save();

    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser.toObject();

    return {
      message: 'User registered successfully',
      user: userWithoutPassword,
    };
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string; user: any }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload, { expiresIn: '8h' });

    // Return token and user info without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async getAllUsers(): Promise<any[]> {
    const users = await this.userModel.find({}, { password: 0 }).exec();
    return users;
  }

  async getCurrentUser(email: string): Promise<any> {
    const user = await this.userModel.findOne({ email }, { password: 0 });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    // Check if user exists
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailExists = await this.userModel.findOne({ email: updateUserDto.email });
      if (emailExists) {
        throw new ConflictException('Email is already registered');
      }
    }

    // Hash password if provided
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    // Update user
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
      .select('-password')
      .exec();

    return updatedUser;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return { message: 'User deleted successfully' };
  }
}
