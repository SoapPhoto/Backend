import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';
import { CreateClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private clientRepository: Repository<ClientEntity>
  ) {}

  public getOne = async (id: string, secret: string) => {
    const data = await this.clientRepository.findOne({
      where: {
        id,
        secret,
      },
    });
    return data;
  };

  public create = async (data: CreateClientDto) => {
    const client = new ClientEntity();
    return this.clientRepository.save(
      this.clientRepository.merge(client, data)
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public getBaseClient = async () => {};
}
