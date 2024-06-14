import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { User } from './schemas/user.schema';
import { PlainAggregatedData } from './types/aggregated-data.interface';
import { PlainTransaction } from './types/transaction.interface';
import { DatabaseService } from './database.service';

@Injectable()
export class AppService {
  constructor(
    private readonly databaseService: DatabaseService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  @Cron('* * * * *')
  async fetchAndAggregateTransactions() {
    console.log('Fetching transactions: ' + new Date().toISOString());
    const transactions = await this.fetchTransactions();

    console.log('Aggregating data: ' + new Date().toISOString());
    const aggregatedData = this.aggregateData(transactions);

    console.log('Saving aggregated data: ' + new Date().toISOString());
    await this.databaseService.saveAggregatedData(aggregatedData);
  }

  async fetchTransactions(): Promise<PlainTransaction[]> {
    const data = {
      items: [
        {
          id: '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
          userId: '074092',
          createdAt: '2023-03-16T12:33:11.000Z',
          type: 'payout',
          amount: 30,
        },
        {
          id: '41bbdf81-735c-4aea-beb3-3e5f433a30c5',
          userId: '074092',
          createdAt: '2023-03-16T12:33:11.000Z',
          type: 'paidOut',
          amount: 30,
        },
        {
          id: '41bbdf81-735c-4aea-beb3-3e5fasfsdfef',
          userId: '074092',
          createdAt: '2023-03-12T12:33:11.000Z',
          type: 'spent',
          amount: 12,
        },
        {
          id: '41bbdf81-735c-4aea-beb3-342jhj234nj234',
          userId: '074092',
          createdAt: '2023-03-15T12:33:11.000Z',
          type: 'earned',
          amount: 100,
        },
      ],
      meta: {
        totalItems: 1200,
        itemCount: 3,
        itemsPerPage: 3,
        totalPages: 400,
        currentPage: 1,
      },
    };

    return data.items;
  }

  aggregateData(transactions: PlainTransaction[]) {
    const aggregatedData = transactions.reduce(
      (acc, transaction) => {
        const { userId, type, amount } = transaction;

        acc[userId] = acc[userId] || {
          id: userId,
          balance: 0,
          earned: 0,
          spent: 0,
          payout: 0,
          paidOut: 0,
        };

        switch (type) {
          case 'earned':
            acc[userId].balance += amount;
            acc[userId].earned += amount;
            break;
          case 'spent':
            acc[userId].balance -= amount;
            acc[userId].spent += amount;
            break;
          case 'payout':
            acc[userId].payout += amount;
            break;
          case 'paidOut':
            acc[userId].balance -= amount;
            acc[userId].payout -= amount;
            acc[userId].paidOut += amount;
            break;
        }

        return acc;
      },
      {} as Record<string, PlainAggregatedData>,
    );

    return Object.values(aggregatedData);
  }
}
