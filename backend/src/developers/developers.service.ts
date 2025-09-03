import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { CreateDeveloperDto } from './dto/create-developer.dto';
import { UpdateDeveloperDto } from './dto/update-developer.dto';
import { Repository } from 'typeorm';
import { Developer } from './entities/developer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevelopersService {
  constructor(
    @InjectRepository(Developer)
    private readonly repository: Repository<Developer>,
  ) {}

  async create(dto: CreateDeveloperDto) {
    const developer = this.repository.create(dto);
    const savedDeveloper = await this.repository.save(developer);

    // Caminho do arquivo JSON
    const filePath = path.join(__dirname, '../../../developers.json');

    // Lê o arquivo existente ou cria um array vazio
  let data: any[] = [];
    if (fs.existsSync(filePath)) {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    // Adiciona o novo registro
    data.push(savedDeveloper);

    // Salva de volta no arquivo
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    return savedDeveloper;
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
   return this.repository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateDeveloperDto) {
    const developer = await this.repository.findOneBy({ id });
    if (!developer) return null;
    this.repository.merge(developer, dto);
    return this.repository.save(developer);
  }

  async remove(id: string) {
    const developer = await this.repository.findOneBy({ id });
    if (!developer) return null;
    return this.repository.remove(developer); 
  }
}
