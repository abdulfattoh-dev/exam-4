import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Wallet } from './models/wallet.model';
import { catchError } from 'src/utils/catch-error';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallet) private walletModel: typeof Wallet) {}

  async create(createWalletDto: CreateWalletDto): Promise<object> {
    try {
      const wallet = await this.walletModel.create({ ...createWalletDto });
      return {
        statusCode: 201,
        message: 'success',
        data: wallet,
      };
    } catch (error) {
      return catchError(error);
    }
  }

  async findAll(): Promise<object> {
    try {
      const wallets = await this.walletModel.findAll();
      if(!wallets?.length) {
        throw new NotFoundException('Products not found');
      }
      return {
        statusCode: 200,
        message: 'success',
        data: wallets,
      };
    } catch (error) {
      return catchError(error)
    }
  }

  async findOne(id: number): Promise<object> {
    try {
      const wallet = await this.walletModel.findByPk(id)
      if(!wallet) {
        throw new NotFoundException('Wallet not found')
      }
      return {
        statusCode: 200,
        message: 'success',
        data: wallet
      }
    } catch (error) {
      return catchError(error)
    }
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<object> {
    try {
      const walletId = await this.walletModel.findByPk(id);
      if(!walletId){
        throw new NotFoundException('Wallet id not found!')
      }
      const newWallet = await this.walletModel.update(updateWalletDto, {where: {id}, returning: true})
      return {
        statusCode: 200,
        message: 'success',
        data: newWallet
      }
    } catch (error) {
      return catchError(error);
    }
  }

  async remove(id: number): Promise<object> {
    try {
      const walletId = await this.walletModel.findByPk(id);
      if(!walletId) {
        throw new NotFoundException('Wallet id not found')
      }
      await this.walletModel.destroy({where: {id}});
      return {
        statusCode: 200,
        message: 'success',
        data: {data: {}}
      }
    } catch (error) {
      return catchError(error)
    }
  }
}
