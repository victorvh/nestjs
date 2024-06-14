// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { PlainAggregatedData } from './types/aggregated-data.interface';

@Injectable()
export class DatabaseService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async saveAggregatedData(
    aggregatedData: PlainAggregatedData[],
  ): Promise<void> {
    const bulkOps = aggregatedData.map((data) => ({
      updateOne: {
        filter: { id: data.id },
        update: {
          $setOnInsert: { id: data.id },
          $inc: {
            balance: data.balance,
            earned: data.earned,
            spent: data.spent,
            payout: data.payout,
            paidOut: data.paidOut,
          },
        },
        upsert: true,
      },
    }));

    await this.userModel.bulkWrite(bulkOps);
  }

  async getAggregatedData(id: string): Promise<PlainAggregatedData> {
    const data = await this.userModel.findOne({ id }).exec();

    return data?.toJSON();
  }

  async getRequestedPayouts(): Promise<{ id: string; amount: number }[]> {
    const data = await this.userModel
      .find({ payout: { $gt: 0 } })
      .select({ id: 1, payout: 1 })
      .exec();

    return data.map(({ id, payout }) => ({ id, amount: payout }));
  }
}
